
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, PlayCircle, BookOpen } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MeditacionGuiadaSinJuicioExerciseContent } from '@/data/paths/pathTypes';

interface MeditacionGuiadaSinJuicioExerciseProps {
  content: MeditacionGuiadaSinJuicioExerciseContent;
  pathId: string;
}

export function MeditacionGuiadaSinJuicioExercise({ content, pathId }: MeditacionGuiadaSinJuicioExerciseProps) {
  const { toast } = useToast();
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({
        title: "Reflexión vacía",
        description: "Escribe algo en tu reflexión para guardarla.",
        variant: "destructive"
      });
      return;
    }
    addNotebookEntry({ title: 'Reflexión: Meditación sin Juicio', content: reflection, pathId: pathId });
    toast({ title: 'Reflexión guardada' });
    setIsSaved(true);
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
          <div className="text-center">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6semana4tecnica1.mp3" type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        <form onSubmit={handleSave} className="mt-4 space-y-2">
            <Label htmlFor="reflection-meditation">¿Cómo fue esta experiencia para ti?</Label>
            <Textarea id="reflection-meditation" value={reflection} onChange={e => setReflection(e.target.value)} disabled={isSaved} />
            {!isSaved ? (
                <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Reflexión</Button>
            ) : (
                 <div className="flex items-center justify-center p-3 mt-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Guardado.</p>
                </div>
            )}
        </form>
      </CardContent>
    </Card>
  );
}

