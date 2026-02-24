
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, TrafficCone, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MentalNoiseTrafficLightExerciseContent } from '@/data/paths/pathTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/contexts/UserContext';

interface MentalNoiseTrafficLightExerciseProps {
  content: MentalNoiseTrafficLightExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const redOptions = ['Antes de dormir', 'Tras una discusión', 'Al empezar la semana', 'Durante atascos de trabajo'];
const amberOptions = ['Antes de una reunión', 'Durante la jornada laboral', 'En conversaciones difíciles', 'Al final del día con tareas pendientes'];
const greenOptions = ['Al caminar', 'Al desayunar en calma', 'Después de hacer ejercicio', 'En actividades creativas'];
const gestureOptions = ['Respirar hondo 3 veces', 'Hacer una mini-pausa física', 'Enviar un mensaje a alguien cercano', 'Escribir en mi cuaderno una gratitud'];

export default function MentalNoiseTrafficLightExercise({ content, pathId, onComplete }: MentalNoiseTrafficLightExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [redZone, setRedZone] = useState('');
  const [otherRed, setOtherRed] = useState('');
  const [amberZone, setAmberZone] = useState('');
  const [otherAmber, setOtherAmber] = useState('');
  const [greenZone, setGreenZone] = useState('');
  const [otherGreen, setOtherGreen] = useState('');
  const [greenGesture, setGreenGesture] = useState('');
  const [otherGesture, setOtherGesture] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setRedZone('');
    setOtherRed('');
    setAmberZone('');
    setOtherAmber('');
    setGreenZone('');
    setOtherGreen('');
    setGreenGesture('');
    setOtherGesture('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    
    const formatZone = (radioSelection: string, otherText: string) => {
        if (radioSelection && otherText.trim()) {
            return `${radioSelection} (Detalles: ${otherText.trim()})`;
        }
        return radioSelection || otherText.trim() || 'No especificado.';
    };

    const finalRed = formatZone(redZone, otherRed);
    const finalAmber = formatZone(amberZone, otherAmber);
    const finalGreen = formatZone(greenZone, otherGreen);
    const finalGesture = greenGesture === 'Otro' ? otherGesture : (greenGesture || 'No especificado.');

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: ¿Cuándo sientes más saturación mental o emocional? (Zona Roja) | Respuesta: ${finalRed}

Pregunta: ¿Cuándo notas que la tensión va subiendo? (Zona Ámbar) | Respuesta: ${finalAmber}

Pregunta: ¿En qué momentos sientes más calma y conexión contigo? (Zona Verde) | Respuesta: ${finalGreen}

Pregunta: Tu gesto de protección (para momentos verdes) | Respuesta: ${finalGesture}
    `;
    addNotebookEntry({ title: `Mi Semáforo del Ruido Mental`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu semáforo ha sido guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>Tu mente a veces es como una calle llena de tráfico: hay momentos de atasco, momentos de tensión creciente y también momentos de calma. Este ejercicio te ayudará a reconocerlos y a entrenar tu capacidad de detenerte cuando más lo necesites.</p>
            <Button onClick={nextStep}>Empezar práctica <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-red-600 flex items-center gap-2"><TrafficCone/>Zona Roja: Saturación</h4>
            <Label>¿Cuándo sientes más saturación mental o emocional?</Label>
            <RadioGroup value={redZone} onValueChange={setRedZone}>
                {redOptions.map(opt => <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`red-${opt}`} /><Label htmlFor={`red-${opt}`} className="font-normal">{opt}</Label></div>)}
            </RadioGroup>
            <Textarea value={otherRed} onChange={e => setOtherRed(e.target.value)} placeholder="Describe tu momento rojo aquí..." />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
       case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-amber-600 flex items-center gap-2"><TrafficCone/>Zona Ámbar: Tensión creciente</h4>
            <Label>¿Cuándo notas que la tensión va subiendo?</Label>
             <RadioGroup value={amberZone} onValueChange={setAmberZone}>
                {amberOptions.map(opt => <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`amber-${opt}`} /><Label htmlFor={`amber-${opt}`} className="font-normal">{opt}</Label></div>)}
            </RadioGroup>
            <Textarea value={otherAmber} onChange={e => setOtherAmber(e.target.value)} placeholder="Describe tu momento ámbar aquí..." />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-green-600 flex items-center gap-2"><TrafficCone/>Zona Verde: Claridad y presencia</h4>
            <Label>¿En qué momentos sientes más calma y conexión contigo?</Label>
            <RadioGroup value={greenZone} onValueChange={setGreenZone}>
                {greenOptions.map(opt => <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`green-${opt}`} /><Label htmlFor={`green-${opt}`} className="font-normal">{opt}</Label></div>)}
            </RadioGroup>
            <Textarea value={otherGreen} onChange={e => setOtherGreen(e.target.value)} placeholder="Describe tu momento verde aquí..." />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Tu gesto de protección</h4>
            <Label>Elige un gesto pequeño para proteger o ampliar los momentos verdes:</Label>
             <RadioGroup value={greenGesture} onValueChange={setGreenGesture}>
                {gestureOptions.map(opt => <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`gesture-${opt}`} /><Label htmlFor={`gesture-${opt}`} className="font-normal">{opt}</Label></div>)}
                <div className="flex items-center space-x-2"><RadioGroupItem value="Otro" id="gesture-other" /><Label htmlFor="gesture-other" className="font-normal">Otro:</Label></div>
            </RadioGroup>
            {greenGesture === 'Otro' && <Textarea value={otherGesture} onChange={e => setOtherGesture(e.target.value)} />}
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                {!isSaved ? (
                <Button type="submit" className="w-auto"><Save className="mr-2 h-4 w-4"/>Guardar mi semáforo</Button>
                ) : (
                <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Guardado.</p>
                </div>
                )}
            </div>
          </form>
        );
      case 5:
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <CheckCircle className="h-10 w-10 text-primary mx-auto" />
            <h4 className="font-semibold text-lg">Tu Semáforo Personal</h4>
            <p className="text-sm text-muted-foreground">Ya tienes tu semáforo personal: rojo para detectar saturación, amarillo para anticipar tensión y verde para reconocer tus momentos de calma. Cada vez que lo consultes, recuerda que no necesitas eliminar el ruido mental, sino aprender a escucharlo como señal para volver a ti.</p>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={resetExercise} variant="outline">Hacer otro registro</Button>
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
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
