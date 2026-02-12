"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InfluenceWheelExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Situation {
    name: string;
    control: 'mine' | 'not_mine' | 'partial' | '';
    circle: 'interno' | 'externo' | '';
}

interface InfluenceWheelExerciseProps {
  content: InfluenceWheelExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const internalActions = [
    "Preparar mejor una presentación o reunión",
    "Establecer un límite claro con una persona",
    "Pedir ayuda o feedback",
    "Organizar tu agenda y priorizar tareas",
    "Cambiar tu actitud ante una situación",
    "Expresar lo que sientes de forma respetuosa",
    "Buscar información para tomar una decisión",
    "Practicar técnicas de autocuidado o relajación",
    "Cumplir un compromiso contigo mismo/a",
    "Revisar y ajustar un plan de acción",
    "Otro",
];

const externalActions = [
    "Recordarme que no puedo cambiar el pasado",
    "Delegar en la persona responsable",
    "Reducir la exposición a personas tóxicas",
    "Poner distancia física o emocional",
    "Repetir un mantra de aceptación (“Esto no depende de mí”)",
    "Cambiar el foco a algo que sí puedo hacer",
    "Dejar de rumiar y ocuparme en una tarea productiva",
    "Practicar respiración consciente para soltar tensión",
    "Aceptar que cada persona decide por sí misma",
    "Reenfocar mi energía hacia mis objetivos",
    "Otro",
];

export default function InfluenceWheelExercise({ content, pathId, onComplete }: InfluenceWheelExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [situations, setSituations] = useState<Situation[]>(() =>
    Array.from({ length: 5 }, () => ({ name: '', control: '', circle: '' }))
  );
  const [actionPlans, setActionPlans] = useState<Record<number, string>>({});
  const [otherActionPlans, setOtherActionPlans] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleSituationChange = <K extends keyof Situation>(index: number, field: K, value: Situation[K]) => {
    const newSituations = [...situations];
    newSituations[index] = { ...newSituations[index], [field]: value };
    setSituations(newSituations);
  };

  const handleActionChange = (index: number, value: string) => {
    setActionPlans(prev => ({...prev, [index]: value}));
    if (value !== 'Otro') {
        setOtherActionPlans(prev => {
            const newOthers = {...prev};
            delete newOthers[index];
            return newOthers;
        });
    }
  };

  const handleOtherActionChange = (index: number, value: string) => {
    setOtherActionPlans(prev => ({...prev, [index]: value}));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setSituations(Array.from({ length: 5 }, () => ({ name: '', control: '', circle: '' })));
    setActionPlans({});
    setOtherActionPlans({});
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
     const filledSituations = situations.filter(sit => sit.name.trim() && sit.circle);
    if (filledSituations.length < 1) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, completa al menos una situación para guardar.',
        variant: 'destructive',
      });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledSituations.forEach((sit, index) => {
      notebookContent += `**Situación ${index + 1}:** ${sit.name}\n`;
      notebookContent += `- Círculo: ${sit.circle}\n`;
      const action = actionPlans[index];
      if (action) {
          const finalAction = action === 'Otro' ? otherActionPlans[index] || '' : action;
          notebookContent += `- Plan de acción: ${finalAction}\n`;
      }
      notebookContent += '\n';
    });

    addNotebookEntry({ title: 'Mi Rueda de Influencia', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu rueda de influencia ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">La responsabilidad no es cargar con todo, sino elegir dónde pones tu energía. Este ejercicio te ayuda a dibujar un mapa claro: lo que sí depende de ti y lo que es mejor soltar.</p>
            <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 1: Lista de situaciones</h4>
                <p className="text-sm text-muted-foreground">Piensa en los últimos 7 días y anota situaciones que te han preocupado, estresado o hecho sentir responsable. Ejemplo: Preparar una presentación importante. La actitud negativa de un compañero/a. Que mi pareja esté de mal humor.</p>
                {situations.map((sit, index) => (
                    <div key={index}>
                        <Label htmlFor={`sit-text-${index}`} className="sr-only">Situación ${index + 1}:</Label>
                        <Textarea
                        id={`sit-text-${index}`}
                        value={sit.name}
                        onChange={e => handleSituationChange(index, 'name', e.target.value)}
                        placeholder={`Describe la situación ${index + 1}`}
                        disabled={isSaved}
                        />
                    </div>
                ))}
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente: Clasificar <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </div>
            </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Mi rueda de influencia</h4>
            <p className="text-sm text-muted-foreground">Indica para cada situación su lugar: <br/>Círculo interno: lo que depende de ti (acciones, actitudes, elecciones). <br/>Círculo externo: lo que no depende de ti (conductas ajenas, pasado, azar).</p>
             {situations.filter(sit => sit.name.trim() !== '').map((sit, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                <p className="font-semibold text-muted-foreground">{sit.name}</p>
                <RadioGroup value={sit.circle} onValueChange={v => handleSituationChange(index, 'circle', v as any)} className="flex flex-wrap gap-4 pt-2" disabled={isSaved}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interno" id={`circ-${index}-in`} />
                    <Label htmlFor={`circ-${index}-in`} className="font-normal">Círculo interno</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="externo" id={`circ-${index}-ex`} />
                    <Label htmlFor={`circ-${index}-ex`} className="font-normal">Círculo externo</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>
                Siguiente: Plan de Acción <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
            <form onSubmit={handleSave} className="space-y-4 p-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Plan de acción</h4>
                <p className="text-sm text-muted-foreground">Para las que dependen de ti → indica 1 acción concreta que puedas hacer esta semana.<br/>Para las que no dependen de ti → elige una forma de soltarlas.</p>
                {situations.filter(sit => sit.name.trim() && sit.circle).map((sit, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                        <p className="font-semibold text-muted-foreground">{sit.name} (Círculo {sit.circle})</p>
                        {sit.circle === 'interno' ? (
                            <div className="space-y-2">
                                <Label htmlFor={`action-${index}`}>Acciones concretas que dependen de ti</Label>
                                <Select onValueChange={(value) => handleActionChange(index, value)} value={actionPlans[index] || ''} disabled={isSaved}>
                                    <SelectTrigger><SelectValue placeholder="Elige una acción..."/></SelectTrigger>
                                    <SelectContent>
                                        {internalActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {actionPlans[index] === 'Otro' && <Textarea value={otherActionPlans[index] || ''} onChange={e => handleOtherActionChange(index, e.target.value)} placeholder="Describe tu otra acción..." disabled={isSaved} />}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor={`action-${index}`}>Formas de soltar</Label>
                                <Select onValueChange={(value) => handleActionChange(index, value)} value={actionPlans[index] || ''} disabled={isSaved}>
                                    <SelectTrigger><SelectValue placeholder="Elige una forma de soltar..."/></SelectTrigger>
                                    <SelectContent>
                                        {externalActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {actionPlans[index] === 'Otro' && <Textarea value={otherActionPlans[index] || ''} onChange={e => handleOtherActionChange(index, e.target.value)} placeholder="Describe tu otra forma de soltar..." disabled={isSaved} />}
                            </div>
                        )}
                    </div>
                ))}
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar Rueda y Plan</Button>
                </div>
            </form>
         );
       case 4: // Confirmation
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Ejercicio Guardado</h4>
            <p className="text-muted-foreground italic">Soltar lo que no depende de ti no es rendirse, es liberar espacio para lo que sí puedes transformar.</p>
            <Button onClick={resetExercise} variant="outline">Hacer otro registro</Button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src={content.audioUrl} type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
