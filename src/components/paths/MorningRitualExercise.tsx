"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MorningRitualExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';

interface MorningRitualExerciseProps {
  content: MorningRitualExerciseContent;
  pathId: string;
  onComplete: () => void;
}

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
    { id: 'facilitator-agua', label: 'Dejar preparado el vaso de agua o la tetera la noche anterior.' },
    { id: 'facilitator-alarma', label: 'Poner el despertador 5 minutos antes.' },
    { id: 'facilitator-ropa', label: 'Dejar ropa cómoda o deportiva lista.' },
    { id: 'facilitator-libreta', label: 'Tener a mano tu libreta o lista de intenciones.' },
    { id: 'facilitator-movil', label: 'Guardar el móvil en otro lugar para evitar distracciones al despertar.' },
];


const HabitStep = ({ stepTitle, description, options, selected, setSelected, other, setOther, onNext }: any) => {
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
            <Button onClick={onNext} className="w-full mt-4" disabled={!selected}>Continuar <ArrowRight className="ml-2 h-4 w-4"/></Button>
        </div>
    );
};


export function MorningRitualExercise({ content, pathId, onComplete }: MorningRitualExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  // Step 1
  const [firstGesture, setFirstGesture] = useState('');
  const [otherFirstGesture, setOtherFirstGesture] = useState('');
  // Step 2
  const [bodyCare, setBodyCare] = useState('');
  const [otherBodyCare, setOtherBodyCare] = useState('');
  // Step 3
  const [mentalPrep, setMentalPrep] = useState('');
  const [otherMentalPrep, setOtherMentalPrep] = useState('');
  // Step 4
  const [durations, setDurations] = useState({ firstGesture: '1', bodyCare: '3', mentalPrep: '5' });
  // Step 5
  const [facilitators, setFacilitators] = useState<Record<string, boolean>>({});
  const [otherFacilitator, setOtherFacilitator] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);

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
  };
  
  const handleSave = () => {
    const finalFirstGesture = firstGesture === 'Otro' ? otherFirstGesture : firstGesture;
    const finalBodyCare = bodyCare === 'Otro' ? otherBodyCare : bodyCare;
    const finalMentalPrep = mentalPrep === 'Otro' ? otherMentalPrep : mentalPrep;
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
    addNotebookEntry({ title: 'Mi Ritual de Mañana Amable', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ritual Guardado' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    const finalFirstGesture = firstGesture === 'Otro' ? otherFirstGesture : firstGesture;
    const finalBodyCare = bodyCare === 'Otro' ? otherBodyCare : bodyCare;
    const finalMentalPrep = mentalPrep === 'Otro' ? otherMentalPrep : mentalPrep;
    const selectedFacilitators = facilitatorOptions.filter(opt => facilitators[opt.id]).map(opt => opt.label);
    if(facilitators['facilitator-other'] && otherFacilitator) selectedFacilitators.push(otherFacilitator);

    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Este ejercicio es tu “plan maestro de autocuidado”: vas a elegir un microhábito físico, uno emocional y uno mental que puedas mantener incluso en días ocupados o difíciles. Estos serán tus anclas: puntos fijos que mantendrán tu bienestar estable sin importar lo que pase fuera.</p>
            <p className="text-xs text-muted-foreground">Tiempo estimado: 6-8 minutos. Hazlo al inicio de la semana y repite siempre que sientas que has perdido tus rutinas.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        );
      case 1:
        return <HabitStep stepTitle="Paso 1: Elige tu primer gesto al despertar" description="Lo que haces en los primeros minutos después de abrir los ojos marca el tono del resto del día. Vamos a elegir un gesto amable y consciente que te ayude a conectar contigo antes de sumergirte en las demandas externas." options={firstGestureOptions} selected={firstGesture} setSelected={setFirstGesture} other={otherFirstGesture} setOther={setOtherFirstGesture} onNext={nextStep} />;
      case 2:
        return <HabitStep stepTitle="Paso 2: Añade un cuidado para tu cuerpo" description="Tu cuerpo es tu base para todo lo que harás después. Aquí vamos a elegir un gesto físico breve que te active sin agobio." options={bodyCareOptions} selected={bodyCare} setSelected={setBodyCare} other={otherBodyCare} setOther={setOtherBodyCare} onNext={nextStep} />;
      case 3:
        return <HabitStep stepTitle="Paso 3: Prepara tu mente" description="Ahora vamos a por tu mente: elige una práctica breve que te ayude a enfocarte, aprender o desconectar." options={mentalPrepOptions} selected={mentalPrep} setSelected={setMentalPrep} other={otherMentalPrep} setOther={setOtherMentalPrep} onNext={nextStep} />;
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
                    ].map(item => (
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
                        <Checkbox id={opt.id} checked={!!facilitators[opt.id]} onCheckedChange={c => setFacilitators(p => ({...p, [opt.id]: !!c}))} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                 <div className="flex items-center space-x-2">
                    <Checkbox id="facilitator-other" checked={!!facilitators['facilitator-other']} onCheckedChange={c => setFacilitators(p => ({...p, ['facilitator-other']: !!c}))} />
                    <Label htmlFor="facilitator-other" className="font-normal">Otro:</Label>
                </div>
                {facilitators['facilitator-other'] && <Textarea value={otherFacilitator} onChange={e => setOtherFacilitator(e.target.value)} placeholder="Describe tu facilitador" className="ml-6"/>}
                </div>
                 <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button></div>
            </div>
        );
      case 6:
        return (
             <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Tu rutina de mañana amable</h4>
                <p className="text-sm text-muted-foreground">Aquí tienes tu rutina inicial para empezar el día con más equilibrio y presencia. Es breve, realista y pensada para que puedas mantenerla incluso en días ocupados.</p>
                 <div className="text-left border p-4 rounded-md bg-background space-y-2">
                    <p><strong>Gesto 1:</strong> {finalFirstGesture} ({durations.firstGesture} min)</p>
                    <p><strong>Gesto 2:</strong> {finalBodyCare} ({durations.bodyCare} min)</p>
                    <p><strong>Gesto 3:</strong> {finalMentalPrep} ({durations.mentalPrep} min)</p>
                    <p><strong>Facilitadores:</strong> {selectedFacilitators.join(', ') || 'Ninguno'}</p>
                 </div>
                 <p className="text-xs italic text-muted-foreground">Si un día no puedes hacerlos todos, haz al menos el primero: será suficiente para recordarte que tú decides cómo empezar.</p>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi mañana amable</Button>
            </div>
        );
      case 7:
        return (
             <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Rutina Guardada</h4>
                <p className="text-muted-foreground">“Cada mañana es una oportunidad para cuidarte, y tú acabas de darle a la tuya un nuevo sentido.”</p>
                <div className="flex gap-2 justify-center">
                    <Button onClick={() => setStep(6)} variant="outline">Editar mi rutina</Button>
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
