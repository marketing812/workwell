import { pathsData } from '@/data/pathsData';
import { NotebookEntriesByPathClient } from '@/components/therapeutic-notebook/NotebookEntriesByPathClient';

interface NotebookEntriesByPathPageProps {
  params: Promise<{ pathId: string }>;
}

export function generateStaticParams() {
  return pathsData.map((path) => ({ pathId: path.id }));
}

export default async function NotebookEntriesByPathPage({ params }: NotebookEntriesByPathPageProps) {
  const { pathId } = await params;
  return <NotebookEntriesByPathClient pathId={pathId} />;
}
