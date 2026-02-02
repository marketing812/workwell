"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useTranslations } from '@/lib/translations';
import { formatEntryTimestamp, type NotebookEntry } from '@/data/therapeuticNotebookStore';
import { ArrowLeft, Eye, Calendar, BookText } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useParams } from 'next/navigation';
import { pathsData } from '@/data/pathsData';
import { Loader2 } from 'lucide-react';

export default function NotebookEntriesByPathPage() {
  const t = useTranslations();
  const { notebookEntries, isNotebookLoading } = useUser();
  const params = useParams();
  const pathId = params.pathId as string;

  const [pathEntries, setPathEntries] = useState<NotebookEntry[]>([]);
  const [pathTitle, setPathTitle] = useState('');

  useEffect(() => {
    if (!isNotebookLoading) {
      const currentPath = pathsData.find(p => p.id === pathId);
      if (currentPath) {
        setPathTitle(currentPath.title);
      }

      const filteredEntries = notebookEntries.filter(entry => entry.pathId === pathId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setPathEntries(filteredEntries);
    }
  }, [notebookEntries, pathId, isNotebookLoading]);

  const isLoading = isNotebookLoading;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <BookText className="mr-3 h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              Cuaderno Terapéutico
            </h1>
            <p className="text-muted-foreground mt-1">
              Entradas para la ruta: {pathTitle}
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/therapeutic-notebook">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {pathEntries.length > 0 ? (
            pathEntries.map((entry, index) => (
              <Card key={`${entry.id}-${index}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-accent">{entry.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs pt-1 gap-x-4">
                    <span className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatEntryTimestamp(entry.timestamp)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-3 whitespace-pre-line break-words">
                    {entry.content}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/therapeutic-notebook/entry/${entry.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Entrada Completa
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12 px-6">
              <CardContent>
                <BookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No hay entradas en el cuaderno para esta ruta.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
