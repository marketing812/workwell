"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BraveDecisionsWheelExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface BraveDecisionsWheelExerciseProps {
  content: BraveDecisionsWheelExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function BraveDecisionsWheelExercise({ content, pathId, onComplete }: BraveDecisionsWheelExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [fearDecision, setFearDecision] = useState('');
  const [valueDecision, setValueDecision] = useState('');
  const [confidenceDecision, setConfidenceDecision] = useState('');
  const [despairDecision, setDespairDecision] = useState('');
  const [finalChoice, setFinalChoice] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!finalChoice.trim()) {
        toast({
            title: "Elección final requerida",
            description: "Por favor, describe tu elección final para poder guardar el ejercicio.",
            variant: "destructive",
        });
        return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación:* ${situation || 'No especificada.'}
*Decisión desde el miedo:* ${fearDecision || 'No especificado.'}
*Decisión desde el valor:* ${valueDecision || 'No especificado.'}
*Decisión desde la confianza:* ${confidenceDecision || 'No especificado.'}
*Decisión desde la desesperanza:* ${despairDecision || 'No especificado.'}
*Mi elección final:* ${finalChoice || 'No especificada.'}
`;
    addNotebookEntry({ title: 'Rueda de Decisiones Valientes', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Decisión Guardada', description: 'Tu reflexión ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setFearDecision('');
    setValueDecision('');
    setConfidenceDecision('');
    setDespairDecision('');
    setFinalChoice('');
    setIsSaved(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Introducción
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">En este ejercicio vas a construir una especie de “rueda emocional” para mirar una decisión difícil desde cuatro estados internos distintos. El objetivo no es que elijas ahora, sino que ganes claridad sobre cómo influye tu estado emocional en tu forma de ver y decidir.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Paso 1: Define tu situación actual
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Define tu situación actual</h4>
            <p className="text-sm text-muted-foreground">Describe brevemente la decisión que tienes que tomar. Intenta que sea lo más concreta posible. Ejemplos: Hablar con mi pareja sobre algo que me está doliendo. Pedir un cambio de proyecto en el trabajo. Decidir si continúo en esta relación. Elegir entre quedarme o mudarme.</p>
            <Label htmlFor="situation-brave">¿Cuál es la decisión que estás enfrentando?</Label>
            <Textarea id="situation-brave" value={situation} onChange={e => setSituation(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Paso 2: Miedo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: ¿Qué harías si decidieras desde el miedo?</h4>
            <p className="text-sm text-muted-foreground">El miedo tiende a protegerte evitando el daño. Pero también puede bloquearte. Ejemplo: “Tengo miedo de que si expreso mi necesidad, me rechacen. Así que, desde el miedo, decidiría callarme y seguir acumulando malestar.”</p>
            <div className="text-sm text-muted-foreground mt-2">
                <p className="font-semibold">Preguntas guía:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>¿Qué decisión tomarías si el miedo dirigiera tus acciones?</li>
                    <li>¿Qué estás intentando evitar a toda costa?</li>
                    <li>¿Qué consecuencias temes más?</li>
                </ul>
            </div>
            <Label htmlFor="fear-decision" className="pt-2 block">Describe tu posible decisión si actuaras desde el miedo</Label>
            <Textarea id="fear-decision" value={fearDecision} onChange={e => setFearDecision(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!fearDecision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Paso 3: Valor
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: ¿Qué harías si decidieras desde el valor?</h4>
            <p className="text-sm text-muted-foreground">Decidir desde el valor no es hacerlo sin miedo, sino a pesar de él, priorizando lo que de verdad importa para ti. Ejemplo: “Desde el valor, hablaría con calma y honestidad. Me costaría, pero lo haría porque quiero relaciones donde se pueda hablar desde el respeto.”</p>
            <div className="text-sm text-muted-foreground mt-2">
                <p className="font-semibold">Preguntas guía:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>¿Qué acción se alinea más con tus valores?</li>
                    <li>¿Qué decisión te haría sentir más en paz contigo misma o contigo mismo?</li>
                    <li>¿Qué acto de coraje puedes permitirte hoy?</li>
                </ul>
            </div>
            <Label htmlFor="value-decision" className="pt-2 block">Describe qué harías si actuaras desde tu coraje y tus valores</Label>
            <Textarea id="value-decision" value={valueDecision} onChange={e => setValueDecision(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!valueDecision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Paso 4: Confianza
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: ¿Qué harías si decidieras desde la confianza?</h4>
            <p className="text-sm text-muted-foreground">La confianza no garantiza resultados, pero te recuerda que puedes afrontar lo que venga. Ejemplo: “Desde la confianza, decidiría moverme porque sé que, aunque algo salga mal, voy a saber repararlo.”</p>
            <div className="text-sm text-muted-foreground mt-2">
                <p className="font-semibold">Preguntas guía:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>¿Qué opción elegirías si confiaras más en ti?</li>
                    <li>¿Qué te ha demostrado tu experiencia sobre tu capacidad para sostener lo difícil?</li>
                    <li>¿Qué podrías ganar si actúas con fe en tus propios recursos?</li>
                </ul>
            </div>
            <Label htmlFor="confidence-decision" className="pt-2 block">Describe la decisión que tomarías si confiaras en ti y en tu proceso</Label>
            <Textarea id="confidence-decision" value={confidenceDecision} onChange={e => setConfidenceDecision(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!confidenceDecision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 5: // Paso 5: Desesperanza
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 5: ¿Qué harías si decidieras desde la desesperanza?</h4>
            <p className="text-sm text-muted-foreground">Este paso te ayudará a reconocer tu patrón de rendición o evitación. No es para que decidas desde ahí, sino para detectar cuándo esa parte toma el control. Ejemplo: “Desde la desesperanza, probablemente no haría nada. Pensaría que ya da igual, y me aislaría.”</p>
            <div className="text-sm text-muted-foreground mt-2">
                <p className="font-semibold">Preguntas guía:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>¿Qué harías si sintieras que nada servirá?</li>
                    <li>¿Qué mensajes internos aparecen desde este lugar?</li>
                    <li>¿Qué sueles hacer cuando sientes que no hay salida?</li>
                </ul>
            </div>
            <Label htmlFor="despair-decision" className="pt-2 block">Describe tu posible decisión si actuaras desde la rendición o el agotamiento emocional</Label>
            <Textarea id="despair-decision" value={despairDecision} onChange={e => setDespairDecision(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!despairDecision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 6: // Paso 6: Integrar y elegir
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 6: Integra y elige tu camino</h4>
            <p className="text-sm text-muted-foreground">Ahora que has visto la situación desde distintas lentes… Respira. Vuelve a conectar contigo.</p>
            <div className="text-sm text-muted-foreground mt-2">
                <p className="font-semibold">Preguntas guía:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>¿Cuál de estas decisiones se alinea más contigo hoy?</li>
                    <li>¿Cuál te haría sentir más entera o entero, aunque no sea la más cómoda?</li>
                    <li>¿Qué apoyo necesitas para sostener tu elección?</li>
                </ul>
            </div>
            <Label htmlFor="final-choice" className="pt-2 block">¿Qué decisión quieres tomar hoy y por qué?</Label>
            <Textarea id="final-choice" value={finalChoice} onChange={e => setFinalChoice(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4"/> Guardar mi elección</Button>
            </div>
          </form>
        );
      case 7: // Cierre
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Elección Guardada</h4>
            <p className="text-muted-foreground italic">“No necesitas eliminar el miedo. Solo necesitas escucharte por encima de él”.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Empezar de nuevo</Button>
          </div>
        );
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
                        <source src="https://workwellfut.com/audios/ruta8/tecnicas/Ruta8semana3tecnica1.mp3" type="audio/mp3" />
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
