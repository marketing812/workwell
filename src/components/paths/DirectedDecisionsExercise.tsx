
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DirectedDecisionsExerciseContent } from '@/data/paths/pathTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/contexts/UserContext';

interface DirectedDecisionsExerciseProps {
  content: DirectedDecisionsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const valueOptions = [
    { id: 'care', label: 'Cuidado personal', description: 'Elegir lo que te hace bien física y emocionalmente.' },
    { id: 'auth', label: 'Autenticidad', description: 'Ser fiel a lo que sientes, aunque no siempre sea lo más cómodo.' },
    { id: 'calm', label: 'Calma', description: 'Priorizar espacios de serenidad frente a la prisa o la hiperexigencia.' },
    { id: 'connect', label: 'Conexión', description: 'Cuidar vínculos significativos y estar presente en ellos.' },
    { id: 'respect', label: 'Respeto', description: 'Tratarte (y tratar a los demás) con dignidad y límites sanos.' },
    { id: 'balance', label: 'Equilibrio', description: 'Sostener armonía entre dar y recibir, hacer y descansar.' },
    { id: 'presence', label: 'Presencia', description: 'Estar aquí y ahora, no vivir solo en el “tengo que”.' },
    { id: 'coherence', label: 'Coherencia interna', description: 'Alinear lo que haces con lo que piensas y sientes.' },
    { id: 'autonomy', label: 'Autonomía', description: 'Tomar decisiones propias, no solo por presión externa.' },
    { id: 'compassion', label: 'Compasión', description: 'Tratarte con amabilidad cuando no puedes con todo.' },
    { id: 'creativity', label: 'Creatividad', description: 'Dar espacio a lo que te inspira, nutre o emociona.' },
    { id: 'growth', label: 'Crecimiento personal', description: 'Elegir lo que te ayuda a evolucionar.' },
    { id: 'security', label: 'Seguridad emocional', description: 'Alejarte de lo que daña tu estabilidad interior.' },
    { id: 'vitality', label: 'Vitalidad', description: 'Recuperar energía haciendo cosas con sentido.' },
    { id: 'freedom', label: 'Libertad interna', description: 'Soltar el deber constante para elegir con más consciencia.' },
];

export function DirectedDecisionsExercise({ content, pathId, onComplete }: DirectedDecisionsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [selectedValue, setSelectedValue] = useState('');
  const [decisions, setDecisions] = useState(
    Array(3).fill({ decision: '', adjustment: '' })
  );
  const [tomorrowAction, setTomorrowAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleDecisionChange = (index: number, field: 'decision' | 'adjustment', value: string) => {
    const newDecisions = [...decisions];
    newDecisions[index] = { ...newDecisions[index], [field]: value };
    setDecisions(newDecisions);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!tomorrowAction.trim()) {
      toast({ title: "Acción no definida", description: "Define tu acción para mañana.", variant: 'destructive'});
      return;
    }
    
    let notebookContent = `
**Ejercicio: ${content.title}**

**Valor elegido a fortalecer:** ${selectedValue || 'No especificado.'}
`;

    decisions.forEach((d, i) => {
      if (d.decision.trim()) {
        notebookContent += `
**Decisión ${i + 1}:** ${d.decision}
- *Ajuste posible:* ${d.adjustment || 'Ninguno.'}
`;
      }
    });

    notebookContent += `
**Acción para mañana:** ${tomorrowAction}
    `;
    
    addNotebookEntry({ title: `Decisiones con Dirección`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Decisión Guardada", description: "Tu acción de mañana se ha guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>A veces vivimos decidiendo en automático. Pero hoy vas a practicar algo distinto: tomar decisiones pequeñas que te acerquen a lo que sí tiene sentido para ti.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Elige un valor central</h4>
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              {valueOptions.map(opt => (
                <div key={opt.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-accent/50">
                   <RadioGroupItem value={opt.label} id={opt.id} className="mt-1"/>
                   <div className="grid gap-1.5 leading-none">
                     <Label htmlFor={opt.id} className="font-semibold cursor-pointer">{opt.label}</Label>
                     <p className="text-sm text-muted-foreground">{opt.description}</p>
                   </div>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!selectedValue}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Microdecisiones cotidianas</h4>
            <p className="text-sm text-muted-foreground">Revisa tu día y anota 1-3 decisiones. ¿Están alineadas con tu valor elegido? ¿Cómo podrías reajustarlas?</p>
            {decisions.map((d, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-md">
                <Label htmlFor={`decision${index}`}>Decisión {index + 1}</Label>
                <Textarea id={`decision${index}`} value={d.decision} onChange={e => handleDecisionChange(index, 'decision', e.target.value)} />
                <Label htmlFor={`adjustment${index}`}>Ajuste posible</Label>
                <Textarea id={`adjustment${index}`} value={d.adjustment} onChange={e => handleDecisionChange(index, 'adjustment', e.target.value)} />
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Elige una acción para mañana</h4>
             <div className="space-y-2">
              <Label htmlFor="tomorrow-action">¿Qué pequeña acción puedes tomar mañana que honre ese valor?</Label>
              <Textarea id="tomorrow-action" value={tomorrowAction} onChange={e => setTomorrowAction(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                {!isSaved ? (
                <Button type="submit" className="w-auto"><Save className="mr-2 h-4 w-4"/>Guardar mi acción</Button>
                ) : (
                <div className="flex items-center p-3 text-green-800 dark:text-green-200">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Guardado.</p>
                </div>
                )}
            </div>
          </form>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta7/tecnicas/Ruta7semana3tecnica1.mp3" type="audio/mp3" />
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
