"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';

interface CompassionateReflectionExerciseProps {
  content: ModuleContent;
  pathId: string;
}

export function CompassionateReflectionExercise({ content, pathId }: CompassionateReflectionExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  // State for user inputs
  const [adviceToFriend, setAdviceToFriend] = useState('');
  const [selfJudgment, setSelfJudgment] = useState('');
  const [avoidedEmotions, setAvoidedEmotions] = useState<Record<string, boolean>>({});
  const [otherAvoidedEmotion, setOtherAvoidedEmotion] = useState('');
  const [aftermathEmotion, setAftermathEmotion] = useState('');
  const [perfectionism, setPerfectionism] = useState<Record<string, boolean>>({});
  const [flexibleThought, setFlexibleThought] = useState('');

  // Options for checkboxes
  const emotionOptions = [
    { id: 'fear', label: 'Miedo al fallo' },
    { id: 'shame', label: 'Vergüenza' },
    { id: 'guilt', label: 'Culpa' },
    { id: 'anxiety', label: 'Ansiedad' },
    { id: 'sadness', label: 'Tristeza' },
    { id: 'frustration', label: 'Frustración' },
  ];

  const perfectionismOptions = [
    { id: 'perfect', label: 'Pensé que, si no lo hacía perfecto, mejor no hacerlo.' },
    { id: 'energy', label: 'Sentí que tenía que estar con energía total.' },
    { id: 'error', label: 'Cualquier error me parecía inaceptable.' },
    { id: 'not-my-case', label: 'No fue mi caso esta vez.' },
  ];

  const handleSave = async () => {
    const selectedEmotions = emotionOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
    if (avoidedEmotions['other'] && otherAvoidedEmotion) {
        selectedEmotions.push(otherAvoidedEmotion);
    }
    
    const selectedPerfectionism = perfectionismOptions.filter(opt => perfectionism[opt.id]).map(opt => opt.label);

    const notebookContent = `
**Ejercicio: ${content.title}**

*A alguien que quiero le diría:*
${adviceToFriend || 'No especificado.'}

*En ese momento pensé que:*
${selfJudgment || 'No especificado.'}

*Emociones que intenté evitar:*
${selectedEmotions.length > 0 ? selectedEmotions.join(', ') : 'No especificadas.'}

*¿Qué sentí después de evitarlo?:*
${aftermathEmotion || 'No especificado.'}

*Exigencias detectadas:*
${selectedPerfectionism.length > 0 ? selectedPerfectionism.join(', ') : 'Ninguna.'}

*Nueva forma de pensarlo:*
${flexibleThought || 'No especificada.'}
    `;
    
    addNotebookEntry({
        title: 'Mi Reflexión Compasiva',
        content: notebookContent,
        pathId,
        ruta: 'Superar la Procrastinación y Crear Hábitos',
        userId: user?.id,
    });
    toast({ title: 'Reflexión guardada', description: 'Tu reflexión se ha guardado en el cuaderno.' });
    setStep(prev => prev + 1); // Move to final confirmation screen
  };

  const resetExercise = () => {
    setStep(0);
    setAdviceToFriend('');
    setSelfJudgment('');
    setAvoidedEmotions({});
    setOtherAvoidedEmotion('');
    setAftermathEmotion('');
    setPerfectionism({});
    setFlexibleThought('');
  }

  const renderStep = () => {
    const selectedEmotions = emotionOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
    if (avoidedEmotions['other'] && otherAvoidedEmotion) selectedEmotions.push(otherAvoidedEmotion);

    const selectedPerfectionism = perfectionismOptions.filter(opt => perfectionism[opt.id]).map(opt => opt.label);

    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             {(content as any).audioUrl && (
              <div className="mb-4">
                  <audio controls controlsList="nodownload" className="w-full">
                      <source src={(content as any).audioUrl} type="audio/mp3" />
                      Tu navegador no soporta el elemento de audio.
                  </audio>
              </div>
            )}
            <p className="mb-4">
              Ahora, vamos a mirar dentro de ti, con respeto y sin crítica. No buscamos explicaciones perfectas, solo
              entender qué te estaba pasando.
            </p>
            <Button onClick={() => setStep(1)}>
              Empezar la reflexión <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        );
      case 1:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <Label className="font-semibold">Instrucción:</Label>
                <p className="text-sm text-muted-foreground">Imagina que una persona a la que quieres mucho está en tu situación: bloqueada, con miedo, posponiendo algo importante.</p>
                <div className="space-y-2">
                    <Label htmlFor="advice-to-friend">Le diría que…</Label>
                    <Textarea
                        id="advice-to-friend"
                        value={adviceToFriend}
                        onChange={e => setAdviceToFriend(e.target.value)}
                        placeholder="Ej: Entiendo que te bloquees, lo que estás viviendo es difícil. Vas a poder con ello poco a poco."
                    />
                </div>
                <p className="text-sm italic text-center text-primary pt-2">Si puedes hablarle así a otra persona… también puedes empezar a hablarte así a ti.</p>
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
            <p className="text-sm text-center text-primary pt-2">Es solo un pensamiento. No eres ese pensamiento.</p>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={() => setStep(1)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                <Button onClick={() => setStep(3)} disabled={!selfJudgment.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <Label>¿Qué emoción crees que intentabas evitar cuando procrastinaste?</Label>
                <div className="space-y-1">
                {emotionOptions.map(opt => (
                     <div key={opt.id} className="flex items-center gap-2">
                        <Checkbox
                        id={`emotion-${opt.id}`}
                        checked={avoidedEmotions[opt.id] || false}
                        onCheckedChange={c => setAvoidedEmotions(p => ({ ...p, [opt.id]: !!c }))}
                        />
                        <Label htmlFor={`emotion-${opt.id}`} className="font-normal">
                        {opt.label}
                        </Label>
                    </div>
                ))}
                 <div className="flex items-center gap-2">
                    <Checkbox
                    id="emotion-other"
                    checked={avoidedEmotions['other'] || false}
                    onCheckedChange={c => setAvoidedEmotions(p => ({ ...p, other: !!c }))}
                    />
                    <Label htmlFor="emotion-other" className="font-normal">
                    Otra:
                    </Label>
                </div>
                {avoidedEmotions['other'] && (
                     <Textarea 
                        value={otherAvoidedEmotion}
                        onChange={(e) => setOtherAvoidedEmotion(e.target.value)}
                        placeholder="Describe la otra emoción..."
                        className="ml-6 mt-1"
                    />
                )}
                </div>
            </div>
            <div className="pt-4 space-y-2">
                <Label htmlFor="aftermath">¿Y qué sentí después de evitarlo?</Label>
                <Textarea
                id="aftermath"
                value={aftermathEmotion}
                onChange={e => setAftermathEmotion(e.target.value)}
                placeholder="Ejemplo sugerido: Alivio momentáneo… y luego frustración."
                />
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={() => setStep(2)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                <Button onClick={() => setStep(4)} disabled={!aftermathEmotion.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <Label>¿Te exigiste demasiado en ese momento?</Label>
                <div className="space-y-1">
                {perfectionismOptions.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2">
                        <Checkbox
                        id={`perfectionism-${opt.id}`}
                        onCheckedChange={c => setPerfectionism(p => ({ ...p, [opt.id]: !!c }))}
                        checked={perfectionism[opt.id] || false}
                        />
                        <Label htmlFor={`perfectionism-${opt.id}`} className="font-normal">
                        {opt.label}
                        </Label>
                    </div>
                ))}
                </div>
            </div>
            <div className="pt-4 space-y-2">
                <Label htmlFor="flexible-thought">¿Cómo podrías pensarlo hoy con más flexibilidad?</Label>
                <Textarea
                id="flexible-thought"
                value={flexibleThought}
                onChange={e => setFlexibleThought(e.target.value)}
                placeholder="Aunque no salga perfecto, un pequeño paso ya es avanzar."
                />
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={() => setStep(3)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                <Button onClick={() => setStep(5)} disabled={!flexibleThought.trim()}>
              Ver mi reflexión completa
            </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="p-4 space-y-2 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-bold text-lg">Tu Mapa de Comprensión Emocional</h4>
            <div className="text-left p-4 border rounded-md bg-background/50 space-y-3 text-sm">
                <p><strong>A alguien que quiero le diría:</strong> {adviceToFriend}</p>
                <p><strong>En ese momento pensé que:</strong> {selfJudgment}</p>
                <p><strong>Emociones que intenté evitar:</strong> {selectedEmotions.join(', ')}</p>
                <p><strong>¿Qué sentí después de evitarlo?:</strong> {aftermathEmotion}</p>
                <p><strong>Exigencias detectadas:</strong> {selectedPerfectionism.join(', ')}</p>
                <p><strong>Nueva forma de pensarlo:</strong> {flexibleThought}</p>
            </div>
            <p className="text-sm italic text-center pt-2">
              Has dado un paso valiente. Hablarte con amabilidad te ayuda a avanzar.
            </p>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={() => setStep(4)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4"/> Guardar en mi diario
                </Button>
            </div>
          </div>
        );
      case 6:
        return (
            <div className="p-4 space-y-2 text-center animate-in fade-in-0 duration-500">
                <CheckCircle className="h-10 w-10 text-primary mx-auto" />
                <h4 className="font-bold text-lg">¡Reflexión Guardada!</h4>
                <p className="text-muted-foreground">Tu reflexión se ha guardado en el Cuaderno Terapéutico. Puedes consultarla cuando quieras para recordar tus patrones y tus nuevas formas de responder.</p>
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
