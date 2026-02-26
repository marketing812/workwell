
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { moodCheckInOptions, type MoodOption } from '@/data/moodCheckInOptions';

interface MoodCheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoodCheckInPopup({ isOpen, onClose }: MoodCheckInPopupProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast({
        title: "Respuesta Guardada",
        description: (
          <div className="flex flex-col gap-2">
            <span>¡Gracias por tu registro!</span>
            {result.debugUrl && (
              <a 
                href={result.debugUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Ver llamada a la API
              </a>
            )}
          </div>
        ),
      });
      onClose();
      // Reset for next time
      setSelectedMood(null);
    } else {
      toast({
        title: "Error al Guardar",
        description: result.error || "No se pudo comunicar con el servidor.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">¿Cómo te sientes hoy?</DialogTitle>
          <DialogDescription className="text-center">En general, ¿cómo ha sido tu estado de ánimo?</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {moodCheckInOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant="outline"
                className={cn(
                  "w-full h-auto text-left justify-start p-4 space-x-4 items-start whitespace-normal",
                  selectedMood?.value === option.value && "border-primary ring-2 ring-primary"
                )}
                onClick={() => setSelectedMood(option)}
              >
                <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
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
            <Button onClick={handleSubmit} disabled={!selectedMood || isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar Respuesta
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
