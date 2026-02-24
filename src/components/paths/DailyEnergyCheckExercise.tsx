
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, BatteryFull, BatteryMedium, BatteryLow, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DailyEnergyCheckExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';

interface DailyEnergyCheckExerciseProps {
  content: DailyEnergyCheckExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const rechargeOptions = [
    'Actividad física', 'Alimentación equilibrada', 'Sueño reparador',
    'Tiempo en la naturaleza', 'Conversación positiva', 'Tiempo a solas de calidad',
    'Escuchar música que me guste',
];

const drainOptions = [
    'Estrés laboral o académico', 'Discusiones o tensiones', 'Falta de descanso',
    'Uso excesivo de pantallas', 'Alimentación poco nutritiva', 'Sobrecarga de tareas',
    'Espacios ruidosos o caóticos',
];


export default function DailyEnergyCheckExercise({ content, pathId, onComplete }: DailyEnergyCheckExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [energyLevel, setEnergyLevel] = useState<'alta' | 'media' | 'baja' | ''>('');
  const [energyNuance, setEnergyNuance] = useState('');
  const [rechargedBy, setRechargedBy] = useState('');
  const [drainedBy, setDrainedBy] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const storageKey = `exercise-progress-${pathId}-dailyEnergyCheck`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setEnergyLevel(data.energyLevel || '');
        setEnergyNuance(data.energyNuance || '');
        setRechargedBy(data.rechargedBy || '');
        setDrainedBy(data.drainedBy || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, energyLevel, energyNuance, rechargedBy, drainedBy, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, energyLevel, energyNuance, rechargedBy, drainedBy, isSaved, storageKey, isClient]);


  const handleSave = () => {
    const notebookContent = [
      `**Ejercicio: ${content.title}**`,
      `Pregunta: Nivel de energía de hoy | Respuesta: ${energyLevel}${energyNuance ? ` (${energyNuance})` : ''}`,
      `Pregunta: Lo que me recargó hoy | Respuesta:\n${rechargedBy || 'No especificado.'}`,
      `Pregunta: Lo que me drenó hoy | Respuesta:\n${drainedBy || 'No especificado.'}`
    ].join('\n\n');

    addNotebookEntry({ title: 'Mi Balance de Energía Diario', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Registro Guardado', description: 'Tu registro de energía ha sido guardado.' });
    setIsSaved(true);
    onComplete();
    setStep(4);
  };
  
  const resetExercise = () => {
    setStep(0);
    setEnergyLevel('');
    setEnergyNuance('');
    setRechargedBy('');
    setDrainedBy('');
    setIsSaved(false);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
  const appendToList = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    if (value && value !== 'Otro') {
      setter(prev => prev ? `${prev}\n- ${value}`.trim() : `- ${value}`);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
            <div className="text-center p-4 space-y-4">
                 <p className="mb-4">Este ejercicio te ayudará a identificar qué actividades, personas y entornos recargan tu batería y cuáles la gastan más rápido.</p>
                <Button onClick={nextStep}>Empezar mi registro de energía</Button>
            </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Evalúa tu energía de hoy</h4>
             <p className="text-sm text-muted-foreground">Imagina que tu energía es como la batería de un móvil. ¿Cómo describirías tu energía al final del día?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Button variant="outline" onClick={() => setEnergyLevel('alta')} className={cn("h-auto p-4 flex-col gap-2", energyLevel === 'alta' && 'border-primary ring-2 ring-primary')}>
                    <BatteryFull className="h-8 w-8 text-green-500"/>
                    <span className="font-semibold">Alta</span>
                    <span className="text-xs text-muted-foreground font-normal">Me siento con fuerza, motivación y claridad.</span>
                </Button>
                <Button variant="outline" onClick={() => setEnergyLevel('media')} className={cn("h-auto p-4 flex-col gap-2", energyLevel === 'media' && 'border-primary ring-2 ring-primary')}>
                    <BatteryMedium className="h-8 w-8 text-amber-500"/>
                    <span className="font-semibold">Media</span>
                    <span className="text-xs text-muted-foreground font-normal">Puedo seguir, pero noto cansancio o dispersión.</span>
                </Button>
                <Button variant="outline" onClick={() => setEnergyLevel('baja')} className={cn("h-auto p-4 flex-col gap-2", energyLevel === 'baja' && 'border-primary ring-2 ring-primary')}>
                    <BatteryLow className="h-8 w-8 text-red-500"/>
                    <span className="font-semibold">Baja</span>
                    <span className="text-xs text-muted-foreground font-normal">Tengo poca energía, me cuesta concentrarme.</span>
                </Button>
            </div>
            <div className="space-y-2 pt-2">
                <Label htmlFor="energy-nuance">Si quieres, cuéntame un poco más sobre cómo te sientes (opcional)</Label>
                <Input id="energy-nuance" value={energyNuance} onChange={e => setEnergyNuance(e.target.value)} maxLength={200} />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!energyLevel}>Continuar</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Lo que me recargó hoy</h4>
            <p className="text-sm text-muted-foreground">Piensa en actividades, personas o momentos que te dieron energía física, emocional o mental.</p>
            <Textarea value={rechargedBy} onChange={e => setRechargedBy(e.target.value)} placeholder="Ej: Salir a caminar al sol, reír con un amigo, desayunar sin prisas..." rows={4}/>
            <div className="space-y-2">
                <Label className="text-xs">O elige de esta lista para inspirarte:</Label>
                <Select onValueChange={(value) => appendToList(setRechargedBy, value)}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un factor común..."/></SelectTrigger>
                    <SelectContent>
                        {rechargeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Continuar</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Lo que me drenó hoy</h4>
            <p className="text-sm text-muted-foreground">Identifica las cosas que te restaron energía o te dejaron con sensación de desgaste.</p>
            <Textarea value={drainedBy} onChange={e => setDrainedBy(e.target.value)} placeholder="Ej: Reunión tensa, dormir poco, pasar horas frente al ordenador..." rows={4}/>
             <div className="space-y-2">
                <Label className="text-xs">O elige de esta lista:</Label>
                <Select onValueChange={(value) => appendToList(setDrainedBy, value)}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un factor común..."/></SelectTrigger>
                    <SelectContent>
                        {drainOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave}>Guardar Balance</Button>
            </div>
          </div>
        );
      case 4:
        const rechargeCount = rechargedBy.split('\n').filter(Boolean).length;
        const drainCount = drainedBy.split('\n').filter(Boolean).length;
        const balanceMessage = rechargeCount > drainCount
          ? "¡Buen trabajo! Hoy has protegido tu energía. Mantén y repite lo que te ha funcionado."
          : "Hoy tu energía ha bajado, pero ya sabes qué la ha afectado. Mañana puedes probar a sumar más de lo que te recarga.";
        return (
           <div className="p-4 text-center space-y-4">
               <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
               <h4 className="font-semibold text-lg">Mi balance de energía de hoy</h4>
                <div className="text-left p-4 border rounded-md bg-background/50 space-y-3">
                    <div>
                        <h5 className="font-semibold text-green-600">Me recargó:</h5>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{rechargedBy || 'Sin definir'}</pre>
                    </div>
                     <div>
                        <h5 className="font-semibold text-red-600">Me drenó:</h5>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{drainedBy || 'Sin definir'}</pre>
                    </div>
                </div>
               <p className="text-sm italic text-primary">{balanceMessage}</p>
               <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <Button onClick={() => setStep(1)} variant="outline">Editar mi registro</Button>
                    <Button onClick={() => toast({ title: "Próximamente", description: "La función de recordatorios estará disponible pronto." })}>Programar recordatorio semanal</Button>
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
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
