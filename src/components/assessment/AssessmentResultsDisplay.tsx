
"use client";

import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { CheckCircle, ListChecks, Activity, AlertTriangle, Info, RotateCcw, Sparkles, CalendarDays, TrendingUp, Star, Zap, Milestone, ExternalLink, Lightbulb, HeartHandshake, FileJson } from 'lucide-react'; 
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  type DotProps,
} from "recharts"
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { assessmentInterpretations, type InterpretationLevels } from '@/data/assessmentInterpretations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import { formatAssessmentTimestamp } from '@/data/assessmentHistoryStore';
import { pathsData } from '@/data/pathsData';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssessmentResultsDisplayProps {
  results: InitialAssessmentOutput | null;
  rawAnswers?: Record<string, { score: number, weight: number }> | null;
  userId?: string | null;
  onRetake: () => void;
  assessmentTimestamp?: string;
  assessmentDimensions: AssessmentDimension[];
}

interface CategorizedDimension extends AssessmentDimension {
  score: number;
  interpretationText: string;
  scoreLevel: string;
}

const LOW_SCORE_SUPPORT_NOTE =
  "Los resultados indican que esta área podría estar generándote dificultades en este momento. En Emotiva encontrarás contenidos y herramientas basadas en psicología científica que pueden ayudarte a comprender mejor lo que ocurre y a desarrollar habilidades para mejorar tu bienestar. Sin embargo, Emotiva es una herramienta de aprendizaje y entrenamiento psicológico y no sustituye a una evaluación o terapia psicológica profesional. Si estas dificultades están afectando a tu vida o se mantienen en el tiempo, te recomendamos consultar con un profesional de la salud mental que pueda valorar tu situación de forma personalizada.";

function normalizeDimensionKey(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function splitLabelInTwoLines(value: string, maxCharsPerLine: number): [string, string?] {
  const words = String(value || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const firstLineWords: string[] = [];
  let firstLineLength = 0;

  for (const word of words) {
    const nextLength = firstLineLength + (firstLineWords.length > 0 ? 1 : 0) + word.length;
    if (nextLength <= maxCharsPerLine || firstLineWords.length === 0) {
      firstLineWords.push(word);
      firstLineLength = nextLength;
    } else {
      break;
    }
  }

  const secondLineWords = words.slice(firstLineWords.length);
  const firstLine = firstLineWords.join(" ");
  const secondLine = secondLineWords.join(" ");

  return secondLine ? [firstLine, secondLine] : [firstLine];
}

const themedChartColors = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--primary))",
  "hsl(var(--accent))", "hsl(var(--secondary))",
  "hsl(var(--chart-1) / 0.7)", "hsl(var(--chart-2) / 0.7)",
  "hsl(var(--chart-3) / 0.7)", "hsl(var(--chart-4) / 0.7)",
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const getInterpretationText = (score: number, interpretations: InterpretationLevels): string => {
  if (score >= 4.8 && interpretations.veryHigh) {
    return interpretations.veryHigh;
  } else if (score >= 3.8) {
    return interpretations.high;
  } else if (score >= 2.3) {
    return interpretations.medium;
  } else {
    return interpretations.low;
  }
};

const getInterpretationLevel = (score: number, interpretations: InterpretationLevels, t: any): string => {
  if (score >= 4.8 && interpretations.veryHigh) return t.scoreLevelVeryHigh || "Muy Alto";
  if (score >= 3.8) return t.scoreLevelHigh || "Alto";
  if (score >= 2.3) return t.scoreLevelMedium || "Medio";
  return t.scoreLevelLow || "Bajo";
};

export function AssessmentResultsDisplay({ results, rawAnswers, userId, onRetake, assessmentTimestamp, assessmentDimensions }: AssessmentResultsDisplayProps) {
  const t = useTranslations();
  const router = useRouter();
  const isMobile = useIsMobile();

  if (!results || !results.emotionalProfile || Object.keys(results.emotionalProfile).length === 0 ||
      Object.values(results.emotionalProfile).some(score => typeof score !== 'number') ||
      !results.priorityAreas || !Array.isArray(results.priorityAreas)) { 
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold">{t.errorOccurred}</p>
        <p className="text-muted-foreground">No se pudieron cargar los resultados de la evaluación. Faltan datos o están malformados.</p>
        <Button asChild className="mt-6" onClick={() => router.push('/assessment/intro')}>
          <Link href="/assessment/intro">{t.takeInitialAssessment}</Link>
        </Button>
      </div>
    );
  }
  
  const payloadForDebug = rawAnswers && userId && results ? {
    assessmentId: "current-session-id", 
    userId: userId,
    rawAnswers: rawAnswers,
    aiInterpretation: results,
    assessmentTimestamp: assessmentTimestamp || new Date().toISOString(),
  } : null;

  const normalizedProfile = new Map<string, number>();
  Object.entries(results.emotionalProfile || {}).forEach(([key, value]) => {
    const numericValue = Number(value as unknown);
    if (Number.isFinite(numericValue)) {
      normalizedProfile.set(normalizeDimensionKey(key), numericValue);
    }
  });

  const overallScore = normalizedProfile.get(normalizeDimensionKey("Estado Emocional General"));

  const computeDimensionScoreFromRawAnswers = (dim: AssessmentDimension): number | null => {
    if (!rawAnswers || typeof rawAnswers !== "object") {
      return null;
    }

    let weightedTotal = 0;
    let weightsSum = 0;

    dim.items.forEach((item) => {
      const rawAnswer = rawAnswers[item.id];
      const answer = Number(rawAnswer?.score);
      const answerWeight = Number(rawAnswer?.weight ?? item.weight ?? 1);
      const weight = Number.isFinite(answerWeight) && answerWeight > 0 ? answerWeight : 1;

      if (Number.isFinite(answer) && Number.isFinite(weight) && weight > 0) {
        const adjustedAnswer = item.isInverse ? 6 - answer : answer;
        weightedTotal += adjustedAnswer * weight;
        weightsSum += weight;
      }
    });

    if (weightsSum > 0) {
      return weightedTotal / weightsSum;
    }

    return null;
  };

  const resolveDimensionScore = (dim: AssessmentDimension): number | null => {
    const rawScore = computeDimensionScoreFromRawAnswers(dim);
    if (rawScore !== null) {
      return rawScore;
    }

    const exactScore = results.emotionalProfile[dim.name];
    if (typeof exactScore === "number" && Number.isFinite(exactScore)) {
      return exactScore;
    }

    const normalizedScore = normalizedProfile.get(normalizeDimensionKey(dim.name));
    if (typeof normalizedScore === "number" && Number.isFinite(normalizedScore)) {
      return normalizedScore;
    }

    if (typeof overallScore === "number" && Number.isFinite(overallScore)) {
      return overallScore;
    }

    return null;
  };

  const radarData = assessmentDimensions.map(dim => {
    const scoreFromProfile = resolveDimensionScore(dim);
    const scoreValue = scoreFromProfile !== null ? scoreFromProfile : 0;
    const finalScore = Math.max(0, Math.min(5, scoreValue));
    return {
      dimensionId: dim.id,
      dimension: dim.name,
      score: finalScore,
      fullMark: 5,
    };
  });

  const emotionalProfileRadarConfig: ChartConfig = {
    score: {
      label: t.emotionalProfile,
      color: "hsl(var(--primary))", 
    },
  };

  const safePriorityAreas = (() => {
    const fromPayload = (Array.isArray(results.priorityAreas) ? results.priorityAreas : [])
      .map((area) => String(area || "").trim())
      .filter(Boolean);

    const fallbackFromProfile = assessmentDimensions
      .map((dim) => ({
        name: dim.name,
        score: resolveDimensionScore(dim),
      }))
      .filter((item): item is { name: string; score: number } => Number.isFinite(item.score))
      .sort((a, b) => a.score - b.score)
      .map((item) => item.name);

    const merged = [...new Set([...fromPayload, ...fallbackFromProfile])];
    return merged.slice(0, 3);
  })();

  const pieChartData = safePriorityAreas.map((areaName) => {
    const normalizedArea = normalizeDimensionKey(areaName);
    const dimension = assessmentDimensions.find((d) => {
      if (d.name === areaName) return true;
      return normalizeDimensionKey(d.name) === normalizedArea;
    });

    const score =
      dimension ?
        resolveDimensionScore(dimension) :
        normalizedProfile.get(normalizedArea) ?? null;
    const boundedScore =
      typeof score === "number" && Number.isFinite(score) ?
        Math.max(0, Math.min(5, score)) :
        2.5;

    // Menor puntuación => mayor peso en "áreas prioritarias".
    const priorityWeight = Math.max(0.05, 5 - boundedScore);

    return {
      name: areaName,
      slug: slugify(areaName),
      value: priorityWeight,
      score: boundedScore,
    };
  });

  const priorityAreasPieConfig: ChartConfig = {};
  pieChartData.forEach((item, index) => {
    priorityAreasPieConfig[item.slug] = {
      label: item.name.split('(')[0].trim(),
      color: themedChartColors[index % themedChartColors.length],
    };
  });
  
  const radarChartDescriptionText = t.radarChartDescription || "Visualización de tu perfil en las diferentes dimensiones.";
  const getRadarTickLabel = (value: string) => {
    const cleanValue = String(value || "").split("(")[0].trim();
    const maxLength = isMobile ? 12 : 28;
    return cleanValue.length > maxLength ? `${cleanValue.slice(0, maxLength)}…` : cleanValue;
  };
  
  const CustomRadarDot = (props: DotProps & { payload?: any; value?: number }) => {
    const { cx, cy, payload, value } = props;
  
    if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy)) {
      console.error(`CustomRadarDot: cx (${cx}) or cy (${cy}) is not a valid number for dimension ${payload?.dimension || 'Unknown'}. Cannot render dot.`);
      return null;
    }
  
    // Use `value` prop first, which is directly passed by Recharts for the dataKey.
    // Fallback to payload.score if value is not available.
    const scoreValue = typeof value === 'number' && !isNaN(value) 
      ? value 
      : (payload && typeof payload.score === 'number' && !isNaN(payload.score) ? payload.score : 0);
  
    let dotColor = "hsl(var(--chart-2))"; // Default Blue for scores < 1.0
    
    if (scoreValue >= 4.0) {
      dotColor = "hsl(var(--primary))"; // Green for 4.0 - 5.0
    } else if (scoreValue >= 2.5) {
      dotColor = "hsl(var(--chart-5))"; // Orange for 2.5 - 3.99
    } else if (scoreValue >= 1.0) {
      dotColor = "hsl(var(--destructive))"; // Red for 1.0 - 2.49
    }
        
    return <circle cx={cx} cy={cy} r={5} fill={dotColor} stroke="hsl(var(--background))" strokeWidth={1.5} />;
  };

  const highStrengthDimensions: CategorizedDimension[] = [];
  const functionalDimensions: CategorizedDimension[] = [];
  const priorityImprovementDimensions: CategorizedDimension[] = [];

  assessmentDimensions.forEach(dim => {
    const score = resolveDimensionScore(dim);
    const interpretationKey = dim.id as keyof typeof assessmentInterpretations;
    const interpretationsForDim = assessmentInterpretations[interpretationKey];

    if (score !== null && interpretationsForDim) {
      const boundedScore = Math.max(0, Math.min(5, score));
      const interpretationText = getInterpretationText(boundedScore, interpretationsForDim);
      const scoreLevel = getInterpretationLevel(boundedScore, interpretationsForDim, t);
      const categorizedDim = { ...dim, score: boundedScore, interpretationText, scoreLevel };

      if (boundedScore >= 4.0) {
        highStrengthDimensions.push(categorizedDim);
      } else if (boundedScore >= 2.5) {
        functionalDimensions.push(categorizedDim);
      } else if (boundedScore < 2.5) { 
        priorityImprovementDimensions.push(categorizedDim);
      }
    }
  });

  // Sort dimensions within each category
  highStrengthDimensions.sort((a, b) => b.score - a.score);
  functionalDimensions.sort((a, b) => b.score - a.score);
  priorityImprovementDimensions.sort((a, b) => a.score - b.score);


  const renderDimensionGroup = (
    title: string,
    dimensions: CategorizedDimension[],
    icon: React.ElementType,
    showLowScoreSupportNote = false
  ) => {
    if (dimensions.length === 0) return null;
    const IconComponent = icon;
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
          <IconComponent className="mr-2 h-6 w-6" />
          {title}
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {dimensions.map((dim) => (
            <AccordionItem value={dim.id} key={dim.id}>
              <AccordionTrigger className="text-base hover:no-underline">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                  <span className="font-semibold text-foreground">{dim.name}</span>
                  <span className="text-sm text-muted-foreground sm:ml-4">Puntuación: {dim.score.toFixed(1)}/5 ({dim.scoreLevel})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/90 px-2">
                <p className="whitespace-pre-line leading-relaxed">{dim.interpretationText}</p>
                {showLowScoreSupportNote && (
                  <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-950">
                    {LOW_SCORE_SUPPORT_NOTE}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };
  
  const recommendedPaths = safePriorityAreas.map(areaName => {
    const normalizedArea = normalizeDimensionKey(areaName);
    const dimension = assessmentDimensions.find((d) => {
      if (d.name === areaName) return true;
      return normalizeDimensionKey(d.name) === normalizedArea;
    });
    if (dimension && dimension.recommendedPathId) {
        const path = pathsData.find(p => p.id === dimension.recommendedPathId);
        if (path) {
            return path;
        }
    }
    return null;
  }).filter((path): path is NonNullable<typeof path> => path !== null);

  const uniqueRecommendedPaths = Array.from(new Map(recommendedPaths.map(p => [p.id, p])).values());

  const startCarePath = uniqueRecommendedPaths.length > 0
    ? `/paths/${uniqueRecommendedPaths[0].id}`
    : "/paths";

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardHeader className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
            Bienvenido/a a tu perfil emocional y personal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-foreground/90 space-y-3 px-6 md:px-10 pb-6">
          <p className="text-base md:text-lg">
            Este perfil no es un juicio ni una etiqueta.
          </p>
          <p className="text-base md:text-lg">
            Es un mapa claro y respetuoso sobre cómo sientes, piensas y afrontas tu vida en este momento.
          </p>
          <p className="text-base md:text-lg">
            Gracias a tu evaluación, ahora puedes ver con claridad tus fortalezas emocionales y los ámbitos que merecen más cuidado.
          </p>
          <p className="text-base md:text-lg font-semibold text-accent">
            Este es tu punto de partida para transformar tu bienestar.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <Activity className="mr-3 h-8 w-8" />
              {t.assessmentResultsTitle}
            </CardTitle>
            {assessmentTimestamp && (
              <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{formatAssessmentTimestamp(assessmentTimestamp)}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-accent" />{t.emotionalProfile}</CardTitle>
            <CardDescription>{radarChartDescriptionText}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-hidden">
            <div className="h-[320px] sm:h-[400px] w-full min-w-0 overflow-hidden">
            <ChartContainer config={emotionalProfileRadarConfig} className="w-full h-full aspect-auto">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? "56%" : "68%"}
                  margin={isMobile ? { top: 24, right: 18, bottom: 24, left: 18 } : { top: 26, right: 30, bottom: 34, left: 30 }}
                  data={radarData}
                >
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={({ x, y, payload, textAnchor }) => {
                          const label = getRadarTickLabel(String((payload as { value?: string })?.value ?? ""));
                          const [line1, line2] = splitLabelInTwoLines(label, isMobile ? 12 : 16);

                          return (
                            <text
                              x={x}
                              y={y}
                              dy={isMobile ? 3 : 0}
                              textAnchor={textAnchor ?? "middle"}
                              fill="hsl(var(--foreground))"
                              fontSize={isMobile ? 6.5 : 8}
                            >
                              <tspan x={x} dy={isMobile ? 0 : 4}>{line1}</tspan>
                              {line2 ? <tspan x={x} dy={isMobile ? 7 : 9}>{line2}</tspan> : null}
                            </text>
                          );
                        }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <Radar 
                        name={t.emotionalProfile} 
                        dataKey="score" 
                        stroke="hsl(var(--muted-foreground))"  
                        fill="hsl(var(--muted-foreground))"  
                        fillOpacity={0.1} 
                        dot={<CustomRadarDot />} 
                        activeDot={{ r: 7, strokeWidth: 2, fill: "hsl(var(--foreground))", stroke: "hsl(var(--background))" }}
                    />
                    <ChartTooltip
                        cursor={{ stroke: "hsl(var(--border))", strokeDasharray: '3 3' }} 
                        content={
                        <ChartTooltipContent
                            className="!bg-background !border !border-border !shadow-lg !rounded-md max-w-xs"
                            formatter={(value, name, itemProps) => (
                                <div className="text-sm p-1">
                                    <div className="font-medium text-foreground">{itemProps.payload.dimension}</div>
                                    <div className="text-muted-foreground">Puntuación: {Number(itemProps.payload.score).toFixed(1)}/5</div>
                                </div>
                            )}
                        />
                        }
                    />
                </RadarChart>
            </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-accent" />{t.priorityAreas}</CardTitle>
            <CardDescription>{t.priorityAreasDescription || "Dimensiones clave para tu desarrollo actual."}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-hidden">
             <div className="h-[440px] w-full min-w-0 overflow-hidden">
               <ChartContainer config={priorityAreasPieConfig} className="w-full h-full aspect-auto">
                <PieChart margin={isMobile ? { top: 12, right: 10, left: 10, bottom: 32 } : { top: 24, right: 60, left: 60, bottom: 40 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => (
                            <div className="text-sm p-1">
                              <div className="font-medium text-foreground">{props.payload.name}</div>
                            </div>
                          )}
                        nameKey="slug"
                        hideLabel
                        className="!bg-background !border !border-border !shadow-lg !rounded-md"
                      />
                    }
                  />
                  <Pie data={pieChartData} dataKey="value" nameKey="slug" cx="50%" cy="48%" labelLine={!isMobile} outerRadius={isMobile ? 86 : 110}
                    label={({ name, percent, ...entry }) => {
                       const originalEntry = pieChartData.find(d => d.slug === name);
                       const displayName = originalEntry ? originalEntry.name.split('(')[0].trim() : String(name);
                       if (isMobile) return `${(percent * 100).toFixed(0)}%`;
                       return `${displayName} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={`cell-${entry.slug}`} fill={`var(--color-${entry.slug})`} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="slug" className="text-xs"/>} />
                </PieChart>
              </ChartContainer>
            </div>
            {safePriorityAreas.length > 0 ? (
                <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                {safePriorityAreas.map((area, index) => (
                    <li key={index} className="flex items-center p-2 bg-muted/50 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    {area}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm text-muted-foreground italic text-center">No se identificaron áreas prioritarias específicas en esta evaluación o no se pudieron cargar.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>{t.summaryAndRecommendations}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-base leading-relaxed">{results.feedback}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>{t.detailedAnalysisTitle || "Análisis Detallado por Dimensión"}</CardTitle>
          <CardDescription>Explora tus resultados en cada área. Las dimensiones se agrupan según tu puntuación.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderDimensionGroup("Fortalezas Consolidadas (Puntuación >= 4.0)", highStrengthDimensions, Star)}
          {renderDimensionGroup("Ámbitos Funcionales con Potencial de Mejora (Puntuación 2.5 - 3.9)", functionalDimensions, TrendingUp)}
          {renderDimensionGroup("Áreas de Mejora Prioritaria (Puntuación < 2.5)", priorityImprovementDimensions, Zap, true)}
          
          {(highStrengthDimensions.length === 0 && functionalDimensions.length === 0 && priorityImprovementDimensions.length === 0) && (
             <p className="text-muted-foreground text-center py-4">No se pudieron categorizar las dimensiones para el análisis detallado. Verifica los datos de entrada.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-3 h-7 w-7 text-primary" />
            Próximos Pasos: Rutas de Desarrollo Sugeridas
          </CardTitle>
          <CardDescription>
            Basado en tus resultados, te recomendamos explorar las siguientes rutas para continuar tu crecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
          {uniqueRecommendedPaths.length > 0 ? (
            uniqueRecommendedPaths.map((path, index) => (
              <Button
                key={index}
                asChild
                variant="default"
                size="lg"
                className="w-full max-w-sm sm:w-auto justify-center"
              >
                <Link href={`/paths/${path.id}`}>
                  Comenzar Ruta: {path.title}
                </Link>
              </Button>
            ))
          ) : (
            <>
              <p className="text-muted-foreground">
                No se han identificado rutas específicas para tus áreas prioritarias. Te invitamos a explorar todas nuestras rutas de desarrollo disponibles.
              </p>
              <Button asChild variant="outline" size="lg" className="w-full max-w-sm sm:w-auto justify-center">
                <Link href="/paths">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explorar Todas las Rutas
                </Link>
              </Button>
            </>
          )}
          <p className="text-base text-muted-foreground italic pt-4">
            Este perfil no es un veredicto. Es una invitación a cuidarte con más consciencia y compasión. No tienes que hacerlo todo a la vez. Basta con empezar.
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button asChild variant="default" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={startCarePath}>
            <HeartHandshake className="mr-2 h-5 w-5" />
            Empezar a cuidarme
          </Link>
        </Button>
        <Button onClick={onRetake} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Realizar Evaluación de Nuevo
        </Button>
      </div>
    </div>
  );
}

    
