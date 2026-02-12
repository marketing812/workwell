
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { TwoMinuteRuleExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Input } from '../ui/input';

interface TwoMinuteRuleExerciseProps {
  content: TwoMinuteRuleExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function TwoMinuteRuleExercise({ content, pathId, onComplete }: TwoMinuteRuleExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [task, setTask] = useState('');
  const [twoMinVersion, setTwoMinVersion] = useState('');
  const [when, setWhen] = useState('');
  const [saved, setSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setTask('');
    setTwoMinVersion('');
    setWhen('');
    setSaved(false);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !twoMinVersion.trim() || !when.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, rellena todos los campos para guardar tu compromiso.',
        variant: 'destructive',
      });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea que pospongo:*
${task}

*Mi versión de 2 minutos es:*
${twoMinVersion}

*Me comprometo a hacerlo:*
${when}
    `;
    addNotebookEntry({ 
      title: 'Mi Compromiso de 2 Minutos', 
      content: notebookContent, 
      pathId, 
      ruta: 'Superar la Procrastinación y Crear Hábitos',
      userId: user?.id 
    });
    toast({ title: 'Compromiso Guardado', description: 'Tu plan de 2 minutos ha sido guardado.' });
    setSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
            {content.audioUrl && (
              <div className="mb-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
            <p className="mb-4">¿Te pasa que algunas tareas se hacen cada vez más grandes en tu cabeza?  La regla de los 2 minutos consiste en empezar con una versión tan sencilla que no puedas decir que no.  Este microcomienzo te ayudará a pasar de la idea a la acción.</p>
            <Button onClick={() => setStep(1)}>
              Crear mi compromiso <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: ¿Qué tarea estás posponiendo?</h4>
            <Label htmlFor="task" className="sr-only">Tarea que pospones</Label>
            <Textarea id="task" value={task} onChange={e => setTask(e.target.value)} placeholder="Ej: Escribir un email importante, Hacer ejercicio, Ordenar mi habitación" />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep} disabled={!task.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: ¿Cuál sería su versión de 2 minutos?</h4>
            <Label htmlFor="twoMin" className="sr-only">Versión de 2 minutos</Label>
            <Textarea id="twoMin" value={twoMinVersion} onChange={e => setTwoMinVersion(e.target.value)} placeholder="Ej: Escribir solo una línea, Moverme durante 2 minutos, Preparar la ropa de deporte" />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!twoMinVersion.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSave} className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: ¿Cuándo lo harás?</h4>
            <Label htmlFor="when" className="sr-only">¿Cuándo lo harás?</Label>
            <Input id="when" value={when} onChange={e => setWhen(e.target.value)} placeholder="Ej: Justo después de desayunar, En la pausa de las 11:00, Al llegar a casa" />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico</Button>
            </div>
          </form>
        );
      case 4:
        return (
            <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Compromiso Guardado!</h4>
                <p className="text-muted-foreground">Acabas de plantar una semilla. Por pequeña que sea, tiene fuerza.  Te conecta con tu capacidad de actuar… sin esperar a tenerlo todo bajo control.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">
                    Hacer otro compromiso
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
        <CardDescription>
            {content.audioUrl && (
              <div className="mb-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
            ¿Te pasa que algunas tareas se hacen cada vez más grandes en tu cabeza?  La regla de los 2 minutos consiste en empezar con una versión tan sencilla que no puedas decir que no.  Este microcomienzo te ayudará a pasar de la idea a la acción.
          </CardDescription>
      </CardHeader>
      <CardContent>
          {renderStep()}
      </CardContent>
    </Card>
  );
}
