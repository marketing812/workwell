
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';

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

  if (content.type !== 'blockageMapExercise') return null;

  const emotionsOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad', description: 'Siento que algo malo va a pasar si empiezo o si no lo hago bien.' },
    { id: 'emo-insecurity', label: 'Inseguridad', description: 'Dudo de si soy capaz, competente o válido/a para hacer esto.' },
    { id: 'emo-judgment-fear', label: 'Miedo al juicio', description: 'Me preocupa lo que pensarán los demás si no lo hago perfecto.' },
    { id: 'emo-shame', label: 'Vergüenza', description: 'Me siento expuesto/a o inferior, como si fuera a fallar delante de alguien.' },
    { id: 'emo-guilt', label: 'Culpa', description: 'Creo que ya lo debería haber hecho y me castigo por haberlo postergado.' },
    { id: 'emo-frustration', label: 'Frustración', description: 'Lo he intentado otras veces y no funcionó… me siento bloqueado/a o cansado/a.' },
    { id: 'emo-apathy', label: 'Apatía o vacío emocional', description: 'No siento interés por nada… como si todo me diera igual o no tuviera sentido.' },
    { id: 'emo-sadness', label: 'Tristeza o desánimo', description: 'Estoy decaído/a, sin fuerzas, sin ilusión… y cualquier tarea me cuesta el doble.' },
    { id: 'emo-overwhelm', label: 'Agobio mental', description: 'Tengo demasiadas cosas en la cabeza y no sé por dónde empezar.' },
    { id: 'emo-resistance', label: 'Resistencia (“No quiero que me obliguen”)', description: 'Siento que esta tarea viene impuesta, y me rebelo o me cierro como forma de protegerme.' },
  ];

  const handleSave = async () => {
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

    addNotebookEntry({
        title: 'Mi Mapa del Bloqueo Personal',
        content: notebookContent,
        pathId,
        ruta: 'Superar la Procrastinación y Crear Hábitos',
    });
    toast({ title: 'Mapa guardado', description: 'Tu Mapa del Bloqueo Personal se ha guardado en el cuaderno.' });
    setStep(7);
  };
  
  const resetExercise = () => {
    setStep(0);
    setAvoidedTask('');
    setBlockingThoughts('');
    setAvoidedEmotions({});
    setOtherEmotion('');
    setEscapeBehaviors('');
    setConsequences('');
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
             {(content as any).audioUrl && (
              <div className="mt-4">
                  <audio controls controlsList="nodownload" className="w-full">
                      <source src={(content as any).audioUrl} type="audio/mp3" />
                      Tu navegador no soporta el elemento de audio.
                  </audio>
              </div>
            )}
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
              <div key={opt.id} className="flex items-start space-x-3">
                <Checkbox
                  id={opt.id}
                  checked={avoidedEmotions[opt.id] || false}
                  onCheckedChange={checked => setAvoidedEmotions(p => ({ ...p, [opt.id]: !!checked }))}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={opt.id} className="font-semibold cursor-pointer">{opt.label}</Label>
                  <p className="text-sm text-muted-foreground">{opt.description}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center space-x-2 pt-2">
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
            <Button onClick={() => setStep(6)} className="w-full">
              Ver mi mapa del bloqueo
            </Button>
          </div>
        );
      case 6:
        const selectedEmotions = emotionsOptions.filter(opt => avoidedEmotions[opt.id]).map(opt => opt.label);
        if (avoidedEmotions['emo-other'] && otherEmotion) selectedEmotions.push(otherEmotion);
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-bold text-center text-lg">Tu Mapa del Bloqueo</h4>
            <div className="space-y-2 text-sm border p-4 rounded-md bg-background">
              <p><strong>Tarea evitada:</strong> {avoidedTask || 'N/A'}</p>
              <p><strong>Pensamientos bloqueadores:</strong> {blockingThoughts || 'N/A'}</p>
              <p><strong>Emociones evitadas:</strong> {selectedEmotions.join(', ') || 'N/A'}</p>
              <p><strong>Conductas de escape:</strong> {escapeBehaviors || 'N/A'}</p>
              <p><strong>Consecuencias:</strong> {consequences || 'N/A'}</p>
            </div>
            <p className="text-sm italic text-center pt-2">
              Este mapa no es para juzgarte. Es para ayudarte a ver el ciclo completo con más claridad. Entenderlo es el primer paso para liberarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={resetExercise} variant="outline" className="w-full">
                Volver a la sesión
              </Button>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar en mi diario
              </Button>
            </div>
          </div>
        );
    case 7:
        return (
            <div className="p-4 space-y-4 text-center">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">¡Mapa Guardado!</h4>
                <p className="text-muted-foreground">Tu mapa del bloqueo se ha guardado en tu Cuaderno Terapéutico. Puedes consultarlo cuando quieras para recordar tus patrones.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">
                  Registrar otra situación
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
