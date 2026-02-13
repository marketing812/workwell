
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AlternativeStoriesExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface AlternativeStoriesExerciseProps {
  content: AlternativeStoriesExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function AlternativeStoriesExercise({ content, pathId, onComplete }: AlternativeStoriesExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [situation, setSituation] = useState('');
  const [negativeStory, setNegativeStory] = useState('');
  const [neutralStory, setNeutralStory] = useState('');
  const [positiveStory, setPositiveStory] = useState('');
  const [usualAnticipation, setUsualAnticipation] = useState('');
  const [anticipationReason, setAnticipationReason] = useState('');
  const [newPossibilities, setNewPossibilities] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const storageKey = `exercise-progress-${pathId}-alternativeStories`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setSituation(data.situation || '');
        setNegativeStory(data.negativeStory || '');
        setNeutralStory(data.neutralStory || '');
        setPositiveStory(data.positiveStory || '');
        setUsualAnticipation(data.usualAnticipation || '');
        setAnticipationReason(data.anticipationReason || '');
        setNewPossibilities(data.newPossibilities || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { situation, negativeStory, neutralStory, positiveStory, usualAnticipation, anticipationReason, newPossibilities, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [situation, negativeStory, neutralStory, positiveStory, usualAnticipation, anticipationReason, newPossibilities, isSaved, storageKey, isClient]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !negativeStory.trim() || !neutralStory.trim() || !positiveStory.trim() || !usualAnticipation.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todas las historias y selecciona tu anticipación habitual.",
        variant: "destructive",
      });
      return;
    }

    let notebookContent = `
**Ejercicio: ${content.title}**

*Situación incierta que me preocupa:*
${situation}

*Tres versiones posibles que imaginé:*
- **Historia Negativa:** ${negativeStory}
- **Historia Neutral:** ${neutralStory}
- **Historia Positiva:** ${positiveStory}

*La historia que suelo anticipar más es la ${usualAnticipation}.*
${anticipationReason ? `*Creo que es por esto:* ${anticipationReason}` : ''}

*Otras formas de ver la situación que podría considerar:*
${newPossibilities}
    `;

    addNotebookEntry({
      title: `Escenario alternativo: ${content.title}`,
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tus 'Historias Alternativas' se han guardado en el Cuaderno Terapéutico.",
    });
    setIsSaved(true);
    onComplete();
  };
  
  if (!isClient) {
    return null; // O un componente de carga
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="situation" className="font-semibold">Elige una situación incierta que te preocupe</Label>
            <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ej: Tengo que hablar con mi jefa sobre un tema incómodo." disabled={isSaved} />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Imagina tres versiones posibles</h4>
            <div className="space-y-2">
                <Label htmlFor="negative-story" className="text-red-600 dark:text-red-400">🔴 Historia negativa</Label>
                <Textarea id="negative-story" value={negativeStory} onChange={e => setNegativeStory(e.target.value)} placeholder="Ej: Pensará que me quejo por todo y se molestará." disabled={isSaved} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="neutral-story" className="text-amber-600 dark:text-amber-400">🟠 Historia neutral</Label>
                <Textarea id="neutral-story" value={neutralStory} onChange={e => setNeutralStory(e.target.value)} placeholder="Ej: Me escuchará, pero no se comprometerá con nada." disabled={isSaved} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="positive-story" className="text-green-600 dark:text-green-400">🟢 Historia positiva</Label>
                <Textarea id="positive-story" value={positiveStory} onChange={e => setPositiveStory(e.target.value)} placeholder="Ej: Agradecerá que lo comparta y buscará una solución." disabled={isSaved} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">¿Cuál sueles anticipar más?</Label>
            <RadioGroup onValueChange={setUsualAnticipation} value={usualAnticipation} className="space-y-1" disabled={isSaved}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="negativa" id="antic-neg" /><Label htmlFor="antic-neg" className="font-normal">La historia negativa</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="neutral" id="antic-neu" /><Label htmlFor="antic-neu" className="font-normal">La historia neutral</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="positiva" id="antic-pos" /><Label htmlFor="antic-pos" className="font-normal">La historia positiva</Label></div>
            </RadioGroup>
            <Textarea value={anticipationReason} onChange={e => setAnticipationReason(e.target.value)} placeholder="¿Por qué crees que sueles imaginar esa opción? (Opcional)" disabled={isSaved} className="text-sm mt-2" />
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="new-possibilities" className="font-semibold">Abre nuevas posibilidades</Label>
            <Textarea id="new-possibilities" value={newPossibilities} onChange={e => setNewPossibilities(e.target.value)} placeholder="¿Qué otras formas de ver esta situación podrías empezar a considerar?" disabled={isSaved} />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
