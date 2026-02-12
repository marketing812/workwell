"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SelfCareContractExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface SelfCareContractExerciseProps {
  content: SelfCareContractExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function SelfCareContractExercise({ content, pathId, onComplete }: SelfCareContractExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [notWilling, setNotWilling] = useState('');
  const [commitment, setCommitment] = useState('');
  const [howToDo, setHowToDo] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setNotWilling('');
    setCommitment('');
    setHowToDo('');
    setIsSaved(false);
  };


  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!notWilling.trim() || !commitment.trim() || !howToDo.trim()) {
      toast({
        title: "Contrato incompleto",
        description: "Por favor, completa todas las secciones del contrato.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*No estoy dispuesta/o a:*
${notWilling}

*Me comprometo a:*
${commitment}

*Lo haré de forma:*
${howToDo}
    `;
    addNotebookEntry({ title: 'Mi Contrato Interno de Autocuidado', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Contrato Guardado', description: 'Tu pacto contigo se ha guardado en el cuaderno.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-muted-foreground">A menudo hablamos de poner límites hacia fuera, pero ¿qué pasa con los límites internos? Este ejercicio te ayuda a identificar con claridad aquello que ya no estás dispuesto o dispuesta a seguir permitiéndote, desde un lugar de cuidado, no de juicio.</p>
            <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
       case 1:
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">Instrucciones</h4>
            <p className="text-muted-foreground">Busca un momento tranquilo para ti. Lee cada bloque con calma y completa las frases con sinceridad. No hay respuestas correctas: este contrato es solo tuyo, para recordarte lo que necesitas cuidar y cómo quieres comprometerte contigo.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Empezar a construir <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">No estoy dispuesta/o a…</h4>
            <div className="text-sm text-muted-foreground p-3 border rounded-md bg-background/50">
              <p className="font-semibold">Algunos ejemplos:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Seguir callando lo que me duele.</li>
                <li>Ceder siempre para evitar conflictos.</li>
                <li>Negar mis necesidades para complacer.</li>
                <li>Aceptar la falta de respeto, aunque venga disfrazada de cercanía.</li>
              </ul>
            </div>
            <Label htmlFor="not-willing-to">Completa:</Label>
            <Textarea id="not-willing-to" value={notWilling} onChange={e => setNotWilling(e.target.value)} placeholder="No estoy dispuesta/o a..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!notWilling.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Me comprometo a…</h4>
            <p className="text-sm text-muted-foreground">Este compromiso no es una obligación, sino una forma de empezar a elegirte.</p>
            <div className="text-sm text-muted-foreground p-3 border rounded-md bg-background/50">
                <p className="font-semibold">Algunos ejemplos:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Cuidar mi energía como prioridad.</li>
                    <li>Escuchar mis emociones sin juzgarlas.</li>
                    <li>Recordarme que tengo derecho a poner límites.</li>
                    <li>Practicar el respeto hacia mí cada día.</li>
                </ul>
            </div>
            <Label htmlFor="commitment">Completa:</Label>
            <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} placeholder="Me comprometo a..." />
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!commitment.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Lo haré de forma…</h4>
            <p className="text-sm text-muted-foreground">¿Cómo quieres ejercer ese autocuidado?</p>
            <div className="text-sm text-muted-foreground p-3 border rounded-md bg-background/50">
                <p className="font-semibold">Algunos ejemplos:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Clara, sin herir.</li>
                    <li>Suave, pero firme.</li>
                    <li>Honesta, aunque me cueste.</li>
                </ul>
            </div>
            <Label htmlFor="how-to-do">Completa:</Label>
            <Textarea id="how-to-do" value={howToDo} onChange={e => setHowToDo(e.target.value)} placeholder="Lo haré de forma..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar mi Contrato en el cuaderno terapéutico</Button>
            </div>
          </form>
        );
      case 5:
        return (
           <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Contrato Guardado</h4>
            <p className="text-muted-foreground">Tu pacto contigo se ha guardado. Vuelve a él cuando necesites recordar tu compromiso.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Crear otro contrato</Button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta4/tecnicas/Ruta4semana4audio8tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
