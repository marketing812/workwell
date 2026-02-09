"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AcceptanceWritingExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { useUser } from '@/contexts/UserContext';

interface AcceptanceWritingExerciseProps {
  content: AcceptanceWritingExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const acceptanceEmotionOptions = [
  { value: "tristeza", labelKey: "emotionSadness" },
  { value: "miedo", labelKey: "emotionFear" },
  { value: "ira", labelKey: "emotionAnger" },
  { value: "asco", labelKey: "emotionDisgust" },
  { value: "estres", labelKey: "emotionStress" },
  { value: "ansiedad", labelKey: "emotionAnxiety" },
  { value: "agobio", labelKey: "emotionOverwhelm" },
  { value: "tension", labelKey: "emotionTension" },
  { value: "alarma", labelKey: "emotionAlarm" },
  { value: "cansancio_emocional", labelKey: "emotionEmotionalTiredness" },
  { value: "desaliento", labelKey: "emotionDiscouragement" },
  { value: "vacio", labelKey: "emotionEmptiness" },
  { value: "frustracion", labelKey: "emotionFrustration" },
  { value: "rechazo", labelKey: "emotionRejection" },
  { value: "soledad", labelKey: "emotionLoneliness" },
  { value: "celos", labelKey: "emotionJealousy" },
  { value: "envidia", labelKey: "emotionEnvy" },
  { value: "verguenza", labelKey: "emotionShame" },
  { value: "culpa", labelKey: "emotionGuilt" },
  { value: "inseguridad", labelKey: "emotionInsecurity" },
  { value: "confusion", labelKey: "emotionConfusion" },
  { value: "ambivalencia", labelKey: "emotionAmbivalence" },
];


export default function AcceptanceWritingExercise({ content, pathId, onComplete }: AcceptanceWritingExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const [fact, setFact] = useState('');
  const [emotion, setEmotion] = useState('');
  const [dialogue, setDialogue] = useState('');
  const [judgment, setJudgment] = useState('');
  const [response, setResponse] = useState('');
  const [compassionPhrase, setCompassionPhrase] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const storageKey = `exercise-progress-${pathId}-acceptanceWriting`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const { fact, emotion, dialogue, judgment, response, compassionPhrase, isSaved } = JSON.parse(savedState);
        setFact(fact || '');
        setEmotion(emotion || '');
        setDialogue(dialogue || '');
        setJudgment(judgment || '');
        setResponse(response || '');
        setCompassionPhrase(compassionPhrase || '');
        setIsSaved(isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { fact, emotion, dialogue, judgment, response, compassionPhrase, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [fact, emotion, dialogue, judgment, response, compassionPhrase, isSaved, storageKey, isClient]);


  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Hecho objetivo:*
${fact}

*Emoción(es) sentida(s):*
${emotion}

*Diálogo interno:*
"${dialogue}"

*Hecho vs. Juicio:*
${judgment}

*Respuesta actual:*
${response}

*Frase de cierre compasivo:*
"${compassionPhrase}"
    `;
    addNotebookEntry({ title: 'Ejercicio de Aceptación Escrita', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu reflexión ha sido guardada en el cuaderno.' });
    setIsSaved(true);
    onComplete();
  };

  if (!isClient) {
    return null; // O un componente de carga
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana2tecnica1.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fact">Describe el hecho con honestidad</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Escribe lo que ocurrió, centrándote en los hechos y evitando juicios o interpretaciones.<br> Ejemplo: En la reunión de equipo, interrumpí a un compañero y me di cuenta después." }} />
            <Textarea id="fact" value={fact} onChange={e => setFact(e.target.value)} disabled={isSaved} placeholder="Describe objetivamente lo que pasó. Céntrate solo en los hechos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emotion-acceptance">Ponle nombre a lo que sentiste entonces</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Identifica las emociones que surgieron en ese momento.<br> Ejemplo: Vergüenza, incomodidad, culpa. " }} />
            <Select onValueChange={setEmotion} value={emotion} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Selecciona la emoción que sentiste" /></SelectTrigger>
              <SelectContent>{acceptanceEmotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialogue">Reconoce tu diálogo interno</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Anota los pensamientos o frases que te dijiste en ese momento o después.<br> Ejemplos: No tengo remedio, Siempre meto la pata. " }} />
            <Textarea id="dialogue" value={dialogue} onChange={e => setDialogue(e.target.value)} disabled={isSaved} placeholder="Escribe tu diálogo interno" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="judgment">Distingue hechos de juicios</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Anota los pensamientos o frases que te dijiste en ese momento o después.<br> Ejemplo: <ul><li>Hecho: Interrumpí a un compañero.</li><li>Juicio: Siempre meto la pata.</li></ul> " }} />
            <Textarea id="judgment" value={judgment} onChange={e => setJudgment(e.target.value)} disabled={isSaved} placeholder="Anota qué partes son hechos y cuáles son juicios" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Elige tu respuesta actual</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Pregúntate: “Si volviera a pasar, ¿qué podría hacer diferente?”. Escríbelo como una acción concreta. <br> Ejemplo: Pedir disculpas y dejar que termine de hablar. " }} />
            <Textarea id="response" value={response} onChange={e => setResponse(e.target.value)} disabled={isSaved} placeholder="Escribe tu respuesta o acción actual " />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compassion-phrase">Cierra con compasión</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Escribe una frase que te ayude a dejar ir lo que pasó, reconociendo que eres más que ese momento. <br>Ejemplo: Eso pasó, aprendí y ahora sigo adelante." }} />
            <Textarea id="compassion-phrase" value={compassionPhrase} onChange={e => setCompassionPhrase(e.target.value)} disabled={isSaved} placeholder="Escribe tu frase de cierre compasivo" />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Autorregistro</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
