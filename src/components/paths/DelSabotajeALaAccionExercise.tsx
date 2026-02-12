"use client";

import { useState, type FormEvent, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { DelSabotajeALaAccionExerciseContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';


interface DelSabotajeALaAccionExerciseProps {
  content: DelSabotajeALaAccionExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const sabotageOptions = [
    { id: 'sabotage-no-moment', label: '“No es el momento. Necesito estar inspirado o inspirada.”' },
    { id: 'sabotage-tired', label: '“Estoy demasiado cansado o cansada. Mejor luego.”' },
    { id: 'sabotage-perfect', label: '“Si no va a salir perfecto, no tiene sentido hacerlo.”' },
    { id: 'sabotage-fail', label: '“¿Y si me equivoco y piensan que no soy capaz?”' },
    { id: 'sabotage-no-interest', label: '“No tengo interés. No puedo con nada.”' },
    { id: 'sabotage-too-late', label: '“Debería haberlo hecho antes. Ya es tarde.”' },
];

const functionalResponses: Record<string, string> = {
    'sabotage-no-moment': '“La inspiración ayuda, pero el progreso viene al actuar.”',
    'sabotage-tired': '“Solo 15 minutos ya es un avance. A veces, empezar da energía.”',
    'sabotage-perfect': '“Avanzar, aunque sea imperfecto, es mejor que quedarme bloqueado/a.”',
    'sabotage-fail': '“No controlo lo que piensen. Pero puedo aprender y seguir.”',
    'sabotage-no-interest': '“Es solo un pensamiento del bloqueo. Haré algo pequeño y veré.”',
    'sabotage-too-late': '“No puedo cambiar el pasado, pero sí puedo actuar ahora.”',
};

export default function DelSabotajeALaAccionExercise({ content, pathId, onComplete }: DelSabotajeALaAccionExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [customSabotage, setCustomSabotage] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetExercise = () => {
    setCurrentStep(0);
    setSelections({});
    setCustomSabotage('');
    setCustomResponse('');
    setIsSaved(false);
  };

  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelections(prev => ({ ...prev, [id]: checked }));
  };

  const selectedOptions = useMemo(() => sabotageOptions.filter(opt => selections[opt.id]), [selections]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedOptions.length === 0 && !customSabotage.trim()) {
        toast({ title: "Ejercicio Incompleto", description: "Por favor, selecciona al menos una frase o añade una propia.", variant: "destructive"});
        return;
    }

    let notebookContent = `**${content.title}**\n\n**Mis frases de sabotaje y mis nuevas respuestas:**\n\n`;
    
    selectedOptions.forEach(opt => {
        notebookContent += `*Frase que me repito:*\n> ${opt.label}\n`;
        notebookContent += `*Respuesta realista y amable:*\n> ${functionalResponses[opt.id]}\n\n`;
    });

    if (customSabotage.trim() && customResponse.trim()) {
        notebookContent += `*Mi frase personal:*\n> ${customSabotage}\n`;
        notebookContent += `*Mi respuesta personal:*\n> ${customResponse}\n\n`;
    }

    addNotebookEntry({
      title: "Mi Tabla de Diálogo Interno",
      content: notebookContent,
      pathId: pathId,
      ruta: 'Superar la Procrastinación y Crear Hábitos',
      userId: user?.id
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu tabla de diálogo interno se ha guardado en el Cuaderno Terapéutico.",
    });
    
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch (currentStep) {
        case 0:
            return (
                <div className="text-center p-4 space-y-4">
                    <p className="mb-4">Muchas veces postergas no por flojera, sino por lo que te dices justo antes de actuar. Este ejercicio te ayuda a escuchar ese diálogo interno y a crear una respuesta que te sostenga.</p>
                    <Button onClick={nextStep}>Entrenar mi diálogo interno</Button>
                </div>
            );
        
        case 1:
            return (
                <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Frases que alimentan la procrastinación</h4>
                    <p>Marca las que sueles decirte:</p>
                    <div className="space-y-2">
                        {sabotageOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={opt.id} checked={selections[opt.id] || false} onCheckedChange={(checked) => handleSelectionChange(opt.id, checked as boolean)} />
                                <Label htmlFor={opt.id} className="font-normal text-base">{opt.label}</Label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                        <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                </div>
            );

        case 2:
            return (
                <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Tus respuestas entrenadas</h4>
                    {selectedOptions.length > 0 ? (
                        <div className="space-y-4">
                            {selectedOptions.map(opt => (
                                <div key={opt.id} className="p-3 border rounded-md bg-background">
                                    <p className="text-base">Ante el pensamiento:</p>
                                    <p className="font-medium italic">{opt.label}</p>
                                    <p className="text-base mt-2">Tu nueva respuesta amable es:</p>
                                    <p className="font-semibold text-primary">{functionalResponses[opt.id]}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="italic">No has seleccionado ninguna frase común.</p> }
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                        <Button onClick={nextStep}>Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                </div>
            );

        case 3:
             return (
                <form onSubmit={handleSave} className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Crea tu tabla personal</h4>
                    <p>¿Hay otra frase que te repites? Añádela aquí con tu propia respuesta realista.</p>
                    <div className="space-y-2">
                        <Label htmlFor="custom-sabotage">Frase que te repites</Label>
                        <Textarea id="custom-sabotage" value={customSabotage} onChange={e => setCustomSabotage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="custom-response">Respuesta realista y amable</Label>
                        <Textarea id="custom-response" value={customResponse} onChange={e => setCustomResponse(e.target.value)} />
                    </div>
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Guardar mi tabla de diálogo interno
                        </Button>
                    </div>
                </form>
            );

        case 4:
            return (
                <div className="text-center p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="text-xl font-bold">¡Ejercicio Guardado!</h4>
                    <p>Tu forma de hablarte no tiene que ser perfecta. Solo necesita ayudarte a avanzar. Cada vez que te respondas con claridad y compasión, estás construyendo un puente hacia la acción.</p>
                    <Button onClick={resetExercise} variant="outline" className="w-full">
                        Hacer otro ejercicio
                    </Button>
                </div>
            );
        default: return null;
    }
  }
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription>{content.objective}</CardDescription>}
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
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
