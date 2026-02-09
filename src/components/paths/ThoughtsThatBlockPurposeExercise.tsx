
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
    {id: 'catastrophism', label: 'Catastrofismo', description: 'Ver las situaciones como si el peor desenlace fuera inevitable o insoportable. Ejemplo: “Si fallo esta presentación, será un desastre total y arruinaré mi carrera.”' },
    {id: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)', description: 'Ver las cosas en extremos (todo-nada, siempre-nunca, bien-mal, ...) sin matices. Todo es perfecto o un fracaso. Ejemplo: “Si no hago todo bien, entonces soy una inútil.”' },
    {id: 'overgeneralization', label: 'Sobregeneralización', description: 'Sacar conclusiones generales a partir de un solo hecho negativo. Ejemplo: “Me equivoqué en esto, siempre lo hago mal.”' },
    {id: 'personalization', label: 'Personalización', description: 'Creer que todo lo que ocurre está relacionado contigo, incluso sin evidencia. Ejemplo: “Seguro que están serios porque yo hice algo mal.”' },
    {id: 'mind_reading', label: 'Inferencia arbitraria / Saltar a conclusiones', description: 'Sacar conclusiones negativas sin pruebas claras. Hay dos tipos: la Adivinación del Pensamiento de los demás y la Adivinación del Futuro. Ejemplo: “No me contestó el mensaje, seguro que está molesto conmigo”, “No me lo voy a pasar bien en la cena, asi que no voy a ir”.' },
    {id: 'selective_abstraction', label: 'Abstracción selectiva', description: 'Fijarse solo en lo negativo, ignorando el resto de los acontecimientos y hechos de la experiencia. Ejemplo: “Todo salió mal porque me equivoqué en una palabra”, aunque el resto de la reunión fue bien.' },
    {id: 'emotional_reasoning', label: 'Razonamiento emocional', description: 'Creer que algo es cierto solo porque lo sientes intensamente. Ejemplo: “Me siento insegura, así que debo ser incompetente.”' },
    {id: 'should_statements', label: '“Deberías” rígidos', description: 'Imponerse reglas a uno mismo o a los demás, absolutas y exigentes que generan culpa o presión. Ejemplo: “Debería estar siempre tranquila”, “No debería fallar nunca.”' },
    {id: 'magnification_minimization', label: 'Minimizar lo positivo y Maximizar lo negativo', description: 'Rechazar o minimizar cualquier logro o aspecto positivo y maximizar cualquier error o aspecto negativo. Ejemplo: “Sí, me felicitaron… pero seguro fue por compromiso”, “Mi pareja me señala un error...soy lo peor, es imperdonable”.' },
    {id: 'perfectionism', label: 'Perfeccionismo', description: 'Necesidad de cumplir estándares imposiblemente altos, sin permitir errores. Ejemplo: “Si no lo hago todo perfecto, no vale la pena.”' },
    {id: 'approval_dependency', label: 'Valía personal dependiente de la aprobación', description: 'Sentir que tu valor depende de lo que piensan los demás. Ejemplo: “Si no me valoran en el trabajo, entonces no valgo nada.”' },
    {id: 'negative_comparison', label: 'Comparación negativa', description: 'Compararse con otros en lo que uno cree que falla, sin ver el conjunto. Ejemplo: “Ella tiene más éxito que yo (porque tiene un salario más alto), entonces soy un fracaso.”' },
    {id: 'responsibility_exaggeration', label: 'Exageración de la responsabilidad', description: 'Asumir que todo depende de ti, incluso cuando no está en tus manos. Ejemplo: “Si el grupo falla, será por mi culpa.”' },
    {id: 'time_distortion', label: 'Distorsión del tiempo', description: 'Pensar que lo que sientes o vives ahora durará para siempre. Ejemplo: “Nunca voy a salir de esto.”' },
    {id: 'negative_attentional_tunnel', label: 'Túnel atencional negativo', description: 'Enfocarse solo en los peligros o en lo que falta, y no ver lo que sí está bien. Ejemplo: “Hoy ha sido horrible porque tuve una discusión”, ignorando que el resto del día fue tranquilo.' },
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
        toast({ title: 'Reformulación vacía', description: 'Por favor, completa la reformulación.', variant: 'destructive'});
        return;
    }
    const selectedDistortions = distortionOptions.filter(d => distortions[d.id]).map(d => d.label);

    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation || 'No especificada.'}
**Pensamiento automático:** "${automaticThought || 'No especificado.'}"
**Distorsiones detectadas:** ${selectedDistortions.join(', ') || 'Ninguna.'}
**Reformulación consciente:** "${reformulation}"
    `;
    addNotebookEntry({ title: `Micropráctica: Pensamientos que Bloquean`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Práctica Guardada", description: "Tu ejercicio ha sido guardado." });
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
                <h4 className="font-semibold text-lg">Ejemplo guía:</h4>
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-background/50 space-y-2">
                    <p><strong>Situación reciente:</strong> Tenía planeado hablar con mi jefe sobre reducir mi carga de trabajo, pero no me atreví.</p>
                    <p><strong>Pensamiento automático que me bloqueó:</strong> “Seguro que piensa que me estoy quejando por nada y que no soy lo suficientemente bueno/a para el puesto.”</p>
                    <p><strong>Distorsiones que aparecieron:</strong> Inferencia arbitraria: Adivinación del pensamiento, Catastrofismo</p>
                    <p><strong>Reformulación adecuada consciente:</strong> “No puedo saber lo que piensa. Estoy cuidándome al expresar mis límites, y eso es una muestra de responsabilidad y valentía.”</p>
                </div>
                 <Button onClick={nextStep} className="w-full">Empezar práctica <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Activa el recuerdo</h4>
            <Label htmlFor="sit-block">¿Qué situación reciente te bloqueó para actuar desde tu propósito?</Label>
            <Textarea id="sit-block" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Pensamiento automático y distorsiones</h4>
            <div className="space-y-2">
                <Label htmlFor="thought-block">¿Qué frase pasó por tu mente en ese momento?</Label>
                <Textarea id="thought-block" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>¿Qué distorsiones cognitivas detectas?</Label>
                <Accordion type="multiple" className="w-full">
                    {distortionOptions.map(opt => (
                        <AccordionItem value={opt.id} key={opt.id} className="border-b">
                           <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <Checkbox id={opt.id} checked={!!distortions[opt.id]} onCheckedChange={(checked) => handleDistortionChange(opt.id, !!checked)} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                                <AccordionTrigger className="p-2 text-muted-foreground hover:no-underline [&>svg]:size-5">
                                    <span className="sr-only">Ver descripción</span>
                                </AccordionTrigger>
                            </div>
                            <AccordionContent className="pl-10 pr-2 pb-2 text-xs text-muted-foreground">
                                {opt.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
             <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!automaticThought.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Reformulación consciente</h4>
            <Label htmlFor="reformulation-block">Reformula esa frase desde un lugar más realista, valiente o compasivo.</Label>
            <Textarea id="reformulation-block" value={reformulation} onChange={e => setReformulation(e.target.value)} />
             <div className="flex justify-between mt-2">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar Práctica</Button>
            </div>
          </form>
        );
      case 4:
        return (
             <div className="p-4 space-y-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Práctica Guardada!</h4>
                <p className="text-muted-foreground">Has entrenado una forma más consciente de relacionarte con tus pensamientos.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <Button variant="secondary" disabled>
                      <Save className="mr-2 h-4 w-4" /> Guardado en tu caja de herramientas
                    </Button>
                    <Button onClick={resetExercise} variant="outline">
                      Repetir con otro pensamiento
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
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
