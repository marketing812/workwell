"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, Save, Frown, Annoyed, Meh, Smile, Laugh } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { likertOptions } from '@/data/assessmentQuestions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useTranslations } from '@/lib/translations';

const iconMap: Record<string, React.ElementType> = {
  Frown, Annoyed, Meh, Smile, Laugh,
};

const likertToneClasses: Record<number, { base: string; selected: string }> = {
  1: {
    base: "border-rose-200 bg-rose-50",
    selected: "border-rose-300 bg-rose-100 ring-rose-200",
  },
  2: {
    base: "border-orange-200 bg-orange-50",
    selected: "border-orange-300 bg-orange-100 ring-orange-200",
  },
  3: {
    base: "border-amber-200 bg-amber-50",
    selected: "border-amber-300 bg-amber-100 ring-amber-200",
  },
  4: {
    base: "border-lime-200 bg-lime-50",
    selected: "border-lime-300 bg-lime-100 ring-lime-200",
  },
  5: {
    base: "border-emerald-200 bg-emerald-50",
    selected: "border-emerald-300 bg-emerald-100 ring-emerald-200",
  },
};

const DAILY_CHECKIN_URL_KEY = 'workwell-debug-daily-checkin-url';

interface DailyCheckInPopupProps {
  isOpen: boolean;
  questions: DailyQuestion[]; // Now receives questions as a prop
  onClose: (questionId: string) => void;
  onDismiss: () => void; // A simple dismiss function
}

export function DailyCheckInPopup({ isOpen, questions, onClose, onDismiss }: DailyCheckInPopupProps) {
  const t = useTranslations();
  const { user } = useUser();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  
  // The current question is always the first in the list
  const currentQuestion = questions.length > 0 ? questions[0] : null;

  // Reset answer when the question changes
  useEffect(() => {
    setCurrentAnswer('');
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (!user?.id || !currentQuestion || !currentAnswer) {
      toast({ title: "Error", description: "Falta información para guardar la respuesta.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
      const response = await fetch(`${base}/save-daily-check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          questionCode: currentQuestion.id,
          answer: currentAnswer,
        }),
      });
      const result = await response.json();
      
      if (result.debugUrl && typeof window !== 'undefined') {
        sessionStorage.setItem(DAILY_CHECKIN_URL_KEY, result.debugUrl);
        window.dispatchEvent(new Event('daily-checkin-url-updated'));
      }

      if (response.ok && result.success) {
        toast({ title: "Respuesta Guardada", description: "Gracias por tu registro diario." });
        onClose(currentQuestion.id); // Close and mark this specific question as done
      } else {
        throw new Error(result.message || "Error al guardar la respuesta.");
      }
    } catch (error: any) {
      toast({
        title: "Error al Guardar",
        description: error.message || "No se pudo comunicar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="flex w-[calc(100%-0.5rem)] max-w-md flex-col gap-0 rounded-[28px] p-5 max-sm:min-h-[60svh] max-sm:max-h-[78svh] sm:max-h-[90vh] sm:p-6">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl leading-tight sm:text-lg">{t.dailyCheckInPageTitle || "Pregunta del Día"}</DialogTitle>
          <DialogDescription className="text-lg leading-relaxed sm:text-sm">
            {t.dailyCheckInPageDescription || "Una pequeña pausa para conectar contigo."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 overflow-y-auto py-2 sm:py-4">
          {!currentQuestion ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-lg text-muted-foreground sm:text-sm">No hay preguntas para hoy.</p>
            </div>
          ) : (
              <div key={currentQuestion.id} className="flex min-h-full w-full flex-col justify-between gap-5">
                <div className="flex flex-1 items-center justify-center py-2">
                  <p className="text-2xl font-semibold text-center leading-snug break-words sm:text-lg">
                    {currentQuestion.text}
                  </p>
                </div>
                <RadioGroup
                  value={currentAnswer}
                  onValueChange={setCurrentAnswer}
                  className="grid grid-cols-5 items-center justify-items-center gap-3 py-2"
                >
                  {likertOptions.map(option => {
                    const IconComponent = iconMap[option.label];
                    const tone = likertToneClasses[option.value];
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`${currentQuestion.id}-${option.value}`}
                        className={cn(
                          "flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                          "aspect-square w-full max-w-[3.65rem] hover:shadow-md sm:max-w-14",
                          tone?.base,
                          currentAnswer === option.value.toString()
                            ? cn("ring-2 shadow-lg scale-105", tone?.selected)
                            : "shadow-sm"
                        )}
                        title={option.description}
                      >
                        <RadioGroupItem value={option.value.toString()} id={`${currentQuestion.id}-${option.value}`} className="sr-only" />
                        {IconComponent && <IconComponent className="h-9 w-9 text-foreground/80 sm:h-8 sm:w-8" />}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
          )}
        </div>
        {currentQuestion && (
            <div className="mt-2 flex justify-end border-t pt-4">
                <Button onClick={handleSubmit} disabled={!currentAnswer || isSubmitting} className="h-14 w-full text-lg sm:h-10 sm:w-auto sm:text-sm">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Respuesta
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
