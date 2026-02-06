"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { QuestionYourIfsExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface QuestionYourIfsExerciseProps {
  content: QuestionYourIfsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function QuestionYourIfsExercise({ content, pathId, onComplete }: QuestionYourIfsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState({ pro: '', con: '' });
  const [alternatives, setAlternatives] = useState(['', '']);
  const [severity, setSeverity] = useState(5);
  const [reformulation, setReformulation] = useState('');

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    if (!thought || !reformulation) {
      toast({ title: "Datos incompletos", description: "Completa el pensamiento y la reformulación para guardar.", variant: "destructive" });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Pensamiento ansioso:* "${thought}"
*Evidencia a favor:* ${evidence.pro}
*Evidencia en contra:* ${evidence.con}
*Alternativas:*
- ${alternatives[0]}
- ${alternatives[1]}
*Gravedad real (0-10):* ${severity}
*Reformulación final:* "${reformulation}"
    `;
    addNotebookEntry({ title: 'Cuestionando mis "¿Y si...?"', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado' });
    onComplete();
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 0: return <div className="p-4 text-center"><p className="mb-4">Tu mente es una máquina de crear historias. Este ejercicio te enseña a no creértelas todas, especialmente las de miedo.</p><Button onClick={next}>Empezar práctica <ArrowRight className="ml-2 h-4 w-4"/></Button></div>;
      case 1: return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Identifica tu "¿Y si...?"</h4>
            <p className="text-sm text-muted-foreground">¿Cuál es tu “¿Y si…?” más frecuente?</p>
            <audio key="audio-step-1" controls controlsList="nodownload" className="w-full mt-2"><source src="https://workwellfut.com/audios/ruta13/tecnicas/R13sem3tecnica2primerpaso.mp3" type="audio/mp3" /></audio>
            <Textarea id="thought" value={thought} onChange={e => setThought(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!thought.trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 2: return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Examina la evidencia</h4>
            <audio key="audio-step-2" controls controlsList="nodownload" className="w-full mt-2"><source src="https://workwellfut.com/audios/ruta13/tecnicas/R13sem3tecnica2segundopaso.mp3" type="audio/mp3" /></audio>
            <Textarea value={evidence.pro} onChange={e => setEvidence(p => ({...p, pro: e.target.value}))} placeholder="Pruebas a favor..."/>
            <Textarea value={evidence.con} onChange={e => setEvidence(p => ({...p, con: e.target.value}))} placeholder="Pruebas en contra..."/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!evidence.pro.trim() || !evidence.con.trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 3: return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Explora alternativas</h4>
            <audio key="audio-step-3" controls controlsList="nodownload" className="w-full mt-2"><source src="https://workwellfut.com/audios/ruta13/tecnicas/R13sem3tecnica2paso3.mp3" type="audio/mp3" /></audio>
            <Textarea value={alternatives[0]} onChange={e => setAlternatives(p => [e.target.value, p[1]])} placeholder="Alternativa 1..."/>
            <Textarea value={alternatives[1]} onChange={e => setAlternatives(p => [p[0], e.target.value])} placeholder="Alternativa 2..."/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={!alternatives[0].trim() || !alternatives[1].trim()}>Siguiente</Button>
            </div>
        </div>
      );
      case 4: return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 4: Evalúa el impacto real (0-10): {severity}</h4>
            <audio key="audio-step-4" controls controlsList="nodownload" className="w-full mt-2"><source src="https://workwellfut.com/audios/ruta13/tecnicas/R13sem3tecnica2paso4.mp3" type="audio/mp3" /></audio>
            <Slider value={[severity]} onValueChange={v => setSeverity(v[0])} max={10} step={1} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>Siguiente</Button>
            </div>
        </div>
      );
      case 5: return (
        <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 5: Reformula tu pensamiento</h4>
            <audio key="audio-step-5" controls controlsList="nodownload" className="w-full mt-2"><source src="https://workwellfut.com/audios/ruta13/tecnicas/R13sem3tecnica2paso5.mp3" type="audio/mp3" /></audio>
            <Textarea id="reformulation" value={reformulation} onChange={e => setReformulation(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave} disabled={!reformulation.trim()}><Save className="mr-2 h-4 w-4"/>Guardar</Button>
            </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
          <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                  <source src="https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana3tecnica2.mp3" type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
              </audio>
          </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>{renderCurrentStep()}</CardContent>
    </Card>
  );
}
