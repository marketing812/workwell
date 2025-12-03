"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ExposureToIntoleranceExerciseContent } from '@/data/paths/pathTypes';

interface ExposureToIntoleranceExerciseProps {
  content: ExposureToIntoleranceExerciseContent;
  pathId: string;
}

export function ExposureToIntoleranceExercise({ content, pathId }: ExposureToIntoleranceExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [whatCouldGoWrong, setWhatCouldGoWrong] = useState('');
  const [howToHandle, setHowToHandle] = useState('');
  const [pastExperience, setPastExperience] = useState('');
  const [bodyReflection, setBodyReflection] = useState('');
  const [mindReflection, setMindReflection] = useState('');
  const [realityReflection, setRealityReflection] = useState('');
  const [finalReflection, setFinalReflection] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!finalReflection.trim()) {
      toast({ title: 'Reflexión vacía', description: 'Por favor, escribe tu reflexión final para guardarla.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**${content.title} - Reflexión**

*¿Qué pasó cuando no tuve todas las respuestas?*
${finalReflection}

*Situación elegida:*
${situation}

*Lo que creía que podría salir mal:*
${whatCouldGoWrong}

*Plan de afrontamiento:*
${howToHandle}

*Experiencia pasada que me dio fuerza:*
${pastExperience}

*Reflexión corporal:*
${bodyReflection}

*Reflexión mental:*
${mindReflection}

*Lo que ocurrió en realidad:*
${realityReflection}
    `;
    addNotebookEntry({ title: `Exposición a la Incertidumbre: ${situation.substring(0,20)}`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico." });
    setIsSaved(true);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">¿Y si no necesitas tenerlo todo bajo control?</h4>
            <p className="text-sm text-muted-foreground">Cuando anticipas lo peor, tu cuerpo reacciona como si ya estuvieras en peligro. Este ejercicio te invita a exponerte, en dosis pequeñas, a lo que no puedes controlar, para entrenar tu confianza.</p>
            <Button onClick={next}>Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu situación</h4>
            <Label htmlFor="situation">Elige una situación cotidiana que suelas controlar en exceso o evitar. Ejemplos: Enviar un mensaje sin revisar 3 veces, tomar una decisión sencilla sin pedir confirmación...</Label>
            <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next}>Siguiente</Button></div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Antes de actuar</h4>
            <p className="text-sm text-muted-foreground">No anticipes el resultado. Haz la acción con conciencia. Antes de actuar, reflexiona y escribe:</p>
            <div className="space-y-2"><Label htmlFor="what-wrong">¿Qué creo que podría salir mal?</Label><Textarea id="what-wrong" value={whatCouldGoWrong} onChange={e => setWhatCouldGoWrong(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="how-handle">¿Qué haría si eso pasara?</Label><Textarea id="how-handle" value={howToHandle} onChange={e => setHowToHandle(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="past-exp">¿En qué otras ocasiones me he enfrentado a situaciones inciertas como esta? ¿Qué hice entonces que me ayudó o me dio fuerza?</Label><Textarea id="past-exp" value={pastExperience} onChange={e => setPastExperience(e.target.value)} /></div>
            <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next}>Hecho, siguiente</Button></div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Observa lo que ocurrió</h4>
            <p className="text-sm text-muted-foreground">Después de haber realizado tu pequeño acto de exposición, reflexiona:</p>
            <div className="space-y-2"><Label>En tu cuerpo (¿Se activó algo? ¿Hubo tensión? ¿Cómo fue cambiando?):</Label><Textarea value={bodyReflection} onChange={e => setBodyReflection(e.target.value)} /></div>
            <div className="space-y-2"><Label>En tu mente (¿Qué pensamientos aparecieron? ¿Se cumplieron tus predicciones?):</Label><Textarea value={mindReflection} onChange={e => setMindReflection(e.target.value)} /></div>
            <div className="space-y-2"><Label>En la realidad (¿Qué ocurrió realmente? ¿Fue tan grave como temías?):</Label><Textarea value={realityReflection} onChange={e => setRealityReflection(e.target.value)} /></div>
            <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next}>Siguiente</Button></div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Reflexión final</h4>
            <Label htmlFor="final-reflection">Para tu cuaderno: ¿Qué pasó cuando no tuve todas las respuestas? ¿Fue tan grave como imaginaba?</Label>
            <Textarea id="final-reflection" value={finalReflection} onChange={e => setFinalReflection(e.target.value)} disabled={isSaved}/>
            {!isSaved ? (
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar en Cuaderno</Button>
            ) : (
              <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Guardado.</p>
              </div>
            )}
            <Button onClick={() => setStep(0)} variant="link" className="w-full">Hacer otro registro</Button>
          </form>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
