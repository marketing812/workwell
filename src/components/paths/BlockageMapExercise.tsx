
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

interface BlockageMapExerciseProps {
  content: ModuleContent;
  pathId: string;
}

export function BlockageMapExercise({ content, pathId }: BlockageMapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [avoidedTask, setAvoidedTask] = useState('');
  const [blockingThoughts, setBlockingThoughts] = useState('');
  const [avoidedEmotions, setAvoidedEmotions] = useState<Record<string, boolean>>({});
  const [otherEmotion, setOtherEmotion] = useState('');
  const [escapeBehaviors, setEscapeBehaviors] = useState('');
  const [consequences, setConsequences] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (content.type !== 'exercise') return null;

  const emotionsOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad' },
    { id: 'emo-insecurity', label: 'Inseguridad' },
    { id: 'emo-judgment-fear', label: 'Miedo al juicio' },
    { id: 'emo-shame', label: 'Vergüenza' },
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-frustration', label: 'Frustración' },
    { id: 'emo-apathy', label: 'Apatía o vacío emocional' },
    { id: 'emo-sadness', label: 'Tristeza o desánimo' },
    { id: 'emo-overwhelm', label: 'Agobio mental' },
    { id: 'emo-resistance', label: 'Resistencia (“No quiero que me obliguen”)' },
  ];

  const handleSave = () => {
    const selectedEmotions = emotionsOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
    if (avoidedEmotions['emo-other'] && otherEmotion) {
      selectedEmotions.push(otherEmotion);
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea evitada:*
${avoidedTask || 'No especificada.'}

*Pensamientos bloqueadores:*
${blockingThoughts || 'No especificados.'}

*Emociones evitadas:*
${selectedEmotions.length > 0 ? selectedEmotions.map(e => `- ${e}`).join('\n') : 'No especificadas.'}

*Conductas de escape:*
${escapeBehaviors || 'No especificadas.'}

*Consecuencias:*
${consequences || 'No especificadas.'}
    `;

    addNotebookEntry({ title: 'Mi Mapa del Bloqueo Personal', content: notebookContent, pathId });
    toast({ title: 'Mapa guardado', description: 'Tu Mapa del Bloqueo Personal se ha guardado en el cuaderno.' });
    setStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src="https://workwellfut.com/audios/ruta3/tecnicas/Ruta3sesion1tecnica1.mp3" type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
            <p className="mb-4">
              ¿Tienes una tarea pendiente que sigues posponiendo? Este ejercicio te ayudará a identificar qué está
              pasando dentro de ti. No hay respuestas correctas, solo pistas para entenderte mejor.
            </p>
            <Button onClick={() => setStep(1)}>
              Comenzar mi mapa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="avoided-task">Piensa en una tarea concreta que llevas tiempo evitando.</Label>
            <Textarea
              id="avoided-task"
              value={avoidedTask}
              onChange={e => setAvoidedTask(e.target.value)}
              placeholder="Ej: Escribir un email importante"
            />
            <Button onClick={() => setStep(2)} className="w-full">
              Siguiente
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="blocking-thoughts">¿Qué pensamientos aparecen cuando piensas en esa tarea?</Label>
            <Textarea
              id="blocking-thoughts"
              value={blockingThoughts}
              onChange={e => setBlockingThoughts(e.target.value)}
              placeholder="Ej: Lo haré mal y me juzgarán"
            />
            <Button onClick={() => setStep(3)} className="w-full">
              Siguiente
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4">
            <Label>¿Qué emociones o sensaciones físicas intentas evitar?</Label>
            {emotionsOptions.map(opt => (
              <div key={opt.id} className="flex items-center space-x-2">
                <Checkbox
                  id={opt.id}
                  checked={avoidedEmotions[opt.id] || false}
                  onCheckedChange={checked => setAvoidedEmotions(p => ({ ...p, [opt.id]: !!checked }))}
                />
                <Label htmlFor={opt.id} className="font-normal">
                  {opt.label}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emo-other"
                checked={avoidedEmotions['emo-other'] || false}
                onCheckedChange={checked => setAvoidedEmotions(p => ({ ...p, 'emo-other': !!checked }))}
              />
              <Label htmlFor="emo-other" className="font-normal">
                Otra:
              </Label>
            </div>
            {avoidedEmotions['emo-other'] && (
              <Textarea
                value={otherEmotion}
                onChange={e => setOtherEmotion(e.target.value)}
                placeholder="Describe la otra emoción"
                className="ml-6"
              />
            )}
            <Button onClick={() => setStep(4)} className="w-full">
              Siguiente
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="escape-behaviors">¿Qué haces para evitarla?</Label>
            <Textarea
              id="escape-behaviors"
              value={escapeBehaviors}
              onChange={e => setEscapeBehaviors(e.target.value)}
              placeholder="Ej: Miro redes sociales, limpio compulsivamente..."
            />
            <Button onClick={() => setStep(5)} className="w-full">
              Siguiente
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="p-4 space-y-4">
            <Label htmlFor="consequences">¿Qué consecuencias tiene para ti seguir evitándolo?</Label>
            <Textarea
              id="consequences"
              value={consequences}
              onChange={e => setConsequences(e.target.value)}
              placeholder="Ej: Me siento culpable, pierdo oportunidades..."
            />
            <Button onClick={handleSave} className="w-full">
              Ver mi mapa del bloqueo
            </Button>
          </div>
        );
      case 6:
        // Summary screen
        const selectedEmotions = emotionsOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
        if (avoidedEmotions['emo-other'] && otherEmotion) selectedEmotions.push(otherEmotion);
        return (
          <div className="p-4 space-y-2">
            <h4 className="font-bold text-center text-lg">Tu Mapa del Bloqueo</h4>
            <p>
              <strong>Tarea evitada:</strong> {avoidedTask || 'N/A'}
            </p>
            <p>
              <strong>Pensamientos bloqueadores:</strong> {blockingThoughts || 'N/A'}
            </p>
            <p>
              <strong>Emociones evitadas:</strong> {selectedEmotions.join(', ') || 'N/A'}
            </p>
            <p>
              <strong>Conductas de escape:</strong> {escapeBehaviors || 'N/A'}
            </p>
            <p>
              <strong>Consecuencias:</strong> {consequences || 'N/A'}
            </p>
            <p className="text-sm italic text-center pt-4">
              Este mapa no es para juzgarte. Es para ayudarte a ver el ciclo completo con más claridad. Entenderlo es
              el primer paso para liberarte.
            </p>
            <Button onClick={() => setStep(0)} variant="outline" className="w-full">
              Comenzar de nuevo
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
