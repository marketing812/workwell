"use client";

const IN_PROGRESS_ASSESSMENT_KEY = "workwell-assessment-in-progress";
const IN_PROGRESS_ASSESSMENT_KEY_PREFIX = "workwell-assessment-in-progress:";

export interface InProgressAssessmentData {
  answers: Record<string, { score: number; weight: number }>;
  position: {
    dimension: number;
    item: number;
  };
}

function getScopedInProgressAssessmentKey(userId: string): string {
  return `${IN_PROGRESS_ASSESSMENT_KEY_PREFIX}${userId}`;
}

function clearLegacyInProgressAssessmentIfPresent(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(IN_PROGRESS_ASSESSMENT_KEY) !== null) {
      localStorage.removeItem(IN_PROGRESS_ASSESSMENT_KEY);
    }
  } catch (error) {
    console.error("Error clearing legacy in-progress assessment from localStorage:", error);
  }
}

export function getInProgressAssessment(userId?: string | null): InProgressAssessmentData | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    clearLegacyInProgressAssessmentIfPresent();
    const item = localStorage.getItem(getScopedInProgressAssessmentKey(userId));
    return item ? (JSON.parse(item) as InProgressAssessmentData) : null;
  } catch (error) {
    console.error("Error reading in-progress assessment from localStorage:", error);
    return null;
  }
}

export function saveInProgressAssessment(
  userId: string | null | undefined,
  data: InProgressAssessmentData
): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    clearLegacyInProgressAssessmentIfPresent();
    localStorage.setItem(getScopedInProgressAssessmentKey(userId), JSON.stringify(data));
  } catch (error) {
    console.error("Error saving in-progress assessment to localStorage:", error);
  }
}

export function clearInProgressAssessment(userId?: string | null): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    clearLegacyInProgressAssessmentIfPresent();
    localStorage.removeItem(getScopedInProgressAssessmentKey(userId));
  } catch (error) {
    console.error("Error clearing in-progress assessment from localStorage:", error);
  }
}
