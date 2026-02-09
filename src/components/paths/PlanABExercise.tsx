
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PlanABExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface PlanABExerciseProps {
  content: PlanABExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function PlanABExercise({ content, pathId, onComplete }: PlanABExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0); // State for multi-step flow
  const [decision, setDecision] = useState('');
  const [planA, setPlanA] = useState({ action: '', value: '', outcome: '' });
  const [planB, setPlanB] = useState({ fear: '', strategy: '', support: '', phrase: '' });
  const [commitment, setCommitment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setDecision('');
    setPlanA({ action: '', value: '', outcome: '' });
    setPlanB({ fear: '', strategy: '', support: '', phrase: '' });
    setCommitment('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || !planA.action.trim() || !planB.fear.trim() || !commitment.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todas las secciones para guardar tu plan.', variant: 'destructive' });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a tomar:**
${decision}

---
**Plan A (Paso con intención):**
* Acción: ${planA.action}
* Valor: ${planA.value}
* Resultado esperado: ${planA.outcome}

---
**Plan B (Red de cuidado emocional):**
* Miedo principal: ${planB.fear}
* Estrategia de cuidado: ${planB.strategy}
* Apoyo disponible: ${planB.support}
* Frase personal de contención: "${planB.phrase}"

---
**Mi compromiso realista:**
${commitment}
    `;

    addNotebookEntry({ title: 'Mi Plan A/B Emocional', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Plan Guardado', description: 'Tu plan A/B se ha guardado en el cuaderno.' });
    setIsSaved(true);
    onComplete();
    nextStep(); // Go to confirmation screen
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Vamos a construir dos planes:</p>
            <ul className="list-disc list-inside text-left mx-auto max-w-md">
                <li><strong>Plan A:</strong> tu elección principal, tu paso con intención.</li>
                <li><strong>Plan B:</strong> tu red de cuidado emocional si las cosas no salen como esperas.</li>
            </ul>
            <p className="text-sm text-muted-foreground">Esto no es pensar en negativo. Es pensar con valentía y con inteligencia emocional.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1: Define tu decisión
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Define tu decisión</h4>
            <Label htmlFor="decision">Describe en una frase clara la decisión que estás enfrentando.</Label>
            <p className="text-xs text-muted-foreground italic">Ejemplo: “Decidir si hablo con mi hermana sobre cómo me sentí en la discusión.”</p>
            <Textarea id="decision" value={decision} onChange={e => setDecision(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!decision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Step 2: Plan A
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Plan A – ¿Qué harás?</h4>
            <p className="text-sm text-muted-foreground">Ejemplo: Acción: Hablar con ella mañana con calma. Valor: Quiero relaciones donde pueda ser honesta. Resultado esperado: Que me escuche y podamos acercarnos.</p>
            <div className="space-y-2">
              <Label htmlFor="planA-action">Acción concreta</Label>
              <Textarea id="planA-action" value={planA.action} onChange={e => setPlanA(p => ({ ...p, action: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planA-value">Valor asociado</Label>
              <Textarea id="planA-value" value={planA.value} onChange={e => setPlanA(p => ({ ...p, value: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planA-outcome">Resultado deseado</Label>
              <Textarea id="planA-outcome" value={planA.outcome} onChange={e => setPlanA(p => ({ ...p, outcome: e.target.value }))} />
            </div>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!planA.action.trim() || !planA.value.trim() || !planA.outcome.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Step 3: Plan B
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Plan B – ¿Cómo te cuidarás si no sale como esperas?</h4>
            <p className="text-sm text-muted-foreground">Ejemplo: Miedo: Que se enfade o me rechace. Estrategia: Recordarme que expresar lo que siento no es hacer daño. Apoyo: Hablar con mi terapeuta. Frase: “No controlo sus reacciones, pero sí puedo cuidar mi verdad.”</p>
            <div className="space-y-2">
              <Label htmlFor="planB-fear">¿Qué es lo que más temes que ocurra?</Label>
              <Textarea id="planB-fear" value={planB.fear} onChange={e => setPlanB(p => ({ ...p, fear: e.target.value }))} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="planB-strategy">¿Qué harías si eso sucede?</Label>
              <Textarea id="planB-strategy" value={planB.strategy} onChange={e => setPlanB(p => ({ ...p, strategy: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planB-support">¿A quién podrías acudir?</Label>
              <Textarea id="planB-support" value={planB.support} onChange={e => setPlanB(p => ({ ...p, support: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planB-phrase">¿Qué frase o imagen podrías recordarte para sostenerte?</Label>
              <Textarea id="planB-phrase" value={planB.phrase} onChange={e => setPlanB(p => ({ ...p, phrase: e.target.value }))} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!planB.fear.trim() || !planB.strategy.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Step 4: Tu compromiso realista
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Tu compromiso realista</h4>
            <Label htmlFor="commitment">¿Qué paso pequeño y concreto vas a dar en los próximos días para poner en marcha este plan?</Label>
            <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Plan</Button>
            </div>
          </form>
        );
       case 5: // Confirmation Screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Plan Guardado</h4>
            <p className="text-muted-foreground italic">“No todo depende de ti. Pero sí depende de ti cómo decides cuidarte pase lo que pase”.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Crear otro plan A/B</Button>
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
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta8/tecnicas/Ruta8semana3tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
