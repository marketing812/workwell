
import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

export default async function Page({ params }: RoutePageProps<{ assessmentId: string }>) {
  const resolvedParams = await params;
  const { assessmentId } = resolvedParams;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata({ params }: RoutePageProps<{ assessmentId: string }>): Promise<Metadata> {
  const resolvedParams = await params;
  const { assessmentId } = resolvedParams;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
