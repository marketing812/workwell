
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { EmpathicShieldVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';

interface EmpathicShieldVisualizationExerciseProps {
  content: EmpathicShieldVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function EmpathicShieldVisualizationExercise({ content, pathId, onComplete }: EmpathicShieldVisualizationExerciseProps) {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      toast({ title: "Práctica Finalizada", description: "Has entrenado una nueva forma de cuidar: desde la empatía que también te cuida a ti." });
      onComplete();
    }
    setStep(7); // Go to final confirmation screen
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Vamos a entrenar una forma de cuidar sin romperte: una visualización breve, pero poderosa, que te ayudará a crear tu escudo emocional interno. No es una barrera. Es un filtro que te protege mientras sigues siendo tú.</p>
            <Button onClick={nextStep}>Empezar Visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 1: Bienvenida
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 1: Bienvenida: cuida sin fundirte</h4>
            <p className="text-muted-foreground">Vamos a realizar una visualización para ayudarte a sostener a los demás sin perderte tú. Imagina que construyes un espacio interno que te protege sin cerrarte. Ese espacio se llama escudo empático: un filtro emocional que cuida tu energía y mantiene tu presencia sin exigirte absorber lo que no te corresponde.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2: // Pantalla 2: Respiración
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 2: Respiración y conexión</h4>
            <p className="text-muted-foreground">Busca una posición cómoda. Cierra los ojos si te ayuda a conectar. Lleva tu atención a la respiración.</p>
            <p className="text-muted-foreground">Inhala por la nariz… Retén… Exhala por la boca, vaciando completamente. Hazlo dos veces más… Y siente cómo tu cuerpo empieza a calmarse.</p>
            <p className="text-muted-foreground italic">Solo por hoy, no tienes que resolver nada. Solo estar.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 3: // Pantalla 3: Construye
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 3: Construye tu escudo emocional</h4>
            <p className="text-muted-foreground">Imagina ahora que una luz suave y cálida te envuelve. Puede tener el color que tú necesites hoy. Esta luz forma un escudo flexible a tu alrededor: por delante, por detrás, a los lados, arriba, abajo.</p>
            <p className="text-muted-foreground">Este escudo no es una barrera. Es una membrana sabia: deja pasar lo que nutre, y suaviza lo que desborda. Dentro de él respiras mejor. Piensas con más claridad. Puedes cuidar sin romperte.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 4: // Pantalla 4: Escena real
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 4: Escena emocional real</h4>
            <p className="text-muted-foreground">Ahora, piensa en una persona o situación que suele exigirte emocionalmente. Imagina que estás ahí, pero con tu escudo activo.</p>
            <p className="text-muted-foreground">Ves al otro. Lo escuchas. Comprendes su emoción… Pero no te pierdes en ella. Tu centro sigue contigo. Estás presente. Estás entera/o. Acompañas… pero no absorbes.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 5: // Pantalla 5: Refuerza
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 5: Refuerza tu espacio interior</h4>
            <p className="text-muted-foreground">Vuelve a ti. A tu cuerpo. A tu escudo. Siente su contorno. Respira dentro de él.</p>
            <p className="text-muted-foreground">Repite mentalmente:</p>
            <blockquote className="p-4 italic border-l-4 bg-background border-primary">
              <p>“Puedo cuidar sin desaparecer.”</p>
              <p>“Mi presencia es suficiente.”</p>
              <p>“También yo merezco protección emocional.”</p>
            </blockquote>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 6: // Pantalla 6: Cierre
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Pantalla 6: Cierre: tu escudo sigue contigo</h4>
            <p className="text-muted-foreground">Imagina cómo ese escudo se integra en tu conciencia. No desaparece: ahora vive dentro de ti, como una herramienta que puedes activar siempre que lo necesites.</p>
            <p className="text-muted-foreground">Respira una última vez… Y cuando estés lista/o, vuelve suavemente al presente.</p>
            <p className="text-muted-foreground italic">Has entrenado una nueva forma de cuidar: desde la empatía que también te cuida a ti.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={handleComplete}>Finalizar Ejercicio <CheckCircle className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 7: // Confirmation screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
            <p className="text-muted-foreground">Has creado un recurso interno muy valioso. Recuerda tu escudo empático la próxima vez que necesites cuidar y cuidarte. Tu escudo ahora vive dentro de ti.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Repetir Visualización</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2 whitespace-pre-line">{content.objective}</CardDescription>
        {content.audioUrl && (
          <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
