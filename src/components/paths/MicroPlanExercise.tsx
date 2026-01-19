"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
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
  
  const resetExercise = () => {
    setMoment('');
    setOtherMoment('');
    setAction('');
    setStep(0);
  };

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
    setStep(4); // Go to motivational screen
  };

  const momentOptions = [
    'Llegue a casa',
    'Termine de cenar',
    'Apague el portátil',
    'Me levante por la mañana',
    'Deje a los niños o niñas en el cole'
  ];

  const renderStep = () => {
      switch(step) {
        case 0:
            return (
                <div className="text-center p-4">
                    <p className="mb-4">Planear con realismo es lo que necesitamos para avanzar. Crea tu microplan: una frase corta que una lo cotidiano con lo que quieres empezar.</p>
                    <Button onClick={() => setStep(1)}>Crear mi frase de acción</Button>
                </div>
            );
        case 1:
            return (
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
                    <div className="flex justify-between w-full">
                        <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                        <Button onClick={() => setStep(2)} className="w-auto" disabled={!finalMoment.trim()}>Siguiente paso</Button>
                    </div>
                </div>
            );
        case 2:
            return (
                <div className="p-4 space-y-4">
                    <Label>¿Qué pequeña acción puedes vincular a ese momento?</Label>
                    <Textarea value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: Salir a caminar 10 minutos..." />
                    <div className="flex justify-between w-full">
                        <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                        <Button onClick={() => setStep(3)} className="w-auto" disabled={!action.trim()}>Ver mi frase</Button>
                    </div>
                </div>
            );
        case 3: // NEW: "Tu microplan personalizado"
            return (
                <div className="p-4 space-y-4 text-center">
                    <h4 className="font-bold">Tu frase final:</h4>
                    <p className="italic text-lg p-4 bg-accent/10 border-l-4 border-accent">"Cuando {finalMoment}, voy a {action}."</p>
                    <div className="text-sm text-muted-foreground text-left">
                        <p className="font-semibold">Ejemplos reales:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>“Cuando termine de cenar, voy a salir a caminar 10 minutos.”</li>
                            <li>“Cuando llegue a casa, voy a abrir el documento del proyecto.”</li>
                        </ul>
                    </div>
                    <p className="text-xs italic text-muted-foreground pt-2">Esta frase no es una obligación: es una señal de autocuidado. Puedes ajustarla tantas veces como necesites. Lo importante es empezar.</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button onClick={() => setStep(1)} variant="outline" className="w-full">Volver a editar</Button>
                        <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar en mi diario</Button>
                    </div>
                </div>
            );
        case 4: // NEW: "Refuerzo y motivación"
            return (
                <div className="p-4 space-y-4 text-center">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">Ya no dependes de tus ganas del momento.</h4>
                    <p className="text-muted-foreground">Ahora tienes un plan. Y eso lo cambia todo.</p>
                    <blockquote className="italic border-l-4 border-primary pl-4 text-left">“La acción nace del compromiso, no de la inspiración. Hoy te has comprometido contigo.”</blockquote>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button onClick={resetExercise} variant="outline" className="w-full">Crear otro plan</Button>
                    </div>
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
