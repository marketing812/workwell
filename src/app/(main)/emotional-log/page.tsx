"use client";

import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { EmotionalEntryForm, emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { formatEntryTimestamp, type EmotionalEntry } from "@/data/emotionalEntriesStore";
import { ArrowLeft, NotebookPen, Edit, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getAutoregistrosLegacy, saveAutoregistroLegacy } from "@/data/autoregistrosLegacy";

export default function EmotionalLogPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const [allEntries, setAllEntries] = useState<EmotionalEntry[]>([]);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    if (!user?.id) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const entries = await getAutoregistrosLegacy(user.id);
      setAllEntries(entries);
    } catch (error) {
      console.error("Error loading emotional entries from webservice:", error);
      toast({ title: "Error", description: "No se pudieron cargar los autorregistros.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleEmotionalEntrySubmit = async (data: { situation: string; thought: string; emotion: string }) => {
    if (!user?.id) {
      toast({
        title: "Error de Usuario o Conexión",
        description: "No se pudo identificar al usuario.",
        variant: "destructive",
      });
      return;
    }
    setIsEntryDialogOpen(false);
    
    try {
      const result = await saveAutoregistroLegacy({
        userId: user.id,
        entry: data,
      });

      if (!result.success) {
        toast({ title: "Error al Guardar", description: result.message, variant: "destructive" });
        return;
      }

      toast({
        title: t.emotionalEntrySavedTitle,
        description: "Tu autorregistro se ha guardado.",
      });

      // Recargar entradas para mostrar la nueva
      await loadEntries();

    } catch (error) {
       toast({ title: "Error al Guardar", description: "No se pudo guardar el registro.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            <NotebookPen className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8" />
            {t.fullEmotionalHistoryTitle}
        </h1>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/resources/post/autorregistro-el-habito-que-cambia-como-piensas-como-sientes-y-como-actuas">
                ¿Qué es el autorregistro?
              </Link>
            </Button>
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full sm:w-auto shadow-md">
                  <Edit className="mr-2 h-4 w-4" />
                  {t.registerEmotion}
                </Button>
              </DialogTrigger>
              <DialogContent className="flex w-[calc(100%-1rem)] max-w-[480px] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden p-4 sm:p-6">
                <DialogHeader className="shrink-0">
                  <DialogTitle className="text-2xl">{t.registerEmotionDialogTitle}</DialogTitle>
                  <DialogDescription>
                    {t.registerEmotionDialogDescription}
                  </DialogDescription>
                </DialogHeader>
                <EmotionalEntryForm onSubmit={handleEmotionalEntrySubmit} />
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-accent flex items-center">
            <NotebookPen className="mr-3 h-6 w-6" />
            {t.allEmotionalEntriesTitle}
          </CardTitle>
          <CardDescription>
            {t.allEmotionalEntriesDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : allEntries.length > 0 ? (
            <ul className="space-y-4">
              {allEntries.map((entry, index) => {
                const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
                const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
                return (
                  <li key={entry.id} className="p-4 border rounded-lg bg-muted/30 shadow-sm">
                    <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString("es-ES")}</p>
                    <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                      {entry.situation}
                    </p>
                     {entry.thought && (
                        <p className="text-sm text-muted-foreground mt-2 italic border-l-2 pl-2">
                           "{entry.thought}"
                        </p>
                    )}
                    <p className="font-semibold text-primary mt-1">{emotionLabel}</p>
                    {index < allEntries.length - 1 && <Separator className="my-4" />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground italic text-center py-4">{t.noEntriesYet}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
