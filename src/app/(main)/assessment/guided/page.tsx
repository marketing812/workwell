
"use client";
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import { assessmentDimensions } from '@/data/assessmentDimensions';
import type { AssessmentDimension } from '@/data/paths/pathTypes';


export default function GuidedAssessmentPage() {
  return (
    <AssessmentPageClient
      assessmentDimensions={assessmentDimensions}
      isGuided={true}
    />
  );
}
