"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckIcon, MinusIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { GentleTrackingExerciseContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';

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

  const saveProgressToLocal = (newProgress: Record<string, DailyProgress>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving tracking progress to localStorage', error);
    }
  };
  
  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    const dateKey = format(day, 'yyyy-MM-dd');
    const currentStatus = progress[dateKey]?.status;
    
    let nextStatus: TrackingStatus | undefined;
    
    if (currentStatus === 'done') {
        nextStatus = 'partial';
    } else if (currentStatus === 'partial') {
        nextStatus = 'skipped';
    } else if (currentStatus === 'skipped') {
        nextStatus = undefined; // clear status
    } else {
        nextStatus = 'done'; // Default first click
    }

    const newProgress = { ...progress };
    if (nextStatus) {
        newProgress[dateKey] = { ...newProgress[dateKey], status: nextStatus };
    } else {
        delete newProgress[dateKey];
    }
    
    setProgress(newProgress);
    saveProgressToLocal(newProgress);
    setSelectedDate(day); // Keep track of the last clicked day
  };


  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const progressText = Object.entries(progress)
      .map(([date, data]) => {
        const statusSymbol = data.status === 'done' ? '✔' : data.status === 'partial' ? '~' : 'X';
        return `${format(new Date(date), 'dd/MM/yyyy')}: ${statusSymbol}`;
      })
      .join('\n');

    const notebookContent = {
        title: 'Mi Seguimiento Amable',
        content: `**Seguimiento del Hábito:**\n${progressText || 'No se registraron días.'}\n\n*Mi palabra de la semana para este hábito ha sido:*\n**${weekWord || 'No especificada.'}**`,
        pathId,
        ruta: 'Superar la Procrastinación y Crear Hábitos',
    };
    
    addNotebookEntry(notebookContent);
    
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
    if (dayProgress?.status === 'done') icon = <CheckIcon className="h-5 w-5 text-green-500" />;
    if (dayProgress?.status === 'partial') icon = <MinusIcon className="h-5 w-5 text-yellow-500" />;
    if (dayProgress?.status === 'skipped') icon = <XIcon className="h-5 w-5 text-red-500" />;

    return (
      <div className="relative flex items-center justify-center h-full w-full">
        {day.getDate()}
        {icon && <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">{icon}</div>}
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-sm text-center md:text-left">Haz clic en un día para marcar tu progreso.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onDayClick={handleDayClick}
              locale={es}
              className="rounded-md border p-3"
              classNames={{
                day_cell: "h-12 w-12",
                day: "h-12 w-12",
              }}
              components={{
                DayContent: ({ date }) => renderDayContent(date as Date),
              }}
            />
            <div className="space-y-3 text-sm text-muted-foreground self-center md:self-start">
              <p className="font-semibold text-foreground">Leyenda:</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span>Lo hice (1er clic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MinusIcon className="h-5 w-5 text-yellow-500" />
                  <span>Lo hice parcialmente (2º clic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <XIcon className="h-5 w-5 text-red-500" />
                  <span>No lo hice (3er clic)</span>
                </div>
                 <p className="text-xs italic pt-2">(4º clic para limpiar)</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4">
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
