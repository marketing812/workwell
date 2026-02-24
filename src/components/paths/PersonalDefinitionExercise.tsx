
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PersonalDefinitionExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface PersonalDefinitionExerciseProps {
  content: PersonalDefinitionExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function PersonalDefinitionExercise({ content, pathId, onComplete }: PersonalDefinitionExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [definition, setDefinition] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!definition.trim()) {
      toast({ title: 'Definición vacía', description: 'Por favor, escribe tu definición personal.', variant: 'destructive' });
      return;
    }
    const notebookContent = `**${content.title}**\n\nPregunta: Para mí, ser resiliente es... | Respuesta: ${definition}`;
    
    addNotebookEntry({ title: 'Mi Definición de Resiliencia', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Definición Guardada', description: 'Tu definición de resiliencia se ha guardado en el cuaderno.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const resetExercise = () => {
    setStep(0);
    setDefinition('');
    setIsSaved(false);
  }

  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-muted-foreground">La resiliencia no es una fórmula universal. Tiene que ver con cómo tú vives el dolor, el cambio y la transformación. Te invito a escribir tu propia definición.</p>
            <Button onClick={nextStep} className="w-full">
              Comenzar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1: // Guiding questions
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Preguntas guía</h4>
            <p className="text-sm text-muted-foreground">Reflexiona con estas preguntas (puedes usarlas como inspiración o escribir libremente):</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm pl-4">
              <li>¿Qué significa para ti "sostenerte en lo difícil"?</li>
              <li>¿Qué has aprendido de tus momentos más duros?</li>
              <li>¿Cómo te gustaría recordar tu forma de atravesar los desafíos?</li>
            </ul>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2: // Free writing
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Redacción libre</h4>
            <Label htmlFor="resilience-def">Ahora escribe tu propia definición de resiliencia, con tus palabras. Puedes empezar con:</Label>
            <p className="text-sm text-muted-foreground italic">"Para mí, ser resiliente es..."</p>
            <Textarea id="resilience-def" value={definition} onChange={e => setDefinition(e.target.value)} rows={5} disabled={isSaved} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
              <Button type="submit" disabled={isSaved || !definition.trim()}>
                <Save className="mr-2 h-4 w-4" /> {isSaved ? 'Guardado' : 'Guardar mi Definición'}
              </Button>
            </div>
          </form>
        );
      case 3: // Confirmation
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Definición Guardada</h4>
            <p className="text-muted-foreground">Tendrás acceso a ella cuando necesites recordarte de lo que eres capaz.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">
              Empezar de nuevo
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
        {content.audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
