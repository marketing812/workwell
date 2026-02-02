"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/translations';
import { ArrowLeft, BookCheck, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { pathsData, type Path } from '@/data/pathsData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCompletedModules } from '@/lib/progressStore';

interface PathWithNotebookEntries extends Path {
  notebookEntryCount: number;
}

export default function TherapeuticNotebookHomePage() {
  const t = useTranslations();
  const { notebookEntries, isNotebookLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pathsWithEntries = useMemo(() => {
    if (!isClient) return [];
    
    const entriesByPath: Record<string, number> = {};
    for (const entry of notebookEntries) {
      if (entry.pathId) {
        if (!entriesByPath[entry.pathId]) {
          entriesByPath[entry.pathId] = 0;
        }
        entriesByPath[entry.pathId]++;
      }
    }

    return pathsData
      .filter(path => entriesByPath[path.id] > 0)
      .map(path => ({
        ...path,
        notebookEntryCount: entriesByPath[path.id],
      }));
  }, [notebookEntries, isClient]);

  if (!isClient || isNotebookLoading) {
    return (
      <div className="container mx-auto py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 text-center sm:text-left">
        <div>
          <BookCheck className="mx-auto sm:mx-0 h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-3">
            Cuaderno Terapéutico
          </h1>
          <p className="text-lg text-muted-foreground">
            Tus reflexiones y ejercicios, organizados por ruta.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4 sm:mt-0">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToDashboard}
          </Link>
        </Button>
      </div>

      {pathsWithEntries.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathsWithEntries.map((path) => (
            <PathNotebookCard key={path.id} path={path} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 px-6">
          <CardContent>
            <BookCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">{t.noNotebookEntries}</p>
            <Button asChild className="mt-6">
                <Link href="/paths">Explorar Rutas</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PathNotebookCard({ path }: { path: PathWithNotebookEntries }) {
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

    useEffect(() => {
        setCompletedModules(getCompletedModules(path.id));
    }, [path.id]);
    
    const totalModules = path.modules.length;
    const completedCount = completedModules.size;
    const progressPercentage = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl text-accent">{path.title}</CardTitle>
                <CardDescription className="text-sm">
                    {path.notebookEntryCount} {path.notebookEntryCount === 1 ? 'entrada' : 'entradas'} en el cuaderno.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
                 <div>
                    <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                        <span>Progreso de la ruta</span>
                        <span>{completedCount} de {totalModules} módulos</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href={`/therapeutic-notebook/path/${path.id}`}>
                        Ver Entradas
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}