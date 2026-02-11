"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';

interface ActivateShieldExerciseProps {
  content: ModuleContent;
  pathId: string;
  onComplete: () => void;
}

export default function ActivateShieldExercise({ content, pathId, onComplete }: ActivateShieldExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (content.type !== 'activateShieldExercise') return null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    if (!isCompleted) {
        toast({ title: "Práctica Finalizada", description: "Has entrenado tu escudo empático." });
        setIsCompleted(true);
        onComplete();
    }
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">{content.objective}</p>
            <div className="mt-4">
                <h4 className="font-semibold text-foreground">Cuándo hacerla:</h4>
                <ul className="list-disc list-inside text-sm text-left mx-auto max-w-md">
                    <li>Antes de una conversación difícil.</li>
                    <li>Antes de un encuentro que sabes que te remueve.</li>
                    <li>Antes de contestar un mensaje que te genera tensión.</li>
                    <li>Antes de acompañar emocionalmente a alguien.</li>
                </ul>
            </div>
            <Button onClick={nextStep}>Empezar Práctica <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Pausa un momento</h4>
            <p className="text-muted-foreground">Cierra los ojos (o baja la mirada). Toma una respiración lenta y profunda. Suelta el aire como si soltaras el peso de tener que resolverlo todo.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Step 2
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Hazte estas 3 preguntas</h4>
            <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
                <li>¿Estoy emocionalmente disponible para esto ahora?</li>
                <li>¿Desde dónde quiero responder: desde la presión o desde la presencia?</li>
                <li>¿Puedo activar mi escudo interno para estar sin absorber?</li>
            </ul>
            <p className="italic text-sm text-muted-foreground">No tienes que responder perfecto. Solo notar cómo estás… ya es un acto de presencia.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Step 3
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Activa tu escudo empático</h4>
            <p className="text-muted-foreground">Visualiza por un instante tu escudo suave a tu alrededor. Recuerda: no es una barrera, es tu espacio seguro.</p>
            <p className="text-muted-foreground">Repite en silencio una frase que te cuide:</p>
            <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic">
                <p>“Puedo estar contigo… sin dejar de estar conmigo.”</p>
                <p>“Mi cuidado también importa aquí.”</p>
                <p>“Mi presencia es suficiente. No tengo que absorberlo todo.”</p>
            </blockquote>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleComplete}>Finalizar Práctica <CheckCircle className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
       case 4: // Confirmation
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Práctica finalizada</h4>
            <p className="text-muted-foreground">Has practicado un gesto breve pero poderoso para cuidarte. Puedes volver a él siempre que lo necesites.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Repetir Práctica</Button>
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
        {content.audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        {content.duration && <p className="text-xs text-muted-foreground pt-1">Duración estimada: {content.duration}</p>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
