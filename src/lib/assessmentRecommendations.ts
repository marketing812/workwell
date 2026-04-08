import type { AssessmentDimension } from "@/data/paths/pathTypes";
import type { Path } from "@/data/paths/pathTypes";

function normalizeDimensionKey(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getScoreBandPriority(score: number): number {
  if (score < 2.5) return 0;
  if (score < 4) return 1;
  return 2;
}

export type RecommendationScenario = "pesoA" | "pesoB";

export interface RankedDimensionRecommendation {
  dimension: AssessmentDimension;
  score: number;
  weightedPriority: number;
  bandPriority: number;
  sourcePriority: number;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(5, score));
}

function getDimensionScoreMap(params: {
  assessmentDimensions: AssessmentDimension[];
  resolveDimensionScore: (dimension: AssessmentDimension) => number | null;
}): Map<string, number> {
  const scoreMap = new Map<string, number>();

  params.assessmentDimensions.forEach((dimension) => {
    const score = params.resolveDimensionScore(dimension);
    if (Number.isFinite(score)) {
      scoreMap.set(dimension.id, clampScore(score as number));
    }
  });

  return scoreMap;
}

export function resolveRecommendationScenario(params: {
  assessmentDimensions: AssessmentDimension[];
  resolveDimensionScore: (dimension: AssessmentDimension) => number | null;
}): RecommendationScenario {
  const scoreMap = getDimensionScoreMap(params);
  const moodScore = scoreMap.get("dim12");
  const anxietyScore = scoreMap.get("dim13");

  if ((typeof moodScore === "number" && moodScore < 2.5) || (typeof anxietyScore === "number" && anxietyScore > 3.5)) {
    return "pesoB";
  }

  return "pesoA";
}

export function rankDimensionsForRecommendations(params: {
  priorityAreas?: string[];
  assessmentDimensions: AssessmentDimension[];
  resolveDimensionScore: (dimension: AssessmentDimension) => number | null;
}): {
  scenario: RecommendationScenario;
  rankedDimensions: RankedDimensionRecommendation[];
} {
  const {
    priorityAreas = [],
    assessmentDimensions,
    resolveDimensionScore,
  } = params;

  const scenario = resolveRecommendationScenario({
    assessmentDimensions,
    resolveDimensionScore,
  });

  const preferredAreaOrder = new Map<string, number>();
  priorityAreas.forEach((areaName, index) => {
    preferredAreaOrder.set(normalizeDimensionKey(areaName), index);
  });

  const rankedDimensions: RankedDimensionRecommendation[] = assessmentDimensions
    .filter((dimension) => dimension.recommendedPathId)
    .map((dimension) => {
      const score = resolveDimensionScore(dimension);
      if (!Number.isFinite(score)) return null;

      const boundedScore = clampScore(score as number);
      const normalizedName = normalizeDimensionKey(dimension.name);
      const dimensionWeight = Number(dimension[scenario] ?? 1);
      const normalizedWeight = Number.isFinite(dimensionWeight) && dimensionWeight > 0 ? dimensionWeight : 1;

      return {
        dimension,
        score: boundedScore,
        weightedPriority: (5 - boundedScore) * normalizedWeight,
        bandPriority: getScoreBandPriority(boundedScore),
        sourcePriority: preferredAreaOrder.get(normalizedName) ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter((item): item is RankedDimensionRecommendation => item !== null)
    .sort((a, b) => {
      if (a.bandPriority !== b.bandPriority) return a.bandPriority - b.bandPriority;
      if (a.weightedPriority !== b.weightedPriority) return b.weightedPriority - a.weightedPriority;
      if (a.sourcePriority !== b.sourcePriority) return a.sourcePriority - b.sourcePriority;
      if (a.score !== b.score) return a.score - b.score;
      return a.dimension.name.localeCompare(b.dimension.name, "es");
    });

  return { scenario, rankedDimensions };
}

export function buildPriorityAreaNames(params: {
  priorityAreas?: string[];
  assessmentDimensions: AssessmentDimension[];
  resolveDimensionScore: (dimension: AssessmentDimension) => number | null;
  maxAreas?: number;
}): string[] {
  const { rankedDimensions } = rankDimensionsForRecommendations(params);
  const maxAreas = params.maxAreas ?? 3;

  return rankedDimensions.slice(0, maxAreas).map((item) => item.dimension.name);
}

export function buildRecommendedPaths(params: {
  priorityAreas?: string[];
  assessmentDimensions: AssessmentDimension[];
  pathsData: Path[];
  resolveDimensionScore: (dimension: AssessmentDimension) => number | null;
  maxPaths?: number;
}): Path[] {
  const {
    assessmentDimensions,
    pathsData,
    maxPaths = 3,
  } = params;
  const { rankedDimensions } = rankDimensionsForRecommendations(params);

  const selectedPaths: Path[] = [];
  const seenPathIds = new Set<string>();

  for (const item of rankedDimensions) {
    if (!item.dimension.recommendedPathId) continue;

    const path = pathsData.find((candidate) => candidate.id === item.dimension.recommendedPathId);
    if (!path || seenPathIds.has(path.id)) continue;

    selectedPaths.push(path);
    seenPathIds.add(path.id);

    if (selectedPaths.length >= maxPaths) {
      break;
    }
  }

  return selectedPaths;
}
