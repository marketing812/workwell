
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MicroPlanExerciseContent } from '@/data/paths/pathTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface MicroPlanExerciseProps {
  content: MicroPlanExerciseContent;
  pathId: string;
}

export function MicroPlanExercise({ content, pathId }: MicroPlanExerciseProps) {
  const { toast } = useToast();
  const [moment, setMoment] = useState('');
  const [otherMoment, setOtherMoment] = useState('');
  const [action, setAction] = useState('');
  const [step, setStep] = useState(0);

  const finalMoment = moment === 'Otra' ? otherMoment : moment;

  const handleSave = () => {
    if (!finalMoment || !action) {
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
Cuando ${finalMoment}, voy a ${action}.
    `;
    addNotebookEntry({ title: 'Mi Microplan de Acción', content: notebookContent, pathId });
    toast({ title: 'Microplan Guardado', description: 'Tu frase de acción ha sido guardada.' });
    setStep(3); // Go to final confirmation
  };

  const momentOptions = [
    'Llegue a casa',
    'Termine de cenar',
    'Apague el portátil',
    'Me levante por la mañana',
    'Deje a los niños o niñas en el cole'
  ];

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
            <p className="text-sm text-muted-foreground">Elige un momento del día que ya forme parte de tu rutina.</p>
            <Select onValueChange={setMoment} value={moment}>
                <SelectTrigger>
                    <SelectValue placeholder="Elige un momento..." />
                </SelectTrigger>
                <SelectContent>
                    {momentOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                    <SelectItem value="Otra">Otra</SelectItem>
                </SelectContent>
            </Select>
            {moment === 'Otra' && (
                <Input 
                    value={otherMoment} 
                    onChange={e => setOtherMoment(e.target.value)} 
                    placeholder="Describe el otro momento"
                    className="mt-2"
                />
            )}
            <Button onClick={() => setStep(2)} className="w-full mt-2" disabled={!finalMoment.trim()}>Siguiente paso</Button>
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
            <p className="italic">"Cuando {finalMoment}, voy a {action}."</p>
            <p className="text-sm text-muted-foreground">Esta frase no es una obligación: es una señal de autocuidado.</p>
            <Button onClick={() => setStep(0)} variant="outline">Crear otro plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
