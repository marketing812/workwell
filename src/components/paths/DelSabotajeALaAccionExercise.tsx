
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
    { id: 'sabotage-no-moment', label: 'â€œNo es el momento. Necesito estar inspirado o inspirada.â€' },
    { id: 'sabotage-tired', label: 'â€œEstoy demasiado cansado o cansada. Mejor luego.â€' },
    { id: 'sabotage-perfect', label: 'â€œSi no va a salir perfecto, no tiene sentido hacerlo.â€' },
    { id: 'sabotage-fail', label: 'â€œÂ¿Y si me equivoco y piensan que no soy capaz?â€' },
    { id: 'sabotage-no-interest', label: 'â€œNo tengo interÃ©s. No puedo con nada.â€' },
    { id: 'sabotage-too-late', label: 'â€œDeberÃ­a haberlo hecho antes. Ya es tarde.â€' },
];

const functionalResponses: Record<string, string> = {
    'sabotage-no-moment': 'â€œLa inspiraciÃ³n ayuda, pero el progreso viene al actuar.â€',
    'sabotage-tired': 'â€œSolo 15 minutos ya es un avance. A veces, empezar da energÃ­a.â€',
    'sabotage-perfect': 'â€œAvanzar, aunque sea imperfecto, es mejor que quedarme bloqueado/a.â€',
    'sabotage-fail': 'â€œNo controlo lo que piensen. Pero puedo aprender y seguir.â€',
    'sabotage-no-interest': 'â€œEs solo un pensamiento del bloqueo. HarÃ© algo pequeÃ±o y verÃ©.â€',
    'sabotage-too-late': 'â€œNo puedo cambiar el pasado, pero sÃ­ puedo actuar ahora.â€',
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
        toast({ title: "Ejercicio Incompleto", description: "Por favor, selecciona al menos una frase o aÃ±ade una propia.", variant: "destructive"});
        return;
    }

    let notebookContent = `**${content.title}**\n\n`;
    
    selectedOptions.forEach(opt => {
        notebookContent += `Pregunta: Frase de sabotaje que me repito | Respuesta: "${opt.label}"\n`;
        notebookContent += `Pregunta: Respuesta realista y amable | Respuesta: "${functionalResponses[opt.id]}"\n\n`;
    });

    if (customSabotage.trim() && customResponse.trim()) {
        notebookContent += `Pregunta: Mi frase de sabotaje personal | Respuesta: "${customSabotage}"\n`;
        notebookContent += `Pregunta: Mi respuesta personal amable | Respuesta: "${customResponse}"\n\n`;
    }

    addNotebookEntry({
      title: "Mi Tabla de DiÃ¡logo Interno",
      content: notebookContent,
      pathId: pathId,
      ruta: 'Superar la ProcrastinaciÃ³n y Crear HÃ¡bitos',
      userId: user?.id
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu tabla de diÃ¡logo interno se ha guardado en el Cuaderno TerapÃ©utico.",
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
                    <p className="mb-4">Muchas veces postergas no por flojera, sino por lo que te dices justo antes de actuar. Este ejercicio te ayuda a escuchar ese diÃ¡logo interno y a crear una respuesta que te sostenga.</p>
                    <Button onClick={nextStep}>Entrenar mi diÃ¡logo interno</Button>
                </div>
            );
        
        case 1:
            return (
                <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Frases que alimentan la procrastinaciÃ³n</h4>
                    <p className="text-base">Marca las que sueles decirte:</p>
                    <div className="space-y-2">
                        {sabotageOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={opt.id} checked={selections[opt.id] || false} onCheckedChange={(checked) => handleSelectionChange(opt.id, checked as boolean)} />
                                <Label htmlFor={opt.id} className="font-normal text-base">{opt.label}</Label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
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
                                    <p className="font-medium italic text-base">{opt.label}</p>
                                    <p className="text-base mt-2">Tu nueva respuesta amable es:</p>
                                    <p className="font-semibold text-primary text-base">{functionalResponses[opt.id]}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="italic">No has seleccionado ninguna frase comÃºn.</p> }
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                        <Button onClick={nextStep}>Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                </div>
            );

        case 3:
             return (
                <form onSubmit={handleSave} className="space-y-4 p-2 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Crea tu tabla personal</h4>
                    <p className="text-base">Â¿Hay otra frase que te repites? AÃ±Ã¡dela aquÃ­ con tu propia respuesta realista.</p>
                    <div className="space-y-2">
                        <Label htmlFor="custom-sabotage">Frase que te repites</Label>
                        <Textarea id="custom-sabotage" value={customSabotage} onChange={e => setCustomSabotage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="custom-response">Respuesta realista y amable</Label>
                        <Textarea id="custom-response" value={customResponse} onChange={e => setCustomResponse(e.target.value)} />
                    </div>
                    <div className="flex justify-between w-full">
                        <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapÃ©utico
                        </Button>
                    </div>
                </form>
            );

        case 4:
            return (
                <div className="text-center p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="text-xl font-bold">Â¡Ejercicio Guardado!</h4>
                    <p>Tu forma de hablarte no tiene que ser perfecta. Solo necesita ayudarte a avanzar. Cada vez que te respondas con claridad y compasiÃ³n, estÃ¡s construyendo un puente hacia la acciÃ³n.</p>
                    
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
