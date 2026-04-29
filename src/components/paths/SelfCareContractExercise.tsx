"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SelfCareContractExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface SelfCareContractExerciseProps {
  content: SelfCareContractExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function SelfCareContractExercise({ content, pathId, onComplete }: SelfCareContractExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [notWillingTo, setNotWillingTo] = useState('');
  const [commitment, setCommitment] = useState('');
  const [howIWillDoIt, setHowIWillDoIt] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const handleSave = () => {
    if (!notWillingTo.trim() || !commitment.trim() || !howIWillDoIt.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Completa los tres bloques del contrato antes de guardarlo.',
        variant: 'destructive',
      });
      return;
    }

    const notebookContent = [
      `**Ejercicio: ${content.title}**`,
      `Pregunta: No estoy dispuesta/o a... | Respuesta: ${notWillingTo}`,
      `Pregunta: Me comprometo a... | Respuesta: ${commitment}`,
      `Pregunta: Lo haré de forma... | Respuesta: ${howIWillDoIt}`,
      '',
      '**Mi contrato interno de autocuidado:**',
      `No estoy dispuesta/o a ${notWillingTo}.`,
      `Me comprometo a ${commitment}.`,
      `Lo haré de forma ${howIWillDoIt}.`,
    ].join('\n\n');

    addNotebookEntry({
      title: 'Mi Contrato Interno de Autocuidado',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({
      title: 'Contrato guardado',
      description: 'Tu contrato se ha guardado en el cuaderno terapéutico.',
    });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: ¿Por qué un contrato contigo?</h4>
            <p className="text-sm text-muted-foreground">
              A menudo hablamos de poner límites hacia fuera, pero ¿qué pasa con los límites internos? Este ejercicio
              te ayuda a identificar con claridad aquello que ya no estás dispuesto o dispuesta a seguir
              permitiéndote, desde un lugar de cuidado, no de juicio.
            </p>
            <div className="flex justify-end w-full">
              <Button onClick={nextStep}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Instrucciones</h4>
            <p className="text-sm text-muted-foreground">
              Busca un momento tranquilo para ti. Lee cada bloque con calma y completa las frases con sinceridad. No
              hay respuestas correctas: este contrato es solo tuyo, para recordarte lo que necesitas cuidar y cómo
              quieres comprometerte contigo.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep}>
                Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: No estoy dispuesta/o a...</h4>
            <p className="text-sm text-muted-foreground">Algunos ejemplos:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Seguir callando lo que me duele.</li>
              <li>Ceder siempre para evitar conflictos.</li>
              <li>Negar mis necesidades para complacer.</li>
              <li>Aceptar la falta de respeto, aunque venga disfrazada de cercanía.</li>
            </ul>
            <div className="space-y-2">
              <Label htmlFor="not-willing-to">Completa: No estoy dispuesta/o a:</Label>
              <Textarea
                id="not-willing-to"
                value={notWillingTo}
                onChange={(e) => setNotWillingTo(e.target.value)}
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!notWillingTo.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Me comprometo a...</h4>
            <p className="text-sm text-muted-foreground">
              Este compromiso no es una obligación, sino una forma de empezar a elegirte.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Cuidar mi energía como prioridad.</li>
              <li>Escuchar mis emociones sin juzgarlas.</li>
              <li>Recordarme que tengo derecho a poner límites.</li>
              <li>Practicar el respeto hacia mí cada día.</li>
            </ul>
            <div className="space-y-2">
              <Label htmlFor="commitment">Completa: Me comprometo a:</Label>
              <Textarea
                id="commitment"
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!commitment.trim()}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 5: Lo haré de forma...</h4>
            <p className="text-sm text-muted-foreground">¿Cómo quieres ejercer ese autocuidado?</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clara, sin herir.</li>
              <li>Suave, pero firme.</li>
              <li>Honesta, aunque me cueste.</li>
            </ul>
            <div className="space-y-2">
              <Label htmlFor="how-i-will-do-it">Completa: Lo haré de forma:</Label>
              <Textarea
                id="how-i-will-do-it"
                value={howIWillDoIt}
                onChange={(e) => setHowIWillDoIt(e.target.value)}
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={handleSave} disabled={!howIWillDoIt.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Guardar en el cuaderno terapéutico
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="p-6 space-y-4 text-center animate-in fade-in-0 duration-500">
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <p className="font-medium text-green-800 dark:text-green-200">Guardado.</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu contrato interno de autocuidado quedó guardado. Puedes releerlo durante la semana para sostener tu
              compromiso contigo.
            </p>
            <Button onClick={() => setStep(4)} variant="outline" disabled={!isSaved}>
              Revisar mi contrato
            </Button>
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
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            {content.audioUrl && (
              <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}

