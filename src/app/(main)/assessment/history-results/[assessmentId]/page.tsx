import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

interface HistoryResultsPageProps {
  params: { assessmentId: string };
}

export default function Page({ params }: HistoryResultsPageProps) {
  const { assessmentId } = params;
  return <HistoricalResultsPageClient assessmentId={assessmentId} />;
}

export async function generateMetadata({ params }: HistoryResultsPageProps): Promise<Metadata> {
  const { assessmentId } = params;
  return { title: `Resultados de Evaluación ${assessmentId}` };
}
