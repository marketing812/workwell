
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InfluenceWheelExerciseContent } from '@/data/paths/pathTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InfluenceWheelExerciseProps {
  content: InfluenceWheelExerciseContent;
  pathId: string;
}

interface Situation {
    name: string;
    control: 'mine' | 'not_mine' | 'partial' | '';
    circle: 'interno' | 'externo' | '';
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


export function InfluenceWheelExercise({ content, pathId }: InfluenceWheelExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [situations, setSituations] = useState<Situation[]>(() =>
    Array(5).fill(null).map(() => ({ name: '', control: '', circle: '' }))
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

  const nextStep = () => {
    if (step === 1 && situations.filter(s => s.name.trim()).length < 3) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, anota al menos 3 situaciones para continuar.',
        variant: 'destructive',
      });
      return;
    }
    if (step === 2 && situations.filter(s => s.name.trim() && s.control).length < 3) {
      toast({
        title: 'Clasificación Incompleta',
        description: 'Por favor, clasifica al menos 3 situaciones.',
        variant: 'destructive',
      });
      return;
    }
    if (step === 3 && situations.filter(s => s.name.trim() && s.circle).length < 3) {
       toast({
        title: 'Clasificación Incompleta',
        description: 'Por favor, asigna un círculo a tus 3 situaciones para poder guardar.',
        variant: 'destructive',
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
     const filledSituations = situations.filter(sit => sit.name.trim() && sit.control && sit.circle);
    if (filledSituations.length < 1) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, completa al menos una situación para poder guardar.',
        variant: 'destructive',
      });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledSituations.forEach((sit, index) => {
      notebookContent += `**Situación ${index + 1}:** ${sit.name}\n`;
      notebookContent += `- Control: ${sit.control}\n`;
      notebookContent += `- Círculo: ${sit.circle}\n`;
      const action = actionPlans[index];
      if (action) {
          const finalAction = action === 'Otro' ? otherActionPlans[index] || '' : action;
          notebookContent += `- Plan de acción: ${finalAction}\n`;
      }
      notebookContent += '\n';
    });

    addNotebookEntry({ title: 'Mi Rueda de Influencia', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu rueda de influencia ha sido guardada.' });
    setIsSaved(true);
    nextStep();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <Button onClick={nextStep} className="w-full">Empezar ejercicio <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        );
      case 1:
        return (
            <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold" dangerouslySetInnerHTML={{ __html: "<b>Paso 1: Lista de situaciones</b><br>  Piensa en los últimos 7 días y anota situaciones que te han preocupado, estresado o hecho sentir responsable.   Ejemplo:   Preparar una presentación importante.   La actitud negativa de un compañero/a.   Que mi pareja esté de mal humor. " }}/>
                {situations.map((sit, index) => (
                    <div key={index}>
                        <Label htmlFor={`sit-text-${index}`} className="sr-only">Situación {index + 1}:</Label>
                        <Input
                        id={`sit-text-${index}`}
                        value={sit.name}
                        onChange={e => handleSituationChange(index, 'name', e.target.value)}
                        placeholder={`Describe la situación ${index + 1}`}
                        disabled={isSaved}
                        />
                    </div>
                ))}
                 <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente: Clasificar <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </div>
            </div>
        );
      case 2:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold" dangerouslySetInnerHTML={{__html: "<b>Paso 2: Clasificación</b><br> Para cada situación, selecciona si:  - Depende de mí. - No depende de mí.  - Depende parcialmente de mí.   Ejemplo:  Preparar una presentación importante → Depende de mí.  Que mi pareja esté de mal humor → No depende de mí. "}}/>
            {situations.filter(sit => sit.name.trim() !== '').map((sit, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                <p className="font-semibold text-muted-foreground">{sit.name}</p>
                <RadioGroup value={sit.control} onValueChange={v => handleSituationChange(index, 'control', v as any)} className="flex flex-wrap gap-4 pt-2" disabled={isSaved}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mine" id={`c-${index}-m`} />
                    <Label htmlFor={`c-${index}-m`} className="font-normal">Depende de mí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_mine" id={`c-${index}-n`} />
                    <Label htmlFor={`c-${index}-n`} className="font-normal">No depende de mí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id={`c-${index}-p`} />
                    <Label htmlFor={`c-${index}-p`} className="font-normal">Depende parcialmente</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
             <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Mi Rueda <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
           <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold" dangerouslySetInnerHTML={{__html:"<b>Paso 3: Mi rueda de influencia</b></p><p>Indica para cada situación su lugar: <br>Círculo interno: lo que depende de ti (acciones, actitudes, elecciones). <br>Círculo externo: lo que no depende de ti (conductas ajenas, pasado, azar). </p>"}}/>
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
             <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">Atrás</Button>
              <Button onClick={nextStep}>
                Siguiente: Plan de Acción <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </div>
          </div>
        );
      case 4:
         return (
            <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold" dangerouslySetInnerHTML={{__html:"<b>Paso 4: Plan de acción </b><p>Para las que dependen de ti → indica1 acción concreta que puedas hacer esta semana.<br>Para las que no dependen de ti → elige una forma de soltarlas.  </p>"}}/>
                {situations.filter(sit => sit.name.trim() && sit.circle).map((sit, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                        <p className="font-semibold text-muted-foreground">{sit.name}</p>
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
                 <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline">Atrás</Button>
                    <Button onClick={handleSave} disabled={isSaved}>
                        <Save className="mr-2 h-4 w-4" /> Guardar Rueda y Plan
                    </Button>
                </div>
            </div>
         );
      case 5:
        return (
             <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center space-y-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">Guardado. Puedes ver el registro en tu cuaderno.</p>
                <p className="text-sm text-muted-foreground italic" dangerouslySetInnerHTML={{ __html: "Soltar lo que no depende de ti <b>no es rendirse</b>, es liberar espacio para lo que sí puedes cambiar. Cuanto más claro tengas tu círculo de influencia, más ligera será tu carga." }}/>
                <Button onClick={() => { setStep(0); setIsSaved(false); setSituations(Array(5).fill({ name: '', control: '', circle: '' })); setActionPlans({}); setOtherActionPlans({}); }} variant="link" className="mt-4">
                    Hacer otro ejercicio
                </Button>
            </div>
        )
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana4tecnica1.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
