
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { VitaminMomentExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface VitaminMomentExerciseProps {
  content: VitaminMomentExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function VitaminMomentExercise({ content, pathId, onComplete }: VitaminMomentExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({
        title: "Reflexión vacía",
        description: "Escribe tu reflexión para guardarla.",
        variant: "destructive"
      });
      return;
    }
    addNotebookEntry({ title: content.title, content: reflection, pathId: pathId, userId: user?.id });
    toast({ title: "Reflexión Guardada", description: "Tu momento vitamina ha sido guardado." });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2">
            {content.objective}
            {content.audioUrl && (
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full h-10">
                        <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            )}
            <p className="text-sm text-muted-foreground pt-1">Duración estimada: {content.duration}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reflection-vitamin" className="font-semibold">Anótalo en una frase en tu cuaderno</Label>
            <Textarea 
              id="reflection-vitamin"
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Escribe aquí tu momento vitamina del día..."
              rows={4}
              disabled={isSaved}
            />
             <p className="text-xs text-muted-foreground italic">Beneficio: refuerza tu percepción de que sí tienes apoyos y ayuda a tu cerebro a fijar las experiencias positivas (según la neurociencia, dedicar unos segundos extra a saborear el recuerdo fortalece las conexiones neuronales asociadas a la gratitud y la seguridad emocional).</p>
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4"/> Guardar Reflexión en mi Cuaderno
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu reflexión ha sido guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
