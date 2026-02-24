
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DiarioMeDiCuentaExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface DiarioMeDiCuentaExerciseProps {
  content: DiarioMeDiCuentaExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const messages = [
    "Cada vez que te observas con cariño, sanas un poco más.",
    "Lo que te das cuenta hoy, puede cambiar tu mañana.",
    "No necesitas cambiar lo que sientes. Solo comprenderlo.",
    "El simple hecho de mirarte con respeto… ya es transformación."
];

export default function DiarioMeDiCuentaExercise({ content, pathId, onComplete }: DiarioMeDiCuentaExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [step, setStep] = useState(0);
  const [noticed, setNoticed] = useState('');
  const [howNoticed, setHowNoticed] = useState('');
  const [whatINeed, setWhatINeed] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setNoticed('');
    setHowNoticed('');
    setWhatINeed('');
    setIsSaved(false);
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!noticed.trim() || !howNoticed.trim() || !whatINeed.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todas las preguntas para guardar tu registro.",
        variant: 'destructive',
      });
      return;
    }

    const notebookContent = `
**${content.title}**

Pregunta: ¿Qué noté en mí hoy? | Respuesta: ${noticed}

Pregunta: ¿Qué me ayudó a notarlo? | Respuesta: ${howNoticed}

Pregunta: ¿Qué necesito ahora que me he dado cuenta de esto? | Respuesta: ${whatINeed}
`;
    addNotebookEntry({ title: 'Mi "Me di cuenta" del día', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Entrada Guardada' });
    if(!isSaved) { // To avoid calling onComplete multiple times
        onComplete();
    }
    setIsSaved(true);
    nextStep();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // PANTALLA 1 & 2: Intro y explicación
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg text-center">¿Qué es un “me di cuenta”?</h4>
                <p className="text-sm text-muted-foreground">Son esos instantes en los que, de pronto, notas algo que antes te pasaba desapercibido:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                    <li>“Me di cuenta de que estaba irritada porque no descansé.”</li>
                    <li>“Me di cuenta de que suelo exigirme en silencio.”</li>
                    <li>“Me di cuenta de que necesito pedir ayuda, aunque me cueste.”</li>
                </ul>
                <p className="text-sm text-muted-foreground">No necesitas grandes respuestas. Solo estar atenta o atento a lo cotidiano.</p>
                <div className="pt-4 border-t">
                    <h4 className="font-semibold text-lg text-center">Cada día, intenta registrar uno o dos momentos de autoconciencia.</h4>
                    <p className="text-sm text-muted-foreground text-center">El formato es muy simple:</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground pl-4 space-y-1 mt-2">
                        <li>¿Qué notaste?</li>
                        <li>¿Qué te ayudó a darte cuenta?</li>
                        <li>¿Qué puedes hacer con eso ahora?</li>
                    </ol>
                </div>
                <Button onClick={nextStep} className="w-full mt-4">Comenzar mi registro <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        );
      case 1: // PANTALLA 3: Formulario
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-center">Tu entrada de hoy</h4>
                <p className="text-sm text-muted-foreground text-center">Completa tu “me di cuenta” del día:</p>
                <div className="space-y-2">
                    <Label htmlFor="noticed" className="font-semibold">1. ¿Qué noté en mí hoy?</Label>
                    <Textarea id="noticed" value={noticed} onChange={e => setNoticed(e.target.value)} disabled={isSaved} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="howNoticed" className="font-semibold">2. ¿Qué me ayudó a notarlo? (Ej: pausa, emoción intensa, algo que dije o pensé...)</Label>
                    <Textarea id="howNoticed" value={howNoticed} onChange={e => setHowNoticed(e.target.value)} disabled={isSaved} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="whatINeed" className="font-semibold">3. ¿Qué necesito ahora que me he dado cuenta de esto?</Label>
                    <Textarea id="whatINeed" value={whatINeed} onChange={e => setWhatINeed(e.target.value)} disabled={isSaved} />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2 pt-2"><CheckCircle className="h-4 w-4 text-primary" />Puedes completar este diario cada día o varias veces a la semana. Lo importante es crear el hábito de escucharte con más atención y menos juicio.</p>
                <div className="flex justify-between w-full mt-2">
                    <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                    <Button type="submit" disabled={isSaved}>
                        {isSaved ? <><CheckCircle className="mr-2 h-4 w-4" /> Guardado</> : <><Save className="mr-2 h-4 w-4"/> Guardar entrada</>}
                    </Button>
                </div>
            </form>
        );
      case 2: // PANTALLA 4: Mensajes y Cierre
        return (
            <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                 <CheckCircle className="h-10 w-10 text-primary mx-auto" />
                <h4 className="font-semibold text-lg">Entrada Guardada</h4>
                <p className="text-muted-foreground">Puedes abrir uno de estos mensajes cuando necesites impulso para mirar dentro:</p>
                <Accordion type="single" collapsible className="w-full text-left">
                    <AccordionItem value="random-message">
                        <AccordionTrigger>Despliega para ver un mensaje</AccordionTrigger>
                        <AccordionContent className="text-center italic p-4">
                            "{messages[Math.floor(Math.random() * messages.length)]}"
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/therapeutic-notebook">Ver mi cuaderno</Link>
                    </Button>
                    <Button onClick={resetExercise} variant="outline" className="w-full sm:w-auto">
                        Hacer otro registro
                    </Button>
                </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
            <Edit3 className="mr-2" />{content.title}
        </CardTitle>
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
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
