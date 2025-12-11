
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, PlayCircle, BookOpen } from 'lucide-react';
import type { EmpathicShieldVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EmpathicShieldVisualizationExerciseProps {
  content: EmpathicShieldVisualizationExerciseContent;
  pathId: string;
}

export function EmpathicShieldVisualizationExercise({ content, pathId }: EmpathicShieldVisualizationExerciseProps) {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({ title: "Práctica Finalizada", description: "Has entrenado una nueva forma de cuidar: desde la empatía que también te cuida a ti." });
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
            <>
                <Button onClick={handleComplete} className="w-full mt-6">
                    <CheckCircle className="mr-2 h-4 w-4" /> Marcar como completado
                </Button>
            </>
        ) : (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
                <p className="text-muted-foreground">Has creado un recurso interno muy valioso. Recuerda tu escudo empático la próxima vez que necesites cuidar y cuidarte.</p>
                <Button onClick={() => setIsCompleted(false)} variant="outline" className="w-full">Repetir Visualización</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
