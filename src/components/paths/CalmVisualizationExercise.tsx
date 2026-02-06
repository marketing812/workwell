"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle } from 'lucide-react';
import type { CalmVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';

interface CalmVisualizationExerciseProps {
  content: CalmVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CalmVisualizationExercise({ content, pathId, onComplete }: CalmVisualizationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleComplete = () => {
    if (isCompleted) return;

    addNotebookEntry({
      title: `Práctica completada: ${content.title}`,
      content: "He completado la visualización para cultivar la calma y he marcado el módulo como finalizado.",
      pathId: pathId,
      userId: user?.id,
    });
    
    setIsCompleted(true);
    onComplete(); // Mark module as complete
    toast({ title: "Práctica Finalizada", description: "Tu ejercicio ha sido guardado y marcado como completado." });
  };
  
  const meditationText = "Cierra los ojos y visualiza la situación que te genera ansiedad. Ahora, imagina que una luz cálida te envuelve, creando una burbuja de calma. Dentro de esa burbuja, te sientes seguro/a. Observa la escena desde esa distancia, sabiendo que puedes manejarla. Respira hondo y siente cómo la calma se expande. Repite mentalmente: 'Puedo estar aquí, estoy a salvo'.";

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && 
            <CardDescription className="pt-2">
                {content.objective}
                {content.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src={content.audioUrl} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
            </CardDescription>
        }
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
            <>
                <div className="space-y-4 p-4 border rounded-lg bg-background animate-in fade-in-0 duration-500">
                  <p className="text-sm whitespace-pre-line">{meditationText}</p>
                </div>
                
                <Button onClick={handleComplete} className="w-full mt-6">
                    <CheckCircle className="mr-2 h-4 w-4" /> Marcar como completado
                </Button>
            </>
        ) : (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Práctica finalizada!</h4>
                <p className="text-muted-foreground">Has ensayado una respuesta más calmada. Tu cerebro está aprendiendo.</p>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={() => setIsCompleted(false)} variant="outline">Repetir Visualización</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
