"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface SecureBoundaryPhraseExerciseProps {
  content: ModuleContent;
  pathId: string;
  onComplete: () => void;
}

const suggestedPhrases = [
    'Gracias por pensar en mí, pero esta vez no voy a poder.',
    'Voy a pensarlo y te contesto más tarde.',
    'Esto no me resulta cómodo. ¿Podemos hablarlo?',
    'Prefiero no tomar esa decisión ahora.',
    'Necesito un momento para procesarlo antes de responder.',
];

export function SecureBoundaryPhraseExercise({ content, pathId, onComplete }: SecureBoundaryPhraseExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [selectedPhrase, setSelectedPhrase] = useState('');
    const [customPhrase, setCustomPhrase] = useState('');
    const [dailyPractice, setDailyPractice] = useState('');

    const finalPhrase = selectedPhrase === 'Otra' ? customPhrase : selectedPhrase;

    const handleSave = () => {
        if (!finalPhrase.trim()) {
            toast({ title: 'Frase vacía', description: 'Por favor, escribe o selecciona tu frase para guardarla.', variant: 'destructive' });
            return;
        }
        addNotebookEntry({
            title: `Mi Frase de Límite Seguro`,
            content: `Mi frase: "${finalPhrase}"\n\nPráctica diaria opcional: ${dailyPractice || 'No realizada.'}`,
            pathId: pathId,
            userId: user?.id,
        });
        toast({ title: 'Frase Guardada' });
        onComplete();
        setStep(5); // Confirmation screen
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const resetExercise = () => {
      setStep(0);
      setSelectedPhrase('');
      setCustomPhrase('');
      setDailyPractice('');
    };
    
    const renderStep = () => {
        const contentTyped = content as any;
        switch (step) {
            case 0: // Pantalla 1: Introducción
                return (
                    <div className="p-4 space-y-4">
                        <p>Este ejercicio te ayuda a tener preparada una frase clara y amable para poner límites cuando lo necesites. Primero, leerás algunas frases sugeridas que puedes usar como punto de partida. Después, elegirás una o crearás la tuya propia. La idea es que la practiques varias veces, en voz alta o por escrito, hasta que te salga con naturalidad. Si lo deseas, también puedes usarla como entrenamiento emocional: imaginarte situaciones pasadas o futuras donde te hubiera gustado decir algo y ensayar tu frase. Al final, reflexionarás sobre lo que sentiste al practicar.</p>
                        <Button onClick={nextStep} className="w-full">Comenzar</Button>
                    </div>
                );
            case 1: // Pantalla 2: Ejemplo
                return (
                    <div className="p-4 space-y-4 text-center">
                        <h4 className="font-semibold text-lg">Ejemplo Visual</h4>
                        <p className="text-sm text-muted-foreground">Así quedaría una frase real, para que te hagas una idea:</p>
                        <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic">
                            “Gracias por pensar en mí, pero esta vez no voy a poder.”
                        </blockquote>
                        <p className="text-sm text-muted-foreground">Es una frase breve, respetuosa y clara. No necesitas justificarte, ni dar explicaciones largas. Solo necesitas sentir que lo que dices te representa y te cuida.</p>
                        <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 2: // Pantalla 3: Seleccionar frase
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Selecciona o edita una frase</h4>
                        <RadioGroup value={selectedPhrase} onValueChange={setSelectedPhrase}>
                            {suggestedPhrases.map((phrase, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem value={phrase} id={`phrase-${index}`} />
                                    <Label htmlFor={`phrase-${index}`} className="font-normal">{phrase}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Otra" id="phrase-other" />
                                <Label htmlFor="phrase-other" className="font-normal">Otra (escríbela tú)</Label>
                            </div>
                        </RadioGroup>
                         <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep} disabled={!selectedPhrase}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 3: // Pantalla 4: Frase personalizada
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Tu frase personalizada</h4>
                        <Label htmlFor="custom-phrase">Escribe aquí tu frase de límite seguro:</Label>
                        <Textarea id="custom-phrase" value={finalPhrase === 'Otra' ? '' : finalPhrase} onChange={e => {
                            if(selectedPhrase !== 'Otra') setSelectedPhrase('Otra');
                            setCustomPhrase(e.target.value)
                        }} />
                        <p className="text-xs text-muted-foreground">Puedes grabarte diciéndola o leerla cada mañana para integrarla.</p>
                         <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </div>
                    </div>
                );
             case 4: // Pantalla 5: Micropráctica diaria
                return (
                     <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Micropráctica diaria (opcional)</h4>
                        <p className="text-sm text-muted-foreground">Ejercicio rápido para cada día (3 minutos): Recuerda una situación donde no te expresaste. Imagina qué te habría gustado decir. Dilo en voz alta o escríbelo.</p>
                        <Label htmlFor="daily-practice">Escribe aquí:</Label>
                        <Textarea id="daily-practice" value={dailyPractice} onChange={e => setDailyPractice(e.target.value)} />
                        <p className="text-xs text-muted-foreground italic">Este ensayo mental o escrito fortalece tus circuitos de autoafirmación. Es un entrenamiento emocional real.</p>
                         <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                             <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Guardar en mi cuaderno</Button>
                        </div>
                    </div>
                );
            case 5: // Confirmation
                 return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">¡Frase Guardada!</h4>
                        <p className="text-muted-foreground">Tu frase de límite seguro se ha guardado. Puedes practicarla para que se vuelva parte de tu forma natural de comunicarte.</p>
                        <Button onClick={resetExercise} variant="outline">Crear otra frase</Button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const contentTyped = content as any;

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{contentTyped.title}</CardTitle>
                {contentTyped.objective && <CardDescription className="pt-2">{contentTyped.objective}</CardDescription>}
                 {contentTyped.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full h-10">
                            <source src={contentTyped.audioUrl} type="audio/mp3" />
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
