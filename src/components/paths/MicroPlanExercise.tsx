
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import type { MicroPlanExerciseContent } from '@/data/paths/pathTypes';

interface MicroPlanExerciseProps {
  content: MicroPlanExerciseContent;
  pathId: string;
}

export function MicroPlanExercise({ content, pathId }: MicroPlanExerciseProps) {
  const { toast } = useToast();
  const [moment, setMoment] = useState('');
  const [action, setAction] = useState('');
  const [step, setStep] = useState(0);

  const handleSave = () => {
    if (!moment || !action) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor, completa ambos campos.',
        variant: 'destructive',
      });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi microplan de acción es:*
Cuando ${moment}, voy a ${action}.
    `;
    addNotebookEntry({ title: 'Mi Microplan de Acción', content: notebookContent, pathId });
    toast({ title: 'Microplan Guardado', description: 'Tu frase de acción ha sido guardada.' });
    setStep(3);
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
        {step === 0 && (
          <div className="text-center p-4">
            <p className="mb-4">Planear con realismo es lo que necesitamos para avanzar. Crea tu microplan: una frase corta que una lo cotidiano con lo que quieres empezar.</p>
            <Button onClick={() => setStep(1)}>Crear mi frase de acción</Button>
          </div>
        )}
        {step === 1 && (
          <div className="p-4 space-y-4">
            <Label>¿En qué momento cotidiano podrías activar tu gesto?</Label>
            <Textarea value={moment} onChange={e => setMoment(e.target.value)} placeholder="Ej: Llegue a casa..." />
            <Button onClick={() => setStep(2)} className="w-full mt-2">Siguiente paso</Button>
          </div>
        )}
        {step === 2 && (
          <div className="p-4 space-y-4">
            <Label>¿Qué pequeña acción puedes vincular a ese momento?</Label>
            <Textarea value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: Salir a caminar 10 minutos..." />
            <Button onClick={handleSave} className="w-full mt-2">Ver mi frase</Button>
          </div>
        )}
        {step === 3 && (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="font-bold">Tu frase final:</p>
            <p className="italic">"Cuando {moment}, voy a {action}."</p>
            <p className="text-sm text-muted-foreground">Esta frase no es una obligación: es una señal de autocuidado.</p>
            <Button onClick={() => setStep(0)} variant="outline">Crear otro plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
