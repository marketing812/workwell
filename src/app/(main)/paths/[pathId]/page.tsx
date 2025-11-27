
import { pathsData } from '@/data/pathsData';
import { PathDetailClient } from '@/components/paths/PathDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = { params: { pathId: string } };

// Se añade esta línea para forzar el renderizado dinámico y evitar problemas de caché
export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);

  if (!path) {
    notFound();
  }

  return <PathDetailClient path={path} />;
}

// Se restaura generateStaticParams para que Next.js sepa qué páginas construir.
export async function generateStaticParams(): Promise<{pathId: string}[]> {
  return pathsData.map((path) => ({
    pathId: path.id,
  }));
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { pathId } = params;
  const path = pathsData.find(p => p.id === pathId);
  return { title: path?.title || "Ruta de Desarrollo" };
}
