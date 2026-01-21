
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PresentVsEssentialSelfExerciseContent } from '@/data/paths/pathTypes';

interface PresentVsEssentialSelfExerciseProps {
  content: PresentVsEssentialSelfExerciseContent;
  pathId: string;
}

export function PresentVsEssentialSelfExercise({ content, pathId }: PresentVsEssentialSelfExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [presentSelfDesc, setPresentSelfDesc] = useState('');
  const [essentialSelfDesc, setEssentialSelfDesc] = useState('');
  const [smallAction, setSmallAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);

  const resetExercise = () => {
    setStep(0);
    setPresentSelfDesc('');
    setEssentialSelfDesc('');
    setSmallAction('');
    setIsSaved(false);
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!smallAction.trim()) {
      toast({ title: "Acción no definida", description: "Por favor, escribe tu pequeña acción para guardar.", variant: "destructive" });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Mi yo actual:**
${presentSelfDesc || 'No descrito.'}

**Mi yo esencial:**
${essentialSelfDesc || 'No descrito.'}

**Mi pequeña acción para esta semana:**
${smallAction}
    `;
    addNotebookEntry({ title: `Visualización: Yo Presente vs. Yo Esencial`, content: notebookContent, pathId });
    toast({ title: "Ejercicio Guardado", description: "Tu visualización ha sido guardada." });
    setIsSaved(true);
    next();
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
             <p className="text-sm text-muted-foreground">No se trata de juzgarte ni de exigirte cambios inmediatos. Se trata de mirarte con amabilidad, como quien observa una película, para redescubrir quién eres y hacia dónde quieres ir.</p>
            <Button onClick={next}>Empezar visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Present Self
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Tu yo actual</h4>
            <p className="text-sm text-muted-foreground">Pregúntate: ¿Cómo me hablo en mi día a día? ¿Cómo transcurren mis jornadas? ¿Qué emociones predominan? ¿Cómo me relaciono con los demás? ¿Qué hábitos mantengo, aunque no me hagan bien?</p>
            <Label htmlFor="present-self">Describe tu yo actual...</Label>
            <Textarea id="present-self" value={presentSelfDesc} onChange={e => setPresentSelfDesc(e.target.value)} placeholder="Ej: Mi yo actual corre a todos lados, revisa el móvil constantemente..." />
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 2: // Essential Self
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Tu yo esencial</h4>
            <p>Ahora imagina cómo sería tu vida si vivieras conectada o conectado a lo que de verdad importa para ti. Visualiza tu yo esencial, esa versión tuya que ya existe dentro, esperando más espacio. </p><p>Pregúntate: <ul><li>¿Cómo se mueve esta versión de mí? </li><li>¿Cómo cuida sus espacios y se habla? </li><li>¿Qué decisiones toma? </li><li>¿Qué límites pone? </li><li>¿Qué transmite a los demás? </li></ul></p><p>Escribe aquí tu descripción de tu yo esencial… </p>
            <Label htmlFor="essential-self">Escribe aquí tu descripción de tu yo esencial… </Label>
            <Textarea id="essential-self" value={essentialSelfDesc} onChange={e => setEssentialSelfDesc(e.target.value)} placeholder="Mi yo esencial se mueve con calma, respira profundamente, dice lo que necesita con serenidad y cuida sus tiempos. Me inspira paz y claridad." />
            <p className="text-xs text-muted-foreground italic pt-2">La neurociencia muestra que visualizar de forma repetida comportamientos positivos activa las mismas áreas cerebrales que al ejecutarlos (corteza prefrontal y sistema límbico). Así entrenas tu mente para acercarte a esa versión de ti.</p>
            <Button onClick={next} className="w-full">Siguiente</Button>
          </div>
        );
      case 3: // Integration and choice
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Integración y elección</h4>
            <p>Ahora que tienes delante a tu yo actual y a tu yo esencial, observa la diferencia entre ambos. Esta comparación no es para sentir distancia, sino para elegir un puente que los conecte.</p>
            
            <div className="space-y-4 text-sm p-4 border rounded-md bg-background/50">
                <div>
                    <h5 className="font-medium">Tu yo actual:</h5>
                    <p className="italic text-muted-foreground whitespace-pre-wrap">{presentSelfDesc || "No descrito."}</p>
                </div>
                <div>
                    <h5 className="font-medium">Tu yo esencial:</h5>
                    <p className="italic text-muted-foreground whitespace-pre-wrap">{essentialSelfDesc || "No descrito."}</p>
                </div>
            </div>

            <div className="text-sm text-muted-foreground">
                <p> Pregúntate:</p><ul><li> ¿Qué diferencia más significativa noto entre mis dos versiones? </li><li>¿Qué gesto pequeño de mi yo esencial puedo traer a mi vida esta semana? </li></ul>
            </div>

            <div className="space-y-2">
                <Label htmlFor="small-action">Mi pequeña acción para esta semana:</Label>
                <Textarea 
                    id="small-action" 
                    value={smallAction} 
                    onChange={e => setSmallAction(e.target.value)} 
                    placeholder="Describe tu gesto o acción pequeña…" 
                />
                 <p className="text-xs text-muted-foreground">Ejemplo guía: “Quiero probar a poner el móvil en silencio media hora cada noche y usar ese tiempo para leer o simplemente descansar en calma.”</p>
            </div>
            
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar mis pequeñas acciones</Button>
            
          </form>
        );
      case 4: // Confirmation screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Guardado con Éxito!</h4>
            <p className="text-muted-foreground">Recuerda: no se trata de transformarte de golpe, sino de acercarte poco a poco a tu esencia. Cada gesto que incorpores es un paso hacia tu autenticidad.</p>
            <ul className="text-sm text-muted-foreground list-none space-y-2 text-left">
                <li className="flex items-start"><span className="mr-2">✅</span>Felicítate por haberte regalado este momento de conexión.</li>
                <li className="flex items-start"><span className="mr-2">👉</span>Tus respuestas quedan guardadas en tu cuaderno terapéutico.</li>
            </ul>
            <Button onClick={resetExercise} variant="outline" className="w-full mt-4">
              Hacer otra reflexión
            </Button>
          </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
