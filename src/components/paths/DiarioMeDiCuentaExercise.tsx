

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

export function DiarioMeDiCuentaExercise({ content, pathId, onComplete }: DiarioMeDiCuentaExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [noticed, setNoticed] = useState('');
  const [howNoticed, setHowNoticed] = useState('');
  const [whatINeed, setWhatINeed] = useState('');
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**

*¿Qué noté en mí hoy?:*
${noticed}

*¿Qué me ayudó a notarlo?:*
${howNoticed}

*¿Qué necesito ahora que me he dado cuenta de esto?:*
${whatINeed}
`;
    addNotebookEntry({ title: 'Mi "Me di cuenta" del día', content: notebookContent, pathId: pathId });
    toast({ title: 'Entrada Guardada' });
    onComplete();
    setStep(prev => prev + 1);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4 space-y-4"><p className="text-center">Registra uno o dos momentos de autoconciencia del día.</p><Button onClick={nextStep} className="w-full">Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>¿Qué noté en mí hoy?</Label><Textarea value={noticed} onChange={e => setNoticed(e.target.value)} /><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!noticed}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 2: return <div className="p-4 space-y-4"><Label>¿Qué me ayudó a notarlo?</Label><Textarea value={howNoticed} onChange={e => setHowNoticed(e.target.value)} /><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!howNoticed}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 3: return <div className="p-4 space-y-4"><Label>¿Qué necesito ahora que me he dado cuenta de esto?</Label><Textarea value={whatINeed} onChange={e => setWhatINeed(e.target.value)} /><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={handleSave} className="w-auto" disabled={!whatINeed}><Save className="mr-2 h-4 w-4"/>Guardar</Button></div></div>;
      case 4: return <div className="p-4 text-center space-y-4"><CheckCircle className="h-10 w-10 text-primary mx-auto" /><p className="italic">"{messages[Math.floor(Math.random() * messages.length)]}"</p><Button onClick={() => setStep(0)} variant="outline">Registrar otro "Me di cuenta"</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}<div className="mt-4"><audio controls controlsList="nodownload" className="w-full"><source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6semana4tecnica2.mp3" type="audio/mp3" />Tu navegador no soporta el elemento de audio.</audio></div></CardDescription>}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
