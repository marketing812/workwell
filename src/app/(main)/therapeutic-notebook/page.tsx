
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { formatEntryTimestamp, type NotebookEntry } from "@/data/therapeuticNotebookStore";
import { ArrowLeft, NotebookText, Calendar, Eye, FileJson, ArrowRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";

const DEBUG_NOTEBOOK_FETCH_URL_KEY = "workwell-debug-notebook-fetch-url";

export default function TherapeuticNotebookPage() {
  const t = useTranslations();
  const { user, loading: userLoading, notebookEntries, fetchAndSetNotebook, isNotebookLoading } = useUser();
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cuando el componente se monta y el usuario está disponible,
    // se inicia la carga de las entradas del cuaderno.
    if (user && user.id && !isNotebookLoading) {
        fetchAndSetNotebook(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fetchAndSetNotebook]); // Depende del usuario y de la función de carga

  useEffect(() => {
    // Listener para actualizar la URL de depuración si cambia en otra parte
    const handleUrlUpdate = () => {
        if (typeof window !== 'undefined') {
            setDebugUrl(sessionStorage.getItem(DEBUG_NOTEBOOK_FETCH_URL_KEY));
        }
    };
    // Llamada inicial para establecer la URL al cargar
    handleUrlUpdate();
    window.addEventListener('notebook-url-updated', handleUrlUpdate);
    return () => window.removeEventListener('notebook-url-updated', handleUrlUpdate);
  }, []);

  const isLoading = userLoading || isNotebookLoading;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
            <NotebookText className="mr-3 h-10 w-10 text-primary" />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                    {t.therapeuticNotebookTitle}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t.therapeuticNotebookDescription}
                </p>
            </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToDashboard}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {notebookEntries.length > 0 ? (
            notebookEntries.map((entry) => (
              <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                      <CardTitle className="text-xl text-accent">{entry.ruta || entry.title}</CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center text-xs pt-1 gap-x-4">
                          <span className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatEntryTimestamp(entry.timestamp)}
                          </span>
                          {entry.ruta && entry.title !== entry.ruta && (
                            <span className="flex items-center mt-1 sm:mt-0 text-primary">
                              <ArrowRight className="mr-2 h-3 w-3" />
                              {entry.title}
                            </span>
                          )}
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-foreground/80 line-clamp-3 whitespace-pre-line break-words">
                          {entry.content}
                      </p>
                  </CardContent>
                  <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/therapeutic-notebook/${entry.id}`}>
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
                <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">{t.noNotebookEntries}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      

    </div>
  );
}

    
