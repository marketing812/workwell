
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MeditacionGuiadaSinJuicioExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';

interface MeditacionGuiadaSinJuicioExerciseProps {
  content: MeditacionGuiadaSinJuicioExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function MeditacionGuiadaSinJuicioExercise({ content, pathId, onComplete }: MeditacionGuiadaSinJuicioExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({
        title: "Reflexión vacía",
        description: "Escribe algo en tu reflexión para guardarla.",
        variant: "destructive"
      });
      return;
    }
    addNotebookEntry({ title: 'Reflexión: Meditación sin Juicio', content: reflection, pathId: pathId, userId: user?.id });
    toast({ title: 'Reflexión guardada' });
    setIsSaved(true);
    onComplete();
  };
  
  const meditationText = "Puedes cerrar los ojos si lo deseas. Respira… y sigue el ritmo del ejercicio.\n\nLleva tu atención a la respiración.\nInhala… exhala lentamente.\n\nSiente el aire entrar y salir de tu cuerpo.\n\nPermite que cualquier sensación, pensamiento o emoción esté presente.\nNo tienes que luchar. Solo observar.\n\nDi mentalmente:\n\n“Esto es lo que siento ahora… y está bien.”\n\nSi te distraes, vuelve suavemente a la frase y la respiración.\n\nQuédate ahí unos minutos. Simplemente presente contigo misma o contigo mismo.\n\n(Recomendado: 5 minutos)";

  const renderStep = () => {
    switch(step) {
      case 0: // PANTALLA 1
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-muted-foreground">
              "Hoy vamos a realizar una meditación sencilla y poderosa. No necesitas hacer nada especial, solo estar contigo un momento sin exigencias. No vas a cambiar lo que sientes, ni analizarlo. Solo a observarlo y sostenerlo con suavidad."
            </p>
            <Button onClick={nextStep}>Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // PANTALLA 2 - Choice
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold">¿Cómo quieres realizar esta meditación?</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setStep(2)} className="w-full sm:w-auto">Escuchar audio</Button>
              <Button onClick={() => setStep(3)} variant="outline" className="w-full sm:w-auto">Leer el texto en pantalla</Button>
            </div>
            <div className="flex items-center justify-center pt-2">
              <CheckCircle className="h-4 w-4 mr-2 text-primary" />
              <p className="text-xs text-muted-foreground">También puedes repetirla varias veces en la semana.</p>
            </div>
            <Button onClick={prevStep} variant="link" className="text-xs">Volver</Button>
          </div>
        );
      case 2: // Audio version
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold">Meditación Guiada (Audio)</h4>
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <Button onClick={() => setStep(4)} className="w-full mt-4">Ir a la reflexión <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button onClick={() => setStep(1)} variant="link" className="text-xs">Elegir otra opción</Button>
          </div>
        );
      case 3: // Text version
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-center">Meditación guiada (versión texto)</h4>
            <p className="text-muted-foreground whitespace-pre-line text-center">{meditationText}</p>
            <Button onClick={() => setStep(4)} className="w-full mt-4">Ir a la reflexión <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button onClick={() => setStep(1)} variant="link" className="w-full text-xs">Elegir otra opción</Button>
          </div>
        );
      case 4: // PANTALLA 4 - Reflection
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-center">¿Cómo fue esta experiencia?</h4>
            <p className="text-sm text-muted-foreground text-center">No hay respuestas correctas. Lo importante es haber estado contigo sin juicio.</p>
            <div className="space-y-2">
                <Label htmlFor="reflection-meditation" className="sr-only">¿Qué sentí al observarme sin intentar corregirme?</Label>
                <Textarea
                  id="reflection-meditation"
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="¿Qué sentí al observarme sin intentar corregirme?"
                  disabled={isSaved}
                  rows={4}
                />
            </div>
            {!isSaved ? (
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" />Guardar Reflexión</Button>
            ) : (
              <div className="flex items-center justify-center p-3 mt-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Guardado.</p>
              </div>
            )}
             <p className="text-xs text-muted-foreground text-center pt-2">✅ Puedes repetir esta meditación en cualquier momento del día. Es una herramienta que entrena tu amabilidad interna y tu presencia consciente.</p>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        <CardDescription className="pt-2">{content.objective}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
