
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AnchorInStormExerciseContent } from '@/data/paths/pathTypes';

interface AnchorInStormExerciseProps {
  content: AnchorInStormExerciseContent;
  pathId: string;
}

export function AnchorInStormExercise({ content, pathId }: AnchorInStormExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [emotionalState, setEmotionalState] = useState('');
  const [anchorType, setAnchorType] = useState('');
  const [otherAnchorType, setOtherAnchorType] = useState(''); // For "Otra" option
  const [anchorDesc, setAnchorDesc] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const storageKey = `exercise-progress-${pathId}-anchorInStorm`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setEmotionalState(data.emotionalState || '');
        setAnchorType(data.anchorType || '');
        setOtherAnchorType(data.otherAnchorType || '');
        setAnchorDesc(data.anchorDesc || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, emotionalState, anchorType, otherAnchorType, anchorDesc, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, emotionalState, anchorType, otherAnchorType, anchorDesc, isSaved, storageKey, isClient]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const finalAnchorType = anchorType === 'Otra' ? otherAnchorType : anchorType;
    if (!emotionalState.trim() || !finalAnchorType.trim() || !anchorDesc.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los campos del ancla.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Estado emocional frecuente:*
${emotionalState}

*Tipo de ancla:*
${finalAnchorType}

*Descripción de mi ancla:*
${anchorDesc}
    `;
    addNotebookEntry({ title: 'Mi Ancla en la Tormenta', content: notebookContent, pathId });
    toast({ title: 'Ancla Guardada', description: 'Tu ancla emocional ha sido guardada.' });
    setIsSaved(true);
    setStep(3); // Move to the closing screen
  };
  
  const resetExercise = () => {
    setStep(0);
    setEmotionalState('');
    setAnchorType('');
    setOtherAnchorType('');
    setAnchorDesc('');
    setIsSaved(false);
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!isClient) {
    return null; // O un componente de carga
  }

  const renderStep = () => {
    const finalAnchorType = anchorType === 'Otra' ? otherAnchorType : anchorType;

    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">En medio de una tormenta, tener un ancla puede evitar que te arrastre el oleaje. En esta práctica vas a crear tu propio ancla emocional: un recurso personal, íntimo y portátil que puedas usar cuando te sientas desbordado o desbordada.</p>
            <div className="p-3 border rounded-md bg-background/50 text-sm">
                <p className="font-semibold">Ejemplo:</p>
                <p><strong>Estado emocional:</strong> Cuando me abruma el miedo a equivocarme y empiezo a sentir ansiedad.</p>
                <p><strong>Mi ancla:</strong> Cierro los ojos, respiro profundo y me repito: “Estoy a salvo. Puedo ir paso a paso.”</p>
                <p><strong>Efecto:</strong> Mi corazón se calma y puedo pensar con más claridad.</p>
            </div>
            <Button onClick={nextStep} className="w-full">Empezar a Crear mi Ancla</Button>
          </div>
        );
      case 1: // Choose anchor type
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Elige tu tipo de ancla</h4>
            <p className="text-sm text-muted-foreground">Selecciona una o varias de estas opciones según lo que más te ayude. (Puedes crear más de una ancla).</p>
            <RadioGroup value={anchorType} onValueChange={setAnchorType} disabled={isSaved}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Respiración calmante" id="anchor-breath" /><Label htmlFor="anchor-breath" className="font-normal">Respiración calmante</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Imagen segura o reconfortante" id="anchor-image" /><Label htmlFor="anchor-image" className="font-normal">Imagen segura o reconfortante</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Frase de autorregulación" id="anchor-phrase" /><Label htmlFor="anchor-phrase" className="font-normal">Frase de autorregulación</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Gesto físico de autocuidado" id="anchor-gesture" /><Label htmlFor="anchor-gesture" className="font-normal">Gesto físico de autocuidado (ej. abrazarte, tocarte el pecho, cerrar los ojos)</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Otra" id="anchor-other-radio" /><Label htmlFor="anchor-other-radio" className="font-normal">Otra:</Label></div>
            </RadioGroup>
            {anchorType === 'Otra' && (
                <Textarea value={otherAnchorType} onChange={e => setOtherAnchorType(e.target.value)} placeholder="Describe tu tipo de ancla..." className="ml-6 mt-2" />
            )}
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!finalAnchorType.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Create anchor
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Crea tu ancla paso a paso</h4>
            <div className="space-y-2">
              <Label htmlFor="emotionalState">Nombra tu estado emocional frecuente: ¿En qué momentos sientes que necesitas un ancla?</Label>
              <Textarea id="emotionalState" value={emotionalState} onChange={e => setEmotionalState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchor-desc">Describe tu ancla emocional: ¿Qué imagen, gesto, respiración o frase usarás?</Label>
              <Textarea id="anchor-desc" value={anchorDesc} onChange={e => setAnchorDesc(e.target.value)} />
            </div>
            <div className="p-3 border-l-4 border-accent bg-accent/10">
                <p className="font-semibold">Conecta con tu ancla ahora:</p>
                <p className="text-sm text-muted-foreground">Hazlo en este momento. Respira, visualiza, repite tu frase o realiza el gesto. Siente su efecto en tu cuerpo.</p>
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/> Guardar Ancla</Button>
            </div>
          </form>
        );
      case 3: // Closing
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ancla Guardada!</h4>
            <p className="text-muted-foreground">Recuérdala como una herramienta personal. Puedes regresar a ella en cualquier momento. Cuanto más la practiques, más fácil será volver a tu centro incluso en la tormenta.</p>
            <Button onClick={resetExercise} variant="outline">Crear otra ancla</Button>
          </div>
        );
      default: return null;
    }
  }

  const newObjective = '¿Te has sentido alguna vez como si todo dentro de ti estuviera a punto de romperse, mientras fuera el mundo seguía su ritmo como si nada? En esos momentos de tensión o caos, no necesitas entenderlo todo ni resolverlo ya. Lo que más necesitas es algo que te sostenga. Este ejercicio es un regalo que te haces a ti misma o a ti mismo: vas a crear tu propia “ancla emocional”, un recurso íntimo y poderoso que te devuelva el equilibrio cuando sientas que estás a la deriva. Porque no siempre puedes calmar la tormenta. Pero sí puedes encontrar un lugar dentro de ti donde anclarte mientras pasa.';

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        <CardDescription className="pt-2">
            {newObjective}
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
