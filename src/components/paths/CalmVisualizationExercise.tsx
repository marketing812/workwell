
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CalmVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface CalmVisualizationExerciseProps {
  content: CalmVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CalmVisualizationExercise({ content, pathId, onComplete }: CalmVisualizationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [calmScript, setCalmScript] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setCalmScript('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!calmScript.trim()) {
      toast({ title: 'Frase incompleta', description: 'Por favor, completa tu guion interno para guardar.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Situación a visualizar | Respuesta: ${situation || 'No especificada.'}
Pregunta: Mi guion interno de calma | Respuesta: "${calmScript}"
    `;
    addNotebookEntry({ title: 'Mi Ensayo Mental Calmado', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu ensayo mental ha sido guardado." });
    setIsSaved(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Hoy vamos a usar tu imaginación como herramienta. La visualización es como ver una película en tu mente, pero en esta versión tú eres el protagonista o la protagonista… y la historia tiene un final tranquilo y positivo.</p>
            <Button onClick={nextStep}>Empezar visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Paso 1: Prepara tu cuerpo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Prepara tu cuerpo</h4>
            <p className="text-sm text-muted-foreground">Siéntate cómodo o cómoda, cierra los ojos y toma tres respiraciones profundas. Puedes hacerlo tu solo/a o utilizar la guía de audio. Esto ayuda a calmar tu sistema nervioso y preparar el terreno.</p>
            {content.audioUrl && (
              <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 2: // Paso 2: Imagina la situación
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Imagina la situación</h4>
            <p className="text-sm text-muted-foreground">Trae a tu mente una situación que normalmente te produce ansiedad. No empieces con la más difícil, elige una de nivel intermedio.</p>
            <Label htmlFor="situation-vis">Escribe con detalle qué situación vas a imaginar</Label>
            <Textarea id="situation-vis" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Paso 3: Cambia el guion interno
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Cambia el guion interno</h4>
            <p className="text-sm text-muted-foreground">Ahora imagínate en esa situación actuando con calma y seguridad. Observa cómo hablas, cómo te mueves, cómo tu respiración se mantiene serena. Trae a tu mente todo lo bueno.</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: “Me veo entrando en la sala de reuniones, siento algo de nervios, pero respiro y sonrío. Empiezo a hablar y noto que mi voz suena clara.”</p>
            <Label htmlFor="calm-script">Ahora, escríbelo</Label>
            <Textarea id="calm-script" value={calmScript} onChange={e => setCalmScript(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!calmScript.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: // Paso 4: Repite la escena
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Repite la escena</h4>
            <p className="text-sm text-muted-foreground">Visualiza la misma escena varias veces, como un ensayo. Cada repetición entrena tu cerebro para que la respuesta ansiosa sea menor en la vida real.</p>
            <p className="text-xs text-muted-foreground p-2 border-l-2 border-accent bg-accent/10">La neurociencia lo confirma: las imágenes mentales activan las mismas áreas cerebrales que la experiencia real (Kosslyn, 2001).</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 5: // Cierre y guardado
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Cierre</h4>
            <p className="text-sm text-muted-foreground">Has practicado tu ensayo mental calmado. Recuerda: no buscamos que la ansiedad desaparezca por completo, sino entrenar a tu mente a responder con más calma. Con cada práctica, reduces la brecha entre el miedo anticipado y tu capacidad real.</p>
            <blockquote className="italic text-primary pt-2">“Tu mente es un gimnasio: cuanto más ensayas la calma, más fuerte se vuelve.”</blockquote>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              {!isSaved ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
                </Button>
              ) : (
                <div className="flex items-center justify-center p-3 text-green-800 dark:text-green-200">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Guardado
                </div>
              )}
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2">
            El cerebro no distingue del todo entre lo que imagina y lo que vive. Por eso, cuando visualizas con detalle que te enfrentas a una situación temida de forma calmada, entrenas a tu sistema nervioso para responder con menos alarma en la vida real. Esta práctica es como un ensayo mental que reduce la anticipación ansiosa y prepara tu cuerpo para exponerte en pasos pequeños. Tiempo estimado: 8-10 minutos. Te recomiendo hacerlo 3-4 veces por semana, ideal antes de cada exposición real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

    
