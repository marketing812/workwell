"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle } from 'lucide-react';
import type { SelfAcceptanceAudioExerciseContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface SelfAcceptanceAudioExerciseProps {
  content: SelfAcceptanceAudioExerciseContent;
  pathId: string;
  onComplete: () => void;
  audioUrl?: string; // Make audioUrl an optional prop
}

export default function SelfAcceptanceAudioExercise({ content, pathId, onComplete, audioUrl }: SelfAcceptanceAudioExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    if (isCompleted) return;

    addNotebookEntry({
      title: `Práctica completada: ${content.title}`,
      content: "He completado la práctica de audio de autoaceptación y la he marcado como finalizada.",
      pathId: pathId,
      userId: user?.id,
    });
    
    setIsCompleted(true);
    onComplete();
    toast({ title: "Práctica Finalizada", description: "Tu ejercicio ha sido guardado y marcado como completado." });
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                 <div className="mt-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-foreground">Objetivo terapéutico</h4>
                        <audio controls controlsList="nodownload" className="w-full mt-1">
                            <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana2tecnica2primeraparte.mp3`} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">Meditación</h4>
                        <audio controls controlsList="nodownload" className="w-full mt-1">
                            <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana2tecnica2meditacion.mp3`} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Micropráctica</h4>
                        <audio controls controlsList="nodownload" className="w-full mt-1">
                            <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta10/tecnicas/Ruta10semana2tecnica2micropractica.mp3`} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                </div>
            </CardDescription>
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
                <p className="text-muted-foreground">Has practicado una forma poderosa de hablarte. Recuerda que puedes volver a este ejercicio siempre que lo necesites.</p>
                <Button onClick={() => setIsCompleted(false)} variant="outline" className="w-full">Repetir Práctica</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
