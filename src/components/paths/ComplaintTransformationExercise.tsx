
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface ComplaintTransformationExerciseProps {
  content: ComplaintTransformationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ComplaintTransformationExercise({ content, pathId, onComplete }: ComplaintTransformationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [complaint, setComplaint] = useState('');
  const [controllable, setControllable] = useState('');
  const [action, setAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setComplaint('');
    setControllable('');
    setAction('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!complaint.trim() || !controllable.trim() || !action.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los pasos para guardar.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Me quejo de:*
${complaint}

*Lo que sí depende de mí es:*
${controllable}

*Lo que sí puedo hacer es:*
${action}
    `;
    addNotebookEntry({ title: 'Transformación de Queja a Acción', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación de queja a acción ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">La queja te mantiene en un bucle de frustración. En este ejercicio vas a transformar ese malestar en una acción concreta, recuperando tu poder de elección.</p>
            <Button onClick={nextStep}>Empezar Transformación <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu queja</h4>
            <p className="text-sm text-muted-foreground">Piensa en algo que te haya molestado en las últimas 24–48 horas. Escríbelo tal cual lo dirías.</p>
            <Textarea value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Escribe aquí tu queja..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!complaint.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Detecta lo que está bajo tu control</h4>
            <p className="text-sm text-muted-foreground">Pregúntate: “¿Qué parte de esta situación depende de mí?"</p>
            <Textarea value={controllable} onChange={e => setControllable(e.target.value)} placeholder="Describe la parte que sí depende de ti..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!controllable.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Redefine en modo acción</h4>
            <p className="text-sm text-muted-foreground">Cambia la queja por un paso concreto que puedas dar. Ejemplo: Queja → "Nunca me valoran en el trabajo". Acción → "Voy a pedir feedback a mi jefe esta semana."</p>
            <Textarea value={action} onChange={e => setAction(e.target.value)} placeholder="Escribe tu acción concreta..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Ver Resumen <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-center">Resumen de tu Transformación</h4>
            <div className="space-y-3 p-4 border rounded-md bg-background/50">
              <p><strong>Queja:</strong> {complaint || '...'}</p>
              <p><strong>Bajo mi control:</strong> {controllable || '...'}</p>
              <p><strong>Acción concreta:</strong> {action || '...'}</p>
            </div>
            <p className="text-center italic text-muted-foreground text-sm pt-2">Has pasado de la frustración a la acción. Guarda este registro como recordatorio de tu poder.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar en mi Cuaderno</Button>
            </div>
          </form>
        );
       case 5:
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Tu transformación ha sido guardada. Puedes volver a ella en tu cuaderno cuando lo necesites.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                {content.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
