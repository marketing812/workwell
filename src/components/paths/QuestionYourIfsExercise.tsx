
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { QuestionYourIfsExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface QuestionYourIfsExerciseProps {
  content: QuestionYourIfsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function QuestionYourIfsExercise({ content, pathId, onComplete }: QuestionYourIfsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState({ pro: '', con: '' });
  const [alternatives, setAlternatives] = useState(['', '']);
  const [severity, setSeverity] = useState(5);
  const [reformulation, setReformulation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setThought('');
    setEvidence({ pro: '', con: '' });
    setAlternatives(['', '']);
    setSeverity(5);
    setReformulation('');
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!thought || !reformulation) {
      toast({ title: "Datos incompletos", description: "Completa el pensamiento y la reformulación para guardar.", variant: "destructive" });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: ¿Cuál es tu pensamiento ansioso “¿Y si…?”? | Respuesta: "${thought}"
Pregunta: ¿Qué evidencias tengo a favor? | Respuesta: ${evidence.pro}
Pregunta: ¿Qué evidencias tengo en contra? | Respuesta: ${evidence.con}
Pregunta: Alternativa 1 | Respuesta: ${alternatives[0]}
Pregunta: Alternativa 2 | Respuesta: ${alternatives[1]}
Pregunta: Gravedad real (0-10) | Respuesta: ${severity}/10
Pregunta: Reformulación final | Respuesta: "${reformulation}"
    `;
    addNotebookEntry({ title: 'Cuestionando mis "¿Y si...?"', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado' });
    onComplete();
    setIsSaved(true);
    next();
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return (
            <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">Los pensamientos ansiosos suelen empezar con un “¿Y si…?”: </p>
                <ul className="list-disc list-inside text-sm pl-4">
                  <li>“¿Y si me quedo en blanco en la reunión?”</li>
                  <li>“¿Y si me mareo en el metro?”</li>
                  <li>“¿Y si no consigo dormir y mañana no rindo?”</li>
                </ul>
                <p className="text-sm text-muted-foreground">Cuando la mente lanza estos “¿y si…?”, lo hace con la intención de protegerte. El problema es que termina convenciéndote de que esa posibilidad es real e inevitable.</p>
                <p className="text-sm font-semibold">Aquí conviene recordar algo muy importante: Que algo sea posible no significa que sea probable.</p>
                <p className="text-sm text-muted-foreground">La mente ansiosa confunde ambas cosas: puede que sea posible que tropieces al hablar, pero la probabilidad real de que ocurra y de que tenga un gran impacto es mucho menor de lo que imaginas. La ansiedad se engancha a la posibilidad extrema y se olvida de la probabilidad realista.</p>
                <p className="text-sm text-muted-foreground">El objetivo de este ejercicio es romper la fusión con esos pensamientos ansiosos. Es decir, dejar de verlos como una realidad absoluta, ganar perspectiva y abrir alternativas más realistas.</p>
                <p className="text-sm text-muted-foreground">Vamos a hacerlo con una herramienta clásica de la terapia cognitivo-conductual: el cuestionamiento socrático.</p>
                <Button onClick={next} className="w-full mt-4">Empezar práctica <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
        );
      case 1: 
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Identifica tu “¿Y si…?”</h4>
            <p className="text-sm text-muted-foreground">Primero, vamos a poner por escrito ese pensamiento que te ronda.</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: “¿Y si mi jefe piensa que no valgo por equivocarme en la presentación?”</p>
            <audio key="audio-step-1" controls controlsList="nodownload" className="w-full mt-2"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica2primerpaso.mp3`} type="audio/mp3" /></audio>
            <Label htmlFor="thought" className="font-medium">Escribe tu “¿Y si…?” más frecuente.</Label>
            <Textarea id="thought" value={thought} onChange={e => setThought(e.target.value)} />
            <p className="text-xs text-muted-foreground italic">Recordatorio: no intentes elegir el “peor” ni el “más importante”, basta con uno que aparezca en tu día a día.</p>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!thought.trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 2: 
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Examina la evidencia</h4>
            <p className="text-sm text-muted-foreground">Cuando la ansiedad habla, parece que tiene pruebas sólidas. Pero muchas veces solo son suposiciones. Pregúntate: ¿Qué evidencias tengo a favor de que ocurra? ¿Qué evidencias tengo en contra?</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: A favor: “La semana pasada me puse nervioso o nerviosa en otra presentación.” En contra: “He hecho 10 presentaciones bien; incluso cuando me pongo nervioso, la gente no me juzga tanto como creo.”</p>
            <audio key="audio-step-2" controls controlsList="nodownload" className="w-full mt-2"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica2segundopaso.mp3`} type="audio/mp3" /></audio>
            <Label>Escribe una prueba a favor y una en contra</Label>
            <Textarea value={evidence.pro} onChange={e => setEvidence(p => ({...p, pro: e.target.value}))} placeholder="Pruebas a favor..."/>
            <Textarea value={evidence.con} onChange={e => setEvidence(p => ({...p, con: e.target.value}))} placeholder="Pruebas en contra..."/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!evidence.pro.trim() || !evidence.con.trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 3: 
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Explora alternativas</h4>
            <p className="text-sm text-muted-foreground">El pensamiento ansioso suele ser un túnel con una sola salida. Aquí se trata de abrir ventanas. Pregúntate: ¿Hay otra forma de interpretar esta situación? ¿Qué más podría pasar aparte de lo que imagino?</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: “Quizá me equivoque, pero también es posible que lo resuelva bien, o que incluso alguien me ayude. No todo depende de la perfección.”</p>
            <audio key="audio-step-3" controls controlsList="nodownload" className="w-full mt-2"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica2paso3.mp3`} type="audio/mp3" /></audio>
            <Label>Escribe al menos dos alternativas a tu “¿Y si…?”</Label>
            <Textarea value={alternatives[0]} onChange={e => setAlternatives(p => [e.target.value, p[1]])} placeholder="Alternativa 1..."/>
            <Textarea value={alternatives[1]} onChange={e => setAlternatives(p => [p[0], e.target.value])} placeholder="Alternativa 2..."/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!alternatives[0].trim() || !alternatives[1].trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 4: 
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 4: Evalúa el impacto real (0-10): {severity}</h4>
            <p className="text-sm text-muted-foreground">La mente ansiosa exagera el coste. Aquí entrenamos realismo. Pregúntate: Si lo peor ocurriera, ¿qué tan grave sería dentro de una semana, un mes o un año? ¿Qué recursos tengo para afrontarlo si sucede?</p>
            <p className="text-sm text-muted-foreground italic">Ejemplo: “Si me trabo en la presentación, en una semana nadie lo recordará. Además, puedo preparar notas de apoyo.”</p>
            <audio key="audio-step-4" controls controlsList="nodownload" className="w-full mt-2"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica2paso4.mp3`} type="audio/mp3" /></audio>
            <Label>Valora del 0 al 10, ¿qué tan grave sería en realidad?</Label>
            <Slider value={[severity]} onValueChange={v => setSeverity(v[0])} max={10} step={1} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>Siguiente</Button>
            </div>
        </div>
      );
      case 5: 
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 5: Reformula tu pensamiento</h4>
            <p className="text-sm text-muted-foreground">Ahora reescribe tu “¿Y si…?” con una versión más equilibrada. No se trata de pintarlo todo de rosa, sino de verlo con más perspectiva.</p>
            <p className="text-sm text-muted-foreground italic">De: “¿Y si fallo y piensan que soy un desastre?” A: “Es posible que me equivoque, pero eso no define todo mi valor ni mi desempeño.”</p>
            <audio key="audio-step-5" controls controlsList="nodownload" className="w-full mt-2"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/R13sem3tecnica2paso5.mp3`} type="audio/mp3" /></audio>
            <Label htmlFor="reformulation">Escribe tu nueva versión más realista</Label>
            <Textarea id="reformulation" value={reformulation} onChange={e => setReformulation(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave} disabled={!reformulation.trim() || isSaved}>
                    <Save className="mr-2 h-4 w-4"/>
                    {isSaved ? 'Guardado' : 'Guardar en el cuaderno terapéutico'}
                </Button>
            </div>
          </div>
        );
       case 6: // Cierre del ejercicio
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Práctica Guardada!</h4>
            <p className="text-sm text-muted-foreground">Lo que has hecho ahora es como sacar la lupa de la ansiedad y ponerte unas gafas más neutrales. La neurociencia lo confirma: cuando pones a prueba un pensamiento en lugar de creerlo al pie de la letra, la corteza prefrontal se activa y la amígdala se calma. Dicho de forma sencilla: tu parte racional gana terreno y tu alarma interna baja el volumen.</p>
            <blockquote className="italic">“Un pensamiento no es un hecho: es una hipótesis de tu mente. Y tú tienes el poder de revisarla.”</blockquote>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={resetExercise} variant="outline">Hacer otra práctica</Button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && 
        <CardDescription className="pt-2">
            <p className="mb-2">A veces la ansiedad se alimenta de preguntas que empiezan con “¿Y si…?”. Son como un tren que no para de añadir vagones: “¿Y si me equivoco?”, “¿Y si piensan mal de mí?”, “¿Y si no lo soporto?”. Con este ejercicio aprenderás a poner esas preguntas bajo una lupa, en lugar de darles por hechas. Así tu mente pasa de la catástrofe a un análisis más realista y equilibrado. El objetivo es romper la fusión con los pensamientos ansiosos, es decir, no ver los pensamientos como una realidad, ganar perspectiva y abrir alternativas. Tiempo estimado: 7–9 minutos. Te recomiendo practicarlo siempre que detectes un “¿Y si…?” repetitivo (3 veces por semana es suficiente al inicio).</p>
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta13/tecnicas/Ruta13semana3tecnica2.mp3`} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
        </CardDescription>
        }
      </CardHeader>
      <CardContent>{renderCurrentStep()}</CardContent>
    </Card>
  );
}
