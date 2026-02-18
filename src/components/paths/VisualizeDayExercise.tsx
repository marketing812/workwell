"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { VisualizeDayExerciseContent } from '@/data/paths/pathTypes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface VisualizeDayExerciseProps {
  content: VisualizeDayExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const activityOptions = ['Desayunar con calma', 'Caminar al aire libre', 'Escuchar música que me guste', 'Hacer ejercicio', 'Comer sano', 'Pasar tiempo con familia o amistades', 'Avanzar en un proyecto importante', 'Dedicar tiempo a un hobby', 'Meditar o practicar respiración consciente', 'Otro'];

const intentionOptions = ['Calma', 'Foco', 'Energía', 'Gratitud', 'Presencia', 'Amabilidad', 'Otro'];


export default function VisualizeDayExercise({ content, pathId, onComplete }: VisualizeDayExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState('');
  const [otherIntention, setOtherIntention] = useState('');
  const [idealDay, setIdealDay] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [otherActivity, setOtherActivity] = useState('');
  const [keyGesture, setKeyGesture] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>, otherSetter: React.Dispatch<React.SetStateAction<string>>, mainSetter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (value !== 'Otro') {
      mainSetter(prev => prev ? `${prev}\n- ${value}`.trim() : `- ${value}`);
      otherSetter(''); 
    } else {
      otherSetter('');
    }
  };

  const handleSave = () => {
    const finalIntention = intention === 'Otro' ? otherIntention : intention;
    if (!finalIntention || !idealDay || !keyGesture) {
      toast({ title: 'Campos Incompletos', description: 'Por favor, completa todos los pasos para guardar.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Intención para hoy:** ${finalIntention}
**Mi día ideal:** ${idealDay}
**Gesto clave:** ${keyGesture}
    `;
    addNotebookEntry({ title: 'Mi Visualización del Día', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Visualización Guardada', description: 'Tu visualización del día ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    setStep(4);
  };
  
  const resetExercise = () => {
    setStep(0);
    setIntention('');
    setOtherIntention('');
    setIdealDay('');
    setSelectedActivity('');
    setOtherActivity('');
    setKeyGesture('');
    setIsSaved(false);
  };

  const renderStep = () => {
    const finalIntention = intention === 'Otro' ? otherIntention : intention;

    switch(step) {
      case 0: // Intro
        return (
          <div className="text-center p-4 space-y-4">
            <p className="text-sm text-muted-foreground">La visualización es una herramienta muy utilizada en psicología y neurociencia porque activa en el cerebro las mismas redes que usamos al ejecutar una acción real. Con este ejercicio vas a diseñar mentalmente el día que quieres vivir.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="mr-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Paso 1: Intención
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu intención para hoy</h4>
            <p className="text-sm text-muted-foreground">¿Qué actitud o estado emocional quieres que te acompañe?</p>
            <div className="space-y-2">
                <Select onValueChange={setIntention} value={intention}>
                    <SelectTrigger><SelectValue placeholder="Elige una intención..."/></SelectTrigger>
                    <SelectContent>
                        {intentionOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {intention === 'Otro' && <Input value={otherIntention} onChange={e => setOtherIntention(e.target.value)} placeholder="Escribe otra intención..." className="mt-2" />}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">Atrás</Button>
              <Button onClick={nextStep} disabled={!finalIntention.trim()}>Continuar</Button>
            </div>
          </div>
        );
      case 2: // Paso 2: Día Ideal
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Visualiza tu día ideal</h4>
            <p className="text-sm text-muted-foreground">Imagina y escribe cómo transcurre tu día. Incluye acciones, sensaciones y personas o entornos.</p>
            <Textarea value={idealDay} onChange={e => setIdealDay(e.target.value)} placeholder="Ej: Desayuno tranquilo escuchando música, camino al trabajo disfrutando del aire fresco..." rows={5}/>
             <div className="space-y-2">
                <Label className="text-xs">O inspírate con esta lista:</Label>
                <Select onValueChange={(value) => handleSelectChange(setSelectedActivity, setOtherActivity, setIdealDay, value)} value={selectedActivity}>
                    <SelectTrigger><SelectValue placeholder="Selecciona una actividad para añadir..."/></SelectTrigger>
                    <SelectContent>
                        {activityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedActivity === 'Otro' && <Input value={otherActivity} onChange={e => {setOtherActivity(e.target.value); setIdealDay(p => p ? `${p}\n- ${e.target.value}`.trim() : `- ${e.target.value}`)}} placeholder="Escribe otra actividad" className="mt-2"/>}
            </div>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">Atrás</Button>
              <Button onClick={nextStep} disabled={!idealDay.trim()}>Continuar</Button>
            </div>
          </div>
        );
      case 3: // Paso 3: Gesto Clave
         return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Un gesto clave para mantener tu intención</h4>
            <p className="text-sm text-muted-foreground">Piensa en una acción sencilla que puedas repetir hoy para sostener el estado emocional que has elegido.</p>
            <Textarea value={keyGesture} onChange={e => setKeyGesture(e.target.value)} placeholder="Ej: Hacer 3 respiraciones profundas antes de una reunión."/>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">Atrás</Button>
              <Button onClick={handleSave} disabled={!keyGesture.trim()}>Guardar mi visualización</Button>
            </div>
          </div>
        );
      case 4: // Final summary
        return (
           <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
              <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
              <h4 className="font-semibold text-lg">Mi visualización para hoy</h4>
               <p className="text-sm text-muted-foreground">Aquí tienes tu visualización para revisarla cuando quieras:</p>
              <div className="text-left p-4 border rounded-md bg-background/50 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Intención para hoy:</p>
                    <p className="italic">“{finalIntention}”</p>
                  </div>
                  <div>
                    <p className="font-semibold">Mi día ideal:</p>
                    <p className="italic">“{idealDay}”</p>
                  </div>
                   <div>
                    <p className="font-semibold">Gesto clave:</p>
                    <p className="italic">“{keyGesture}”</p>
                  </div>
              </div>
              <p className="text-sm text-foreground pt-4">Recuerda… tu día no tiene que ser perfecto para que sea valioso. Cada vez que vuelvas a tu intención, estarás entrenando tu mente para vivirlo como lo deseas.</p>
              <p className="text-sm text-foreground pt-2">Si lo lees cada mañana, tu cerebro lo recordará más fácilmente durante el día.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                   <Button onClick={() => setStep(1)} variant="outline">Editar mi visualización</Button>
                   <Button onClick={resetExercise}>Finalizar ejercicio</Button>
              </div>
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
        <CardDescription className="pt-2">
          {content.objective}
          {content.audioUrl && (
              <div className="mt-4">
                  <audio controls controlsList="nodownload" className="w-full">
                      <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
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
