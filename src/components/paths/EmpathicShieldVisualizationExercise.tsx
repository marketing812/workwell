"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { EmpathicShieldVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';

interface EmpathicShieldVisualizationExerciseProps {
  content: EmpathicShieldVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function EmpathicShieldVisualizationExercise({ content, pathId, onComplete }: EmpathicShieldVisualizationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    if (!isCompleted) {
      addNotebookEntry({
        title: `PrÃ¡ctica completada: ${content.title}`,
        content: "He completado la visualizaciÃ³n de Escudo EmpÃ¡tico y he marcado el mÃ³dulo como finalizado.",
        pathId: pathId,
        userId: user?.id,
      });
      setIsCompleted(true);
      toast({ title: "PrÃ¡ctica Finalizada", description: "Has entrenado una nueva forma de cuidar: desde la empatÃ­a que tambiÃ©n te cuida a ti." });
      onComplete();
    }
    setStep(7); // Go to final confirmation screen
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <Button onClick={nextStep}>Empezar VisualizaciÃ³n <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Bienvenida
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Bienvenida: cuida sin fundirte</h4>
            <audio controls controlsList="nodownload" className="w-full">
              <source src="`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta5/tecnicas/R5sem3tec1pantalla12.mp3`" type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <p className="text-muted-foreground">Vamos a realizar una visualizaciÃ³n para ayudarte a sostener a los demÃ¡s sin perderte tÃº. Imagina que construyes un espacio interno que te protege sin cerrarte. Ese espacio se llama escudo empÃ¡tico: un filtro emocional que cuida tu energÃ­a y mantiene tu presencia sin exigirte absorber lo que no te corresponde.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2: // RespiraciÃ³n
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">RespiraciÃ³n y conexiÃ³n</h4>
            <audio controls controlsList="nodownload" className="w-full">
              <source src="`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta5/tecnicas/R5sem3tec1pantallas2-6-2.mp3`" type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <p className="text-muted-foreground">Busca una posiciÃ³n cÃ³moda. Cierra los ojos si te ayuda a conectar. Lleva tu atenciÃ³n a la respiraciÃ³n.</p>
            <p className="text-muted-foreground">Inhala por la narizâ€¦ RetÃ©nâ€¦ Exhala por la boca, vaciando completamente. Hazlo dos veces mÃ¡sâ€¦ Y siente cÃ³mo tu cuerpo empieza a calmarse.</p>
            <p className="text-muted-foreground italic">Solo por hoy, no tienes que resolver nada. Solo estar.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 3: // Construye
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Construye tu escudo emocional</h4>
            <p className="text-muted-foreground">Imagina ahora que una luz suave y cÃ¡lida te envuelve. Puede tener el color que tÃº necesites hoy. Esta luz forma un escudo flexible a tu alrededor: por delante, por detrÃ¡s, a los lados, arriba, abajo.</p>
            <p className="text-muted-foreground">Este escudo no es una barrera. Es una membrana sabia: deja pasar lo que nutre, y suaviza lo que desborda. Dentro de Ã©l respiras mejor. Piensas con mÃ¡s claridad. Puedes cuidar sin romperte.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 4: // Escena real
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Escena emocional real</h4>
            <p className="text-muted-foreground">Ahora, piensa en una persona o situaciÃ³n que suele exigirte emocionalmente. Imagina que estÃ¡s ahÃ­, pero con tu escudo activo.</p>
            <p className="text-muted-foreground">Ves al otro. Lo escuchas. Comprendes su emociÃ³nâ€¦ Pero no te pierdes en ella. Tu centro sigue contigo. EstÃ¡s presente. EstÃ¡s entera/o. AcompaÃ±asâ€¦ pero no absorbes.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 5: // Refuerza
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Refuerza tu espacio interior</h4>
            <p className="text-muted-foreground">Vuelve a ti. A tu cuerpo. A tu escudo. Siente su contorno. Respira dentro de Ã©l.</p>
            <p className="text-muted-foreground">Repite mentalmente:</p>
            <blockquote className="p-4 italic border-l-4 bg-background border-primary">
              <p>â€œPuedo cuidar sin desaparecer.â€</p>
              <p>â€œMi presencia es suficiente.â€</p>
              <p>â€œTambiÃ©n yo merezco protecciÃ³n emocional.â€</p>
            </blockquote>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 6: // Cierre
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Cierre: tu escudo sigue contigo</h4>
            <p className="text-muted-foreground">Imagina cÃ³mo ese escudo se integra en tu conciencia. No desaparece: ahora vive dentro de ti, como una herramienta que puedes activar siempre que lo necesites.</p>
            <p className="text-muted-foreground">Respira una Ãºltima vezâ€¦ Y cuando estÃ©s lista/o, vuelve suavemente al presente.</p>
            <p className="text-muted-foreground italic">Has entrenado una nueva forma de cuidar: desde la empatÃ­a que tambiÃ©n te cuida a ti.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={handleComplete}>Finalizar Ejercicio <CheckCircle className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 7: // Confirmation screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Â¡PrÃ¡ctica finalizada!</h4>
            <p className="text-muted-foreground">Has creado un recurso interno muy valioso. Recuerda tu escudo empÃ¡tico la prÃ³xima vez que necesites cuidar y cuidarte. Tu escudo ahora vive dentro de ti.</p>
            
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2 whitespace-pre-line">{content.objective}</CardDescription>
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
        {renderStep()}
      </CardContent>
    </Card>
  );
}
