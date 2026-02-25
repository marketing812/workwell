"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { DailyQuestion } from '@/types/daily-question';
import { Loader2, AlertTriangle, Save, Frown, Annoyed, Meh, Smile, Laugh } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { likertOptions } from '@/data/assessmentQuestions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useTranslations } from '@/lib/translations';
import { saveDailyCheckInAction } from '@/actions/save-daily-check-in';

const iconMap: Record<string, React.ElementType> = {
  Frown, Annoyed, Meh, Smile, Laugh,
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
      const result = await saveDailyCheckInAction({
        userId: user.id,
        questionCode: currentQuestion.id,
        answer: currentAnswer,
      });
      
      if (result.debugUrl && typeof window !== 'undefined') {
        sessionStorage.setItem(DAILY_CHECKIN_URL_KEY, result.debugUrl);
        window.dispatchEvent(new Event('daily-checkin-url-updated'));
      }

      if (result.success) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.dailyCheckInPageTitle || "Pregunta del Día"}</DialogTitle>
          <DialogDescription>{t.dailyCheckInPageDescription || "Una pequeña pausa para conectar contigo."}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!currentQuestion ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No hay preguntas para hoy.</p>
            </div>
          ) : (
              <div key={currentQuestion.id} className="space-y-4">
                <p className="text-lg font-semibold text-center">{currentQuestion.text}</p>
                <RadioGroup
                  value={currentAnswer}
                  onValueChange={setCurrentAnswer}
                  className="flex flex-wrap justify-center items-center gap-2 pt-2"
                >
                  {likertOptions.map(option => {
                    const IconComponent = iconMap[option.label];
                    return (
                      <Label
                        key={option.value}
                        htmlFor={`${currentQuestion.id}-${option.value}`}
                        className={cn(
                          "flex flex-col items-center justify-center p-1 border-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out",
                          "hover:border-primary hover:shadow-md",
                          "w-14 h-14",
                          currentAnswer === option.value.toString()
                            ? "bg-primary/10 border-primary ring-2 ring-primary shadow-lg scale-105"
                            : "bg-background border-input"
                        )}
                        title={option.description}
                      >
                        <RadioGroupItem value={option.value.toString()} id={`${currentQuestion.id}-${option.value}`} className="sr-only" />
                        {IconComponent && <IconComponent className="h-8 w-8 text-foreground/80" />}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
          )}
        </div>
        {currentQuestion && (
            <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={!currentAnswer || isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Respuesta
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
