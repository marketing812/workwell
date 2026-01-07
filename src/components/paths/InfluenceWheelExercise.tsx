
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InfluenceWheelExerciseContent } from '@/data/paths/pathTypes';

interface InfluenceWheelExerciseProps {
  content: InfluenceWheelExerciseContent;
  pathId: string;
}

interface Situation {
  text: string;
  control: 'mine' | 'not_mine' | 'partial' | '';
}

export function InfluenceWheelExercise({ content, pathId }: InfluenceWheelExerciseProps) {
  const { toast } = useToast();
  const [situations, setSituations] = useState<Situation[]>(() => Array(5).fill({ text: '', control: '' }));
  const [isSaved, setIsSaved] = useState(false);

  const handleSituationChange = (index: number, field: keyof Situation, value: Situation[keyof Situation]) => {
    const newSituations = [...situations];
    (newSituations[index] as any)[field] = value;
    setSituations(newSituations);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledSituations = situations.filter(sit => sit.text.trim() && sit.control);
    
    if (filledSituations.length < 3) {
      toast({
        title: 'Ejercicio Incompleto',
        description: 'Por favor, completa al menos 3 situaciones con su clasificación antes de guardar.',
        variant: 'destructive',
      });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledSituations.forEach((sit, index) => {
      notebookContent += `**Situación ${index + 1}:** ${sit.text} (Control: ${sit.control})\n\n`;
    });

    addNotebookEntry({ title: 'Mi Rueda de Influencia', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu rueda de influencia ha sido guardada.' });
    setIsSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana4tecnica1.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <p><b>Paso 1: Lista de situaciones</b><br/>  Piensa en los últimos 7 días y anota situaciones que te han preocupado, estresado o hecho sentir responsable.   Ejemplo:   Preparar una presentación importante.   La actitud negativa de un compañero/a.   Que mi pareja esté de mal humor. </p>
          </div>
          
          <div className="space-y-4">
            <p><b>Paso 2: Clasificación</b><br/> Para cada situación, selecciona si: <br/>- Depende de mí. <br/>- No depende de mí. <br/>- Depende parcialmente de mí. <p>Ejemplo: Preparar una presentación importante → Depende de mí. <br/>Que mi pareja esté de mal humor → No depende de mí. </p></p>
            {situations.map((sit, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                <Label htmlFor={`sit-${index}`}>Situación {index + 1}</Label>
                <Textarea id={`sit-${index}`} value={sit.text} onChange={e => handleSituationChange(index, 'text', e.target.value)} disabled={isSaved} />
                <RadioGroup value={sit.control} onValueChange={v => handleSituationChange(index, 'control', v as any)} disabled={isSaved}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="mine" id={`c-${index}-m`} /><Label htmlFor={`c-${index}-m`} className="font-normal">Depende de mí</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="not_mine" id={`c-${index}-n`} /><Label htmlFor={`c-${index}-n`} className="font-normal">No depende de mí</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="partial" id={`c-${index}-p`} /><Label htmlFor={`c-${index}-p`} className="font-normal">Depende parcialmente</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>

          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Rueda</Button>
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
