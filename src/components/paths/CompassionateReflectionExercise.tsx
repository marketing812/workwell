
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';

interface CompassionateReflectionExerciseProps {
  content: ModuleContent;
  pathId: string;
}

export function CompassionateReflectionExercise({ content, pathId }: CompassionateReflectionExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [adviceToFriend, setAdviceToFriend] = useState('');
  const [selfJudgment, setSelfJudgment] = useState('');
  const [avoidedEmotions, setAvoidedEmotions] = useState<Record<string, boolean>>({});
  const [aftermathEmotion, setAftermathEmotion] = useState('');
  const [perfectionism, setPerfectionism] = useState<Record<string, boolean>>({});
  const [flexibleThought, setFlexibleThought] = useState('');

  if (content.type !== 'compassionateReflectionExercise') return null;

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

*A alguien que quiero le diría:*
${adviceToFriend || 'No especificado.'}

*En ese momento pensé que:*
${selfJudgment || 'No especificado.'}

*Emociones que intenté evitar:*
${Object.keys(avoidedEmotions)
  .filter(k => avoidedEmotions[k])
  .join(', ') || 'No especificadas.'}

*¿Qué sentí después de evitarlo?:*
${aftermathEmotion || 'No especificado.'}

*Exigencias detectadas:*
${Object.keys(perfectionism)
  .filter(k => perfectionism[k])
  .join(', ') || 'Ninguna.'}

*Nueva forma de pensarlo:*
${flexibleThought || 'No especificada.'}
        `;
    addNotebookEntry({ title: 'Mi Reflexión Compasiva', content: notebookContent, pathId });
    toast({ title: 'Reflexión guardada', description: 'Tu reflexión se ha guardado en el cuaderno.' });
    setStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4">
            <p className="mb-4">
              Ahora, vamos a mirar dentro de ti, con respeto y sin crítica. No buscamos explicaciones perfectas, solo
              entender qué te estaba pasando.
            </p>
            <Button onClick={() => setStep(1)}>Empezar la reflexión <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
            <Label>Imagina que una persona a la que quieres mucho está en tu situación. ¿Qué le dirías?</Label>
            <Textarea
              value={adviceToFriend}
              onChange={e => setAdviceToFriend(e.target.value)}
              placeholder="Le diría que..."
            />
            <Button onClick={() => setStep(2)} className="w-full mt-2">
              Continuar
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
            <Label>Cuando te bloqueaste, ¿qué pensaste sobre ti?</Label>
            <Textarea
              value={selfJudgment}
              onChange={e => setSelfJudgment(e.target.value)}
              placeholder="Pensé que no valía para esto..."
            />
            <p className="text-sm text-center text-primary">Es solo un pensamiento. No eres ese pensamiento.</p>
            <Button onClick={() => setStep(3)} className="w-full mt-2">
              Siguiente
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
            <Label>¿Qué emoción crees que intentabas evitar cuando procrastinaste?</Label>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="fear"
                  onCheckedChange={c => setAvoidedEmotions(p => ({ ...p, fear: !!c }))}
                />
                <Label htmlFor="fear" className="font-normal">
                  Miedo al fallo
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="shame"
                  onCheckedChange={c => setAvoidedEmotions(p => ({ ...p, shame: !!c }))}
                />
                <Label htmlFor="shame" className="font-normal">
                  Vergüenza
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="guilt"
                  onCheckedChange={c => setAvoidedEmotions(p => ({ ...p, guilt: !!c }))}
                />
                <Label htmlFor="guilt" className="font-normal">
                  Culpa
                </Label>
              </div>
            </div>
            <Label htmlFor="aftermath">¿Y qué sentí después de evitarlo?</Label>
            <Textarea
              id="aftermath"
              value={aftermathEmotion}
              onChange={e => setAftermathEmotion(e.target.value)}
              placeholder="Alivio momentáneo... y luego frustración."
            />
            <Button onClick={() => setStep(4)} className="w-full mt-2">
              Siguiente
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
            <Label>¿Te exigiste demasiado en ese momento?</Label>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="perfect"
                  onCheckedChange={c => setPerfectionism(p => ({ ...p, perfect: !!c }))}
                />
                <Label htmlFor="perfect" className="font-normal">
                  Pensé que, si no lo hacía perfecto, mejor no hacerlo.
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="energy"
                  onCheckedChange={c => setPerfectionism(p => ({ ...p, energy: !!c }))}
                />
                <Label htmlFor="energy" className="font-normal">
                  Sentí que tenía que estar con energía total.
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="no-error"
                  onCheckedChange={c => setPerfectionism(p => ({ ...p, error: !!c }))}
                />
                <Label htmlFor="no-error" className="font-normal">
                  Cualquier error me parecía inaceptable.
                </Label>
              </div>
            </div>
            <Label htmlFor="flexible-thought">¿Cómo podrías pensarlo hoy con más flexibilidad?</Label>
            <Textarea
              id="flexible-thought"
              value={flexibleThought}
              onChange={e => setFlexibleThought(e.target.value)}
              placeholder="Aunque no salga perfecto, un pequeño paso ya es avanzar."
            />
            <Button onClick={handleSave} className="w-full mt-2">
              Ver mi reflexión completa
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="p-4 space-y-2 text-center animate-in fade-in-0 duration-500">
            <CheckCircle className="h-10 w-10 text-primary mx-auto" />
            <h4 className="font-bold text-lg">Tu Mapa de Comprensión Emocional</h4>
            <p className="text-sm italic text-center">
              Has dado un paso valiente. Hablarte con amabilidad te ayuda a avanzar.
            </p>
            <Button onClick={() => setStep(0)} variant="outline" className="w-full">
              Empezar de nuevo
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}

    