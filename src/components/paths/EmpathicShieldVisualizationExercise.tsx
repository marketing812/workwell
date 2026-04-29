"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import type { EmpathicShieldVisualizationExerciseContent } from "@/data/paths/pathTypes";
import { useToast } from "@/hooks/use-toast";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import { useUser } from "@/contexts/UserContext";
import { EXTERNAL_SERVICES_BASE_URL } from "@/lib/constants";

interface EmpathicShieldVisualizationExerciseProps {
  content: EmpathicShieldVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function EmpathicShieldVisualizationExercise({
  content,
  pathId,
  onComplete,
}: EmpathicShieldVisualizationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const handleComplete = () => {
    if (!isCompleted) {
      addNotebookEntry({
        title: `Practica completada: ${content.title}`,
        content: "He completado la visualizacion de Escudo Empatico y he marcado el modulo como finalizado.",
        pathId,
        userId: user?.id,
      });
      setIsCompleted(true);
      toast({
        title: "Practica finalizada",
        description: "Has entrenado una nueva forma de cuidar: desde la empatia que tambien te cuida a ti.",
      });
      onComplete();
    }
    setStep(3);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Bienvenida: cuida sin fundirte</h4>
            <audio controls controlsList="nodownload" className="w-full">
              <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta5/tecnicas/Ruta5sesion3tecnica1.mp3`} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
               <div className="flex justify-end w-full mt-4">
              <Button onClick={nextStep}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Preparación</h4>
  
           
            <p className="text-muted-foreground">
               <audio controls controlsList="nodownload" className="w-full">
              <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta5/tecnicas/R5sem3tec1pantalla12.mp3`} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio> Te recomiendo repetir esta visualización 2 o 3 veces por semana, especialmente antes de conversaciones emocionalmente exigentes o relaciones que te remueven.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep}>
                Empezar visualización <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta5/tecnicas/R5sem3tec1pantallas2-6-2.mp3`} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={handleComplete}>
                Finalizar ejercicio <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Practica finalizada</h4>
            <p className="text-muted-foreground">
              Has creado un recurso interno muy valioso. Recuerda tu escudo empatico la proxima vez que necesites cuidar y cuidarte. Tu escudo ahora vive dentro de ti.
            </p>
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
        <CardDescription className="pt-2 whitespace-pre-line">{content.objective}</CardDescription>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
