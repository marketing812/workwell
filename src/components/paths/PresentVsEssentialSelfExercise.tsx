"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PresentVsEssentialSelfExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface PresentVsEssentialSelfExerciseProps {
  content: PresentVsEssentialSelfExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function PresentVsEssentialSelfExercise({ content, pathId, onComplete }: PresentVsEssentialSelfExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [presentSelfDesc, setPresentSelfDesc] = useState('');
  const [essentialSelfDesc, setEssentialSelfDesc] = useState('');
  const [smallAction, setSmallAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const storageKey = `exercise-progress-${pathId}-presentVsEssential`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setPresentSelfDesc(data.presentSelfDesc || '');
        setEssentialSelfDesc(data.essentialSelfDesc || '');
        setSmallAction(data.smallAction || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, presentSelfDesc, essentialSelfDesc, smallAction, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, presentSelfDesc, essentialSelfDesc, smallAction, isSaved, storageKey, isClient]);


  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const resetExercise = () => {
    setStep(0);
    setPresentSelfDesc('');
    setEssentialSelfDesc('');
    setSmallAction('');
    setIsSaved(false);
    localStorage.removeItem(storageKey);
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
    addNotebookEntry({ title: `Visualización: Yo Presente vs. Yo Esencial`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu visualización ha sido guardada." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
             <p>No se trata de juzgarte ni de exigirte cambios inmediatos. Se trata de mirarte con amabilidad, como quien observa una película, para redescubrir quién eres y hacia dónde quieres ir.</p>
             <p>En este ejercicio visualizarás dos imágenes muy valiosas:</p>
             <ul className="list-disc list-inside text-left mx-auto max-w-md">
                <li>Tu yo actual: cómo estás viviendo hoy.</li>
                <li>Tu yo esencial: cómo sería tu vida si actuases desde tus valores.</li>
             </ul>
             <p>Cuando quieras, pulsa Empezar y deja que tu imaginación te guíe.</p>
            <Button onClick={nextStep}>Empezar visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Present Self
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Tu yo actual</h4>
            <p>Antes de avanzar, piensa que este paso es como mirar una fotografía de ti hoy. No para criticarte, sino para comprenderte mejor.</p>
            <p>Pregúntate:</p>
             <ul className="list-disc list-inside pl-4 text-sm">
              <li>¿Cómo me hablo en mi día a día?</li>
              <li>¿Cómo transcurren mis jornadas?</li>
              <li>¿Qué emociones predominan?</li>
              <li>¿Cómo me relaciono con los demás?</li>
              <li>¿Qué hábitos mantengo, aunque no me hagan bien?</li>
            </ul>
            <Label htmlFor="present-self">Escribe aquí tu descripción de tu yo actual…</Label>
            <Textarea id="present-self" value={presentSelfDesc} onChange={e => setPresentSelfDesc(e.target.value)} />
             <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>Ejemplo guía: “Mi yo actual corre a todos lados, revisa el móvil constantemente, y muchas veces dice que sí, aunque quiere decir que no. Siento tensión en el pecho y, a veces, tristeza.”</p>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!presentSelfDesc.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Essential Self
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 2: Tu yo esencial</h4>
                <p>Ahora imagina cómo sería tu vida si vivieras conectada o conectado a lo que de verdad importa para ti. Visualiza tu yo esencial, esa versión tuya que ya existe dentro, esperando más espacio.</p>
                <p>Pregúntate:</p>
                <ul className="list-disc list-inside pl-4 text-sm">
                    <li>¿Cómo se mueve esta versión de mí?</li>
                    <li>¿Cómo cuida sus espacios y se habla?</li>
                    <li>¿Qué decisiones toma?</li>
                    <li>¿Qué límites pone?</li>
                    <li>¿Qué transmite a los demás?</li>
                </ul>
                <Label htmlFor="essential-self">Escribe aquí tu descripción de tu yo esencial…</Label>
                <Textarea id="essential-self" value={essentialSelfDesc} onChange={e => setEssentialSelfDesc(e.target.value)} />
                 <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                    <p>Ejemplo guía: “Mi yo esencial se mueve con calma, respira profundamente, dice lo que necesita con serenidad y cuida sus tiempos. Me inspira paz y claridad.”</p>
                </div>
                <p className="text-xs italic pt-2">La neurociencia muestra que visualizar de forma repetida comportamientos positivos activa las mismas áreas cerebrales que al ejecutarlos (corteza prefrontal y sistema límbico). Así entrenas tu mente para acercarte a esa versión de ti.</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep} disabled={!essentialSelfDesc.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
            </div>
        );
      case 3: // Integration and choice
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Integración y elección</h4>
            <p>Ahora que tienes delante a tu yo actual y a tu yo esencial, observa la diferencia entre ambos. Esta comparación no es para sentir distancia, sino para elegir un puente que los conecte.</p>
            <p>Pregúntate:</p>
            <ul className="list-disc list-inside pl-4 text-sm">
                <li> ¿Qué diferencia más significativa noto entre mis dos versiones?</li>
                <li>¿Qué gesto pequeño de mi yo esencial puedo traer a mi vida esta semana?</li>
            </ul>

            <div className="space-y-2">
                <Label htmlFor="small-action">Describe tu gesto o acción pequeña…</Label>
                <Textarea 
                    id="small-action" 
                    value={smallAction} 
                    onChange={e => setSmallAction(e.target.value)} 
                />
                 <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                    <p>Ejemplo guía: “Quiero probar a poner el móvil en silencio media hora cada noche y usar ese tiempo para leer o simplemente descansar en calma.”</p>
                </div>
            </div>
            
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit" disabled={!smallAction.trim()}><Save className="mr-2 h-4 w-4"/> Guardar mis pequeñas acciones</Button>
            </div>
          </form>
        );
      case 4: // Confirmation screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <p>Recuerda: no se trata de transformarte de golpe, sino de acercarte poco a poco a tu esencia. Cada gesto que incorpores es un paso hacia tu autenticidad.</p>
            <ul className="text-sm list-none space-y-2 text-left">
                <li className="flex items-start">✅ Felicítate por haberte regalado este momento de conexión.</li>
                <li className="flex items-start">👉 Tus respuestas quedan guardadas en tu cuaderno terapéutico.</li>
            </ul>
            <Button onClick={resetExercise} variant="outline" className="w-auto">
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
            <CardDescription>A veces vivimos en “piloto automático” y sentimos que no somos del todo nosotros mismos. Este ejercicio te ayudará a observarte desde fuera, sin juicio, para distinguir entre tu yo presente (cómo vives ahora mismo) y tu yo esencial (cómo te gustaría vivir si actuaras desde tus valores más profundos). Al hacerlo, entrenas tu capacidad de autoconciencia —la misma que Daniel Goleman señaló como la base de la inteligencia emocional— y te orientas hacia decisiones más alineadas contigo.</CardDescription>
             <p className="text-sm pt-1">Duración estimada: 10–15 minutos. Te recomiendo repetir este ejercicio una vez al mes, o cuando sientas que necesitas reconectar con tu dirección vital.</p>
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
