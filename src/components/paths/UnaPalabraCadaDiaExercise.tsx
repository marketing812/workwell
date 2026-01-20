
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UnaPalabraCadaDiaExerciseContent } from '@/data/paths/pathTypes';

interface UnaPalabraCadaDiaExerciseProps {
  content: UnaPalabraCadaDiaExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const unaPalabraEmotionOptions = [
    { value: 'gratitud', label: 'Gratitud' },
    { value: 'frustracion', label: 'Frustración' },
    { value: 'cansancio', label: 'Cansancio' },
    { value: 'alegria', label: 'Alegría' },
    { value: 'inseguridad', label: 'Inseguridad' },
    { value: 'curiosidad', label: 'Curiosidad' },
];


export function UnaPalabraCadaDiaExercise({ content, pathId, onComplete }: UnaPalabraCadaDiaExerciseProps) {
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [anchorAction, setAnchorAction] = useState('');
  const [reflection, setReflection] = useState('');
  const [isClient, setIsClient] = useState(false);
  const storageKey = `exercise-progress-${pathId}-${content.type}`;

  // Cargar estado guardado al iniciar
  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const { step, selectedEmotion, otherEmotion, anchorAction, reflection } = JSON.parse(savedState);
        setStep(step || 0);
        setSelectedEmotion(selectedEmotion || '');
        setOtherEmotion(otherEmotion || '');
        setAnchorAction(anchorAction || '');
        setReflection(reflection || '');
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  // Guardar estado en cada cambio
  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, selectedEmotion, otherEmotion, anchorAction, reflection };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, selectedEmotion, otherEmotion, anchorAction, reflection, storageKey, isClient]);


  const handleSaveReflection = () => {
    if (reflection.trim()) {
        addNotebookEntry({ title: 'Reflexión semanal: Mis emociones', content: reflection, pathId });
        toast({ title: 'Reflexión Guardada' });
    }
    onComplete();
    setStep(4); // Move to a final confirmation step
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!isClient) {
    return null; // O un componente de carga
  }
  
  const renderStep = () => {
    const finalEmotion = selectedEmotion === 'otra' ? otherEmotion : (unaPalabraEmotionOptions.find(e => e.value === selectedEmotion)?.label || selectedEmotion);

    switch(step) {
      case 0: return <div className="p-4 space-y-4"><Label>¿Qué emoción resume mejor tu día hasta ahora?</Label><p className="text-sm text-muted-foreground">Puedes elegir de una lista emocional o escribirla libremente</p><Select value={selectedEmotion} onValueChange={v => {setSelectedEmotion(v); if(v !== 'otra') setOtherEmotion('')}}><SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger><SelectContent>{unaPalabraEmotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>{selectedEmotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Escribe tu emoción..." className="mt-2" />}<Button onClick={nextStep} className="w-full mt-2" disabled={!selectedEmotion}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div>;
      case 1: return <div className="p-4 space-y-4"><p>Has sentido: <strong>{finalEmotion}</strong>.</p><p>Reconócelo con respeto: "Me permito reconocerlo, sin juzgarlo y con aceptación"</p><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 2: return <div className="p-4 space-y-4"><Label>Elige una microacción para anclar el ejercicio:</Label><div className="space-y-1"><div className="flex items-center gap-2"><Checkbox id="a1" onCheckedChange={c => c && setAnchorAction('Respirar')} checked={anchorAction === 'Respirar'} /><Label htmlFor="a1" className="font-normal">Respirar con esta emoción durante 3 ciclos</Label></div><div className="flex items-center gap-2"><Checkbox id="a2" onCheckedChange={c => c && setAnchorAction('Llevar')} checked={anchorAction === 'Llevar'} /><Label htmlFor="a2" className="font-normal">Llevar esta frase conmigo como una compañera</Label></div></div><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!anchorAction}>Finalizar</Button></div></div>;
      case 3: return <div className="p-4 space-y-4"><h4 className="font-semibold">Práctica reflexiva opcional (Días 5-7)</h4><Label>Mis tres emociones más repetidas o significativas de la semana y qué necesitaba al sentirlas:</Label><Textarea value={reflection} onChange={e => setReflection(e.target.value)} /><div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={handleSaveReflection} className="w-auto"><Save className="mr-2 h-4 w-4" />Guardar y Completar</Button></div></div>;
      case 4: return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><h4 className="font-bold text-lg">¡Práctica Guardada!</h4><p className="text-muted-foreground">Tu reflexión ha sido guardada en el cuaderno.</p><Button onClick={() => setStep(0)} variant="outline">Hacer otro registro</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            <div className="mt-4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6sesion1tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
