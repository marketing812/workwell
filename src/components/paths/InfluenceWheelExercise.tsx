
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InfluenceWheelExerciseContent } from '@/data/paths/pathTypes';

interface InfluenceWheelExerciseProps {
  content: InfluenceWheelExerciseContent;
  pathId: string;
}

interface Situation {
    name: string;
    control: 'mine' | 'not_mine' | 'partial' | '';
    circle: 'interno' | 'externo' | '';
}

export function InfluenceWheelExercise({ content, pathId }: InfluenceWheelExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [situations, setSituations] = useState<Situation[]>(() =>
    Array(5).fill(null).map(() => ({ name: '', control: '', circle: '' }))
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSituationChange = <K extends keyof Situation>(index: number, field: K, value: Situation[K]) => {
    const newSituations = [...situations];
    newSituations[index] = { ...newSituations[index], [field]: value };
    setSituations(newSituations);
  };
  
  const nextStep = () => {
    if (step === 0 && situations.filter(s => s.name.trim()).length < 3) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, anota al menos 3 situaciones para continuar.',
        variant: 'destructive',
      });
      return;
    }
     if (step === 1 && situations.filter(s => s.name.trim() && s.control).length < 3) {
      toast({
        title: 'Clasificación Incompleta',
        description: 'Por favor, clasifica al menos 3 situaciones.',
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
    if (filledSituations.length < 3) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, asigna un círculo a tus 3 situaciones para poder guardar.',
        variant: 'destructive',
      });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledSituations.forEach((sit, index) => {
      notebookContent += `**Situación ${index + 1}:** ${sit.name}\n`;
      notebookContent += `- Control: ${sit.control}\n`;
      notebookContent += `- Círculo: ${sit.circle}\n\n`;
    });

    addNotebookEntry({ title: 'Mi Rueda de Influencia', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu rueda de influencia ha sido guardada.' });
    setIsSaved(true);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="font-semibold"><b>Paso 1: Lista de situaciones</b><br/>Piensa en los últimos 7 días y anota situaciones que te han preocupado, estresado o hecho sentir responsable. Ejemplo: Preparar una presentación importante. La actitud negativa de un compañero/a. Que mi pareja esté de mal humor.</p>
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
            <Button onClick={nextStep} className="w-full">Siguiente: Clasificar</Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <p className="font-semibold"><b>Paso 2: Clasificación</b><br/>Para cada situación, selecciona si: - Depende de mí. - No depende de mí. - Depende parcialmente de mí. <p>Ejemplo: Preparar una presentación importante → Depende de mí. <br/>Que mi pareja esté de mal humor → No depende de mí. </p></p>
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
              <Button onClick={nextStep}>Siguiente: Mi Rueda</Button>
            </div>
          </div>
        );
      case 2:
        return (
           <div className="space-y-4">
            <p className="font-semibold"><b>Paso 3: Mi rueda de influencia</b></p><p>Indica para cada situación su lugar: <br/>Círculo interno: lo que depende de ti (acciones, actitudes, elecciones). <br/>Círculo externo: lo que no depende de ti (conductas ajenas, pasado, azar). </p>
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
              <Button onClick={handleSave} disabled={isSaved}>
                <Save className="mr-2 h-4 w-4" /> Guardar Rueda
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
        {isSaved ? (
           <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado. Puedes ver el registro en tu cuaderno.</p>
            </div>
        ) : renderStep()}
      </CardContent>
    </Card>
  );
}
