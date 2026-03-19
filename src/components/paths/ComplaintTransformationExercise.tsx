"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowRight, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

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
  const [underControl, setUnderControl] = useState('');
  const [concreteAction, setConcreteAction] = useState('');
  const [tableComplaint, setTableComplaint] = useState('');
  const [tableAction, setTableAction] = useState('');
  const [todayAction, setTodayAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => (prev > 0 ? prev - 1 : 0));

  const resetExercise = () => {
    setStep(0);
    setComplaint('');
    setUnderControl('');
    setConcreteAction('');
    setTableComplaint('');
    setTableAction('');
    setTodayAction('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (
      !complaint.trim() ||
      !underControl.trim() ||
      !concreteAction.trim() ||
      !tableComplaint.trim() ||
      !tableAction.trim() ||
      !todayAction.trim()
    ) {
      toast({
        title: 'Campos incompletos',
        description: 'Completa los cinco pasos pantallas antes de guardar.',
        variant: 'destructive',
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Paso 1 - Elige tu queja: ${complaint}

Paso 2 - Parte bajo tu control: ${underControl}

Paso 3 - Redefine en modo accion: ${concreteAction}

Paso 4 - Tabla (Me quejo de...): ${tableComplaint}

Paso 4 - Tabla (Lo que si puedo hacer es...): ${tableAction}

Paso 5 - Accion que hare hoy: ${todayAction}
`;

    addNotebookEntry({
      title: 'Transformacion de queja a accion',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({
      title: 'Ejercicio guardado',
      description: 'La transformacion de queja a accion se guardo en tu cuaderno.',
    });

    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              En este ejercicio vas a convertir una queja en una accion concreta que dependa de ti.
            </p>
            <Button onClick={nextStep}>
              Empezar ejercicio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1 - Elige tu queja</h4>
            <p className="text-sm text-muted-foreground">
              Piensa en algo que te haya molestado en las ultimas 24-48 horas. Escribelo tal cual lo dirias.
            </p>
            <Textarea
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              placeholder="Escribe aqui tu queja"
            />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!complaint.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2 - Detecta lo que esta bajo tu control</h4>
            <p className="text-sm text-muted-foreground">
              Preguntate: "Que parte de esta situacion depende de mi?".
            </p>
            <Textarea
              value={underControl}
              onChange={e => setUnderControl(e.target.value)}
              placeholder="Describe la parte que si depende de ti"
            />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!underControl.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3 - Redefine en modo accion</h4>
            <p className="text-sm text-muted-foreground">
              Cambia la queja por un paso concreto que puedas dar.
            </p>
            <div className="rounded-md border p-3 bg-muted/30 text-sm">
              <p><strong>Ejemplo:</strong></p>
              <p>Queja: "Nunca me valoran en el trabajo."</p>
              <p>Accion: "Voy a pedir feedback a mi jefe esta semana para saber que estoy haciendo bien y que puedo mejorar."</p>
            </div>
            <Textarea
              value={concreteAction}
              onChange={e => setConcreteAction(e.target.value)}
              placeholder="Escribe tu accion concreta"
            />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!concreteAction.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4 - Registra tu plan</h4>
            <p className="text-sm text-muted-foreground">
              En la tabla "Me quejo de... / Lo que si puedo hacer es...", anota de nuevo tu queja y la accion que has definido.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table-complaint">Me quejo de...</Label>
                <Textarea
                  id="table-complaint"
                  value={tableComplaint}
                  onChange={e => setTableComplaint(e.target.value)}
                  placeholder="Escribe tu queja"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-action">Lo que si puedo hacer es...</Label>
                <Textarea
                  id="table-action"
                  value={tableAction}
                  onChange={e => setTableAction(e.target.value)}
                  placeholder="Escribe tu accion"
                />
              </div>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!tableComplaint.trim() || !tableAction.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 5 - Revision final</h4>
            <p className="text-sm text-muted-foreground">
              Lee tus acciones y elige la primera que pondras en practica hoy mismo.
            </p>
            <Label htmlFor="today-action">Escribe la accion que haras hoy</Label>
            <Textarea
              id="today-action"
              value={todayAction}
              onChange={e => setTodayAction(e.target.value)}
              placeholder="Escribe la accion que haras hoy"
            />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </form>
        );
      case 6:
        return (
          <div className="p-6 space-y-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Ejercicio guardado</h4>
            <p className="text-muted-foreground">La practica se guardo en tu cuaderno terapeutico.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        <CardDescription className="pt-2">
          {content.objective}
          {content.duration && (
            <p className="pt-1 text-sm text-muted-foreground">
              <span className="font-semibold">Duracion estimada:</span> {content.duration}
            </p>
          )}
          {content.audioUrl && (
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src={content.audioUrl} type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}


