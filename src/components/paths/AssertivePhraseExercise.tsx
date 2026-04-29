
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AssertivePhraseExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface AssertivePhraseExerciseProps {
  content: AssertivePhraseExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const steps = ['intro', 'step1', 'step2', 'step3', 'step4', 'summary'];

export default function AssertivePhraseExercise({ content, pathId, onComplete }: AssertivePhraseExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [fact, setFact] = useState('');
  const [feeling, setFeeling] = useState('');
  const [need, setNeed] = useState('');
  const [request, setRequest] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const storageKey = `exercise-progress-${pathId}-assertivePhrase`;

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        try {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
            const data = JSON.parse(savedState);
            setCurrentStep(data.currentStep || 0);
            setFact(data.fact || '');
            setFeeling(data.feeling || '');
            setNeed(data.need || '');
            setRequest(data.request || '');
        }
        } catch (error) {
        console.error("Error loading exercise state:", error);
        }
    }
  }, [storageKey]);

  useEffect(() => {
    if (isClient) {
        try {
            const stateToSave = { currentStep, fact, feeling, need, request };
            localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Error saving exercise state:", error);
        }
    }
  }, [currentStep, fact, feeling, need, request, storageKey, isClient]);


  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!fact.trim() || !feeling.trim() || !need.trim() || !request.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos para construir y guardar tu frase.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = [
        `**Ejercicio: ${content.title}**`,
        `Pregunta: Describe el hecho objetivo | Respuesta: ${fact || 'No especificado.'}`,
        `Pregunta: Expresa tu emoción | Respuesta: ${feeling || 'No especificado.'}`,
        `Pregunta: Identifica tu necesidad | Respuesta: ${need || 'No especificado.'}`,
        `Pregunta: Formula una petición | Respuesta: ${request || 'No especificado.'}`,
        `\n**Frase Asertiva Final:**\n"Cuando ${fact}, me siento ${feeling}. Necesito ${need}. Por eso te pido ${request}."`
    ].join('\n\n');

    addNotebookEntry({
      title: "Mi Frase Asertiva en 4 Pasos",
      content: notebookContent,
      pathId: pathId,
      userId: user?.id
    });

    toast({
      title: "Frase Guardada",
      description: "Tu frase asertiva se ha guardado en el Cuaderno Terapéutico.",
    });
    onComplete(); // Marcar módulo como completado al guardar
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'intro':
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm">Esta técnica se basa en una estructura simple que puedes usar cuando algo te molesta o necesitas expresar un límite. Te ayudará a hablar desde ti, sin atacar ni culparte.</p>
            <div className="p-3 border rounded-md bg-background text-left">
              <p className="text-sm">Ejemplo visual</p>
              <p className="text-sm">Así quedaría una frase real, para que te hagas una idea:</p>
              <p className="text-sm italic">“Cuando haces bromas sobre mí delante de otros, me siento incómoda. Necesito sentirme respetada. Por eso, si hay algo que no te gusta, te pido que me lo digas en privado.”  </p>
            </div>
            <Button onClick={nextStep}>Empezar a construir mi frase <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      
      case 'step1':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="fact" className="font-semibold text-lg">Paso 1: ¿Qué ocurrió?</Label>
            <p className="text-sm">Piensa en una situación reciente en la que algo te incomodó.</p>
            <p className="text-sm italic">Ejemplo: “Llegaste tarde a la reunión sin avisar.”</p>
            <Label htmlFor="fact" className="text-sm font-medium">Cuando...</Label>
            <Textarea id="fact" value={fact} onChange={e => setFact(e.target.value)} placeholder="Ej: Llegaste tarde a la reunión sin avisar." />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );

      case 'step2':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="feeling" className="font-semibold text-lg">Paso 2: ¿Cómo te sentiste?</Label>
            <p className="text-sm">Ponle nombre a tu emoción. No hay respuestas correctas o incorrectas.</p>
            <p className="text-sm italic">Ejemplo: frustración, tristeza, inseguridad...</p>
            <Label htmlFor="feeling" className="text-sm font-medium">Me siento...</Label>
            <Textarea id="feeling" value={feeling} onChange={e => setFeeling(e.target.value)} placeholder="Ej: frustrado, triste, inseguro..." />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );

      case 'step3':
         return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="need" className="font-semibold text-lg">Paso 3: ¿Qué necesitabas?</Label>
            <p className="text-sm">Conecta con lo que estaba en juego para ti.</p>
            <p className="text-sm italic">Ejemplo: respeto, apoyo, claridad...</p>
            <Label htmlFor="need" className="text-sm font-medium">Necesito...</Label>
            <Textarea id="need" value={need} onChange={e => setNeed(e.target.value)} placeholder="Ej: respeto, apoyo, claridad..." />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      
      case 'step4':
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="request" className="font-semibold text-lg">Paso 4: ¿Qué te gustaría pedir?</Label>
            <p className="text-sm">Formula una petición concreta, breve y posible.</p>
            <p className="text-sm italic">Ejemplo: “Te pido que me avises si vas a llegar más tarde.”</p>
            <Label htmlFor="request" className="text-sm font-medium">Por eso te pido...</Label>
            <Textarea id="request" value={request} onChange={e => setRequest(e.target.value)} placeholder="Ej: Te pido que me avises si vas a llegar más tarde." />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Ver mi frase completa</Button>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-bold text-primary">Tu Frase Asertiva Completa</h3>
            <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic text-left">
              “Cuando {fact || '...' }, me siento {feeling || '...'}. Necesito {need || '...'}. Por eso te pido {request || '...' }.”
            </blockquote>
            <p className="text-sm">Puedes guardarla en tu cuaderno, practicarla en voz alta o escribirla varias veces. Cuanto más la repitas, más natural te saldrá. Si ves que la frase está mal construida, repite los pasos.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Guardar en el cuaderno terapéutico</Button>
            </div>
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
        <CardDescription className="pt-2">{content.objective}</CardDescription>
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={content.audioUrl} type="audio/mpeg" />
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

