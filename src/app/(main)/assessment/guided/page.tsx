
"use client";
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import { assessmentDimensions } from '@/data/assessmentDimensions';


export default function GuidedAssessmentPage() {
  return (
    <AssessmentPageClient
      assessmentDimensions={assessmentDimensions}
      isGuided={true}
    />
  );
}
