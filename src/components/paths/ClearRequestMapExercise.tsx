"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ClearRequestMapExerciseContent } from '@/data/paths/pathTypes';
import { Checkbox } from '../ui/checkbox';
import { useUser } from '@/contexts/UserContext';

interface ClearRequestMapExerciseProps {
  content: ClearRequestMapExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ClearRequestMapExercise({ content, pathId, onComplete }: ClearRequestMapExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [situation, setSituation] = useState('');
  const [need, setNeed] = useState('');
  const [when, setWhen] = useState('');
  const [how, setHow] = useState('');
  const [finalPhrase, setFinalPhrase] = useState('');
  const [checklist, setChecklist] = useState({ isClear: false, isKind: false, isEasy: false });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación:* ${situation}
*Petición final:* ${finalPhrase}
    `;
    addNotebookEntry({ title: 'Mi Petición Clara', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Petición Guardada' });
    setIsSaved(true);
    onComplete();
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src="https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana3tecnica1.mp3" type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
            {content.objective}
            </CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Describe una situación en la que necesites ayuda</h4>
            <Textarea id="sit-clear-req" value={situation} onChange={e => setSituation(e.target.value)} disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Define qué, cuándo y cómo</h4>
            <Textarea value={need} onChange={e => setNeed(e.target.value)} placeholder="Qué necesito exactamente..." disabled={isSaved}/>
            <Textarea value={when} onChange={e => setWhen(e.target.value)} placeholder="Cuándo lo necesito..." disabled={isSaved}/>
            <Textarea value={how} onChange={e => setHow(e.target.value)} placeholder="Cómo quiero que me ayuden..." disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Formula tu petición final</h4>
            <Textarea id="final-phrase-req" value={finalPhrase} onChange={e => setFinalPhrase(e.target.value)} disabled={isSaved}/>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Revisión rápida</h4>
            <div className="flex items-center gap-2"><Checkbox id="isClear" onCheckedChange={c => setChecklist(p => ({...p, isClear: !!c}))} disabled={isSaved}/><Label htmlFor="isClear" className="font-normal">¿Es clara?</Label></div>
            <div className="flex items-center gap-2"><Checkbox id="isKind" onCheckedChange={c => setChecklist(p => ({...p, isKind: !!c}))} disabled={isSaved}/><Label htmlFor="isKind" className="font-normal">¿Es amable?</Label></div>
            <div className="flex items-center gap-2"><Checkbox id="isEasy" onCheckedChange={c => setChecklist(p => ({...p, isEasy: !!c}))} disabled={isSaved}/><Label htmlFor="isEasy" className="font-normal">¿Es fácil de responder?</Label></div>
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Petición</Button>
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
