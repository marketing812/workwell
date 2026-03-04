
import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

interface HistoryResultsPageProps {
  params: Promise<{ assessmentId: string }>;
}

export default async function Page({ params }: HistoryResultsPageProps) {
  const { assessmentId } = await params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata({ params }: HistoryResultsPageProps): Promise<Metadata> {
  const { assessmentId } = await params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
