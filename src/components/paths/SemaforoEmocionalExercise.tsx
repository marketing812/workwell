
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight, AlertTriangle, XCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SemaforoEmocionalExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface SemaforoEmocionalExerciseProps {
  content: SemaforoEmocionalExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function SemaforoEmocionalExercise({ content, pathId, onComplete }: SemaforoEmocionalExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [step, setStep] = useState(0);
  const [light, setLight] = useState<'verde' | 'ambar' | 'rojo' | ''>('');
  const [action, setAction] = useState('');
  const [learning, setLearning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setLight('');
    setAction('');
    setLearning('');
    setIsSaved(false);
  }

  const handleSave = () => {
    if (!action.trim()) {
        toast({
            title: "Acción requerida",
            description: "Por favor, escribe qué harás para cuidarte.",
            variant: "destructive",
        });
        return;
    }
    const notebookContent = `
**${content.title}**

Pregunta: ¿Cómo te sientes ahora? | Respuesta: ${light}
Pregunta: Tu acción de cuidado elegida | Respuesta: ${action}
Pregunta: Reflexión y aprendizaje (opcional) | Respuesta: ${learning || 'Sin reflexión.'}
`;

    addNotebookEntry({ title: 'Registro de Semáforo Emocional', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Registro Guardado' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Este ejercicio te ayudará a parar antes de que la emoción tome el control. Vas a entrenar la capacidad de saber en qué punto estás y, lo más importante, vas a elegir cómo cuidarte en cada momento.</p>
            <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: ¿Cómo te sientes ahora?</h4>
            <p className="text-muted-foreground text-sm">Escanea tu cuerpo, tu mente y tus emociones. Selecciona en qué “luz” estás ahora:</p>
            <RadioGroup value={light} onValueChange={(v) => setLight(v as any)} className="flex flex-col sm:flex-row justify-around py-4 gap-4">
              {[
                {color: 'verde', label: 'Verde', description: 'Me siento en calma, presente y estable.', icon: CheckCircle, iconClass: 'text-green-500'},
                {color: 'ambar', label: 'Ámbar', description: 'Empiezo a activarme, tengo tensión o pensamientos que se aceleran.', icon: AlertTriangle, iconClass: 'text-amber-500'},
                {color: 'rojo', label: 'Rojo', description: 'Estoy muy activado/a. Siento ansiedad, rabia, bloqueo o impulso fuerte.', icon: XCircle, iconClass: 'text-red-500'},
              ].map(({color, label, description, icon: Icon, iconClass}) => (
                <Label key={color} htmlFor={`light-${color}`} 
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all w-full sm:w-auto h-40",
                    light === color ? `border-primary ring-2 ring-primary bg-primary/10` : 'border-border bg-background hover:bg-muted'
                  )}>
                  <RadioGroupItem value={color} id={`light-${color}`} className="sr-only" />
                  <Icon className={cn("h-10 w-10 mb-2", iconClass)} />
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
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} className="w-auto" disabled={!light}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2:
        let suggestions, title, placeholder;
        if(light === 'verde') { 
          title='Paso 2: Bienestar emocional presente'; 
          suggestions = 'Aprovecha para reforzar lo que te hace bien. Sugerencias:\n\nAgradece algo del día.\nRegálate un momento consciente (una respiración profunda, una mirada amable).\nAnota lo que has hecho hoy para sentirte así.';
          placeholder = '¿Qué quieres seguir cultivando hoy?';
        } else if(light === 'ambar') { 
          title='Paso 2: Activación emocional leve o moderada'; 
          suggestions = 'Estás empezando a salir de tu zona de calma. Este es el momento ideal para regularte antes de escalar. Sugerencias:\n\nHaz una respiración profunda y diafragmática.\nNombra lo que sientes sin juicio.\nConecta con los sentidos: ¿qué ves, qué oyes, qué tocas?';
          placeholder = '¿Qué harás ahora para ayudarte?';
        } else { // rojo
          title='Paso 2: Desborde o activación intensa'; 
          suggestions = 'Cuando estás muy activado/a, lo primero es contenerte con cuidado, sin exigencias. Sugerencias:\n\nAléjate del estímulo si puedes.\nUsa una técnica de grounding (contacto con un objeto frío, contar objetos de un color, etc.) o de relajación.\nEscribe lo que sientes sin censura.\nRespira con ritmo lento, sin forzarte.';
          placeholder = '¿Qué vas a hacer ahora para sostenerte?';
        }
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-center text-lg">{title}</h4>
            <p className="text-sm text-muted-foreground text-center whitespace-pre-line">{suggestions}</p>
            <Label htmlFor="action-textarea" className="font-semibold">Tu acción:</Label>
            <Textarea id="action-textarea" value={action} onChange={e => setAction(e.target.value)} placeholder={placeholder} />
            <div className="flex justify-between w-full mt-2">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
              <Button onClick={nextStep} className="w-auto" disabled={!action.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Integración y aprendizaje</h4>
                <p className="text-sm text-muted-foreground">Hoy entrenaste tu autorregulación emocional. Anotar cómo te sientes y qué hiciste para ayudarte refuerza nuevas conexiones cerebrales que te darán más recursos cada vez.</p>
                <div className="space-y-2 pt-2">
                    <Label htmlFor="learning-reflection">¿Qué aprendiste hoy sobre ti? (Opcional)</Label>
                    <Textarea id="learning-reflection" value={learning} onChange={(e) => setLearning(e.target.value)} />
                </div>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                    <Button onClick={handleSave} className="w-auto"><Save className="mr-2 h-4 w-4"/>Guardar Registro</Button>
                </div>
            </div>
        );
       case 4:
        return (
            <div className="p-6 space-y-4 text-center">
                 <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <p className="font-medium text-green-800 dark:text-green-200">Registro Guardado.</p>
                </div>
                <div className="pt-4 space-y-2">
                    <h5 className="font-semibold">Recuerda:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4 text-left">
                        <li>No hay emociones incorrectas.</li>
                        <li>Lo importante es darte cuenta y cuidarte en el momento que lo necesites.</li>
                        <li>Puedes estar en rojo y aún así elegir qué hacer y no hacerte daño.</li>
                        <li>Puedes volver a tu centro con práctica y presencia.</li>
                    </ul>
                    <blockquote className="text-sm italic pt-4">“Tu calma no es un destino. Es una decisión que puedes entrenar.”</blockquote>
                </div>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={resetExercise} variant="outline" className="w-auto">Hacer otro registro</Button>
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
        <CardDescription className="pt-1">
            <span className="text-xs italic">
                (<span className="text-green-500 font-semibold">verde</span> = bienestar;{' '}
                <span className="text-amber-500 font-semibold">ámbar</span> = activación;{' '}
                <span className="text-red-500 font-semibold">rojo</span> = desborde) con estrategias de regulación en cada fase.
            </span>
            {content.objective && <p className="pt-2">{content.objective}</p>}
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
