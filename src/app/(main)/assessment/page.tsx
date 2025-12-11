
"use client";
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { assessmentDimensions as assessmentDimensionsData } from '@/ai/flows/initial-assessment';


export default function AssessmentPage() {
  return (
    <AssessmentPageClient
      assessmentDimensions={assessmentDimensionsData}
    />
  );
}

