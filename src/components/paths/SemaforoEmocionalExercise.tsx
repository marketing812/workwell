"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, TrafficCone, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SemaforoEmocionalExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';

interface SemaforoEmocionalExerciseProps {
  content: SemaforoEmocionalExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function SemaforoEmocionalExercise({ content, pathId, onComplete }: SemaforoEmocionalExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [light, setLight] = useState<'verde' | 'ambar' | 'rojo' | ''>('');
  const [action, setAction] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    if (!action.trim()) {
        toast({
            title: "Acción requerida",
            description: "Por favor, escribe qué harás para cuidarte.",
            variant: "destructive",
        });
        return;
    }
    addNotebookEntry({ title: 'Registro de Semáforo Emocional', content: `Estado: ${light}. Acción de cuidado: ${action}`, pathId: pathId });
    toast({ title: 'Registro Guardado' });
    onComplete();
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: 
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">¿Cómo te sientes ahora?</h4>
            <p>Escanea tu cuerpo, tu mente y tus emociones. Selecciona en qué “luz” estás ahora:</p>
            <RadioGroup value={light} onValueChange={(v) => setLight(v as any)} className="flex flex-col sm:flex-row justify-around py-4 gap-4">
              {[
                {color: 'verde', label: 'Verde', description: 'Me siento en calma, presente y estable.'},
                {color: 'ambar', label: 'Ámbar', description: 'Empiezo a activarme, tengo tensión o pensamientos que se aceleran.'},
                {color: 'rojo', label: 'Rojo', description: 'Estoy muy activado/a. Siento ansiedad, rabia, bloqueo o impulso fuerte.'},
              ].map(({color, label, description}) => (
                <Label key={color} htmlFor={`light-${color}`} 
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all w-full sm:w-auto",
                    light === 'verde' && color === 'verde' ? 'border-green-500 bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' :
                    light === 'ambar' && color === 'ambar' ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-500' :
                    light === 'rojo' && color === 'rojo' ? 'border-red-500 bg-red-100 dark:bg-red-900/30 ring-2 ring-red-500' :
                    'border-border bg-background hover:bg-muted'
                  )}>
                  <RadioGroupItem value={color} id={`light-${color}`} className="sr-only" />
                  <span className={cn(
                    "font-bold",
                    color === 'verde' && 'text-green-700 dark:text-green-300',
                    color === 'ambar' && 'text-amber-700 dark:text-amber-300',
                    color === 'rojo' && 'text-red-700 dark:text-red-300'
                  )}>{label}</span>
                  <p className="text-xs text-muted-foreground text-center mt-1">{description}</p>
                </Label>
              ))}
            </RadioGroup>
            <Button onClick={nextStep} className="w-full" disabled={!light}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        let suggestions, title, placeholder;
        if(light === 'verde') { 
          title='🟢 Bienestar emocional presente'; 
          suggestions = 'Aprovecha para reforzar lo que te hace bien. Sugerencias:\n\nAgradece algo del día.\nRegálate un momento consciente (una respiración profunda, una mirada amable).\nAnota lo que has hecho hoy para sentirte así.';
          placeholder = '¿Qué quieres seguir cultivando hoy?';
        } else if(light === 'ambar') { 
          title='🟠 Activación emocional leve o moderada'; 
          suggestions = 'Estás empezando a salir de tu zona de calma. Este es el momento ideal para regularte antes de escalar. Sugerencias:\n\nHaz una respiración profunda y diafragmática.\nNombra lo que sientes sin juicio.\nConecta con los sentidos: ¿qué ves, qué oyes, qué tocas?';
          placeholder = '¿Qué harás ahora para ayudarte?';
        } else { // rojo
          title='🔴 Desborde o activación intensa'; 
          suggestions = 'Cuando estás muy activado/a, lo primero es contenerte con cuidado, sin exigencias. Sugerencias:\n\nAléjate del estímulo si puedes.\nUsa una técnica de grounding (contacto con un objeto frío, contar objetos de un color, etc.) o de relajación.\nEscribe lo que sientes sin censura.\nRespira con ritmo lento, sin forzarte.';
          placeholder = '¿Qué vas a hacer ahora para sostenerte?';
        }
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">{title}</h4>
            <p className="text-sm text-muted-foreground text-center whitespace-pre-line">{suggestions}</p>
            <Label htmlFor="action-textarea">Tu acción:</Label>
            <Textarea id="action-textarea" value={action} onChange={e => setAction(e.target.value)} placeholder={placeholder} />
            <div className="flex justify-between w-full mt-2">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={handleSave} className="w-auto" disabled={!action.trim()}><Save className="mr-2 h-4 w-4"/>Guardar</Button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        <CardDescription>
            <p className="pt-1 text-xs italic">
                (<span className="text-green-500 font-semibold">verde</span> = bienestar;{' '}
                <span className="text-amber-500 font-semibold">ámbar</span> = activación;{' '}
                <span className="text-red-500 font-semibold">rojo</span> = desborde) con estrategias de regulación en cada fase.
            </p>
            {content.objective && <p className="pt-2"><span className="font-bold">Objetivo terapéutico:</span> {content.objective}</p>}
            {content.duration && <p className="pt-1 text-sm text-muted-foreground"><span className="font-bold">Duración estimada:</span> {content.duration}</p>}
        </CardDescription>
        {content.audioUrl && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
