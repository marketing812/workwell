
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { GuiltRadarExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface GuiltRadarExerciseProps {
  content: GuiltRadarExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function GuiltRadarExercise({ content, pathId, onComplete }: GuiltRadarExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [internalPhrase, setInternalPhrase] = useState('');
  const [controlLevel, setControlLevel] = useState<'total' | 'parcial' | 'ninguno' | ''>('');
  const [responseAction, setResponseAction] = useState('');
  const [learning, setLearning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
      setStep(0);
      setSituation('');
      setInternalPhrase('');
      setControlLevel('');
      setResponseAction('');
      setLearning('');
      setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !internalPhrase.trim() || !controlLevel || !responseAction.trim() || !learning.trim()) {
      toast({
        title: 'Campos Incompletos',
        description: 'Por favor, completa todos los campos del radar para guardarlo.',
        variant: 'destructive',
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Situación que me generó culpa | Respuesta: ${situation}

Pregunta: Mi frase interna fue | Respuesta: "${internalPhrase}"

Pregunta: Nivel de control real | Respuesta: ${controlLevel}

Pregunta: Mi respuesta/acción elegida | Respuesta: ${responseAction}

Pregunta: Aprendizaje y cuidado para la próxima vez | Respuesta: ${learning}
    `;
    addNotebookEntry({ title: 'Mi Radar de Culpa', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Radar Guardado', description: 'Tu radar de culpa ha sido guardado.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">La culpa no es una sentencia, es solo una señal. Este ejercicio te ayudará a escucharla para aprender y luego decidir si realmente te corresponde o si es momento de soltarla.</p>
            <Button onClick={nextStep}>Empezar Radar <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Recuerda la situación</h4>
            <p className="text-sm text-muted-foreground">Te recuerdo que ...<br />La culpa es una emoción que aparece cuando sentimos que hemos hecho algo mal o que no hemos hecho lo suficiente. En dosis justas, nos ayuda a reconocer errores y reparar el daño. Pero cuando es excesiva o injustificada, se convierte en una carga que nos paraliza y nos castiga por cosas que no siempre dependen de nosotros o nosotras. 
La culpa no es una sentencia, es solo una señal: puedes escucharla para aprender y luego decidir si realmente te corresponde o si es momento de soltarla. </p>
            <p className="text-sm text-muted-foreground">Piensa en un momento reciente en el que hayas sentido culpa.</p>
            <Textarea id="situation-guilt" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe brevemente la situación" disabled={isSaved} />
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Escucha tu frase interna</h4>
            <p className="text-sm text-muted-foreground">Cuando sentimos culpa, solemos hablarnos por dentro con frases muy rápidas y automáticas. Pueden ser juicios duros, exigencias o reproches. En este paso, quiero que anotes exactamente lo que te dijiste en ese momento, sin suavizarlo ni cambiar las palabras. Esto nos ayudará a detectarlo tal y como surge. Ejemplos: <ul><li>- “Es mi culpa que mi amigo esté enfadado.”</li><li>- “No hice lo suficiente, tendría que haberme esforzado más.”</li><li> - “Siempre meto la pata, no aprendo nunca.”</li></ul> </p>
            <Textarea id="internal-phrase" value={internalPhrase} onChange={e => setInternalPhrase(e.target.value)} placeholder={"Escribe tu frase interna..."} disabled={isSaved} />
              <p>Recuerda: No estamos validando que estas frases sean ciertas; solo queremos capturarlas para analizarlas después.</p>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!internalPhrase.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Evalúa el control real</h4>
            <p className="text-sm text-muted-foreground">No todo lo que nos hace sentir culpa está realmente bajo nuestro control. A veces, cargamos con pesos que pertenecen a otras personas o a circunstancias que no podemos cambiar. </p><p className="text-sm text-muted-foreground">Ejemplo: <br /> - Situación: “Mi amiga estaba seria y pensé que era por algo que dije.” <br />- Evaluación: Parcialmente (porque no controlo cómo se siente, pero sí puedo preguntar o aclarar). </p><p className="text-sm text-muted-foreground">En este paso, quiero que te detengas y evalúes con honestidad: ¿qué parte de esta situación depende realmente de ti? </p>
            <RadioGroup value={controlLevel} onValueChange={v => setControlLevel(v as any)} disabled={isSaved} className="mt-2 space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="total" id="ctrl-total" /><Label htmlFor="ctrl-total" className="font-normal">Estaba totalmente bajo mi control.</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="ninguno" id="ctrl-none" /><Label htmlFor="ctrl-none" className="font-normal">No estaba bajo mi control.</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="parcial" id="ctrl-partial" /><Label htmlFor="ctrl-partial" className="font-normal">Parcialmente: una parte sí y otra no.</Label></div>
            </RadioGroup>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!controlLevel}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Decide tu respuesta</h4>
            <p className="text-sm text-muted-foreground">Ahora que sabes cuánto control tienes sobre la situación, vamos a decidir qué hacer con esa culpa: </p>
            <ul className="text- text-muted-foreground list-disc list-inside pl-2">
                <li>Si marcaste No: repite mentalmente las veces que sean necesarias “No es mi responsabilidad” y deja que el pensamiento se vaya. </li>
                <li>Si marcaste Parcialmente: escribe la parte que sí depende de ti y cómo actuarás sobre ella.</li>
                <li>Si marcaste Sí: define una acción reparadora o de aprendizaje que puedas poner en marcha.</li>
            </ul>
            <p className="text- text-muted-foreground" >Ejemplo: <br />Evaluación: Parcialmente. <br />Respuesta: “Voy a hablar con ella para saber si mi comentario le molestó y, si es así, pedir disculpas.” </p>
            <Textarea id="response-action" value={responseAction} onChange={e => setResponseAction(e.target.value)} placeholder="Escribe tu respuesta y/o acción..." disabled={isSaved} />
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!responseAction.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 5: Cierre</h4>
            <Label htmlFor="learning-guilt">Relee lo que has escrito y pregúntate: ¿Qué puedo aprender de esto y cómo puedo cuidarme mejor la próxima vez?</Label>
            <Textarea id="learning-guilt" value={learning} onChange={e => setLearning(e.target.value)} placeholder="Escribe tu aprendizaje y plan para la próxima vez..." disabled={isSaved} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              {!isSaved ? (
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar aprendizaje</Button>
              ) : (
                <div className="flex items-center p-3 text-green-800 dark:text-green-200">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Guardado.</p>
                </div>
              )}
            </div>
          </form>
        );
      case 6: // Confirmation Screen
        return (
             <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Radar Guardado</h4>
                <p className="text-muted-foreground">Tu radar de culpa se ha guardado en el cuaderno. Puedes volver a consultarlo para recordar cómo transformar la culpa en aprendizaje.</p>
                
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            {content.duration && (
              <p className="pt-1 text-sm text-muted-foreground">
                <span className="font-semibold">Duracion estimada:</span> {content.duration}
              </p>
            )}
            {content.audioUrl && (
              <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

