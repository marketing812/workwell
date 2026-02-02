
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { RealisticRitualExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Input } from '../ui/input';

interface RealisticRitualExerciseProps {
  content: RealisticRitualExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function RealisticRitualExercise({ content, pathId, onComplete }: RealisticRitualExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [habit, setHabit] = useState('');
  const [minVersion, setMinVersion] = useState('');
  const [link, setLink] = useState('');
  const [reminder, setReminder] = useState('');
  const [saved, setSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setHabit('');
    setMinVersion('');
    setLink('');
    setReminder('');
    setSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!habit || !minVersion || !link || !reminder) {
      toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Hábito que quiero mantener:*
${habit}

*Mi versión mínima viable:*
${minVersion}

*Lo vincularé a:*
${link}

*Para recordarlo o facilitarlo, voy a:*
${reminder}
    `;
    addNotebookEntry({ 
      title: 'Mi Ritual Realista', 
      content: notebookContent, 
      pathId,
      ruta: 'Superar la Procrastinación y Crear Hábitos',
      userId: user?.id 
    });
    toast({ title: 'Ritual Guardado', description: 'Tu ritual ha sido guardado.' });
    setSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">Un ritual realista es un hábito que se adapta a ti, no al revés. Aquí vas a diseñar una versión mínima, clara y posible de lo que quieres sostener en el tiempo.</p>
            <Button onClick={nextStep}>Diseñar mi ritual <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: ¿Qué hábito quiero mantener?</h4>
            <p className="text-sm text-muted-foreground">Ejemplos: “Revisar mi agenda cada mañana”, “Hacer 3 minutos de respiración”, “Caminar 10 minutos después de comer”</p>
            <Label htmlFor="habit-ritual" className="sr-only">¿Qué hábito quiero mantener?</Label>
            <Textarea id="habit-ritual" value={habit} onChange={e => setHabit(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep} disabled={!habit.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: ¿Cuál es su versión mínima viable?</h4>
            <p className="text-sm text-muted-foreground">Ejemplos: “Escribir solo una línea”, “Moverme durante 2 minutos”, “Preparar la ropa deportiva”</p>
            <Label htmlFor="min-version" className="sr-only">¿Cuál es su versión mínima viable?</Label>
            <Textarea id="min-version" value={minVersion} onChange={e => setMinVersion(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!minVersion.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: ¿Cuándo o con qué lo vincularás?</h4>
            <p className="text-sm text-muted-foreground">Ejemplos: “Después de lavarme los dientes”, “Cuando cierre el portátil”, “Al volver de dejar a mi hijo o hija”</p>
            <Label htmlFor="link" className="sr-only">¿Cuándo o con qué lo vincularás?</Label>
            <Textarea id="link" value={link} onChange={e => setLink(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!link.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: ¿Qué puedo hacer para recordarlo o facilitarlo?</h4>
            <p className="text-sm text-muted-foreground">Ejemplos: “Dejar una nota visible”, “Poner una alarma suave”, “Dejar el libro preparado sobre la mesa”</p>
            <Label htmlFor="reminder" className="sr-only">¿Qué puedo hacer para recordarlo o facilitarlo?</Label>
            <Textarea id="reminder" value={reminder} onChange={e => setReminder(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button type="submit" disabled={!reminder.trim()}>
                <Save className="mr-2 h-4 w-4" /> Guardar mi ritual
              </Button>
            </div>
          </form>
        );
      case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ritual Guardado!</h4>
            <Button onClick={resetExercise} variant="outline" className="w-full">
              Crear otro ritual
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

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
          {renderStep()}
      </CardContent>
    </Card>
  );
}
