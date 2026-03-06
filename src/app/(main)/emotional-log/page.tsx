"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { MoodEvolutionChart } from "@/components/dashboard/MoodEvolutionChart";
import { EmotionalEntryForm, emotions as emotionOptions } from "@/components/dashboard/EmotionalEntryForm";
import { formatEntryTimestamp, type EmotionalEntry } from "@/data/emotionalEntriesStore";
import { ArrowLeft, NotebookPen, LineChart as LineChartIcon, Edit, Loader2 } from "lucide-react";
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

const moodScoreMapping: Record<string, number> = {
  alegria: 5, confianza: 5, sorpresa: 4, anticipacion: 4,
  enfado: 2, miedo: 2, tristeza: 1, asco: 1,
};

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

  const chartData = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return [];
    return allEntries
      .filter(entry => entry.timestamp)
      .map(entry => {
        const emotionDetail = emotionOptions.find(e => e.value === entry.emotion);
        const emotionLabel = emotionDetail ? t[emotionDetail.labelKey as keyof typeof t] : entry.emotion;
        const moodScore = moodScoreMapping[entry.emotion] ?? 0;
        return {
          date: formatEntryTimestamp(entry.timestamp).split(',')[0],
          moodScore: moodScore,
          emotionLabel: emotionLabel,
          fullDate: formatEntryTimestamp(entry.timestamp),
        };
      }).reverse();
  }, [allEntries, t]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            <LineChartIcon className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8" />
            {t.fullEmotionalHistoryTitle}
        </h1>
        <div className="flex gap-2">
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="shadow-md">
                  <Edit className="mr-2 h-4 w-4" />
                  {t.registerEmotion}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{t.registerEmotionDialogTitle}</DialogTitle>
                  <DialogDescription>
                    {t.registerEmotionDialogDescription}
                  </DialogDescription>
                </DialogHeader>
                <EmotionalEntryForm onSubmit={handleEmotionalEntrySubmit} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToDashboard}
            </Link>
            </Button>
        </div>
      </div>

      <MoodEvolutionChart
        data={chartData}
        title="Mis autorregistros"
        description="Evolución de tus autorregistros a lo largo del tiempo"
        className="lg:h-[450px]"
      />

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
                    <p className="text-xs text-muted-foreground">{formatEntryTimestamp(entry.timestamp)}</p>
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



