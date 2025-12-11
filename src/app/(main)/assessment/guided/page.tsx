"use client";
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import { assessmentDimensions as assessmentDimensionsData } from '@/ai/flows/initial-assessment';
import type { AssessmentDimension } from '@/data/paths/pathTypes';


export default function GuidedAssessmentPage() {
  return (
    <AssessmentPageClient
      assessmentDimensions={assessmentDimensionsData}
      isGuided={true}
    />
  );
}
