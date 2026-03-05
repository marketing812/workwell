
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

const firstGestureOptions = [
  { id: 'respirar', label: 'Caminar 15 minutos al día  — ¿Por qué es importante?', importance: 'Caminar a diario no solo cuida tu salud física (mejora la circulación, fortalece el corazón y regula la presión arterial), sino que también activa la liberación de endorfinas y serotonina, neurotransmisores que elevan el estado de ánimo y reducen el estrés. Además, rompe la inercia de la pasividad: un gesto tan simple como ponerse en movimiento envía a tu cerebro el mensaje de que te estás cuidando activamente, lo que refuerza la motivación para otras acciones saludables. ' },
  { id: 'agua', label: 'Beber un vaso grande de agua al despertar  — ¿Por qué es importante? ', importance: 'Durante la noche, tu cuerpo pierde líquidos y necesita rehidratarse para funcionar bien. Tomar agua nada más levantarte reactiva tu metabolismo, favorece la oxigenación cerebral y mejora la concentración desde las primeras horas. Según estudios de neurociencia, incluso una leve deshidratación puede afectar tu atención y estado de ánimo. Este sencillo hábito es una forma consciente de empezar el día cuidando de ti, sin esfuerzo extra. ' },
  { id: 'luz', label: 'Estirarte 2 minutos al levantarte  — ¿Por qué es importante?', importance: 'Estirarte suavemente al iniciar el día activa la circulación, aumenta la movilidad y libera la tensión acumulada durante el sueño. Además, le envía señales al sistema nervioso de que es hora de “ponerse en marcha”, despertando cuerpo y mente. Es un ritual breve que conecta contigo desde el primer momento, ayudándote a iniciar el día con más presencia y energía. ' },
  { id: 'frase1', label: 'Tomar el sol 10 minutos  — ¿Por qué es importante?', importance: 'La exposición moderada al sol estimula la producción de vitamina D, esencial para el sistema inmunitario y la salud ósea, y favorece la regulación del ritmo circadiano, lo que mejora el sueño. Además, la luz solar incrementa la liberación de serotonina, la hormona del bienestar, contribuyendo a un estado de ánimo más equilibrado. Es como darle a tu cuerpo una recarga natural de energía y buen humor. ' },
  { id: 'frase2', label: 'Comer una fruta o verdura extra  — ¿Por qué es importante?', importance: 'Aumentar la ingesta de frutas y verduras aporta vitaminas, minerales y fibra que estabilizan los niveles de energía y ayudan a regular el azúcar en sangre, evitando los bajones de ánimo que provocan algunos alimentos procesados. Además, sus antioxidantes protegen las células del estrés oxidativo. Es un microgesto que nutre tanto tu cuerpo como tu salud emocional. ' },
  { id: 'frase3', label: 'Preparar la ropa de ejercicio la noche anterior  — ¿Por qué es importante?', importance: 'Dejar lista tu ropa deportiva reduce la “fricción” para empezar a moverte: elimina una excusa y aumenta las probabilidades de que cumplas tu plan, incluso si la motivación está baja. Este hábito es un ejemplo de cómo pequeñas decisiones estratégicas facilitan cambios grandes en tu bienestar. ' },
  { id: 'frase4', label: 'Subir escaleras en vez de ascensor  — ¿Por qué es importante?', importance: 'Optar por las escaleras incrementa tu gasto energético diario, fortalece piernas y corazón, y mejora la capacidad pulmonar. Más allá del beneficio físico, es un recordatorio constante de que cada elección suma en tu salud: no siempre hacen falta grandes esfuerzos para sentirte más fuerte y con más energía. ' }
];
const bodyCareOptions = [
  { id: 'estirar', label: 'Escribir una frase de gratitud al final del día — ¿Por qué es importante?', importance: 'Practicar gratitud entrena tu cerebro para fijarse en lo positivo, lo que reduce la atención excesiva en lo negativo. Según investigaciones en psicología positiva (Emmons & McCullough, 2003), este hábito mejora el ánimo y la satisfacción vital. Además, escribirlo antes de dormir ayuda a cerrar el día con una sensación de calma y bienestar.' },
  { id: 'caminar', label: 'Decir algo amable a alguien — ¿Por qué es importante?', importance: 'Los actos de amabilidad liberan oxitocina y dopamina, hormonas vinculadas al bienestar y la conexión social. Este gesto no solo mejora el día de la otra persona, también refuerza tu autoestima y fortalece vínculos.' },
  { id: 'desayuno', label: 'Escuchar una canción que te inspire — ¿Por qué es importante?', importance: 'La música puede regular tus emociones de forma rápida y eficaz. Investigaciones en neurociencia han demostrado que escuchar canciones que te gustan activa el sistema de recompensa del cerebro, elevando el ánimo y reduciendo el estrés. ' },
  { id: 'higiene1', label: 'Dar un abrazo (o autoabrazo consciente) — ¿Por qué es importante? ', importance: 'Abrazar —o abrazarte— estimula la liberación de oxitocina, que genera calma y conexión. Un autoabrazo consciente, acompañado de respiración lenta, también reduce la activación del sistema nervioso simpático, ayudándote a relajarte.' },
  { id: 'higiene2', label: 'Encender una vela y respirar profundamente — ¿Por qué es importante?', importance: 'Este pequeño ritual combina estímulos sensoriales (luz suave, aroma) con respiración profunda, favoreciendo la relajación y reduciendo el ritmo cardíaco. Es un ancla que te ayuda a pasar del “modo estrés” al “modo calma”.' },
  { id: 'higiene3', label: 'Observar un paisaje, planta o cielo 5 minutos — ¿Por qué es importante? ', importance: 'Mirar elementos naturales, aunque sea desde una ventana, tiene efectos restauradores en la atención y el estado de ánimo. Según la teoría de la restauración de la atención (Kaplan, 1995), este contacto con la naturaleza recarga la mente y reduce la fatiga mental.' },
  { id: 'higiene4', label: 'Colocar una foto que te motive en un lugar visible — ¿Por qué es importante? ', importance: 'Ver una imagen que te conecta con algo valioso para ti (personas, lugares, metas) genera emociones positivas y te recuerda qué es importante, ayudando a mantener la motivación en tu día a día.' },
];
const mentalPrepOptions = [
  { id: 'intencion', label: 'Respiración consciente 5 minutos — ¿Por qué es importante?', importance: 'La respiración consciente reduce la activación del sistema de estrés y mejora la concentración. Practicarla unos minutos al día entrena tu mente para volver al presente y gestionar mejor la ansiedad. ' },
  { id: 'gratitud', label: 'Leer una página de un libro — ¿Por qué es importante?', importance: 'La lectura estimula la mente, amplía el vocabulario y mejora la concentración. Incluso leer una sola página antes de dormir puede ayudarte a desconectar de las preocupaciones y relajar la mente.' },
  { id: 'musica', label: 'Anotar una idea o aprendizaje del día — ¿Por qué es importante? ', importance: 'Registrar tus ideas o aprendizajes fortalece la memoria, te ayuda a integrar lo aprendido y genera una sensación de progreso personal.' },
  { id: 'meditacion1', label: 'Meditación guiada breve — ¿Por qué es importante?', importance: 'La meditación guiada entrena tu atención y regula el sistema nervioso. Incluso sesiones cortas (3-5 minutos) han demostrado reducir el estrés y aumentar la sensación de calma.' },
  { id: 'meditacion2', label: 'Escribir una meta o intención diaria — ¿Por qué es importante?', importance: 'Poner por escrito una meta concreta orienta tu energía y tu atención hacia lo que de verdad importa, aumentando la probabilidad de cumplirlo.' },
  { id: 'meditacion3', label: 'Planificar 3 tareas clave para mañana — ¿Por qué es importante? ', importance: 'La planificación anticipada reduce la sobrecarga mental, previene olvidos y libera espacio mental para enfocarte en el presente.' },
  { id: 'meditacion4', label: 'Hacer un descanso sin pantallas cada hora — ¿Por qué es importante? ', importance: 'Darle un respiro a tu cerebro y a tu vista reduce la fatiga mental y visual. Estos microdescansos mejoran el rendimiento y la creatividad.' },
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
            <div className={cn("flex w-full mt-4", onPrev ? "justify-between" : "justify-end")}>
                {onPrev && <Button variant="outline" onClick={onPrev} type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>}
                <Button onClick={onNext} disabled={!selected}>Continuar <ArrowRight className="mr-2 h-4 w-4"/></Button>
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
    
    const notebookContent = [
      `**${content.title}**`,
      `Pregunta: Mi primer gesto al despertar | Respuesta: ${finalFirstGesture} (${durations.firstGesture} min)`,
      `Pregunta: Mi cuidado para el cuerpo | Respuesta: ${finalBodyCare} (${durations.bodyCare} min)`,
      `Pregunta: Mi preparación mental | Respuesta: ${finalMentalPrep} (${durations.mentalPrep} min)`,
    ].join('\n\n');

    addNotebookEntry({ title: 'Mi Plan Diario de Bienestar', content: notebookContent, pathId: pathId, userId: user?.id });
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
        { key: 'firstGesture', label: finalFirstGesture, duration: durations.firstGesture },
        { key: 'bodyCare', label: finalBodyCare, duration: durations.bodyCare },
        { key: 'mentalPrep', label: finalMentalPrep, duration: durations.mentalPrep }
    ].filter(h => h.label);

    switch(step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             <p className="text-sm text-muted-foreground">En el ejercicio anterior trazaste tu plan maestro para cuidar de ti durante todo el día. Ahora vamos a encender ese plan desde el primer instante de la mañana, para que empiece a funcionar con tu primera respiración.</p>
             <p className="text-sm text-muted-foreground">Tus primeras acciones al despertar marcan el tono de todo lo que viene después. Si empiezas acelerado o en piloto automático, el día puede arrastrarte. Si empiezas con calma, intención y energía positiva, tendrás más control y claridad para todo lo demás.</p>
             <p className="text-sm text-muted-foreground">En este ejercicio vas a diseñar una rutina inicial breve —aunque sea de pocos minutos— que te permita aterrizar en tu día con presencia y equilibrio.</p>
             <p className="text-xs text-muted-foreground">Tiempo estimado: 8-10 minutos para diseñarla. Hazlo una vez y revisa cuando sientas que tu mañana necesita un ajuste.</p>
            <Button onClick={nextStep}>Empezar</Button>
          </div>
        );
      case 1:
        return <HabitStep stepTitle="Paso 1: Microhábito físico" description="Vamos a empezar por tu cuerpo. Pequeños gestos físicos repetidos cada día pueden tener un gran impacto en tu bienestar. No se trata de hacer mucho, sino de acciones simples que activan tu cuerpo, regulan tu energía y mejoran tu estado de ánimo. En el siguiente desplegable verás ejemplos con su explicación, para que elijas el que más encaje contigo o pruebes varios hasta encontrar tus favoritos. También vas a poder escribir libremente otro gesto que quieras implementar. " options={firstGestureOptions} selected={firstGesture} setSelected={setFirstGesture} other={otherFirstGesture} setOther={setOtherFirstGesture} onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <HabitStep stepTitle="Paso 2: Microhábito emocional " description="Ahora piensa en algo pequeño que alimente tu mundo emocional. Puede ser conectar con alguien, darte un momento de calma o buscar una sensación agradable que te recargue por dentro. En el siguiente desplegable verás ejemplos con su explicación, para que elijas el que más encaje contigo o pruebes varios hasta encontrar tus favoritos. También podrás escribir otro gesto libremente. " options={bodyCareOptions} selected={bodyCare} setSelected={setBodyCare} other={otherBodyCare} setOther={setOtherBodyCare} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <HabitStep stepTitle="Paso 3: Microhábito mental" description="Ahora vamos a por tu mente: elige una práctica breve que te ayude a enfocarte, aprender o desconectar de la sobrecarga mental. En el siguiente desplegable verás ejemplos con su explicación, para que elijas el que más encaje contigo o pruebes varios hasta encontrar tus favoritos. También podrás escribir otro gesto libremente. " options={mentalPrepOptions} selected={mentalPrep} setSelected={setMentalPrep} other={otherMentalPrep} setOther={setOtherMentalPrep} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Decide el orden y la duración</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a ordenar tus tres gestos para que encajen en tu mañana sin prisa. No necesitas más de 10-15 minutos en total.</p>
                <div className="space-y-4">
                    {habits.map(item => (
                        <div key={item.key} className="p-3 border rounded-md bg-background flex items-center justify-between">
                            <span className="font-medium text-sm">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={item.duration} onChange={e => setDurations(p => ({...p, [item.key]: e.target.value}))} className="w-16 h-8 text-center" />
                                <span className="text-sm text-muted-foreground">min</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="mr-2 h-4 w-4"/></Button></div>
            </div>
        );
       case 5:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Cómo facilitarlo</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a decidir cómo te vas a recordar a ti mismo/a que es momento de hacer cada microhábito que elegiste. Piensa en lo que mejor funciona para ti: hay personas que responden bien a alarmas, otras a señales visuales, y otras a enlazarlo con una acción que ya hacen sin pensar.</p>
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
            <h4 className="font-semibold text-lg text-primary">Paso 6: Tu rutina de mañana amable</h4>
            <p className="text-sm text-muted-foreground">Aquí tienes tu rutina inicial para empezar el día con más equilibrio y presencia. Es breve, realista y pensada para que puedas mantenerla incluso en días ocupados.</p>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead>Microhábito</TableHead><TableHead>Duración</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {habits.map(h => (
                            <TableRow key={h.key}>
                                <TableCell>{h.label}</TableCell>
                                <TableCell>{h.duration} min</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-xs italic text-muted-foreground pt-2">Ya tienes tu kit personal de microhábitos: tres gestos sencillos, pero poderosos, que te acompañarán durante el día. Piensa en ellos como “semillas” que, al repetirlas, fortalecerán tu energía, tu ánimo y tu claridad mental. </p>
            <p className="text-xs italic text-muted-foreground pt-2">Incluso los días difíciles cuentan, porque cada intento es una señal a tu cerebro de que estás priorizando tu salud.<br /> Y recuerda: en el próximo ejercicio nos centraremos en uno de los momentos más decisivos para ponerlos en marcha… el primer instante al despertar. </p>
            <div className="flex justify-between w-full mt-2">
                <Button onClick={prevStep} variant="link" className="px-0">Atrás</Button>
                <Button onClick={handleSave}>
                    Guardar en mi plan diario
                </Button>
            </div>
        </div>
      );
      case 7:
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-semibold">"Cada mañana es una oportunidad para cuidarte, y tú acabas de darle a la tuya un nuevo sentido."</p>
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
        <CardDescription className="pt-2 whitespace-pre-line">
          {content.objective}
          {content.audioUrl && (
              <div className="mt-4">
                  <audio controls controlsList="nodownload" className="w-full">
                      <source src={content.audioUrl} type="audio/mp3" />
                      Tu navegador no soporta el elemento de audio.
                  </audio>
              </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

    
