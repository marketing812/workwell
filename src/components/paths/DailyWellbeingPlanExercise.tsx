"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, CalendarIcon, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyWellbeingPlanExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface DailyWellbeingPlanExerciseProps {
  content: DailyWellbeingPlanExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const physicalHabits = [
  { id: 'caminar', label: 'Caminar 15 minutos al día', importance: 'Caminar a diario no solo cuida tu salud física (mejora la circulación, fortalece el corazón y regula la presión arterial), sino que también activa la liberación de endorfinas y serotonina, neurotransmisores que elevan el estado de ánimo y reducen el estrés. Además, rompe la inercia de la pasividad: un gesto tan simple como ponerse en movimiento envía a tu cerebro el mensaje de que te estás cuidando activamente, lo que refuerza la motivación para otras acciones saludables.' },
  { id: 'agua', label: 'Beber un vaso grande de agua al despertar', importance: 'Durante la noche, tu cuerpo pierde líquidos y necesita rehidratarse para funcionar bien. Tomar agua nada más levantarte reactiva tu metabolismo, favorece la oxigenación cerebral y mejora la concentración desde las primeras horas. Según estudios de neurociencia, incluso una leve deshidratación puede afectar tu atención y estado de ánimo. Este sencillo hábito es una forma consciente de empezar el día cuidando de ti, sin esfuerzo extra.' },
  { id: 'estirar', label: 'Estirarte 2 minutos al levantarte', importance: 'Estirarte suavemente al iniciar el día activa la circulación, aumenta la movilidad y libera la tensión acumulada durante el sueño. Además, le envía señales al sistema nervioso de que es hora de “ponerse en marcha”, despertando cuerpo y mente. Es un ritual breve que conecta contigo desde el primer momento, ayudándote a iniciar el día con más presencia y energía.' },
  { id: 'sol', label: 'Tomar el sol 10 minutos', importance: 'La exposición moderada al sol estimula la producción de vitamina D, esencial para el sistema inmunitario y la salud ósea, y favorece la regulación del ritmo circadiano, lo que mejora el sueño. Además, la luz solar incrementa la liberación de serotonina, la hormona del bienestar, contribuyendo a un estado de ánimo más equilibrado. Es como darle a tu cuerpo una recarga natural de energía y buen humor.' },
  { id: 'fruta', label: 'Comer una fruta o verdura extra', importance: 'Aumentar la ingesta de frutas y verduras aporta vitaminas, minerales y fibra que estabilizan los niveles de energía y ayudan a regular el azúcar en sangre, evitando los bajones de ánimo que provocan algunos alimentos procesados. Además, sus antioxidantes protegen las células del estrés oxidativo. Es un microgesto que nutre tanto tu cuerpo como tu salud emocional.' },
  { id: 'ropa', label: 'Preparar la ropa de ejercicio la noche anterior', importance: 'Dejar lista tu ropa deportiva reduce la “fricción” para empezar a moverte: elimina una excusa y aumenta las probabilidades de que cumplas tu plan, incluso si la motivación está baja. Este hábito es un ejemplo de cómo pequeñas decisiones estratégicas facilitan cambios grandes en tu bienestar.' },
  { id: 'escaleras', label: 'Subir escaleras en vez de ascensor', importance: 'Optar por las escaleras incrementa tu gasto energético diario, fortalece piernas y corazón, y mejora la capacidad pulmonar. Más allá del beneficio físico, es un recordatorio constante de que cada elección suma en tu salud: no siempre hacen falta grandes esfuerzos para sentirte más fuerte y con más energía.' },
];

const emotionalHabits = [
  { id: 'gratitud', label: 'Escribir una frase de gratitud al final del día', importance: 'Practicar gratitud entrena tu cerebro para fijarse en lo positivo, lo que reduce la atención excesiva en lo negativo. Según investigaciones en psicología positiva (Emmons & McCullough, 2003), este hábito mejora el ánimo y la satisfacción vital. Además, escribirlo antes de dormir ayuda a cerrar el día con una sensación de calma y bienestar.' },
  { id: 'amabilidad', label: 'Decir algo amable a alguien', importance: 'Los actos de amabilidad liberan oxitocina y dopamina, hormonas vinculadas al bienestar y la conexión social. Este gesto no solo mejora el día de la otra persona, también refuerza tu autoestima y fortalece vínculos.' },
  { id: 'musica', label: 'Escuchar una canción que te inspire', importance: 'La música puede regular tus emociones de forma rápida y eficaz. Investigaciones en neurociencia han demostrado que escuchar canciones que te gustan activa el sistema de recompensa del cerebro, elevando el ánimo y reduciendo el estrés.' },
  { id: 'abrazo', label: 'Dar un abrazo (o autoabrazo consciente)', importance: 'Abrazar —o abrazarte— estimula la liberación de oxitocina, que genera calma y conexión. Un autoabrazo consciente, acompañado de respiración lenta, también reduce la activación del sistema nervioso simpático, ayudándote a relajarte.' },
  { id: 'vela', label: 'Encender una vela y respirar profundamente', importance: 'Este pequeño ritual combina estímulos sensoriales (luz suave, aroma) con respiración profunda, favoreciendo la relajación y reduciendo el ritmo cardíaco. Es un ancla que te ayuda a pasar del “modo estrés” al “modo calma”.' },
  { id: 'paisaje', label: 'Observar un paisaje, planta o cielo 5 minutos', importance: 'Mirar elementos naturales, aunque sea desde una ventana, tiene efectos restauradores en la atención y el estado de ánimo. Según la teoría de la restauración de la atención (Kaplan, 1995), este contacto con la naturaleza recarga la mente y reduce la fatiga mental.' },
  { id: 'foto', label: 'Colocar una foto que te motive en un lugar visible', importance: 'Ver una imagen que te conecta con algo valioso para ti (personas, lugares, metas) genera emociones positivas y te recuerda qué es importante, ayudando a mantener la motivación en tu día a día.' },
];

const mentalHabits = [
  { id: 'respiracion', label: 'Respiración consciente 5 minutos', importance: 'La respiración consciente reduce la activación del sistema de estrés y mejora la concentración. Practicarla unos minutos al día entrena tu mente para volver al presente y gestionar mejor la ansiedad.' },
  { id: 'leer', label: 'Leer una página de un libro', importance: 'La lectura estimula la mente, amplía el vocabulario y mejora la concentración. Incluso leer una sola página antes de dormir puede ayudarte a desconectar de las preocupaciones y relajar la mente.' },
  { id: 'anotar', label: 'Anotar una idea o aprendizaje del día', importance: 'Registrar tus ideas o aprendizajes fortalece la memoria, te ayuda a integrar lo aprendido y genera una sensación de progreso personal.' },
  { id: 'meditacion', label: 'Meditación guiada breve', importance: 'La meditación guiada entrena tu atención y regula el sistema nervioso. Incluso sesiones cortas (3-5 minutos) han demostrado reducir el estrés y aumentar la sensación de calma.' },
  { id: 'meta', label: 'Escribir una meta o intención diaria', importance: 'Poner por escrito una meta concreta orienta tu energía y tu atención hacia lo que de verdad importa, aumentando la probabilidad de cumplirlo.' },
  { id: 'planificar', label: 'Planificar 3 tareas clave para mañana', importance: 'La planificación anticipada reduce la sobrecarga mental, previene olvidos y libera espacio mental para enfocarte en el presente.' },
  { id: 'descanso-pantallas', label: 'Hacer un descanso sin pantallas cada hora', importance: 'Darle un respiro a tu cerebro y a tu vista reduce la fatiga mental y visual. Estos microdescansos mejoran el rendimiento y la creatividad.' },
];

const timeOptions = ['Al despertar', 'Antes o después de una comida', 'Antes de dormir', 'Al volver del trabajo/estudios', 'Otro'];
const reminderOptions = ['Poner una alarma en el móvil', 'Dejar una nota visible', 'Vincularlo a otra acción (ej. después de lavarme los dientes)', 'Aviso en la app', 'Otro'];

const HabitStep = ({ title, description, options, selected, setSelected, other, setOther, onNext, onPrev }: any) => {
    return (
        <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <RadioGroup value={selected} onValueChange={setSelected} className="space-y-1">
                <Accordion type="single" collapsible className="w-full">
                    {options.map((opt: any) => (
                        <AccordionItem value={opt.id} key={opt.id} className="border-b">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value={opt.label} id={opt.id} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                                        {opt.label}
                                    </Label>
                                </div>
                                <AccordionTrigger className="p-2 hover:no-underline [&>svg]:size-5">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </AccordionTrigger>
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
                <Button onClick={onNext} className={cn(!onPrev && "w-full")} disabled={!selected}>Continuar <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
        </div>
    );
};

const SchedulingStep = ({ title, description, habit, habitKey, schedule, setSchedule, otherSchedule, setOtherSchedule, options }: any) => {
  if (!habit) return null;
  return (
    <div className="space-y-3">
      {title && <h4 className="font-semibold text-lg">{title}</h4>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="p-3 border rounded-md bg-background">
        <p className="font-medium text-primary">{habit}</p>
        <RadioGroup value={schedule[habitKey]} onValueChange={v => setSchedule((p: any) => ({...p, [habitKey]: v}))} className="mt-2 space-y-1">
          {options.map((opt: string) => (
            <div key={opt} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`${habitKey}-${opt.replace(/\s+/g, '-')}`} />
              <Label htmlFor={`${habitKey}-${opt.replace(/\s+/g, '-')}`} className="font-normal">{opt}</Label>
            </div>
          ))}
        </RadioGroup>
        {schedule[habitKey] === 'Otro' && <Input value={otherSchedule[habitKey]} onChange={e => setOtherSchedule((p:any) => ({...p, [habitKey]: e.target.value}))} placeholder="Especifica..." className="mt-2 ml-6" />}
      </div>
    </div>
  );
};


export function DailyWellbeingPlanExercise({ content, pathId, onComplete }: DailyWellbeingPlanExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // States for selected habits
  const [firstGesture, setFirstGesture] = useState('');
  const [otherFirstGesture, setOtherFirstGesture] = useState('');
  const [bodyCare, setBodyCare] = useState('');
  const [otherBodyCare, setOtherBodyCare] = useState('');
  const [mentalPrep, setMentalPrep] = useState('');
  const [otherMentalPrep, setOtherMentalPrep] = useState('');
  
  // States for scheduling and reminders
  const [durations, setDurations] = useState({ firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
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
      const stateToSave = { step, firstGesture, otherFirstGesture, bodyCare, otherBodyCare, mentalPrep, otherMentalPrep, durations, facilitators, otherFacilitator, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, firstGesture, otherFirstGesture, bodyCare, otherBodyCare, mentalPrep, otherMentalPrep, durations, facilitators, otherFacilitator, isSaved, storageKey, isClient]);


  const finalFirstGesture = firstGesture === 'Otro' ? otherFirstGesture : firstGesture;
  const finalBodyCare = bodyCare === 'Otro' ? otherBodyCare : bodyCare;
  const finalMentalPrep = mentalPrep === 'Otro' ? otherMentalPrep : mentalPrep;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setFirstGesture(''); setOtherFirstGesture('');
    setBodyCare(''); setOtherBodyCare('');
    setMentalPrep(''); setOtherMentalPrep('');
    setDurations({ firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
    setFacilitators({}); setOtherFacilitator('');
    setIsSaved(false);
    localStorage.removeItem(storageKey);
  };

  const handleSave = () => {
    if (!finalFirstGesture || !finalBodyCare || !finalMentalPrep) {
      toast({ title: "Incompleto", description: "Por favor, elige un microhábito para cada área.", variant: 'destructive' });
      return;
    }

    const selectedFacilitators = facilitatorOptions.filter(opt => facilitators[opt.id]).map(opt => opt.label);
    if(facilitators['facilitator-other'] && otherFacilitator) selectedFacilitators.push(otherFacilitator);

    const notebookContent = `
**${content.title}**

*Mi primer gesto al despertar:* ${finalFirstGesture} (${durations.firstGesture} min)
*Mi cuidado para el cuerpo:* ${finalBodyCare} (${durations.bodyCare} min)
*Mi preparación mental:* ${finalMentalPrep} (${durations.mentalPrep} min)

*Cómo lo facilitaré:*
${selectedFacilitators.length > 0 ? selectedFacilitators.map(f => `- ${f}`).join('\n') : 'Sin facilitadores definidos.'}
    `;

    addNotebookEntry({ title: 'Mi Plan Diario de Bienestar', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Plan Guardado' });
    setIsSaved(true);
    onComplete();
    setStep(6);
  };

  if (!isClient) {
    return null;
  }

  const renderStepContent = () => {
    const selectedFacilitators = facilitatorOptions.filter(opt => facilitators[opt.id]).map(opt => opt.label);
    if(facilitators['facilitator-other'] && otherFacilitator) selectedFacilitators.push(otherFacilitator);

    switch(step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             <p className="mb-4">Hay días en los que sentimos que el tiempo se nos escapa y que nuestras rutinas se desordenan. La buena noticia es que no necesitas cambios drásticos para recuperar la sensación de control: basta con anclar tu día a tres gestos pequeños, pero estratégicos, que sostengan tu cuerpo, tus emociones y tu mente.</p>
            <Button onClick={nextStep}>Empezar mi plan de bienestar</Button>
          </div>
        );
      case 1:
        return <HabitStep stepTitle="Paso 1: Elige tu primer gesto al despertar" description="Lo que haces en los primeros minutos después de abrir los ojos marca el tono del resto del día. Vamos a elegir un gesto amable y consciente que te ayude a conectar contigo antes de sumergirte en las demandas externas." options={firstGestureOptions} selected={firstGesture} setSelected={setFirstGesture} other={otherFirstGesture} setOther={setOtherFirstGesture} onNext={nextStep} onPrev={undefined} />;
      case 2:
        return <HabitStep stepTitle="Paso 2: Añade un cuidado para tu cuerpo" description="Tu cuerpo es tu base para todo lo que harás después. Aquí vamos a elegir un gesto físico breve que te active sin agobio." options={bodyCareOptions} selected={bodyCare} setSelected={setBodyCare} other={otherBodyCare} setOther={setOtherBodyCare} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <HabitStep stepTitle="Paso 3: Prepara tu mente" description="Ahora vamos a por tu mente: elige una práctica breve que te ayude a enfocarte, aprender o desconectar." options={mentalPrepOptions} selected={mentalPrep} setSelected={setMentalPrep} other={otherMentalPrep} setOther={setOtherMentalPrep} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Decide el orden y la duración</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a ordenar tus tres gestos para que encajen en tu mañana sin prisa. No necesitas más de 10-15 minutos en total.</p>
                <div className="space-y-4">
                    {[
                        {label: finalFirstGesture, key: 'firstGesture'},
                        {label: finalBodyCare, key: 'bodyCare'},
                        {label: finalMentalPrep, key: 'mentalPrep'}
                    ].filter(item => item.label).map(item => (
                        <div key={item.key} className="p-3 border rounded-md bg-background flex items-center justify-between">
                            <span className="font-medium text-sm">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={durations[item.key as keyof typeof durations]} onChange={e => setDurations(p => ({...p, [item.key]: e.target.value}))} className="w-16 h-8 text-center" />
                                <span className="text-sm text-muted-foreground">min</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button></div>
            </div>
        );
       case 5:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Cómo facilitarlo</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a decidir cómo te vas a recordar a ti mismo/a que es momento de hacer cada microhábito que elegiste.</p>
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
                     <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar mi mañana amable</Button>
                 </div>
            </div>
        );
      case 6:
        return (
             <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Rutina Guardada</h4>
                <p className="text-muted-foreground">“Cada mañana es una oportunidad para cuidarte, y tú acabas de darle a la tuya un nuevo sentido.”</p>
                <div className="flex gap-2 justify-center">
                    <Button onClick={() => setStep(1)} variant="outline">Editar mi rutina</Button>
                    <Button onClick={resetExercise}>Finalizar ejercicio</Button>
                </div>
            </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2 whitespace-pre-line">
          Hay días en los que sentimos que el tiempo se nos escapa y que nuestras rutinas se desordenan. La buena noticia es que no necesitas cambios drásticos para recuperar la sensación de control: basta con anclar tu día a tres gestos pequeños, pero estratégicos, que sostengan tu cuerpo, tus emociones y tu mente.
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
