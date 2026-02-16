
"use client";

import { useState, type FormEvent, useEffect, useCallback, type DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ExposureLadderExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface ExposureLadderExerciseProps {
  content: ExposureLadderExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ExposureLadderExercise({ content, pathId, onComplete }: ExposureLadderExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState(Array(7).fill(''));
  const [firstStep, setFirstStep] = useState('');

  const [orderedSteps, setOrderedSteps] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (step === 3) {
      setOrderedSteps(steps.filter(s => s.trim()));
    }
  }, [step, steps]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    };

    const newOrderedSteps = [...orderedSteps];
    const [draggedItem] = newOrderedSteps.splice(draggedIndex, 1);
    newOrderedSteps.splice(index, 0, draggedItem);
    
    setOrderedSteps(newOrderedSteps);
    setDraggedIndex(null);
  }, [draggedIndex, orderedSteps]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
  const resetExercise = () => {
    setStep(0);
    setGoal('');
    setSteps(Array(7).fill(''));
    setFirstStep('');
    setOrderedSteps([]);
    setDraggedIndex(null);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledSteps = steps.filter(s => s.trim() !== '');
    if (!goal.trim() || filledSteps.length === 0 || !firstStep.trim()) {
        toast({title: 'Datos incompletos', description: 'Por favor, define tu meta, al menos un escalón y elige tu primer paso.', variant: 'destructive'});
        return;
    }
    const notebookContent = `
**Ejercicio: ${"Mi Escalera de Exposición"}**

**Meta:** ${goal}
**Escalones:**
${steps.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Mi primer paso será:** ${firstStep}
    `;
    addNotebookEntry({ title: 'Mi Escalera de Exposición', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Escalera Guardada' });
    onComplete();
    nextStep();
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 0: return <div className="p-4 text-center"><p className="text-sm mb-4">Imagina que cada situación que temes es un escalón de una escalera. Hoy vamos a construir juntos tu escalera de exposición: desde lo más sencillo hasta lo más desafiante.</p><Button onClick={nextStep}>Empezar a construir <ArrowRight className="ml-2 h-4 w-4"/></Button></div>;
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Define tu meta</h4>
            <p className="text-sm text-muted-foreground">¿Qué situación ansiosa quieres poder afrontar en el futuro?</p>
            <Textarea id="goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ej: Hablar en público en una reunión de trabajo"/>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!goal.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2: return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Divide en escalones</h4>
            <p className="text-sm text-muted-foreground">Ahora divide esa situación en escalones más pequeños.</p>
            <div className="text-sm italic p-2 border-l-2 border-accent bg-accent/10">
              <p>Cada escalón debe ser lo bastante sencillo para poder intentarlo y lo bastante desafiante para activar algo de ansiedad sin bloquearte.</p>
              <p className="font-semibold mt-2">Ejemplo:</p>
              <ul className="list-disc list-inside">
                <li>Hablar 2 minutos frente al espejo.</li>
                <li>Grabarme en audio y escucharme.</li>
                <li>Mandar el audio a varias personas de mi confianza.</li>
                <li>Contarle la presentación a una persona de confianza.</li>
                <li>Hacerlo en un grupo de 3 personas.</li>
                <li>Presentar en una reunión pequeña.</li>
                <li>Presentar en la reunión general.</li>
              </ul>
            </div>
            {steps.map((s, i) => (
                <Textarea key={i} value={s} onChange={e => handleStepChange(i, e.target.value)} placeholder={`Escalón ${i+1}`}/>
            ))}
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
       case 3: return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Ordena tus escalones</h4>
            <p className="text-sm text-muted-foreground">Arrastra y suelta los escalones para ordenarlos del más fácil (arriba) al más difícil (abajo).</p>
            <ul className="space-y-2">
              {orderedSteps.map((s, i) => (
                <li
                  key={s + i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  className={cn(
                      "p-3 border rounded-md cursor-grab bg-background shadow-sm hover:shadow-md transition-shadow",
                      draggedIndex === i && "opacity-50 ring-2 ring-primary"
                  )}
                >
                    {i + 1}. {s}
                </li>
              ))}
            </ul>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={() => {
                    const newSteps = [...orderedSteps];
                    while (newSteps.length < 7) {
                      newSteps.push('');
                    }
                    setSteps(newSteps);
                    nextStep();
                }}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 4: Elige tu primer paso</h4>
            <p className="text-sm text-muted-foreground">¿Cuál será el primer paso realista que puedes poner en práctica esta semana?</p>
             <RadioGroup value={firstStep} onValueChange={setFirstStep}>
                {steps.filter(s => s.trim()).map((s, i) => (
                     <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={`step-radio-${i}`} />
                        <Label htmlFor={`step-radio-${i}`} className="font-normal">{s}</Label>
                     </div>
                ))}
             </RadioGroup>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar mi escalera en el cuaderno terapéutico</Button>
            </div>
          </form>
        );
      case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Has diseñado tu propia escalera de exposición.</h4>
            <p className="text-muted-foreground">Cada peldaño que subas será un entrenamiento para tu confianza. Recuerda: no necesitas subir de golpe. Basta con dar un paso, mantenerte, y volver a intentarlo. Con cada práctica, tu cerebro aprende que eres más capaz de lo que imaginas.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">
              Hacer otra escalera
            </Button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            {content.audioUrl && (
              <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderCurrentStep()}</CardContent>
    </Card>
  );
}
