
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { Edit3, Save, CheckIcon, MinusIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { GentleTrackingExerciseContent } from '@/data/paths/pathTypes';

interface GentleTrackingExerciseProps {
  content: GentleTrackingExerciseContent;
  pathId: string;
}

type TrackingStatus = 'done' | 'partial' | 'skipped';
type DailyProgress = {
  status?: TrackingStatus;
};

export function GentleTrackingExercise({ content, pathId }: GentleTrackingExerciseProps) {
  const { toast } = useToast();
  const [weekWord, setWeekWord] = useState('');
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState<Record<string, DailyProgress>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const storageKey = `gentle-tracking-${pathId}`;

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(storageKey);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error('Error loading tracking progress from localStorage', error);
    }
  }, [storageKey]);

  const saveProgress = (newProgress: Record<string, DailyProgress>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving tracking progress to localStorage', error);
    }
  };

  const handleDayStatusChange = (status: TrackingStatus) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newProgress = { ...progress, [dateKey]: { ...progress[dateKey], status } };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const progressText = Object.entries(progress)
      .map(([date, data]) => {
        const statusSymbol = data.status === 'done' ? '✔' : data.status === 'partial' ? '~' : 'X';
        return `${format(new Date(date), 'dd/MM/yyyy')}: ${statusSymbol}`;
      })
      .join('\n');

    const notebookContent = `
**Ejercicio: ${content.title}**

*Seguimiento del Hábito:*
${progressText || 'No se registraron días.'}

*Mi palabra de la semana para este hábito ha sido:*
**${weekWord || 'No especificada.'}**
    `;
    addNotebookEntry({ title: 'Mi Seguimiento Amable', content: notebookContent, pathId });
    toast({
      title: 'Seguimiento Guardado',
      description: 'Tu progreso y palabra de la semana se han guardado.',
    });
    setSaved(true);
  };

  const renderDayContent = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayProgress = progress[dateKey];
    let icon = null;
    if (dayProgress?.status === 'done') icon = <CheckIcon className="h-4 w-4 text-green-500" />;
    if (dayProgress?.status === 'partial') icon = <MinusIcon className="h-4 w-4 text-yellow-500" />;
    if (dayProgress?.status === 'skipped') icon = <XIcon className="h-4 w-4 text-red-500" />;

    return (
      <div className="relative flex items-center justify-center h-full w-full">
        {day.getDate()}
        {icon && <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">{icon}</div>}
      </div>
    );
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-sm">Usa el calendario para marcar tu progreso diario (✔, ~, X).</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border p-3"
              components={{
                DayContent: ({ date, displayMonth }) => renderDayContent(date),
              }}
            />
            {selectedDate && (
              <div className="w-full sm:w-auto flex-grow space-y-3">
                <p className="font-semibold text-center">Progreso para {format(selectedDate, 'PPP', { locale: es })}</p>
                <div className="flex justify-around gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('done')} title="Lo hice">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('partial')} title="Lo hice parcialmente">
                    <MinusIcon className="h-5 w-5 text-yellow-500" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => handleDayStatusChange('skipped')} title="No lo hice">
                    <XIcon className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="week-word">Tu palabra de la semana</Label>
            <Textarea id="week-word" value={weekWord} onChange={e => setWeekWord(e.target.value)} placeholder="Ej: Constancia, Presencia, Avance..." disabled={saved} />
          </div>
          {!saved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Palabra de la Semana</Button>
          ) : (
            <p className="text-center text-green-600">¡Guardado!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
