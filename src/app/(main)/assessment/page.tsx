
"use client";
import AssessmentPageClient from '@/components/assessment/AssessmentPageClient';
import { assessmentDimensions } from '@/data/assessmentDimensions';

export default function AssessmentPage() {
  return (
    <AssessmentPageClient
      assessmentDimensions={assessmentDimensions}
      isGuided={false}
    />
  );
}

