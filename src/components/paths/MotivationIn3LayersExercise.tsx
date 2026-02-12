"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MotivationIn3LayersExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';


interface MotivationIn3LayersExerciseProps {
  content: MotivationIn3LayersExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const valueOptions = [
    { id: 'salud', label: 'Salud' },
    { id: 'bienestar', label: 'Bienestar emocional' },
    { id: 'familia', label: 'Familia' },
    { id: 'amistad', label: 'Amistad' },
    { id: 'autocuidado', label: 'Autocuidado' },
    { id: 'libertad', label: 'Libertad' },
    { id: 'seguridad', label: 'Seguridad' },
    { id: 'aprendizaje', label: 'Aprendizaje' },
    { id: 'crecimiento', label: 'Crecimiento personal' },
    { id: 'responsabilidad', label: 'Responsabilidad' },
    { id: 'respeto', label: 'Respeto' },
    { id: 'contribucion', label: 'Contribución / ayudar a otros' },
];

export default function MotivationIn3LayersExercise({ content, pathId, onComplete }: MotivationIn3LayersExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [action, setAction] = useState('');
  const [valueReason, setValueReason] = useState('');
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
  const [otherValue, setOtherValue] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const storageKey = `exercise-progress-${pathId}-motivation3layers`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setAction(data.action || '');
        setValueReason(data.valueReason || '');
        setSelectedValues(data.selectedValues || {});
        setOtherValue(data.otherValue || '');
        setPurpose(data.purpose || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, action, valueReason, selectedValues, otherValue, purpose, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, action, valueReason, selectedValues, otherValue, purpose, isSaved, storageKey, isClient]);


  const handleValueChange = (id: string, checked: boolean) => {
    setSelectedValues(prev => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    const finalSelectedValues = valueOptions.filter(opt => selectedValues[opt.id]).map(opt => opt.label);
    if (selectedValues['otro'] && otherValue) {
        finalSelectedValues.push(otherValue);
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Acción concreta:**
${action || 'No especificada.'}

**Valor personal:**
${valueReason || 'No especificado.'}
(Valores asociados: ${finalSelectedValues.length > 0 ? finalSelectedValues.join(', ') : 'Ninguno'})

**Sentido mayor:**
${purpose || 'No especificado.'}
    `;
    addNotebookEntry({ title: 'Mi Motivación en 3 Capas', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Motivación Guardada', description: 'Tu motivación en 3 capas ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    setStep(4);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setAction('');
    setValueReason('');
    setSelectedValues({});
    setOtherValue('');
    setPurpose('');
    setIsSaved(false);
    localStorage.removeItem(storageKey);
  };
  
  if (!isClient) {
    return null;
  }

  const renderStep = () => {
    const finalSelectedValues = valueOptions.filter(opt => selectedValues[opt.id]).map(opt => opt.label);
    if (selectedValues['otro'] && otherValue) finalSelectedValues.push(otherValue);

    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Hay días en los que cuesta arrancar, y otros en los que ni siquiera sabemos por qué deberíamos hacerlo. Pero cuando conectas una tarea con lo que de verdad te importa, la energía cambia.</p>
            <p className="text-xs text-muted-foreground">Tiempo estimado: 7 minutos. Te recomiendo hacerlo 3 o 4 veces esta semana, o siempre que sientas que te falta impulso para empezar.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="mr-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1: Acción concreta
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1 — Acción concreta</h4>
            <p className="text-sm text-muted-foreground">Vamos a empezar por lo más simple: ¿qué es exactamente lo que vas a hacer hoy? No lo pienses demasiado, céntrate en algo concreto y posible.</p>
            <Label htmlFor="action">Escribe una acción específica que quieras realizar.</Label>
            <Textarea id="action" value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: “Llamar a mi amiga Marta”, “Caminar 15 minutos”, “Enviar ese email pendiente”." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!action.trim()}>Continuar</Button>
            </div>
          </div>
        );
      case 2: // Step 2: Valor personal
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2 — Valor personal</h4>
            <p className="text-sm text-muted-foreground">Ahora vamos a darle más fuerza a tu acción. Escríbeme por qué es importante para ti realizarla y después elige el valor o valores que hay detrás. Esto te ayudará a conectar tu acción con algo más profundo y motivador.</p>
            <div className="space-y-2">
              <Label htmlFor="value-reason">Razón de la importancia:</Label>
              <Textarea id="value-reason" value={valueReason} onChange={e => setValueReason(e.target.value)} placeholder="Ej: “Porque valoro cuidar mis relaciones”, “Porque quiero mantenerme activo o activa para mi salud”." />
            </div>
            <div className="space-y-2">
              <Label>Valores asociados:</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {valueOptions.map(opt => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox id={opt.id} checked={!!selectedValues[opt.id]} onCheckedChange={(checked) => handleValueChange(opt.id, !!checked)} />
                    <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                  </div>
                ))}
                 <div className="flex items-center space-x-2">
                    <Checkbox id="otro" checked={!!selectedValues['otro']} onCheckedChange={(checked) => handleValueChange('otro', !!checked)} />
                    <Label htmlFor="otro" className="font-normal">Otro:</Label>
                  </div>
              </div>
              {selectedValues['otro'] && <Input value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Escribe otro valor..." className="mt-2" />}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!valueReason.trim()}>Continuar</Button>
            </div>
          </div>
        );
      case 3: // Step 3: Sentido mayor
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3 — Sentido mayor</h4>
            <p className="text-sm text-muted-foreground">Por último, conecta esa acción con la vida que quieres construir. Aquí no hablamos solo de hoy, sino de la dirección en la que quieres avanzar.</p>
            <Label htmlFor="purpose">Describe cómo esta acción encaja en tu proyecto de vida o en lo que te gustaría sentir a largo plazo.</Label>
            <Textarea id="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Ej: “Quiero tener energía para jugar con mis hijos”, “Quiero sentirme más libre y tranquila con mis finanzas”." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={handleSave} disabled={!purpose.trim()}>Guardar mi motivación en 3 capas</Button>
            </div>
          </div>
        );
      case 4: // Final summary
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
            <h4 className="font-semibold text-lg">Mi motivación en 3 capas</h4>
            <p className="text-sm text-muted-foreground">Acabas de construir un puente entre lo que haces hoy y la persona que quieres ser. Ese puente es tu motor.</p>
            <div className="text-left p-4 border rounded-md bg-background/50 space-y-3">
              <p><strong>Acción concreta:</strong><br/>{action}</p>
              <p><strong>Valor personal:</strong><br/>{valueReason} <em>({finalSelectedValues.join(', ')})</em></p>
              <p><strong>Sentido mayor:</strong><br/>{purpose}</p>
            </div>
            <p className="text-xs italic text-muted-foreground pt-2">"Cada vez que sientas que te faltan ganas, vuelve aquí y recuerda por qué empezaste."</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                   <Button onClick={() => setStep(1)} variant="outline">Editar mi motivación</Button>
                   <Button onClick={() => toast({title: "Próximamente", description: "La función de recordatorios estará disponible pronto."})}>Programar recordatorio</Button>
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
    