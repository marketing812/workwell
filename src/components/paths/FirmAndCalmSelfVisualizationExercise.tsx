
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { FirmAndCalmSelfVisualizationExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface FirmAndCalmSelfVisualizationExerciseProps {
  content: FirmAndCalmSelfVisualizationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function FirmAndCalmSelfVisualizationExercise({ content, pathId, onComplete }: FirmAndCalmSelfVisualizationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({ title: "Reflexión vacía", variant: 'destructive' });
      return;
    }
    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: `¿Qué sentí al verte firme y tranquilo?\n\n${reflection}`,
      pathId: pathId,
      userId: user?.id,
    });
    toast({ title: 'Reflexión guardada' });
    setIsSaved(true);
    onComplete();
  };

  const transcript = `Vamos a entrar en una breve visualización. 
Un momento para conectar con esa parte de ti que sabe cuidarte, incluso cuando hay incomodidad. 

Comienza llevando tu atención a la respiración. 
No hace falta cambiar nada. Solo obsérvala… 

Inhalas… 
Exhalas… 

Siente cómo el aire entra por tu nariz… y sale lentamente por tu boca. 
Con cada exhalación, deja que tu cuerpo suelte un poco más de tensión. 

Inhala… 
Exhala… 

Ahora, imagina una situación concreta en la que necesitas poner un límite. 
Puede ser una escena reciente… o algo que anticipas que podría pasar. 

Observa la escena desde fuera, como si vieras una película. 
¿Dónde estás? ¿Con quién estás? 
¿Qué te ha pedido o dicho la otra persona? 

Tómate unos segundos para traer todos los detalles posibles. 

Y ahora… en esa escena, imagina que aparece una versión de ti más firme, más centrada, más tranquila. 

Es tu “yo firme y tranquilo”. 
Una parte de ti que puede sostener el malestar… sin ceder. 

Observa cómo se mueve… 
Cómo te mira… 
Qué tono de voz usa… 

Escucha con atención cómo esta versión de ti responde. 
No necesita alzar la voz, ni justificarse en exceso. 
Solo expresa, con claridad y respeto, algo como: 

“Lo siento, pero esta vez no puedo.” 
“Entiendo tu situación, pero necesito priorizarme.” 
“Me importa la relación, y por eso quiero poner este límite con honestidad.” 

Siente en tu cuerpo lo que ocurre cuando esa versión tuya dice lo que necesita decir. 
¿Dónde lo notas? 
¿Qué cambia en tu respiración? 
¿Cómo reacciona la otra persona? 

Permite que la escena se desarrolle… 
Desde la firmeza, pero sin agresividad. 
Desde la calma, pero sin pasividad. 

Y si aparece incomodidad… obsérvala. Déjala estar. 
Visualiza cómo tu “yo firme” la sostiene. 
Sin huir. Sin romperse. 

Respira con ella. 

Y repite mentalmente, si te ayuda: 

“Puedo sentirme incómodo y aun así actuar con respeto y claridad.” 

Deja que la escena se vaya difuminando poco a poco… 
Y vuelve a sentir tu respiración, aquí, en el presente. 

Inhala… 
Exhala… 

Lleva tu atención a tu cuerpo… 
A los sonidos del entorno… 

Y cuando estés listo o lista, abre los ojos… lentamente. 

Has practicado algo muy importante: 
sostener un límite desde tu centro. 

Puedes volver a esta visualización cuando lo necesites. 
Cada vez será un poco más fácil.`;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">Busca un lugar tranquilo. Si puedes, siéntate con la espalda recta. Cierra los ojos o suaviza tu mirada. Respira. Escucha. Imagina. Y permite que tu “yo firme” te acompañe.</p>
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="transcript">
                <AccordionTrigger>Ver transcripción</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{transcript}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={nextStep} className="w-full mt-4">Continuar a la reflexión</Button>
          </div>
        );
      case 1:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <p className="text-sm text-muted-foreground">Has practicado algo muy importante: sostener un límite desde tu centro. Recuerda esta frase: “Puedo sentirme incómodo y aun así actuar con respeto y claridad.”</p>
            <div className="space-y-2">
              <Label htmlFor="reflection-visualization">¿Qué sentiste al verte firme y tranquilo?</Label>
              <Textarea id="reflection-visualization" value={reflection} onChange={e => setReflection(e.target.value)} disabled={isSaved} />
            </div>
            {!isSaved ? (
              <div className="flex justify-between w-full">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Reflexión</Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Guardado.</p>
              </div>
            )}
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2">{content.objective}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
