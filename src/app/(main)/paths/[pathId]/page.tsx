import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { RoutePageProps } from '@/types/page-props';

export const dynamic = 'force-dynamic';

export default function Page({ params }: RoutePageProps<{ pathId: string }>) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

export async function generateMetadata(
  { params }: RoutePageProps<{ pathId: string }>
): Promise<Metadata> {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
