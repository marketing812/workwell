
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import type { SenseChecklistExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';


interface SenseChecklistExerciseProps {
  content: SenseChecklistExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const checklistItems = [
    { id: 'check-importa', label: '¿Esto me acerca a lo que importa para mí?' },
    { id: 'check-miedo', label: '¿Estoy actuando por miedo, por presión o por valor?' },
    { id: 'check-emocion', label: '¿Qué emoción me mueve en esta decisión?' },
    { id: 'check-paz', label: '¿Me sentiré en paz conmigo después de esto?' },
    { id: 'check-valor', label: '¿Estoy honrando un valor o evitando un conflicto?' },
];

export default function SenseChecklistExercise({ content, pathId, onComplete }: SenseChecklistExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelections(prev => ({...prev, [id]: checked}));
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setSelections({});
    setIsSaved(false);
  };

  const handleSave = () => {
    const selectedItems = checklistItems
      .filter(item => selections[item.id])
      .map(item => item.label);

    if (selectedItems.length === 0) {
      toast({
        title: "Checklist vacío",
        description: "Por favor, marca al menos una pregunta para guardar tu reflexión.",
        variant: "destructive"
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Preguntas que resonaron conmigo:**
${selectedItems.map(item => `- ${item}`).join('\n')}
    `;

    addNotebookEntry({
      title: 'Checklist del Sentido',
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });

    toast({ title: 'Checklist Guardado', description: 'Tu reflexión ha sido guardada en el cuaderno.' });
    setIsSaved(true);
    if(onComplete) onComplete();
    nextStep();
  };


  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta7/tecnicas/Ruta7semana3tecnica2.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="p-4 text-center space-y-4">
            <p>Antes de actuar o tomar una decisión, te invitamos a hacer una breve pausa y revisar algunas preguntas clave. Este pequeño gesto puede ayudarte a elegir con más claridad y en sintonía con lo que realmente te importa. Solo tienes que leer cada pregunta con calma, responderte con honestidad y observar qué sensación te deja. Al final, podrás notar si la decisión que estás a punto de tomar te acerca o te aleja de tu dirección vital. No se trata de hacerlo perfecto, sino de aprender a escucharte un poco más antes de actuar.</p>
            <Button onClick={nextStep}>Comenzar Checklist <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}
        {step === 1 && (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Checklist del Sentido</h4>
                <p>Piensa en la decisión y marca si la pregunta tiene una respuesta clara y alineada para ti.</p>
                <div className="space-y-2">
                    {checklistItems.map(item => (
                        <div key={item.id} className="flex items-start space-x-2">
                            <Checkbox id={item.id} checked={!!selections[item.id]} onCheckedChange={c => handleSelectionChange(item.id, !!c)} className="mt-1"/>
                            <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Guardar y Revisar
                    </Button>
                 </div>
            </div>
        )}
        {step === 2 && (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Revisa</h4>
                <p>Si hay más ✓ en la dirección de tus valores, adelante. Si hay dudas, quizá aún puedas elegir diferente.</p>
                <p className="italic">“Cada decisión es una oportunidad de acercarte a la vida que sí quieres habitar.”</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={resetExercise} variant="outline" className="w-auto">Hacer otro checklist</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
