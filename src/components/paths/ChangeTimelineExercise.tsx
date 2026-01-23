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

interface ChangeTimelineExerciseProps {
  content: ChangeTimelineExerciseContent;
  pathId: string;
}

export function ChangeTimelineExercise({ content, pathId }: ChangeTimelineExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [startPoint, setStartPoint] = useState({ feelings: '', thoughts: '', beliefs: '', struggles: '' });
  const [inflectionPoints, setInflectionPoints] = useState('');
  const [presentMoment, setPresentMoment] = useState({ thoughts: '', talk: '', resources: '', values: '' });
  const [symbol, setSymbol] = useState({ image: '', why: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleStartPointChange = (field: keyof typeof startPoint, value: string) => {
    setStartPoint(prev => ({ ...prev, [field]: value }));
  };

  const handlePresentMomentChange = (field: keyof typeof presentMoment, value: string) => {
    setPresentMoment(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSymbolChange = (field: keyof typeof symbol, value: string) => {
    const newSymbol = { ...symbol, [field]: value };
    // This logic handles a single textarea for both image and why
    if (field === 'image') {
        const parts = value.split('\nPorqué: ');
        newSymbol.image = parts[0];
        newSymbol.why = parts.slice(1).join('\nPorqué: ');
    }
    setSymbol(newSymbol);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

**Punto de Partida:**
- Sentimientos: ${startPoint.feelings || 'No especificado.'}
- Pensamientos: ${startPoint.thoughts || 'No especificado.'}
- Creencias: ${startPoint.beliefs || 'No especificado.'}
- Dificultades: ${startPoint.struggles || 'No especificado.'}

**Momentos de Inflexión:**
${inflectionPoints || 'No especificado.'}

**Momento Presente:**
- Pensamientos ahora: ${presentMoment.thoughts || 'No especificado.'}
- Cómo me hablo ahora: ${presentMoment.talk || 'No especificado.'}
- Recursos desarrollados: ${presentMoment.resources || 'No especificado.'}
- Lo que valoro de mí: ${presentMoment.values || 'No especificado.'}

**Símbolo de Evolución:**
- Imagen: ${symbol.image || 'No especificado.'}
- Porqué: ${symbol.why || 'No especificado.'}
    `;

    addNotebookEntry({ title: 'Mi Línea del Cambio', content: notebookContent, pathId });
    toast({ title: 'Línea de Cambio Finalizada', description: 'Has integrado tu camino de resiliencia.' });
    setIsSaved(true);
    nextStep();
  };
  
  const resetExercise = () => {
    setStep(0);
    setStartPoint({ feelings: '', thoughts: '', beliefs: '', struggles: '' });
    setInflectionPoints('');
    setPresentMoment({ thoughts: '', talk: '', resources: '', values: '' });
    setSymbol({ image: '', why: '' });
    setIsSaved(false);
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">A veces olvidamos todo lo que ya hemos logrado. Este ejercicio es una invitación a mirar hacia atrás con más conciencia y gratitud, y reconocer que no eres la misma persona que al inicio de este proceso.</p>
            <p className="text-sm text-muted-foreground">Vas a crear una línea del tiempo emocional, donde podrás ver con más claridad tu camino, tus aprendizajes y tu evolución personal.</p>
            <Button onClick={nextStep}>Empezar mi línea del tiempo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Nombra el punto de partida</h4>
            <p className="text-sm text-muted-foreground">Piensa en ese momento clave que marcó un antes y un después para ti, el punto desde el que empieza lo que hoy quieres contar. Escribe aquí cómo estabas entonces:</p>
            <p className="text-sm italic text-muted-foreground">Ejemplo: “Me sentía muy sobrepasada. Creía que no iba a poder con todo. Tenía ansiedad cada día y me hablaba con dureza.”</p>
            <div className="space-y-2">
              <Label>¿Qué sentías?</Label><Textarea value={startPoint.feelings} onChange={e => handleStartPointChange('feelings', e.target.value)} />
              <Label>¿Qué pensamientos dominaban tu mente?</Label><Textarea value={startPoint.thoughts} onChange={e => handleStartPointChange('thoughts', e.target.value)} />
              <Label>¿Qué creías sobre ti?</Label><Textarea value={startPoint.beliefs} onChange={e => handleStartPointChange('beliefs', e.target.value)} />
              <Label>¿Qué cosas te costaban?</Label><Textarea value={startPoint.struggles} onChange={e => handleStartPointChange('struggles', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Nombra tus momentos de inflexión</h4>
            <p className="text-sm text-muted-foreground">Recuerda 2 o 3 momentos importantes del proceso. Pueden ser logros, caídas, descubrimientos o decisiones clave. No tienen que ser grandes cosas: a veces lo más transformador es pequeño y silencioso.</p>
             <p className="text-sm italic text-muted-foreground">Ejemplo: “Cuando logré decirle a mi madre cómo me sentía sin culpa, fue un antes y un después. Me sentí vista y me di cuenta de que merezco expresarme.”</p>
            <Label htmlFor="inflection-points">Describe qué pasó, cómo lo viviste y qué aprendiste de ese momento</Label>
            <Textarea id="inflection-points" value={inflectionPoints} onChange={e => setInflectionPoints(e.target.value)} rows={5} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Nombra tu momento presente</h4>
             <p className="text-sm text-muted-foreground">Ahora vuelve al presente. Describe cómo te sientes hoy comparado o comparada con ese inicio.</p>
             <p className="text-sm italic text-muted-foreground">Ejemplo: “Hoy me doy más permiso para descansar y sentir. Sigo teniendo momentos difíciles, pero ya no me siento tan sola ni tan atrapada en mi mente.”</p>
            <div className="space-y-2">
              <Label>¿Qué ha cambiado en tu forma de pensar?</Label><Textarea value={presentMoment.thoughts} onChange={e => handlePresentMomentChange('thoughts', e.target.value)} />
              <Label>¿Cómo te hablas ahora?</Label><Textarea value={presentMoment.talk} onChange={e => handlePresentMomentChange('talk', e.target.value)} />
              <Label>¿Qué recursos has desarrollado?</Label><Textarea value={presentMoment.resources} onChange={e => handlePresentMomentChange('resources', e.target.value)} />
              <Label>¿Qué cosas valoras de ti?</Label><Textarea value={presentMoment.values} onChange={e => handlePresentMomentChange('values', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Elige un símbolo o imagen de tu evolución</h4>
            <p className="text-sm text-muted-foreground">Para integrar todo lo trabajado, elige una imagen simbólica que represente tu proceso de resiliencia. ¿Qué imagen se te viene a la mente? Una montaña, un faro, una semilla, una cicatriz, una espiral, un árbol, un río…</p>
            <div className="space-y-2">
              <Label>Escríbelo aquí y explica brevemente por qué lo elegiste</Label>
              <Textarea value={`${symbol.image}${symbol.why ? `\nPorqué: ${symbol.why}` : ''}`} onChange={e => handleSymbolChange('image', e.target.value)} placeholder="Una montaña, porque me recuerda que puedo ser fuerte y estable..." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4"/> Finalizar y Guardar</Button>
            </div>
          </form>
        );
        case 5:
            return(
                <div className="p-6 text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">¡Línea del Cambio Guardada!</h4>
                    <p className="text-muted-foreground italic whitespace-pre-line">
                      Tu historia no es lineal ni perfecta.
                      {'\n'}Pero cada paso, cada tropiezo, cada acto de autocuidado… ha sido una forma de reconstruirte.
                      {'\n'}Eres resiliente no porque no caíste, sino porque te levantaste diferente.
                      {'\n'}Y eso… merece ser reconocido.
                    </p>
                    <Button onClick={resetExercise} variant="outline" className="w-full">
                        Empezar de nuevo
                    </Button>
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
