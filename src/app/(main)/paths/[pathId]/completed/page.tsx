import { pathsData } from '@/data/pathsData';
import { PathCompletedClient } from '@/components/paths/PathCompletedClient';

interface PathCompletedPageProps {
  params: Promise<{ pathId: string }>;
}

export function generateStaticParams() {
  return pathsData.map((path) => ({ pathId: path.id }));
}

export default async function PathCompletedPage({ params }: PathCompletedPageProps) {
  const { pathId } = await params;
  return <PathCompletedClient pathId={pathId} />;
}
