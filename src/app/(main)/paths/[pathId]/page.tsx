
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return pathsData.map((path) => ({ pathId: path.id }));
}

interface PathDetailPageProps {
  params: Promise<{ pathId: string }>;
}

export default async function Page({ params }: PathDetailPageProps) {
  const { pathId } = await params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

export async function generateMetadata(
  { params }: PathDetailPageProps
): Promise<Metadata> {
  const { pathId } = await params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}

