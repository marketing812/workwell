
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UnaPalabraCadaDiaExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { useUser } from '@/contexts/UserContext';

interface UnaPalabraCadaDiaExerciseProps {
  content: UnaPalabraCadaDiaExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const unaPalabraEmotionOptions = [
    { value: 'gratitud', label: 'Gratitud' },
    { value: 'frustracion', label: 'FrustraciÃ³n' },
    { value: 'cansancio', label: 'Cansancio' },
    { value: 'alegria', label: 'AlegrÃ­a' },
    { value: 'inseguridad', label: 'Inseguridad' },
    { value: 'curiosidad', label: 'Curiosidad' },
];


export default function UnaPalabraCadaDiaExercise({ content, pathId, onComplete }: UnaPalabraCadaDiaExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const { user } = useUser();
  
  const [step, setStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [anchorAction, setAnchorAction] = useState('');
  const [otherAnchorAction, setOtherAnchorAction] = useState('');
  
  const [isClient, setIsClient] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const storageKey = `exercise-progress-${pathId}-${content.type}`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setStep(data.step || 0);
        setSelectedEmotion(data.selectedEmotion || '');
        setOtherEmotion(data.otherEmotion || '');
        setAnchorAction(data.anchorAction || '');
        setOtherAnchorAction(data.otherAnchorAction || '');
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, selectedEmotion, otherEmotion, anchorAction, otherAnchorAction, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, selectedEmotion, otherEmotion, anchorAction, otherAnchorAction, isSaved, storageKey, isClient]);


  const handleSave = () => {
    const finalEmotion = selectedEmotion === 'otra' ? otherEmotion : (unaPalabraEmotionOptions.find(e => e.value === selectedEmotion)?.label || selectedEmotion);
    const finalAnchorAction = anchorAction === 'Otra' ? otherAnchorAction : anchorAction;

    if (!finalEmotion.trim() || !finalAnchorAction.trim()) {
        toast({ title: "Incompleto", description: "Por favor, completa la emociÃ³n y la acciÃ³n.", variant: "destructive"});
        return;
    }

    const notebookContent = `
**${content.title}**

Pregunta: Â¿QuÃ© emociÃ³n resume mejor tu dÃ­a hasta ahora? | Respuesta: ${finalEmotion}

Pregunta: Â¿QuÃ© microacciÃ³n de anclaje elegiste? | Respuesta: ${finalAnchorAction}
`;
    addNotebookEntry({ title: `Diario de una palabra: ${finalEmotion}`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Registro Diario Guardado' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetDaily = () => {
      setStep(0);
      setSelectedEmotion('');
      setOtherEmotion('');
      setAnchorAction('');
      setOtherAnchorAction('');
      setIsSaved(false);
  }

  if (!isClient) {
    return null;
  }
  
  const renderStep = () => {
    const finalEmotion = selectedEmotion === 'otra' ? otherEmotion : (unaPalabraEmotionOptions.find(e => e.value === selectedEmotion)?.label || selectedEmotion);
    const finalAnchorAction = anchorAction === 'Otra' ? otherAnchorAction : anchorAction;

    switch(step) {
      case 0: // Select Emotion
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Â¿QuÃ© emociÃ³n resume mejor tu dÃ­a hasta ahora?</h4>
            <p className="text-sm text-muted-foreground">Puedes elegir de una lista emocional o escribirla libremente.</p>
            <Select value={selectedEmotion} onValueChange={v => {setSelectedEmotion(v); if(v !== 'otra') setOtherEmotion('')}}>
              <SelectTrigger><SelectValue placeholder="Elige una emociÃ³n..." /></SelectTrigger>
              <SelectContent>{unaPalabraEmotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent>
            </Select>
            {selectedEmotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Escribe tu emociÃ³n aquÃ­..." className="mt-2" />}
            <div className="flex justify-end w-full mt-2">
              <Button onClick={nextStep} disabled={!finalEmotion.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 1: // Acknowledge Emotion
        return (
          <div className="p-4 space-y-4">
            <p>Has sentido: <strong>{finalEmotion}</strong>.</p>
            <p>ReconÃ³celo con respeto: "Me permito reconocerlo, sin juzgarlo y con aceptaciÃ³n".</p>
            <p className="italic text-primary pt-2">â€œNo hace falta que entiendas del todo lo que sientes. Basta con permitirte sentirlo sin pelear.â€</p>
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2: // Choose Micro-action
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Elige una microacciÃ³n para anclar el ejercicio:</h4>
            <RadioGroup value={anchorAction} onValueChange={setAnchorAction}>
              <div className="flex items-center gap-2"><RadioGroupItem value="Respirar con esta emociÃ³n durante 3 ciclos" id="a1" /><Label htmlFor="a1" className="font-normal">Respirar con esta emociÃ³n durante 3 ciclos</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="Llevar esta frase conmigo como una compaÃ±era" id="a2" /><Label htmlFor="a2" className="font-normal">Llevar esta frase conmigo como una compaÃ±era</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="Agradecerme por haberme escuchado" id="a3" /><Label htmlFor="a3" className="font-normal">Agradecerme por haberme escuchado</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="Otra" id="a4" /><Label htmlFor="a4" className="font-normal">Otra:</Label></div>
            </RadioGroup>
            {anchorAction === 'Otra' && (
              <Textarea
                value={otherAnchorAction}
                onChange={e => setOtherAnchorAction(e.target.value)}
                placeholder="Escribe tu frase o acciÃ³n libre..."
                className="ml-6"
              />
            )}
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep} className="w-auto" disabled={!finalAnchorAction.trim()}>Ver resumen y Guardar</Button>
            </div>
          </div>
        );
       case 3: // Save your emotional cloud
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">Tu registro de hoy</h4>
            <div className="text-left border p-3 rounded-md bg-background/50">
                <p><strong>EmociÃ³n:</strong> {finalEmotion}</p>
                <p><strong>AcciÃ³n de anclaje:</strong> {finalAnchorAction}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button onClick={handleSave} className="w-full" disabled={isSaved}>
                   {isSaved ? <><CheckCircle className="mr-2 h-4 w-4"/> Guardado</> : <><Save className="mr-2 h-4 w-4"/> Guardar en el cuaderno terapÃ©utico</>}
                </Button>
            </div>
             <Button variant="link" onClick={prevStep}>AtrÃ¡s</Button>
          </div>
        );
      case 4: // Final confirmation
        return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><h4 className="font-bold text-lg">Â¡PrÃ¡ctica Guardada!</h4><p className="text-muted-foreground">Tu reflexiÃ³n ha sido guardada en el cuaderno.</p></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
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
