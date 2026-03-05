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
  const prevStep = () => setStep(prev => (prev > 0 ? prev - 1 : 0));
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

Pregunta: Situacion a visualizar | Respuesta: ${situation || 'No especificada.'}
Pregunta: Mi guion interno de calma | Respuesta: "${calmScript}"
    `;

    addNotebookEntry({ title: 'Mi Ensayo Mental Calmado', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu ensayo mental ha sido guardado.' });
    setIsSaved(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Hoy vamos a usar tu imaginacion como herramienta. La visualizacion es como ver una pelicula en tu mente, pero en esta version tu eres el protagonista o la protagonista y la historia tiene un final tranquilo y positivo.</p>
            <Button onClick={nextStep}>Empezar visualizacion <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Prepara tu cuerpo</h4>
            <p className="text-sm text-muted-foreground">Sientate comodo o comoda, cierra los ojos y toma tres respiraciones profundas. Puedes hacerlo tu solo/a o utilizar la guia de audio. Esto ayuda a calmar tu sistema nervioso y preparar el terreno.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atras</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Imagina la situacion</h4>
            <p className="text-sm text-muted-foreground">Trae a tu mente una situacion que normalmente te produce ansiedad. No empieces con la mas dificil, elige una de nivel intermedio.</p>
            <Label htmlFor="situation-vis">Escribe con detalle que situacion vas a imaginar</Label>
            <Textarea id="situation-vis" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atras</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Cambia el guion interno</h4>
            <p className="text-sm text-muted-foreground">Ahora imaginate en esa situacion actuando con calma y seguridad. Observa como hablas, como te mueves, como tu respiracion se mantiene serena. Trae a tu mente todo lo bueno.</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: "Me veo entrando en la sala de reuniones, siento algo de nervios, pero respiro y sonrío. Empiezo a hablar y noto que mi voz suena clara."</p>
            <Label htmlFor="calm-script">Ahora, escribelo</Label>
            <Textarea id="calm-script" value={calmScript} onChange={e => setCalmScript(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atras</Button>
              <Button onClick={nextStep} disabled={!calmScript.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Repite la escena</h4>
            <p className="text-sm text-muted-foreground">Visualiza la misma escena varias veces, como un ensayo. Cada repeticion entrena tu cerebro para que la respuesta ansiosa sea menor en la vida real.</p>
            <p className="text-xs text-muted-foreground p-2 border-l-2 border-accent bg-accent/10">La neurociencia lo confirma: las imagenes mentales activan las mismas areas cerebrales que la experiencia real (Kosslyn, 2001).</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atras</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Cierre</h4>
            <p className="text-sm text-muted-foreground">Has practicado tu ensayo mental calmado. Recuerda: no buscamos que la ansiedad desaparezca por completo, sino entrenar a tu mente a responder con mas calma. Con cada practica, reduces la brecha entre el miedo anticipado y tu capacidad real.</p>
            <blockquote className="italic text-primary pt-2">"Tu mente es un gimnasio: cuanto mas ensayas la calma, mas fuerte se vuelve."</blockquote>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" />Atras</Button>
              {!isSaved ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapeutico
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
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        <CardDescription className="pt-2">
          El cerebro no distingue del todo entre lo que imagina y lo que vive. Por eso, cuando visualizas con detalle que te enfrentas a una situacion temida de forma calmada, entrenas a tu sistema nervioso para responder con menos alarma en la vida real. Esta practica es como un ensayo mental que reduce la anticipacion ansiosa y prepara tu cuerpo para exponerte en pasos pequenos. Tiempo estimado: 8-10 minutos. Te recomiendo hacerlo 3-4 veces por semana, ideal antes de cada exposicion real.
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

