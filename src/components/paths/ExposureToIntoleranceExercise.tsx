
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ExposureToIntoleranceExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface ExposureToIntoleranceExerciseProps {
  content: ExposureToIntoleranceExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ExposureToIntoleranceExercise({ content, pathId, onComplete }: ExposureToIntoleranceExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
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

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setWhatCouldGoWrong('');
    setHowToHandle('');
    setPastExperience('');
    setBodyReflection('');
    setMindReflection('');
    setRealityReflection('');
    setFinalReflection('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!finalReflection.trim()) {
      toast({ title: 'Reflexión vacía', description: 'Por favor, escribe tu reflexión final para guardarla.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: Pequeños Actos de Exposición a lo Incierto**

**Situación elegida:**
${situation || 'No especificada.'}

**Antes de actuar:**
- ¿Qué creo que podría salir mal?: ${whatCouldGoWrong || 'No especificado.'}
- ¿Qué haría si eso pasara?: ${howToHandle || 'No especificado.'}
- Experiencia pasada que me dio fuerza: ${pastExperience || 'No especificado.'}

**Observación posterior:**
- En mi cuerpo: ${bodyReflection || 'No especificado.'}
- En mi mente: ${mindReflection || 'No especificado.'}
- En la realidad: ${realityReflection || 'No especificado.'}

**Reflexión final para mi cuaderno terapéutico:**
${finalReflection}
`;
    addNotebookEntry({ title: `Exposición a la Incertidumbre: ${situation.substring(0, 20)}`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">¿Y si no necesitas tenerlo todo bajo control?</h4>
            <p className="text-sm text-muted-foreground">Cuando anticipas lo peor, tu cuerpo reacciona como si ya estuvieras en peligro. Pero esa percepción no siempre es real: muchas veces es solo una interpretación que tu mente hace ante la incertidumbre.</p>
            <p className="text-sm text-muted-foreground font-semibold">Este ejercicio te invita a hacerlo de forma segura y consciente.</p>
            <Button onClick={nextStep}>Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu situación</h4>
            <Label htmlFor="situation">Elige una situación cotidiana que suelas controlar en exceso o evitar por miedo a que algo salga mal.</Label>
             <div className="text-sm text-muted-foreground p-2 border rounded-md bg-background/50">
                <p className="font-semibold">Ejemplos:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Enviar un mensaje sin revisar 3 veces</li>
                    <li>Tomar una decisión sencilla sin pedir confirmación</li>
                    <li>Hacer una pregunta en clase o en una reunión, aunque no estés 100% seguro/a</li>
                    <li>No llevar siempre el objeto “por si acaso” (medicación, agua, cargador…)</li>
                    <li>Empezar una conversación sin planear qué vas a decir</li>
                </ul>
            </div>
            <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="¿Cuál será tu pequeña exposición de hoy?"/>
            <div className="flex justify-between w-full">
                <Button onClick={prevStep} variant="outline">Atrás</Button>
                <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
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
            <div className="flex justify-between w-full">
                <Button onClick={prevStep} variant="outline">Atrás</Button>
                <Button onClick={nextStep} disabled={!whatCouldGoWrong.trim() || !howToHandle.trim() || !pastExperience.trim()}>Hecho, siguiente</Button>
            </div>
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
            <div className="flex justify-between w-full">
                <Button onClick={prevStep} variant="outline">Atrás</Button>
                <Button onClick={nextStep} disabled={!bodyReflection.trim() || !mindReflection.trim() || !realityReflection.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Reflexión final para tu cuaderno terapéutico:</h4>
            <div className="space-y-2">
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>¿Qué pasó cuando no tuve todas las respuestas?</li>
                    <li>¿Fue tan grave como imaginaba?</li>
                </ul>
                <Textarea id="final-reflection" value={finalReflection} onChange={e => setFinalReflection(e.target.value)} disabled={isSaved}/>
            </div>
            {!isSaved ? (
                <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline" type="button">Atrás</Button>
                    <Button type="submit" disabled={!finalReflection.trim()}>
                        <Save className="mr-2 h-4 w-4"/> Guardar en Cuaderno
                    </Button>
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <p className="font-medium">Guardado.</p>
              </div>
            )}
          </form>
        );
      case 5:
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Ejercicio completado y guardado!</h4>
                <p className="text-muted-foreground">Has dado un paso valiente para entrenar tu confianza. Cada vez que te expones a la incertidumbre y compruebas que puedes sostenerla, tu resiliencia crece.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
            </div>
        );
      default: return null;
    }
  };


  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
