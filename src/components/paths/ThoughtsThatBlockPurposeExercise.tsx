
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ThoughtsThatBlockPurposeExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';

interface ThoughtsThatBlockPurposeExerciseProps {
  content: ThoughtsThatBlockPurposeExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const distortionOptions = [
    {id: 'catastrophism', label: 'Catastrofismo', description: 'Ver las situaciones como si el peor desenlace fuera inevitable o insoportable. Ejemplo: â€œSi fallo esta presentaciÃ³n, serÃ¡ un desastre total y arruinarÃ© mi carrera.â€' },
    {id: 'dichotomous', label: 'Pensamiento dicotÃ³mico (todo o nada)', description: 'Ver las cosas en extremos (todo-nada, siempre-nunca, bien-mal, ...) sin matices. Todo es perfecto o un fracaso. Ejemplo: â€œSi no lo hago todo bien, entonces soy una inÃºtil.â€' },
    {id: 'overgeneralization', label: 'SobregeneralizaciÃ³n', description: 'Sacar conclusiones generales a partir de un solo hecho negativo. Ejemplo: â€œMe equivoquÃ© en esto, siempre lo hago mal.â€' },
    {id: 'personalization', label: 'PersonalizaciÃ³n', description: 'Creer que todo lo que ocurre estÃ¡ relacionado contigo, incluso sin evidencia. Ejemplo: â€œSeguro que estÃ¡n serios porque yo hice algo mal.â€' },
    {id: 'mind_reading', label: 'Inferencia arbitraria / Saltar a conclusiones', description: 'Sacar conclusiones negativas sin pruebas claras. Hay dos tipos: la AdivinaciÃ³n del Pensamiento de los demÃ¡s y la AdivinaciÃ³n del Futuro. Ejemplo: â€œNo me contestÃ³ el mensaje, seguro que estÃ¡ molesto conmigoâ€, â€œNo me lo voy a pasar bien en la cena, asi que no voy a irâ€.' },
    {id: 'selective_abstraction', label: 'AbstracciÃ³n selectiva', description: 'Fijarse solo en lo negativo, ignorando el resto de los acontecimientos y hechos de la experiencia. Ejemplo: â€œTodo saliÃ³ mal porque me equivoquÃ© en una palabraâ€, aunque el resto de la reuniÃ³n fue bien.' },
    {id: 'emotional_reasoning', label: 'Razonamiento emocional', description: 'Creer que algo es cierto solo porque lo sientes intensamente. Ejemplo: â€œMe siento insegura, asÃ­ que debo ser incompetente.â€' },
    {id: 'should_statements', label: 'â€œDeberÃ­asâ€ rÃ­gidos', description: 'Imponerse reglas a uno mismo o a los demÃ¡s, absolutas y exigentes que generan culpa o presiÃ³n. Ejemplo: â€œDeberÃ­a estar siempre tranquilaâ€, â€œNo deberÃ­a fallar nunca.â€' },
    {id: 'magnification_minimization', label: 'Minimizar lo positivo y Maximizar lo negativo', description: 'Rechazar o minimizar cualquier logro o aspecto positivo y maximizar cualquier error o aspecto negativo. Ejemplo: â€œSÃ­, me felicitaronâ€¦ pero seguro fue por compromisoâ€, â€œMi pareja me seÃ±ala un error...soy lo peor, es imperdonableâ€.' },
    {id: 'perfectionism', label: 'Perfeccionismo', description: 'Necesidad de cumplir estÃ¡ndares imposiblemente altos, sin permitir errores. Ejemplo: â€œSi no lo hago todo perfecto, no vale la pena.â€' },
    {id: 'approval_dependency', label: 'ValÃ­a personal dependiente de la aprobaciÃ³n', description: 'Sentir que tu valor depende de lo que piensan los demÃ¡s. Ejemplo: â€œSi no me valoran en el trabajo, entonces no valgo nada.â€' },
    {id: 'negative_comparison', label: 'ComparaciÃ³n negativa', description: 'Compararse con otros en lo que uno cree que falla, sin ver el conjunto. Ejemplo: â€œElla tiene mÃ¡s Ã©xito que yo (porque tiene un salario mÃ¡s alto), entonces soy un fracaso.â€' },
    {id: 'responsibility_exaggeration', label: 'ExageraciÃ³n de la responsabilidad', description: 'Asumir que todo depende de ti, incluso cuando no estÃ¡ en tus manos. Ejemplo: â€œSi el grupo falla, serÃ¡ por mi culpa.â€' },
    {id: 'time_distortion', label: 'DistorsiÃ³n del tiempo', description: 'Pensar que lo que sientes o vives ahora durarÃ¡ para siempre. Ejemplo: â€œNunca voy a salir de esto.â€' },
    {id: 'negative_attentional_tunnel', label: 'TÃºnel atencional negativo', description: 'Enfocarse solo en los peligros o en lo que falta, y no ver lo que sÃ­ estÃ¡ bien. Ejemplo: â€œHoy ha sido horrible porque tuve una discusiÃ³nâ€, ignorando que el resto del dÃ­a fue tranquilo.' },
];


export default function ThoughtsThatBlockPurposeExercise({ content, pathId, onComplete }: ThoughtsThatBlockPurposeExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortions, setDistortions] = useState<Record<string, boolean>>({});
  const [reformulation, setReformulation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setAutomaticThought('');
    setDistortions({});
    setReformulation('');
    setIsSaved(false);
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reformulation.trim()) {
        toast({ title: 'ReformulaciÃ³n vacÃ­a', description: 'Por favor, completa la reformulaciÃ³n.', variant: 'destructive'});
        return;
    }
    const selectedDistortions = distortionOptions.filter(d => distortions[d.id]).map(d => d.label);

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Â¿QuÃ© situaciÃ³n reciente te bloqueÃ³ para actuar desde tu propÃ³sito? | Respuesta: ${situation || 'No especificada.'}
Pregunta: Â¿QuÃ© frase pasÃ³ por tu mente en ese momento? | Respuesta: "${automaticThought || 'No especificado.'}"
Pregunta: Â¿QuÃ© distorsiones cognitivas detectas? | Respuesta: [${selectedDistortions.join(', ') || 'Ninguna.'}]
Pregunta: Reformula esa frase desde un lugar mÃ¡s realista, valiente o compasivo | Respuesta: "${reformulation}"
    `;
    addNotebookEntry({ title: `MicroprÃ¡ctica: Pensamientos que Bloquean`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "PrÃ¡ctica Guardada", description: "Tu ejercicio ha sido guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const handleDistortionChange = (id: string, checked: boolean) => {
    setDistortions(prev => ({ ...prev, [id]: checked }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Ejemplo guÃ­a:</h4>
                <div className="p-3 border rounded-md bg-background/50 space-y-2">
                    <p><strong>SituaciÃ³n reciente:</strong> TenÃ­a planeado hablar con mi jefe sobre reducir mi carga de trabajo, pero no me atrevÃ­.</p>
                    <p><strong>Pensamiento automÃ¡tico que me bloqueÃ³:</strong> â€œSeguro que piensa que me estoy quejando por nada y que no soy lo suficientemente bueno/a para el puesto.â€</p>
                    <p><strong>Distorsiones que aparecieron:</strong> Inferencia arbitraria: AdivinaciÃ³n del pensamiento, Catastrofismo</p>
                    <p><strong>ReformulaciÃ³n adecuada consciente:</strong> â€œNo puedo saber lo que piensa. Estoy cuidÃ¡ndome al expresar mis lÃ­mites, y eso es una muestra de responsabilidad y valentÃ­a.â€</p>
                </div>
                 <div className="flex justify-end w-full">
                    <Button onClick={nextStep}>Empezar prÃ¡ctica <ArrowRight className="mr-2 h-4 w-4"/></Button>
                 </div>
            </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Activa el recuerdo</h4>
            <Label htmlFor="sit-block">Â¿QuÃ© situaciÃ³n reciente te bloqueÃ³ para actuar desde tu propÃ³sito?</Label>
            <Textarea id="sit-block" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Pensamiento automÃ¡tico y distorsiones</h4>
            <div className="space-y-2">
                <Label htmlFor="thought-block">Â¿QuÃ© frase pasÃ³ por tu mente en ese momento?</Label>
                <Textarea id="thought-block" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} />
            </div>
            <div className="space-y-4">
                <Label>Â¿QuÃ© distorsiones cognitivas detectas?</Label>
                {distortionOptions.map(opt => (
                    <div key={opt.id} className="flex items-start space-x-3 rounded-md border p-3">
                        <Checkbox id={opt.id} checked={!!distortions[opt.id]} onCheckedChange={(checked) => handleDistortionChange(opt.id, !!checked)} className="mt-1" />
                        <div className="grid gap-1.5 leading-normal">
                            <Label htmlFor={opt.id} className="font-semibold cursor-pointer">{opt.label}</Label>
                            <p className="text-sm">{opt.description}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                <Button onClick={nextStep} disabled={!automaticThought.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: ReformulaciÃ³n consciente</h4>
            <Label htmlFor="reformulation-block">Reformula esa frase desde un lugar mÃ¡s realista, valiente o compasivo.</Label>
            <Textarea id="reformulation-block" value={reformulation} onChange={e => setReformulation(e.target.value)} />
             <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar en el cuaderno terapÃ©utico</Button>
            </div>
          </form>
        );
      case 4:
        return (
             <div className="p-4 space-y-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Â¡PrÃ¡ctica Guardada!</h4>
                <p>Has entrenado una forma mÃ¡s consciente de relacionarte con tus pensamientos.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <Button variant="secondary" disabled>
                      <Save className="mr-2 h-4 w-4" /> Guardado en tu caja de herramientas
                    </Button>
                    
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
        {content.objective && <CardDescription>{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
