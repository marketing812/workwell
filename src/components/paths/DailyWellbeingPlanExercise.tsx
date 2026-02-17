
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyWellbeingPlanExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUser } from '@/contexts/UserContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

const physicalHabitOptions = [
  { id: 'caminar', label: 'Caminar 15 minutos al día', importance: 'Caminar a diario no solo cuida tu salud física (mejora la circulación, fortalece el corazón y regula la presión arterial), sino que también activa la liberación de endorfinas y serotonina, neurotransmisores que elevan el estado de ánimo y reducen el estrés. Además, rompe la inercia de la pasividad: un gesto tan simple como ponerse en movimiento envía a tu cerebro el mensaje de que te estás cuidando activamente, lo que refuerza la motivación para otras acciones saludables.' },
  { id: 'agua', label: 'Beber un vaso grande de agua al despertar', importance: 'Durante la noche, tu cuerpo pierde líquidos y necesita rehidratarse para funcionar bien. Tomar agua nada más levantarte reactiva tu metabolismo, favorece la oxigenación cerebral y mejora la concentración desde las primeras horas. Según estudios de neurociencia, incluso una leve deshidratación puede afectar tu atención y estado de ánimo. Este sencillo hábito es una forma consciente de empezar el día cuidando de ti, sin esfuerzo extra.' },
  { id: 'estirar', label: 'Estirarte 2 minutos al levantarte', importance: 'Estirarte suavemente al iniciar el día activa la circulación, aumenta la movilidad y libera la tensión acumulada durante el sueño. Además, le envía señales al sistema nervioso de que es hora de “ponerse en marcha”, despertando cuerpo y mente. Es un ritual breve que conecta contigo desde el primer momento, ayudándote a iniciar el día con más presencia y energía.' },
  { id: 'sol', label: 'Tomar el sol 10 minutos', importance: 'La exposición moderada al sol estimula la producción de vitamina D, esencial para el sistema inmunitario y la salud ósea, y favorece la regulación del ritmo circadiano, lo que mejora el sueño. Además, la luz solar incrementa la liberación de serotonina, la hormona del bienestar, contribuyendo a un estado de ánimo más equilibrado. Es como darle a tu cuerpo una recarga natural de energía y buen humor.' },
  { id: 'fruta', label: 'Comer una fruta o verdura extra', importance: 'Aumentar la ingesta de frutas y verduras aporta vitaminas, minerales y fibra que estabilizan los niveles de energía y ayudan a regular el azúcar en sangre, evitando los bajones de ánimo que provocan algunos alimentos procesados. Además, sus antioxidantes protegen las células del estrés oxidativo. Es un microgesto que nutre tanto tu cuerpo como tu salud emocional.' },
  { id: 'ropa', label: 'Preparar la ropa de ejercicio la noche anterior', importance: 'Dejar lista tu ropa deportiva reduce la “fricción” para empezar a moverte: elimina una excusa y aumenta las probabilidades de que cumplas tu plan, incluso si la motivación está baja. Este hábito es un ejemplo de cómo pequeñas decisiones estratégicas facilitan cambios grandes en tu bienestar.' },
  { id: 'escaleras', label: 'Subir escaleras en vez de ascensor', importance: 'Optar por las escaleras incrementa tu gasto energético diario, fortalece piernas y corazón, y mejora la capacidad pulmonar. Más allá del beneficio físico, es un recordatorio constante de que cada elección suma en tu salud: no siempre hacen falta grandes esfuerzos para sentirte más fuerte y con más energía.' },
];

const emotionalHabitOptions = [
  { id: 'gratitud', label: 'Escribir una frase de gratitud al final del día', importance: 'Practicar gratitud entrena tu cerebro para fijarse en lo positivo, lo que reduce la atención excesiva en lo negativo. Según investigaciones en psicología positiva (Emmons & McCullough, 2003), este hábito mejora el ánimo y la satisfacción vital. Además, escribirlo antes de dormir ayuda a cerrar el día con una sensación de calma y bienestar.' },
  { id: 'amabilidad', label: 'Decir algo amable a alguien', importance: 'Los actos de amabilidad liberan oxitocina y dopamina, hormonas vinculadas al bienestar y la conexión social. Este gesto no solo mejora el día de la otra persona, también refuerza tu autoestima y fortalece vínculos.' },
  { id: 'musica', label: 'Escuchar una canción que te inspire', importance: 'La música puede regular tus emociones de forma rápida y eficaz. Investigaciones en neurociencia han demostrado que escuchar canciones que te gustan activa el sistema de recompensa del cerebro, elevando el ánimo y reduciendo el estrés.' },
  { id: 'abrazo', label: 'Dar un abrazo (o autoabrazo consciente)', importance: 'Abrazar —o abrazarte— estimula la liberación de oxitocina, que genera calma y conexión. Un autoabrazo consciente, acompañado de respiración lenta, también reduce la activación del sistema nervioso simpático, ayudándote a relajarte.' },
  { id: 'vela', label: 'Encender una vela y respirar profundamente', importance: 'Este pequeño ritual combina estímulos sensoriales (luz suave, aroma) con respiración profunda, favoreciendo la relajación y reduciendo el ritmo cardíaco. Es un ancla que te ayuda a pasar del “modo estrés” al “modo calma”.' },
  { id: 'paisaje', label: 'Observar un paisaje, planta o cielo 5 minutos', importance: 'Mirar elementos naturales, aunque sea desde una ventana, tiene efectos restauradores en la atención y el estado de ánimo. Según la teoría de la restauración de la atención (Kaplan, 1995), este contacto con la naturaleza recarga la mente y reduce la fatiga mental.' },
  { id: 'foto', label: 'Colocar una foto que te motive en un lugar visible', importance: 'Ver una imagen que te conecta con algo valioso para ti (personas, lugares, metas) genera emociones positivas y te recuerda qué es importante, ayudando a mantener la motivación en tu día a día.' },
];

const mentalHabitOptions = [
  { id: 'respiracion', label: 'Respiración consciente 5 minutos', importance: 'La respiración consciente reduce la activación del sistema de estrés y mejora la concentración. Practicarla unos minutos al día entrena tu mente para volver al presente y gestionar mejor la ansiedad.' },
  { id: 'lectura', label: 'Leer una página de un libro', importance: 'La lectura estimula la mente, amplía el vocabulario y mejora la concentración. Incluso leer una sola página antes de dormir puede ayudarte a desconectar de las preocupaciones y relajar la mente.' },
  { id: 'aprendizaje', label: 'Anotar una idea o aprendizaje del día', importance: 'Registrar tus ideas o aprendizajes fortalece la memoria, te ayuda a integrar lo aprendido y genera una sensación de progreso personal.' },
  { id: 'meditacion', label: 'Meditación guiada breve', importance: 'La meditación guiada entrena tu atención y regula el sistema nervioso. Incluso sesiones cortas (3-5 minutos) han demostrado reducir el estrés y aumentar la sensación de calma.' },
  { id: 'intencion', label: 'Escribir una meta o intención diaria', importance: 'Poner por escrito una meta concreta orienta tu energía y tu atención hacia lo que de verdad importa, aumentando la probabilidad de cumplirlo.' },
  { id: 'planificar', label: 'Planificar 3 tareas clave para mañana', importance: 'La planificación anticipada reduce la sobrecarga mental, previene olvidos y libera espacio mental para enfocarte en el presente.' },
  { id: 'descanso', label: 'Hacer un descanso sin pantallas cada hora', importance: 'Darle un respiro a tu cerebro y a tu vista reduce la fatiga mental y visual. Estos microdescansos mejoran el rendimiento y la creatividad.' },
];

const momentOptions = ['Al despertar', 'Antes o después de una comida', 'Antes de dormir', 'Al volver del trabajo/estudios', 'Otro'];
const reminderOptions = ['Poner una alarma en el móvil', 'Dejar una nota visible', 'Vincularlo a otra acción (ej. después de lavarme los dientes)', 'Aviso en la app', 'Otro'];

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

  const [physicalHabit, setPhysicalHabit] = useState('');
  const [otherPhysicalHabit, setOtherPhysicalHabit] = useState('');
  const [emotionalHabit, setEmotionalHabit] = useState('');
  const [otherEmotionalHabit, setOtherEmotionalHabit] = useState('');
  const [mentalHabit, setMentalHabit] = useState('');
  const [otherMentalHabit, setOtherMentalHabit] = useState('');

  const [moments, setMoments] = useState<{ [key: string]: string }>({ physical: '', emotional: '', mental: '' });
  const [otherMoments, setOtherMoments] = useState<{ [key: string]: string }>({ physical: '', emotional: '', mental: '' });

  const [reminders, setReminders] = useState<{ [key: string]: string }>({ physical: '', emotional: '', mental: '' });
  const [otherReminders, setOtherReminders] = useState<{ [key: string]: string }>({ physical: '', emotional: '', mental: '' });
  
  const [remindersOn, setRemindersOn] = useState<{ [key: string]: boolean }>({ physical: true, emotional: true, mental: true });


  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const handleSave = () => {
    const finalPhysicalHabit = physicalHabit === 'Otro' ? otherPhysicalHabit : physicalHabit;
    const finalEmotionalHabit = emotionalHabit === 'Otro' ? otherEmotionalHabit : emotionalHabit;
    const finalMentalHabit = mentalHabit === 'Otro' ? otherMentalHabit : mentalHabit;

    if (!finalPhysicalHabit || !finalEmotionalHabit || !finalMentalHabit) {
      toast({ title: "Incompleto", description: "Por favor, elige un microhábito para cada área.", variant: 'destructive' });
      return;
    }
    
    const notebookContent = `
**${content.title}**

*Mi microhábito físico:* ${finalPhysicalHabit}
*Cuándo:* ${moments.physical === 'Otro' ? otherMoments.physical : moments.physical}
*Recordatorio:* ${reminders.physical === 'Otro' ? otherReminders.physical : reminders.physical} (${remindersOn.physical ? 'Activado' : 'Desactivado'})

*Mi microhábito emocional:* ${finalEmotionalHabit}
*Cuándo:* ${moments.emotional === 'Otro' ? otherMoments.emotional : moments.emotional}
*Recordatorio:* ${reminders.emotional === 'Otro' ? otherReminders.emotional : reminders.emotional} (${remindersOn.emotional ? 'Activado' : 'Desactivado'})

*Mi microhábito mental:* ${finalMentalHabit}
*Cuándo:* ${moments.mental === 'Otro' ? otherMoments.mental : moments.mental}
*Recordatorio:* ${reminders.mental === 'Otro' ? otherReminders.mental : reminders.mental} (${remindersOn.mental ? 'Activado' : 'Desactivado'})
`;

    addNotebookEntry({ title: 'Mi Plan Diario de Bienestar', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Plan Guardado' });
    setIsSaved(true);
    onComplete();
    setStep(6);
  };
  
  const HabitSelectorStep = ({ title, description, options, selected, setSelected, other, setOther }: any) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-primary">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <RadioGroup value={selected} onValueChange={setSelected} className="space-y-1">
        <Accordion type="single" collapsible className="w-full">
          {options.map((opt: any) => (
            <AccordionItem value={opt.id} key={opt.id}>
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
      <div className="flex items-center space-x-2 pt-2">
        <RadioGroup value={selected} onValueChange={setSelected}>
            <RadioGroupItem value="Otro" id="other-option" />
        </RadioGroup>
        <Label htmlFor="other-option" className="font-normal">Otro:</Label>
      </div>
      {selected === 'Otro' && <Textarea value={other} onChange={e => setOther(e.target.value)} placeholder="Describe tu hábito personalizado..." className="ml-8" />}
    </div>
  );

  const renderStep = () => {
    const habits = [
        { key: 'physical', label: 'Físico', value: physicalHabit === 'Otro' ? otherPhysicalHabit : physicalHabit },
        { key: 'emotional', label: 'Emocional', value: emotionalHabit === 'Otro' ? otherEmotionalHabit : emotionalHabit },
        { key: 'mental', label: 'Mental', value: mentalHabit === 'Otro' ? otherMentalHabit : mentalHabit },
    ].filter(h => h.value);

    switch(step) {
      case 0: return (
        <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">Hay días en los que sentimos que el tiempo se nos escapa y que nuestras rutinas se desordenan. La buena noticia es que no necesitas cambios drásticos para recuperar la sensación de control: basta con anclar tu día a tres gestos pequeños, pero estratégicos, que sostengan tu cuerpo, tus emociones y tu mente. Este ejercicio es tu “plan maestro de autocuidado”: vas a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles. Estos serán tus anclas: puntos fijos que mantendrán tu bienestar estable sin importar lo que pase fuera.</p>
            <Button onClick={nextStep}>Empezar</Button>
        </div>
      );
      case 1: return (
        <div className="p-4 space-y-4">
          <HabitSelectorStep title="Paso 1: Microhábito físico" description="Vamos a empezar por tu cuerpo. Pequeños gestos físicos repetidos cada día pueden tener un gran impacto en tu bienestar." options={physicalHabitOptions} selected={physicalHabit} setSelected={setPhysicalHabit} other={otherPhysicalHabit} setOther={setOtherPhysicalHabit} />
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={nextStep} disabled={!physicalHabit}>Siguiente <ArrowRight/></Button></div>
        </div>
      );
      case 2: return (
        <div className="p-4 space-y-4">
          <HabitSelectorStep title="Paso 2: Microhábito emocional" description="Ahora piensa en algo pequeño que alimente tu mundo emocional." options={emotionalHabitOptions} selected={emotionalHabit} setSelected={setEmotionalHabit} other={otherEmotionalHabit} setOther={setOtherEmotionalHabit} />
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={nextStep} disabled={!emotionalHabit}>Siguiente <ArrowRight/></Button></div>
        </div>
      );
      case 3: return (
        <div className="p-4 space-y-4">
          <HabitSelectorStep title="Paso 3: Microhábito mental" description="Ahora vamos a por tu mente: elige una práctica breve que te ayude a enfocarte, aprender o desconectar." options={mentalHabitOptions} selected={mentalHabit} setSelected={setMentalHabit} other={otherMentalHabit} setOther={setOtherMentalHabit} />
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={nextStep} disabled={!mentalHabit}>Siguiente <ArrowRight/></Button></div>
        </div>
      );
      case 4: return (
        <div className="p-4 space-y-4">
          <h4 className="font-semibold text-lg">Paso 4: ¿Cuándo lo harás?</h4>
          <p className="text-sm text-muted-foreground">Cuanto más los vincules a un momento concreto, más fácil será que se conviertan en parte natural de tu día.</p>
          {habits.map(habit => (
            <div key={habit.key} className="space-y-2">
                <Label>{habit.value}</Label>
                <Select onValueChange={(v) => setMoments(p => ({...p, [habit.key]: v}))} value={moments[habit.key]}>
                    <SelectTrigger><SelectValue placeholder="Elige un momento..."/></SelectTrigger>
                    <SelectContent>{momentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
                {moments[habit.key] === 'Otro' && <Input value={otherMoments[habit.key]} onChange={e => setOtherMoments(p => ({...p, [habit.key]: e.target.value}))} placeholder="Describe el otro momento..." />}
            </div>
          ))}
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight/></Button></div>
        </div>
      );
      case 5: return (
        <div className="p-4 space-y-4">
          <h4 className="font-semibold text-lg">Paso 5: ¿Cómo recordarlo?</h4>
          <p className="text-sm text-muted-foreground">Decide cómo te vas a recordar que es momento de hacer cada microhábito.</p>
          {habits.map(habit => (
            <div key={habit.key} className="space-y-2">
                <Label>{habit.value}</Label>
                <Select onValueChange={(v) => setReminders(p => ({...p, [habit.key]: v}))} value={reminders[habit.key]}>
                    <SelectTrigger><SelectValue placeholder="Elige un recordatorio..."/></SelectTrigger>
                    <SelectContent>{reminderOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
                {reminders[habit.key] === 'Otro' && <Input value={otherReminders[habit.key]} onChange={e => setOtherReminders(p => ({...p, [habit.key]: e.target.value}))} placeholder="Describe otro recordatorio..." />}
            </div>
          ))}
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight/></Button></div>
        </div>
      );
      case 6: return (
        <div className="p-4 space-y-4">
          <h4 className="font-semibold text-lg text-center">Paso 6: Tu plan de microhábitos</h4>
          <p className="text-sm text-muted-foreground">Aquí tienes tu plan personalizado. Has elegido qué hacer y cuándo hacerlo.</p>
          <Table>
            <TableHeader><TableRow><TableHead>Microhábito</TableHead><TableHead>Momento</TableHead><TableHead className="text-right">Recordatorio</TableHead></TableRow></TableHeader>
            <TableBody>
              {habits.map(h => (
                <TableRow key={h.key}>
                    <TableCell>{h.value}</TableCell>
                    <TableCell>{moments[h.key] === 'Otro' ? otherMoments[h.key] : moments[h.key]}</TableCell>
                    <TableCell className="text-right"><Switch checked={remindersOn[h.key]} onCheckedChange={(c) => setRemindersOn(p => ({...p, [h.key]: c}))} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs italic text-muted-foreground pt-2">Ya tienes tu kit personal: tres gestos sencillos pero poderosos. Recuerda: en el próximo ejercicio nos centraremos en el primer instante al despertar.</p>
          <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft/> Atrás</Button><Button onClick={handleSave}><Save className="mr-2"/> Guardar mi plan diario</Button></div>
        </div>
      );
      case 7: return (
        <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Plan Guardado</h4>
            <p className="italic text-muted-foreground">“Las grandes transformaciones empiezan con pasos pequeños, repetidos con cariño y constancia.”</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2">{content.objective}</CardDescription>
        <p className="text-sm pt-1">Duración estimada: {content.duration}</p>
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
