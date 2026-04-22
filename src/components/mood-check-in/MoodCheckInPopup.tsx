
"use client";

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { moodCheckInOptions, moodCheckInToneClasses, type MoodOption } from '@/data/moodCheckInOptions';

const LOW_MOOD_VALUES = new Set(['muy-mal', 'mal']);
const LOW_MOOD_ALERT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const LOW_MOOD_ALERT_THRESHOLD = 0.8;
const LOW_MOOD_ALERT_STORAGE_KEY_PREFIX = 'workwell-low-mood-support-alert-last-shown';

interface MoodCheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MoodCheckInHistoryEntry {
  mood: string;
  score: number;
  timestamp: string;
}

function parseMoodTimestamp(timestamp: string): Date | null {
  const normalized = String(timestamp ?? '').trim().replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function MoodCheckInPopup({ isOpen, onClose }: MoodCheckInPopupProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLowMoodAlert, setShowLowMoodAlert] = useState(false);

  const shouldShowLowMoodSupportAlert = async (userId: string): Promise<boolean> => {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
    if (!base) {
      return false;
    }

    const response = await fetch(
      `${base}/mood-check-ins?userId=${encodeURIComponent(userId)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`No se pudo revisar el histórico de estado de ánimo (HTTP ${response.status}).`);
    }

    const payload = await response.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries as MoodCheckInHistoryEntry[] : [];
    const cutoff = Date.now() - LOW_MOOD_ALERT_WINDOW_MS;

    const recentEntries = entries.filter((entry) => {
      const timestamp = parseMoodTimestamp(entry.timestamp);
      return timestamp ? timestamp.getTime() >= cutoff : false;
    });

    if (recentEntries.length === 0) {
      return false;
    }

    const lowMoodEntries = recentEntries.filter((entry) => LOW_MOOD_VALUES.has(entry.mood));
    const lowMoodRatio = lowMoodEntries.length / recentEntries.length;

    if (lowMoodRatio < LOW_MOOD_ALERT_THRESHOLD) {
      return false;
    }

    const storageKey = `${LOW_MOOD_ALERT_STORAGE_KEY_PREFIX}-${userId}`;
    const lastShownRaw = window.localStorage.getItem(storageKey);
    if (lastShownRaw) {
      const lastShown = Number(lastShownRaw);
      if (Number.isFinite(lastShown) && Date.now() - lastShown < LOW_MOOD_ALERT_WINDOW_MS) {
        return false;
      }
    }

    window.localStorage.setItem(storageKey, String(Date.now()));
    return true;
  };

  const handleSubmit = async () => {
    if (!user || !user.id || !selectedMood) {
      toast({ title: "Error", description: "No se puede guardar la respuesta.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    let result: { success: boolean; error?: string; debugUrl?: string };
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
      const response = await fetch(`${base}/save-mood-check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mood: selectedMood.value,
          score: selectedMood.score,
        }),
      });
      const json = await response.json();
      result = response.ok ? json : { success: false, error: json.error || `HTTP ${response.status}`, debugUrl: json.debugUrl };
    } catch (error: any) {
      result = { success: false, error: error?.message || "No se pudo comunicar con el servidor." };
    }

    setIsSubmitting(false);

    if (result.success) {
      let shouldShowSupportAlert = false;

      try {
        shouldShowSupportAlert = await shouldShowLowMoodSupportAlert(user.id);
      } catch (historyError) {
        console.warn('No se pudo evaluar la alerta de estado de ánimo bajo:', historyError);
      }

      toast({
        title: "Respuesta Guardada",
        description: (
          <div className="flex flex-col gap-2">
            <span>¡Gracias por tu registro!</span>
          
          </div>
        ),
      });
      /*  {result.debugUrl && (
           <a 
                href={result.debugUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Ver llamada a la API
              </a> 
            )}*/
      onClose();
      // Reset for next time
      setSelectedMood(null);
      if (shouldShowSupportAlert) {
        setShowLowMoodAlert(true);
      }
    } else {
      toast({
        title: "Error al Guardar",
        description: result.error || "No se pudo comunicar con el servidor.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl">¿Cómo te sientes hoy?</DialogTitle>
            <DialogDescription className="text-center">En general, ¿cómo ha sido o está siendo tu estado de ánimo?</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {moodCheckInOptions.map((option) => {
              const Icon = option.icon;
              const tone = moodCheckInToneClasses[option.score];
              return (
                <Button
                  key={option.value}
                  variant="outline"
                  className={cn(
                    "w-full h-auto text-left justify-start p-4 space-x-4 items-start whitespace-normal border-2 transition-all duration-200 ease-in-out",
                    tone?.base,
                    selectedMood?.value === option.value
                      ? cn("ring-2", tone?.selected)
                      : "shadow-sm"
                  )}
                  onClick={() => setSelectedMood(option)}
                >
                  <Icon className="mt-1 h-8 w-8 flex-shrink-0 text-foreground/80" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-base">{option.label}</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {option.description}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} disabled={!selectedMood || isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Guardar Respuesta
              </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLowMoodAlert} onOpenChange={setShowLowMoodAlert}>
        <AlertDialogContent className="w-[calc(100%-1rem)] max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-primary">Queremos acompañarte en este momento</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-sm leading-6 text-foreground">
              <p>
                Hemos observado que tu estado de ánimo ha sido bajo en las últimas semanas. Sentimos que estés
                pasando por este momento. Sabemos que este malestar puede influir en tu día a día.
              </p>
              <p>
                Emotiva es una herramienta de aprendizaje y entrenamiento psicológico, pero no sustituye a una
                evaluación ni a una terapia psicológica profesional.
              </p>
              <p>
                Si este malestar está afectando a tu vida cotidiana o se mantiene en el tiempo, te recomendamos
                consultar con un profesional de la salud mental que pueda valorar tu situación de forma personalizada.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
