
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowRight, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface ComplaintTransformationExerciseProps {
  content: ComplaintTransformationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ComplaintTransformationExercise({ content, pathId, onComplete }: ComplaintTransformationExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState(''); // This is the "queja"
    const [questioning, setQuestioning] = useState('');
    const [action, setAction] = useState(''); // This is "lo que sí puedo hacer"
    const [chosenAction, setChosenAction] = useState(''); // This is the final action for today

    const [isSaved, setIsSaved] = useState(false);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
    const resetExercise = () => {
        setStep(0);
        setSituation('');
        setThought('');
        setQuestioning('');
        setAction('');
        setChosenAction('');
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        if (!situation.trim() || !thought.trim() || !action.trim() || !chosenAction.trim()) {
          toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los pasos del ejercicio.', variant: 'destructive' });
          return;
        }
        const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Describe la situación (hechos) | Respuesta: ${situation}

Pregunta: Detecta tu queja (pensamiento) | Respuesta: "${thought}"

Pregunta: Cuestiona tu queja | Respuesta: ${questioning}

Pregunta: Registra tu plan (Acción definida) | Respuesta: ${action}

Pregunta: Revisión final (Acción que haré hoy) | Respuesta: ${chosenAction}
    `;
        addNotebookEntry({ title: 'Transformación de Queja a Acción', content: notebookContent, pathId, userId: user?.id });
        toast({ title: 'Ejercicio Guardado', description: 'Tu transformación de queja a acción ha sido guardada.' });
        setIsSaved(true);
        onComplete();
        nextStep();
      };
  
    const renderStep = () => {
        switch(step) {
            case 0: // Intro
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">La queja te mantiene en un bucle de frustración. En este ejercicio vas a transformar ese malestar en una acción concreta, recuperando tu poder de elección.</p>
                        <Button onClick={nextStep}>Empezar Transformación <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            case 1: // Step 1: Describe la situación
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: Describe la situación</h4>
                        <p className="text-sm text-muted-foreground">Piensa en algo que te haya molestado y escríbelo como hechos, sin juicios. Ejemplo: “Mi compañero entregó el informe tarde.”</p>
                        <Textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe la situación objetivamente..." />
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 2: // Step 2: Detecta tu pensamiento (queja)
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: Detecta tu queja</h4>
                        <p className="text-sm text-muted-foreground">¿Qué pensamiento automático o queja surgió? Ejemplo: “Siempre me toca a mí arreglarlo todo.”</p>
                        <Textarea value={thought} onChange={e => setThought(e.target.value)} placeholder="Escribe el pensamiento que tuviste..." />
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!thought.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 3: // Step 3: Cuestiónalo
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Cuestiona tu queja</h4>
                        <p className="text-sm text-muted-foreground">¿Qué pruebas tienes a favor y en contra de ese pensamiento? ¿Es 100% verdad?</p>
                        <Textarea value={questioning} onChange={e => setQuestioning(e.target.value)} placeholder="A favor: ... En contra: ..." />
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!questioning.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4: // NEW: Pantalla 4 – Registra tu plan
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Registra tu plan</h4>
                        <p className="text-sm text-muted-foreground">Ahora, transforma la queja en una acción concreta que dependa de ti.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="queja-readonly">Me quejo de...</Label>
                                <Textarea id="queja-readonly" value={thought} readOnly className="bg-muted/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accion-definida">Lo que sí puedo hacer es...</Label>
                                <Textarea id="accion-definida" value={action} onChange={e => setAction(e.target.value)} placeholder="Ej: Hablar con mi compañero/a sobre cómo nos afecta el retraso."/>
                            </div>
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!action.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 5: // NEW: Pantalla 5 – Revisión final
                return (
                    <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Revisión final</h4>
                        <div className="p-4 border rounded-md bg-background/50 space-y-3">
                            <p className="font-medium">Resumen de tu plan:</p>
                            <p><strong>En lugar de quejarte de:</strong><br/> "{thought}"</p>
                            <p><strong>Te propones hacer:</strong><br/> "{action}"</p>
                        </div>
                        <div className="space-y-2 pt-4">
                            <Label htmlFor="chosen-action">Lee tus acciones y elige la primera que pondrás en práctica hoy mismo. Escribe la acción que harás hoy:</Label>
                            <Textarea id="chosen-action" value={chosenAction} onChange={e => setChosenAction(e.target.value)} />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Transformación</Button>
                        </div>
                    </form>
                );
            case 6: // Confirmation
                return (
                    <div className="p-6 space-y-4">
                        <div className="text-center mb-4">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
                            <p className="text-muted-foreground">Tu transformación ha sido guardada en tu cuaderno.</p>
                        </div>
                        <div className="text-left p-4 border rounded-md bg-background/50 space-y-3 text-sm">
                            <p><strong>Situación:</strong> {situation}</p>
                            <p><strong>Queja:</strong> "{thought}"</p>
                            <p><strong>Acción definida:</strong> "{action}"</p>
                            <p><strong>Acción para hoy:</strong> "{chosenAction}"</p>
                        </div>
                        <Button onClick={resetExercise} variant="outline" className="w-full">
                            Hacer otro registro
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && (
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
                )}
            </CardHeader>
            <CardContent>
                {renderStep()}
            </CardContent>
        </Card>
    );
}
