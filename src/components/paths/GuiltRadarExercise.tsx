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
  const [situation, setSituation] = useState('');
  const [internalPhrase, setInternalPhrase] = useState('');
  const [controlLevel, setControlLevel] = useState<'total' | 'parcial' | 'none' | ''>('');
  const [responseAction, setResponseAction] = useState('');
  const [learning, setLearning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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

*Situación que me generó culpa:*
${situation}

*Mi frase interna fue:*
"${internalPhrase}"

*Nivel de control real:*
${controlLevel}

*Mi respuesta/acción elegida:*
${responseAction}

*Aprendizaje y cuidado para la próxima vez:*
${learning}
    `;
    addNotebookEntry({ title: 'Mi Radar de Culpa', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Radar Guardado', description: 'Tu radar de culpa ha sido guardado.' });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana2tecnica1.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 1: Recuerda la situación</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line" dangerouslySetInnerHTML={{ __html: "Te recuerdo que…<br/>La culpa es una emoción que aparece cuando sentimos que hemos hecho algo mal o que no hemos hecho lo suficiente. En dosis justas, nos ayuda a reconocer errores y reparar el daño. Pero cuando es excesiva o injustificada, se convierte en una carga que nos paraliza y nos castiga por cosas que no siempre dependen de nosotros o nosotras.<br/>La culpa no es una sentencia, es solo una señal: puedes escucharla para aprender y luego decidir si realmente te corresponde o si es momento de soltarla.<br/><br/>Piensa en un momento reciente en el que hayas sentido culpa." }} />
            <Textarea id="situation-guilt" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe brevemente la situación" disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 2: Escucha tu frase interna</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line" dangerouslySetInnerHTML={{ __html: "Cuando sentimos culpa, solemos hablarnos por dentro con frases muy rápidas y automáticas. Pueden ser juicios duros, exigencias o reproches.<br/>En este paso, quiero que anotes exactamente lo que te dijiste en ese momento, <b>sin suavizarlo ni cambiar las palabras</b>. Esto nos ayudará a detectarlo tal y como surge.<br/><br/>Ejemplos:<ul><li class='list-disc ml-5'>Es mi culpa que mi amigo esté enfadado.</li><li class='list-disc ml-5'>No hice lo suficiente, tendría que haberme esforzado más.</li><li class='list-disc ml-5'>Siempre meto la pata, no aprendo nunca.</li></ul>" }} />
            <Textarea id="internal-phrase" value={internalPhrase} onChange={e => setInternalPhrase(e.target.value)} placeholder={"Escribe tu frase interna\nRecuerda: No estamos validando que estas frases sean ciertas; solo queremos capturarlas para analizarlas después."} disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 3: Evalúa el control real</h4>
             <p className="text-sm text-muted-foreground whitespace-pre-line" dangerouslySetInnerHTML={{__html: "No todo lo que nos hace sentir culpa está realmente bajo nuestro control. A veces, cargamos con pesos que pertenecen a otras personas o a circunstancias que no podemos cambiar.<br/>Ejemplo:<br/>Situación: “Mi amiga estaba seria y pensé que era por algo que dije.”<br/>Evaluación: Parcialmente (porque no controlo cómo se siente, pero sí puedo preguntar o aclarar).<br/>En este paso, quiero que te detengas y evalúes con honestidad: ¿qué parte de esta situación depende realmente de ti?<br/>Selecciona la opción que mejor describa tu caso:"}}/>
            <RadioGroup value={controlLevel} onValueChange={v => setControlLevel(v as any)} disabled={isSaved} className="mt-2 space-y-1">
              <div className="flex items-center space-x-2"><RadioGroupItem value="total" id="ctrl-total" /><Label htmlFor="ctrl-total" className="font-normal">Estaba totalmente bajo mi control.</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="parcial" id="ctrl-partial" /><Label htmlFor="ctrl-partial" className="font-normal">Parcialmente: una parte sí y otra no.</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="ninguno" id="ctrl-none" /><Label htmlFor="ctrl-none" className="font-normal">No estaba bajo mi control.</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 4: Decide tu respuesta</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line" dangerouslySetInnerHTML={{__html: "Ahora que sabes cuánto control tienes sobre la situación, vamos a decidir qué hacer con esa culpa:<br/>Si marcaste No: repite mentalmente las veces que sean necesarias “No es mi responsabilidad” y deja que el pensamiento se vaya.<br/>Si marcaste Parcialmente: escribe la parte que sí depende de ti y cómo actuarás sobre ella.<br/>Si marcaste Sí: define una acción reparadora o de aprendizaje que puedas poner en marcha.<br/><br/>Ejemplo:<br/>Evaluación: Parcialmente.<br/>Respuesta: Voy a hablar con ella para saber si mi comentario le molestó y, si es así, pedir disculpas."}}/>
            <Textarea id="response-action" value={responseAction} onChange={e => setResponseAction(e.target.value)} placeholder="Escribe tu respuesta y/o acción" disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 5: Cierre</h4>
            <p className="text-sm text-muted-foreground">Relee lo que has escrito y pregúntate: ¿Qué puedo aprender de esto y cómo puedo cuidarme mejor la próxima vez?</p>
            <Textarea id="learning-guilt" value={learning} onChange={e => setLearning(e.target.value)} placeholder="Escribe tu aprendizaje y plan para la próxima vez" disabled={isSaved} />
          </div>

          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Radar</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}