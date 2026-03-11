import { HistoricalResultsPageClient } from '@/components/assessment/HistoricalResultsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resultados de Evaluacion',
};

export default function Page() {
  return <HistoricalResultsPageClient />;
}
