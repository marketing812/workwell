import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

export default function Page({ params }: RoutePageProps<{ assessmentId: string }>) {
  const { assessmentId } = params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata({ params }: RoutePageProps<{ assessmentId: string }>): Promise<Metadata> {
  const { assessmentId } = params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
