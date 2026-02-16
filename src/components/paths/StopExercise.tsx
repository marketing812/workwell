
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { StopExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface StopExerciseProps {
  content: StopExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function StopExercise({ content, pathId, onComplete }: StopExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  
  const [observedState, setObservedState] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!observedState.trim() || !nextAction.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa tu observación y tu siguiente paso.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi observación (pensamiento y sensación):*
${observedState}

*Mi siguiente paso elegido (Permitir/Prosigue):*
${nextAction}
    `;
    addNotebookEntry({ title: `Práctica STOP`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Práctica Guardada' });
    onComplete();
    setIsSaved(true);
    setStep(5); // Go to new confirmation screen
  };

  const resetExercise = () => {
    setStep(0);
    setObservedState('');
    setNextAction('');
    setIsSaved(false);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">La técnica STOP es como tener un semáforo interno siempre contigo.</h4>
            <p className="text-sm text-muted-foreground">
              Cuando la ansiedad acelera tus pensamientos o tu cuerpo se activa como si hubiera una emergencia, este semáforo te recuerda que puedes parar, respirar, observar y elegir cómo seguir.
            </p>
             <p className="text-sm text-muted-foreground">
              No se trata de “apagar” la ansiedad de golpe, sino de crear un espacio entre lo que sientes y lo que haces. Ese pequeño espacio es lo que te permite recuperar el control y avanzar con más calma y claridad.
            </p>
             <p className="text-sm text-muted-foreground">
              La neurociencia lo confirma: cuando introduces esta pausa consciente, das tiempo a tu corteza prefrontal (la parte racional) para volver a tomar el mando, en lugar de dejar que la amígdala (la alarma emocional) dirija todo.
            </p>
            <p className="text-sm text-muted-foreground">
              Hoy vamos a practicarlo juntos, paso a paso.
            </p>
            <Button onClick={next} className="w-full">Empezar práctica <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 2 — S: STOP / Para
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg flex items-center gap-2">S: STOP / Para</h4>
            <p className="text-sm text-muted-foreground">El objetivo de este primer paso es interrumpir el piloto automático ansioso (la reacción impulsiva de la amígdala) y crear un micro-espacio entre lo que pasa y lo que haces.</p>
            <div className="mt-4">
                <audio key="audio-step-1" controls controlsList="nodownload" className="w-full">
                    <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica1paso1stop.mp3`} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
            <div className="text-sm space-y-2 p-3 border rounded-md bg-background/30">
              <p><strong>Cómo actúa (cuerpo/mente):</strong></p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Patrón-interruptor:</strong> al detenerte físicamente (parar, plantar los pies, soltar hombros), cortas la cadena estímulo → reacción.</li>
                <li><strong>Señal de seguridad:</strong> tu postura estable y el “alto” mental comunican a tu cerebro que no hay una emergencia real.</li>
              </ul>
              <p className="font-semibold pt-2">Efecto inmediato:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Bajas la escalada (“bola de nieve”) de la ansiedad.</li>
                <li>Recuperas una sensación básica de control.</li>
                <li>Disminuye la impulsividad (ej. salir huyendo, contestar en caliente, evitar).</li>
              </ul>
              <p className="font-semibold pt-2">Efecto acumulado (con práctica):</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Más rapidez para detectar disparadores.</li>
                <li>Capacidad de frenar antes el bucle ansioso.</li>
              </ul>
              <p className="font-semibold pt-2">Mini guía práctica:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Frase ancla: “Para. Pausa de 5 segundos.”</li>
                <li>Postura: pies firmes, hombros sueltos, mirada al frente.</li>
              </ul>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={next} >Siguiente</Button>
            </div>
          </div>
        );
      case 2: // Pantalla 3 — T: Toma una respiración
         return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
             <h4 className="font-semibold text-lg flex items-center gap-2">T: Toma una respiración</h4>
             <p className="text-sm text-muted-foreground">El objetivo del paso 2 es activar el freno parasimpático (nervio vago), reducir la hiperventilación y bajar la activación del cuerpo.</p>
             <div className="mt-4">
              <audio key="audio-step-2" controls controlsList="nodownload" className="w-full">
                <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana3tecnica1respira.mp3`} type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
             <div className="text-sm space-y-2 p-3 border rounded-md bg-background/30">
               <p><strong>Cómo actúa (cuerpo/mente):</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Diafragma en marcha:</strong> coloca una mano en el abdomen; al inhalar, deja que se hinche suavemente; al exhalar, deja que baje.</li>
                    <li><strong>Exhalación prolongada:</strong> alargar la salida del aire envía el mensaje biológico de seguridad a tu sistema nervioso.</li>
                </ul>
                <p className="font-semibold pt-2">Efecto inmediato:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Desciende la frecuencia cardiaca.</li>
                  <li>Mejora la sensación de “falta de aire”.</li>
                  <li>Se atenúan síntomas físicos (opresión, nudo, temblor).</li>
                </ul>
                <p className="font-semibold pt-2">Efecto acumulado:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Mejora la variabilidad cardiaca (HRV), indicador de resiliencia fisiológica.</li>
                  <li>Aprendes a calmarte con más facilidad en futuros picos.</li>
                </ul>
                <p className="font-semibold pt-2">Mini guía práctica:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Haz 3–5 ciclos de respiración.</li>
                  <li>Frase ancla: “Inhalo…Exhalo… y suelto.”</li>
                </ul>
             </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                <Button onClick={next}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4 — O: Observa
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg flex items-center gap-2">O: Observa</h4>
            <p className="text-sm text-muted-foreground">El objetivo del tercer paso es pasar de “estar dentro del pensamiento” a mirarlo desde fuera. Observar pensamientos, emociones, sensaciones y entorno.</p>
             <div className="mt-4">
              <audio key="audio-step-3" controls controlsList="nodownload" className="w-full">
                  <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica1observa.mp3`} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
            <div className="text-sm space-y-2 p-3 border rounded-md bg-background/30">
               <p><strong>Cómo actúa (cuerpo/mente):</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Rotación de la atención:</strong> de rumiar el bucle a ponerte en modo “detective curioso”.</li>
                    <li><strong>Etiquetar:</strong> poner nombre a lo que pienso y siento regula la emoción: “Estoy pensando que…”, “Estoy sintiendo que…”.</li>
                </ul>
                <p className="font-semibold pt-2">Efecto inmediato:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Baja la intensidad de la ansiedad al distinguir entre hecho e historia mental.</li>
                  <li>Recuperas perspectiva: “esto es un pensamiento, no un hecho”.</li>
                </ul>
                <p className="font-semibold pt-2">Efecto acumulado:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Aumenta la tolerancia a sensaciones y pensamientos sin necesidad de evitarlos.</li>
                  <li>Se reduce la rumiación crónica.</li>
                </ul>
                 <p className="font-semibold pt-2">Mini guía práctica (3 preguntas):</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>¿Qué estoy pensando ahora?</li>
                  <li>¿Qué siento en el cuerpo?</li>
                  <li>¿Qué está pasando fuera de mí?</li>
                  <li>(opcional: puntúa de 0 a 10 la intensidad)</li>
                </ul>
            </div>
            <Label htmlFor="observed-state">Escríbelo:</Label>
            <Textarea value={observedState} onChange={e => setObservedState(e.target.value)} placeholder="Ej: ‘Voy a hacer el ridículo si entro solo o sola a esa sala’ y siento un nudo en el estómago."/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                <Button onClick={next} disabled={!observedState.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: // Pantalla 5 — P: Permite / Prosigue
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg flex items-center gap-2">P: Permite / Prosigue</h4>
            <p className="text-sm text-muted-foreground">El objetivo del último paso es practicar la aceptación activa (dejar estar sin luchar) y elegir la siguiente acción alineada con lo importante, aunque la ansiedad siga.</p>
            <div className="mt-4">
              <audio key="audio-step-4" controls controlsList="nodownload" className="w-full">
                  <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana3tecnica1permite.mp3`} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
             <div className="text-sm space-y-2 p-3 border rounded-md bg-background/30">
               <p><strong>Cómo actúa (cuerpo/mente):</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Permitir ≠ rendirse:</strong> es como surfear una ola sin pelear con ella, mientras sigues tu camino.</li>
                    <li><strong>Prosigue:</strong> dar un paso, aunque sea pequeño, entrena la seguridad: la ansiedad sube y baja, y tú sigues adelante.</li>
                </ul>
                <p className="font-semibold pt-2">Efecto inmediato:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Rompe la evitación (gasolina de la ansiedad).</li>
                    <li>Aumenta la sensación de autoeficacia.</li>
                    <li>La activación comienza a descender sin “hacer nada mágico”.</li>
                </ul>
                 <p className="font-semibold pt-2">Efecto acumulado:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>El miedo se extingue.</li>
                    <li>Se crean nuevas asociaciones: “esta situación = puedo sostenerla”.</li>
                </ul>
                <p className="font-semibold pt-2">Mini guía práctica:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Frase ancla: “Puedo avanzar con esta ansiedad.”</li>
                    <li>Siguiente paso de 1–3 minutos: enviar un email, entrar a la sala, leer una página.</li>
                </ul>
            </div>
            <Label htmlFor="next-action">Continua la frase añadiendo un paso para seguir adelante: "Esto es lo que se me pasa por la cabeza y lo que siento: '{observedState}'. Lo acepto…lo dejo estar. Lo que sí puedo hacer es..."</Label>
            <Textarea value={nextAction} onChange={e => setNextAction(e.target.value)} placeholder="Ej: ...dar tres pasos, entrar y saludar, aunque aún me sienta nervioso o nerviosa." />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit" disabled={!nextAction.trim()}><Save className="mr-2 h-4 w-4" /> Guardar mi frase permisiva</Button>
            </div>
          </form>
        );
      case 5: // Pantalla 6 - Tip de oro
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Tip de oro</h4>
            <p className="text-center text-sm p-4 border rounded-md bg-accent/10 border-accent">
              Parar (corta la escalada) → Tomar una respiración (baja el cuerpo) → Observar (gana perspectiva) → Permitir (elige y avanza).
            </p>
            <p className="text-sm italic text-center">
              Si el pico persiste, repite Tomar una respiración–Observar una o dos veces y vuelve a Permitir con un paso más pequeño.
            </p>
            <Button onClick={resetExercise} className="w-full">Hacer otra práctica</Button>
          </div>
        );
      default:
        return null;
    }
  };

  const contentTyped = content as any;

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {contentTyped.title}
        </CardTitle>
        <CardDescription className="pt-2">
          {contentTyped.objective}
          <div className="pt-2">
             <p className="mb-2">
              <span className="font-semibold">Sirve para:</span>
            </p>
            <ul className="list-disc list-inside text-sm">
                <li>Interrumpir pensamientos anticipatorios y catastrofistas.</li>
                <li>Recuperar el control cuando la amígdala te secuestra.</li>
                <li>Volver al “modo calma” de tu cerebro.</li>
            </ul>
          </div>
        </CardDescription>
        
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}


    