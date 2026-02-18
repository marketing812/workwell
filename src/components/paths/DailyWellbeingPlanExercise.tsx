
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyWellbeingPlanExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const firstGestureOptions = [
  { id: 'respirar', label: 'Respirar profundamente 1 minuto', importance: 'Comenzar con una respiración lenta y profunda regula tu sistema nervioso, reduce la activación del modo alerta y prepara tu mente para un inicio más sereno.' },
  { id: 'agua', label: 'Beber un vaso grande de agua', importance: 'Hidratarte nada más despertar reactiva tu metabolismo, mejora la concentración y contrarresta la ligera deshidratación de la noche.' },
  { id: 'luz', label: 'Abrir la ventana y dejar entrar luz y aire', importance: 'La luz natural activa tu ritmo circadiano, mejora el estado de ánimo y ayuda a tu cuerpo a “entender” que es hora de iniciar el día.' },
  { id: 'frase', label: 'Decir una frase positiva o motivadora', importance: 'La forma en la que te hablas al empezar el día influye en tu actitud. Una frase breve pero significativa puede enfocar tu mente hacia lo constructivo.' },
];
const bodyCareOptions = [
  { id: 'estirar', label: 'Estiramientos suaves 2-3 minutos', importance: 'Movilizar el cuerpo al despertar mejora la circulación, aumenta la flexibilidad y reduce la rigidez muscular acumulada durante la noche.' },
  { id: 'caminar', label: 'Caminar un poco por casa mientras te preparas', importance: 'El movimiento temprano activa la energía, mejora la oxigenación y ayuda a despejar la mente.' },
  { id: 'desayuno', label: 'Preparar y tomar un desayuno nutritivo', importance: 'Un desayuno equilibrado estabiliza los niveles de glucosa, evitando bajones de energía y cambios bruscos de ánimo en las horas siguientes.' },
  { id: 'higiene', label: 'Higiene consciente (lavarte la cara con agua fresca, ducha breve, etc.)', importance: 'Más que un hábito mecánico, puede convertirse en un momento de presencia y cuidado personal que marca el inicio de tu día.' },
];
const mentalPrepOptions = [
  { id: 'intencion', label: 'Anotar una intención o prioridad del día', importance: 'Te ayuda a enfocar tu energía y a no dispersarte entre tareas menos importantes.' },
  { id: 'gratitud', label: 'Escribir 3 cosas por las que estás agradecido/a', importance: 'Entrena tu mente para fijarse en lo positivo, mejorando tu estado de ánimo y tu resiliencia emocional.' },
  { id: 'musica', label: 'Escuchar una canción o audio inspirador', importance: 'La música o las palabras motivadoras pueden elevar tu energía emocional y predisponerte a un día más positivo.' },
  { id: 'meditacion', label: 'Práctica breve de mindfulness o meditación guiada (2-5 minutos)', importance: 'Mejora la regulación emocional y entrena tu atención para responder en lugar de reaccionar de forma automática.' },
];

const facilitatorOptions = [
    { id: 'facilitator-alarma', label: 'Poner una alarma en el móvil' },
    { id: 'facilitator-nota', label: 'Dejar una nota visible' },
    { id: 'facilitator-vincular', label: 'Vincularlo a otra acción (ej. después de lavarme los dientes)' },
];

const momentOptions = ['Al despertar', 'Antes o después de una comida', 'Antes de dormir', 'Al volver del trabajo/estudios'];


const HabitStep = ({ stepTitle, description, options, selected, setSelected, other, setOther, onNext, onPrev }: any) => {
    return (
        <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">{stepTitle}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <RadioGroup value={selected} onValueChange={setSelected}>
                <Accordion type="single" collapsible className="w-full">
                    {options.map((opt: any) => (
                        <AccordionItem value={opt.id} key={opt.id} className="border-b">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value={opt.label} id={opt.id} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                                <AccordionTrigger className="p-2 hover:no-underline [&>svg]:size-5"><Info className="h-4 w-4 text-muted-foreground" /></AccordionTrigger>
                            </div>
                            <AccordionContent className="text-sm text-muted-foreground pl-9 pr-4 pb-3">{opt.importance}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </RadioGroup>
            <div className="flex items-center space-x-2 pt-4">
                <RadioGroup value={selected} onValueChange={setSelected} className="flex items-center space-x-2">
                    <RadioGroupItem value="Otro" id="other-habit" />
                    <Label htmlFor="other-habit" className="font-normal">Otro:</Label>
                </RadioGroup>
            </div>
            {selected === 'Otro' && <Textarea value={other} onChange={e => setOther(e.target.value)} placeholder="Describe tu hábito personalizado..." className="ml-6" />}
            <div className="flex justify-between w-full mt-4">
                {onPrev && <Button variant="outline" onClick={onPrev} type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>}
                <Button onClick={onNext} className={cn(!onPrev && "w-full")} disabled={!selected}>Continuar <ArrowRight className="mr-2 h-4 w-4"/></Button>
            </div>
        </div>
    );
};

interface DailyWellbeingPlanExerciseProps {
  content: DailyWellbeingPlanExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function DailyWellbeingPlanExercise({ content, pathId, onComplete }: DailyWellbeingPlanExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [firstGesture, setFirstGesture] = useState('');
  const [otherFirstGesture, setOtherFirstGesture] = useState('');
  const [bodyCare, setBodyCare] = useState('');
  const [otherBodyCare, setOtherBodyCare] = useState('');
  const [mentalPrep, setMentalPrep] = useState('');
  const [otherMentalPrep, setOtherMentalPrep] = useState('');
  
  const [durations, setDurations] = useState({ firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
  const [moments, setMoments] = useState<Record<string, string>>({ firstGesture: '', bodyCare: '', mentalPrep: '' });
  const [otherMoments, setOtherMoments] = useState<Record<string, string>>({});
  const [facilitators, setFacilitators] = useState<Record<string, boolean>>({});
  const [otherFacilitator, setOtherFacilitator] = useState('');
  
  const storageKey = `exercise-progress-${pathId}-dailyWellbeingPlan`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setFirstGesture(data.firstGesture || '');
        setOtherFirstGesture(data.otherFirstGesture || '');
        setBodyCare(data.bodyCare || '');
        setOtherBodyCare(data.otherBodyCare || '');
        setMentalPrep(data.mentalPrep || '');
        setOtherMentalPrep(data.otherMentalPrep || '');
        setDurations(data.durations || { firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
        setMoments(data.moments || { firstGesture: '', bodyCare: '', mentalPrep: '' });
        setOtherMoments(data.otherMoments || {});
        setFacilitators(data.facilitators || {});
        setOtherFacilitator(data.otherFacilitator || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, firstGesture, otherFirstGesture, bodyCare, otherBodyCare, mentalPrep, otherMentalPrep, durations, moments, otherMoments, facilitators, otherFacilitator, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, firstGesture, otherFirstGesture, bodyCare, otherBodyCare, mentalPrep, otherMentalPrep, durations, moments, otherMoments, facilitators, otherFacilitator, isSaved, storageKey, isClient]);


  const finalFirstGesture = firstGesture === 'Otro' ? otherFirstGesture : firstGesture;
  const finalBodyCare = bodyCare === 'Otro' ? otherBodyCare : bodyCare;
  const finalMentalPrep = mentalPrep === 'Otro' ? otherMentalPrep : mentalPrep;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
  const resetExercise = () => {
    setStep(0);
    setFirstGesture('');
    setOtherFirstGesture('');
    setBodyCare('');
    setOtherBodyCare('');
    setMentalPrep('');
    setOtherMentalPrep('');
    setDurations({ firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
    setMoments({ firstGesture: '', bodyCare: '', mentalPrep: '' });
    setOtherMoments({});
    setFacilitators({});
    setOtherFacilitator('');
    setIsSaved(false);
    localStorage.removeItem(storageKey);
  };

  const handleSave = () => {
    if (!finalFirstGesture || !finalBodyCare || !finalMentalPrep) {
      toast({ title: "Incompleto", description: "Por favor, elige un microhábito para cada área.", variant: 'destructive' });
      return;
    }
    
    const notebookContent = `
**${content.title}**

*Mi primer gesto al despertar:* ${finalFirstGesture} (${durations.firstGesture} min)
*Mi cuidado para el cuerpo:* ${finalBodyCare} (${durations.bodyCare} min)
*Mi preparación mental:* ${finalMentalPrep} (${durations.mentalPrep} min)
`;

    addNotebookEntry({ title: 'Mi Plan Diario de Bienestar', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Plan Guardado' });
    setIsSaved(true);
    onComplete();
    setStep(7);
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  const renderStep = () => {
    const habits = [
        { key: 'firstGesture', label: 'Físico', value: finalFirstGesture },
        { key: 'bodyCare', label: 'Emocional', value: finalBodyCare },
        { key: 'mentalPrep', label: 'Mental', value: finalMentalPrep },
    ].filter(h => h.value);

    switch(step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             <p className="text-sm text-muted-foreground">Hay días en los que sentimos que el tiempo se nos escapa y que nuestras rutinas se desordenan.</p>
             <p className="text-sm text-muted-foreground">La buena noticia es que no necesitas cambios drásticos para recuperar la sensación de control: basta con anclar tu día a tres gestos pequeños, pero estratégicos, que sostengan tu cuerpo, tus emociones y tu mente.</p>
             <p className="text-sm text-muted-foreground">Este ejercicio es tu “plan maestro de autocuidado”: vas a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles.</p>
             <p className="text-sm text-muted-foreground">Estos serán tus anclas: puntos fijos que mantendrán tu bienestar estable sin importar lo que pase fuera.</p>
             <p className="text-xs text-muted-foreground">Tiempo estimado: 6-8 minutos. Hazlo al inicio de la semana y repite siempre que sientas que has perdido tus rutinas.</p>
            <Button onClick={nextStep}>Empezar</Button>
          </div>
        );
      case 1:
        return <HabitStep stepTitle="Paso 1: Microhábito físico" description="Vamos a empezar por tu cuerpo. Pequeños gestos físicos repetidos cada día pueden tener un gran impacto en tu bienestar. No se trata de hacer mucho, sino de acciones simples que activan tu cuerpo, regulan tu energía y mejoran tu estado de ánimo." options={firstGestureOptions} selected={firstGesture} setSelected={setFirstGesture} other={otherFirstGesture} setOther={setOtherFirstGesture} onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <HabitStep stepTitle="Paso 2: Microhábito emocional" description="Ahora piensa en algo pequeño que alimente tu mundo emocional. Puede ser conectar con alguien, darte un momento de calma o buscar una sensación agradable que te recargue por dentro." options={bodyCareOptions} selected={bodyCare} setSelected={setBodyCare} other={otherBodyCare} setOther={setOtherBodyCare} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <HabitStep stepTitle="Paso 3: Microhábito mental" description="Ahora vamos a por tu mente: elige una práctica breve que te ayude a enfocarte, aprender o desconectar de la sobrecarga mental." options={mentalPrepOptions} selected={mentalPrep} setSelected={setMentalPrep} other={otherMentalPrep} setOther={setOtherMentalPrep} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Cuándo lo harás</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a decidir cuándo realizarás cada uno de los microhábitos que elegiste en los pasos anteriores.</p>
                <div className="space-y-4">
                    {habits.map((item, index) => (
                        <div key={item.key} className="p-3 border rounded-md bg-background space-y-2">
                           <Label htmlFor={`moment-select-${index}`} className="font-medium">{item.value}</Label>
                            <Select 
                                value={moments[item.key as keyof typeof moments]} 
                                onValueChange={(value) => setMoments(p => ({...p, [item.key]: value}))}
                            >
                                <SelectTrigger id={`moment-select-${index}`}>
                                    <SelectValue placeholder="Elige un momento..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {momentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                     <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                             {moments[item.key as keyof typeof moments] === 'Otro' && (
                                <Input 
                                    value={otherMoments[item.key] || ''} 
                                    onChange={e => setOtherMoments(p => ({...p, [item.key]: e.target.value}))} 
                                    placeholder="Describe el otro momento"
                                    className="mt-2 ml-6"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="mr-2 h-4 w-4"/></Button></div>
            </div>
        );
       case 5:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Cómo recordarlo</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a decidir cómo te vas a recordar a ti mismo/a que es momento de hacer cada microhábito que elegiste.</p>
                <p className="text-xs text-muted-foreground">Piensa en lo que mejor funciona para ti: hay personas que responden bien a alarmas, otras a señales visuales, y otras a enlazarlo con una acción que ya hacen sin pensar.</p>
                <div className="space-y-2">
                {facilitatorOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={!!facilitators[opt.id]} onCheckedChange={(c: boolean) => setFacilitators(p => ({...p, [opt.id]: c}))} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                 <div className="flex items-center space-x-2">
                    <Checkbox id="facilitator-other" checked={!!facilitators['facilitator-other']} onCheckedChange={(c: boolean) => setFacilitators(p => ({...p, ['facilitator-other']: c}))} />
                    <Label htmlFor="facilitator-other" className="font-normal">Otro:</Label>
                </div>
                {facilitators['facilitator-other'] && <Textarea value={otherFacilitator} onChange={e => setOtherFacilitator(e.target.value)} placeholder="Describe tu facilitador" className="ml-6"/>}
                </div>
                 <div className="flex justify-between w-full mt-4">
                     <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                     <Button onClick={nextStep}>Revisar y Guardar <ArrowRight className="mr-2 h-4 w-4" /></Button>
                 </div>
            </div>
        );
      case 6:
        return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-primary">Paso 6: Tu plan de microhábitos</h4>
            <p className="text-sm text-muted-foreground">Aquí tienes tu plan personalizado de microhábitos: tres gestos simples, pero con un gran impacto en tu bienestar. Has elegido qué hacer y cuándo hacerlo… ahora vamos a darle un lugar fijo en tu día para que se conviertan en parte natural de tu vida.</p>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead>Microhábito</TableHead><TableHead>Momento elegido</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {habits.map(h => (
                            <TableRow key={h.key}>
                                <TableCell>{h.value}</TableCell>
                                <TableCell>{moments[h.key as keyof typeof moments] === 'Otro' ? otherMoments[h.key] : moments[h.key as keyof typeof moments]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-xs italic text-muted-foreground pt-2">Si un día no puedes hacerlos todos, haz al menos el primero: será suficiente para recordarte que tú decides cómo empezar.</p>
            <p className="text-xs italic text-muted-foreground pt-2">Y ahora, con tu mañana amable lista y tus tres microhábitos definidos, tu bienestar diario tiene un punto de partida y un plan de continuidad.</p>
            <Button onClick={handleSave} className="w-full">
                Guardar mi plan diario en mi cuaderno terapéutico
            </Button>
             <Button onClick={prevStep} variant="link" className="w-full">Atrás</Button>
        </div>
      );
      case 7:
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-semibold">"Las grandes transformaciones empiezan con pasos pequeños, repetidos con cariño y constancia."</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Crear un nuevo plan</Button>
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
          {content.objective && <p className="pt-2 whitespace-pre-line">{content.objective}</p>}
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
