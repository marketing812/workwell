
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

export function TwoMinuteRuleExercise({ content, pathId, onComplete }: TwoMinuteRuleExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [task, setTask] = useState('');
  const [twoMinVersion, setTwoMinVersion] = useState('');
  const [when, setWhen] = useState('');
  const [whenAfter, setWhenAfter] = useState('');
  const [whenOther, setWhenOther] = useState('');
  const [saved, setSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setTask('');
    setTwoMinVersion('');
    setWhen('');
    setWhenAfter('');
    setWhenOther('');
    setSaved(false);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    
    let isWhenValid = false;
    if (when === 'despues') {
        isWhenValid = whenAfter.trim() !== '';
    } else if (when === 'otro') {
        isWhenValid = whenOther.trim() !== '';
    } else {
        isWhenValid = when.trim() !== '';
    }

    if (!task.trim() || !twoMinVersion.trim() || !isWhenValid) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, rellena todos los campos para guardar tu compromiso.',
        variant: 'destructive',
      });
      return;
    }
    
    let finalWhen = when;
    if (when === 'despues') {
        finalWhen = `Después de ${whenAfter}`;
    } else if (when === 'otro') {
        finalWhen = whenOther;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea que pospongo:*
${task}

*Mi versión de 2 minutos es:*
${twoMinVersion}

*Me comprometo a hacerlo:*
${finalWhen}
    `;
    addNotebookEntry({ title: 'Mi Compromiso de 2 Minutos', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Compromiso Guardado', description: 'Tu plan de 2 minutos ha sido guardado.' });
    setSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    const whenOptions = [
        { value: 'Ahora', label: 'Ahora' },
        { value: 'En los próximos 10 minutos', label: 'En los próximos 10 minutos' },
        { value: 'Esta tarde / noche', label: 'Esta tarde / noche' },
    ];
    
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="task" className="font-semibold text-lg">Paso 1: ¿Qué tarea estás posponiendo?</Label>
            <Textarea id="task" value={task} onChange={e => setTask(e.target.value)} />
            <Button onClick={nextStep} className="w-full mt-4" disabled={!task.trim()}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="twoMin" className="font-semibold text-lg">Paso 2: ¿Cuál sería su versión de 2 minutos?</Label>
            <Textarea id="twoMin" value={twoMinVersion} onChange={e => setTwoMinVersion(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!twoMinVersion.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">Paso 3: ¿Cuándo lo harás?</Label>
            <RadioGroup value={when} onValueChange={setWhen}>
                {whenOptions.map(opt => (
                    <div className="flex items-center gap-2" key={opt.value}>
                        <RadioGroupItem value={opt.value} id={`when-${opt.value}`} />
                        <Label htmlFor={`when-${opt.value}`} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
              <div>
                <div className="flex items-center gap-2"><RadioGroupItem value="despues" id="after" /><Label htmlFor="after" className="font-normal">Después de</Label></div>
                {when === 'despues' && <Input value={whenAfter} onChange={e => setWhenAfter(e.target.value)} placeholder="describe el momento (ej: comer)" className="ml-6 mt-1 text-sm"/>}
              </div>
              <div>
                 <div className="flex items-center gap-2"><RadioGroupItem value="otro" id="other" /><Label htmlFor="other" className="font-normal">Otro:</Label></div>
                 {when === 'otro' && <Input value={whenOther} onChange={e => setWhenOther(e.target.value)} placeholder="especifica cuándo" className="ml-6 mt-1 text-sm"/>}
              </div>
            </RadioGroup>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Guardar mi compromiso</Button>
            </div>
          </div>
        );
      case 3:
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center space-y-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">¡Compromiso guardado!</p>
                <Button onClick={nextStep} variant="link">
                    Ver Cierre Motivador <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        );
       case 4:
        return (
          <div className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Cierre Motivador</h4>
            <p className="text-muted-foreground italic">
              Acabas de plantar una semilla. Por pequeña que sea, tiene fuerza. Te conecta con tu capacidad de actuar… sin esperar a tenerlo todo bajo control.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={resetExercise} variant="outline">
                Hacer otro compromiso
              </Button>
            </div>
          </div>
        );
      default: return null;
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
        {content.duration && <p className="text-sm text-muted-foreground pt-1">Duración estimada: {content.duration}</p>}
      </CardHeader>
      <CardContent>
          {renderStep()}
      </CardContent>
    </Card>
  );
}
