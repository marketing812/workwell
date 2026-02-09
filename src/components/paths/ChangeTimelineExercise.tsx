"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, Save, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ChangeTimelineExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface ChangeTimelineExerciseProps {
  content: ChangeTimelineExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ChangeTimelineExercise({ content, pathId, onComplete }: ChangeTimelineExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [startPoint, setStartPoint] = useState({ feelings: '', thoughts: '', beliefs: '', struggles: '' });
  const [inflectionPoints, setInflectionPoints] = useState('');
  const [presentMoment, setPresentMoment] = useState({ thoughts: '', talk: '', resources: '', values: '' });
  const [symbol, setSymbol] = useState({ image: '', why: '' });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStartPointChange = (field: keyof typeof startPoint, value: string) => {
    setStartPoint(prev => ({ ...prev, [field]: value }));
  };

  const handlePresentMomentChange = (field: keyof typeof presentMoment, value: string) => {
    setPresentMoment(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSymbolChange = (field: keyof typeof symbol, value: string) => {
    setSymbol(prev => ({ ...prev, [field]: value }));
  };

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleComplete = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

**Punto de Partida:**
- Sentimientos: ${startPoint.feelings}
- Pensamientos: ${startPoint.thoughts}
- Creencias: ${startPoint.beliefs}
- Dificultades: ${startPoint.struggles}

**Momentos de Inflexión:**
${inflectionPoints}

**Momento Presente:**
- Pensamientos ahora: ${presentMoment.thoughts}
- Cómo me hablo ahora: ${presentMoment.talk}
- Recursos desarrollados: ${presentMoment.resources}
- Lo que valoro de mí: ${presentMoment.values}

**Símbolo de Evolución:**
- Imagen: ${symbol.image}
- Porqué: ${symbol.why}
    `;

    addNotebookEntry({ title: 'Mi Línea del Cambio', content: notebookContent, pathId, userId: user?.id });
    setIsCompleted(true);
    toast({ title: 'Línea de Cambio Finalizada', description: 'Has integrado tu camino de resiliencia.' });
    onComplete();
    next();
  };
  
  const resetExercise = () => {
    setStep(0);
    setStartPoint({ feelings: '', thoughts: '', beliefs: '', struggles: '' });
    setInflectionPoints('');
    setPresentMoment({ thoughts: '', talk: '', resources: '', values: '' });
    setSymbol({ image: '', why: '' });
    setIsCompleted(false);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // NEW INTRO SCREEN
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">A veces olvidamos todo lo que ya hemos logrado. Este ejercicio es una invitación a mirar hacia atrás con más conciencia y gratitud, y reconocer que no eres la misma persona que al inicio de este proceso.</p>
            <p className="text-sm text-muted-foreground">Vas a crear una línea del tiempo emocional, donde podrás ver con más claridad tu camino, tus aprendizajes y tu evolución personal.</p>
            <Button onClick={next} className="w-full">
              Empezar mi línea del tiempo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1: // OLD STEP 0: Punto de partida
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold">Paso 1: Nombra el punto de partida</h4>
            <p className="text-sm text-muted-foreground">Piensa en ese momento clave que marcó un antes y un después para ti, el punto desde el que empieza lo que hoy quieres contar. Escribe aquí cómo estabas entonces:</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>Ejemplo: “Me sentía muy sobrepasada. Creía que no iba a poder con todo. Tenía ansiedad cada día y me hablaba con dureza.”</p>
            </div>
            <div className="space-y-2">
              <Label>¿Qué sentías?</Label><Textarea value={startPoint.feelings} onChange={e => handleStartPointChange('feelings', e.target.value)} />
              <Label>¿Qué pensamientos dominaban tu mente?</Label><Textarea value={startPoint.thoughts} onChange={e => handleStartPointChange('thoughts', e.target.value)} />
              <Label>¿Qué creías sobre ti?</Label><Textarea value={startPoint.beliefs} onChange={e => handleStartPointChange('beliefs', e.target.value)} />
              <Label>¿Qué cosas te costaban?</Label><Textarea value={startPoint.struggles} onChange={e => handleStartPointChange('struggles', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next} className="w-auto">Siguiente</Button>
            </div>
          </div>
        );
      case 2: // OLD STEP 1: Momentos de inflexión
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold">Paso 2: Nombra tus momentos de inflexión</h4>
            <Label>Recuerda 2 o 3 momentos importantes del proceso. Pueden ser logros, caídas, descubrimientos o decisiones clave. No tienen que ser grandes cosas: a veces lo más transformador es pequeño y silencioso. Describe qué pasó, cómo lo viviste y qué aprendiste de ese momento.</Label>
             <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>Ejemplo: “Cuando logré decirle a mi madre cómo me sentía sin culpa, fue un antes y un después. Me sentí vista y me di cuenta de que merezco expresarme.”</p>
            </div>
            <Textarea value={inflectionPoints} onChange={e => setInflectionPoints(e.target.value)} placeholder="Momentos clave, logros, caídas, descubrimientos..." rows={5} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} className="w-auto">Siguiente</Button>
            </div>
          </div>
        );
      case 3: // OLD STEP 2: Momento presente
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold">Paso 3: Nombra tu momento presente</h4>
             <p className="text-sm text-muted-foreground">Ahora vuelve al presente. Describe cómo te sientes hoy comparado o comparada con ese inicio.</p>
             <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>Ejemplo: “Hoy me doy más permiso para descansar y sentir. Sigo teniendo momentos difíciles, pero ya no me siento tan sola ni tan atrapada en mi mente.”</p>
            </div>
            <div className="space-y-2">
              <Label>¿Qué ha cambiado en tu forma de pensar?</Label><Textarea value={presentMoment.thoughts} onChange={e => handlePresentMomentChange('thoughts', e.target.value)} />
              <Label>¿Cómo te hablas ahora?</Label><Textarea value={presentMoment.talk} onChange={e => handlePresentMomentChange('talk', e.target.value)} />
              <Label>¿Qué recursos has desarrollado?</Label><Textarea value={presentMoment.resources} onChange={e => handlePresentMomentChange('resources', e.target.value)} />
              <Label>¿Qué cosas valoras de ti?</Label><Textarea value={presentMoment.values} onChange={e => handlePresentMomentChange('values', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} className="w-auto">Siguiente</Button>
            </div>
          </div>
        );
      case 4: // OLD STEP 3: Símbolo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold">Paso 4: Elige un símbolo o imagen de tu evolución</h4>
            <p className="text-sm text-muted-foreground">Para integrar todo lo trabajado, elige una imagen simbólica que represente tu proceso de resiliencia.</p>
            <div className="space-y-2">
              <Label>¿Qué imagen se te viene a la mente?</Label><Textarea value={symbol.image} onChange={e => handleSymbolChange('image', e.target.value)} placeholder="Una montaña, un faro, una semilla..." />
              <Label>¿Por qué lo elegiste?</Label><Textarea value={symbol.why} onChange={e => handleSymbolChange('why', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleComplete} className="w-auto"><CheckCircle className="mr-2 h-4 w-4"/> Finalizar Ejercicio</Button>
            </div>
          </div>
        );
      case 5: // OLD STEP 4: Cierre / Confirmation
        return (
           <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Completado!</h4>
            <p className="text-muted-foreground">Tu historia no es lineal ni perfecta. Pero cada paso ha sido una forma de reconstruirte. Eres resiliente no porque no caíste, sino porque te levantaste diferente. Y eso… merece ser reconocido.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Repetir Ejercicio</Button>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta8/tecnicas/Ruta8semana4tecnica1.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
