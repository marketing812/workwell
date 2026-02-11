"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CartaDesdeLaEmocionExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface CartaDesdeLaEmocionExerciseProps {
  content: CartaDesdeLaEmocionExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const emotionOptions = [
    { value: 'Alegría', label: 'Alegría' },
    { value: 'Tristeza', label: 'Tristeza' },
    { value: 'Miedo', label: 'Miedo' },
    { value: 'Ira', label: 'Ira' },
    { value: 'Asco', label: 'Asco' },
    { value: 'Sorpresa', label: 'Sorpresa' },
    { value: 'Estrés', label: 'Estrés' },
    { value: 'Ansiedad', label: 'Ansiedad' },
    { value: 'Agobio', label: 'Agobio' },
    { value: 'Tensión', label: 'Tensión' },
    { value: 'Alarma', label: 'Alarma' },
    { value: 'Cansancio emocional', label: 'Cansancio emocional' },
    { value: 'Desaliento', label: 'Desaliento' },
    { value: 'Vacío', label: 'Vacío' },
    { value: 'Ilusión', label: 'Ilusión' },
    { value: 'Entusiasmo', label: 'Entusiasmo' },
    { value: 'Esperanza', label: 'Esperanza' },
    { value: 'Frustración', label: 'Frustración' },
    { value: 'Amor', label: 'Amor' },
    { value: 'Confianza', label: 'Confianza' },
    { value: 'Rechazo', label: 'Rechazo' },
    { value: 'Soledad', label: 'Soledad' },
    { value: 'Celos', label: 'Celos' },
    { value: 'Envidia', label: 'Envidia' },
    { value: 'Vergüenza', label: 'Vergüenza' },
    { value: 'Culpa', label: 'Culpa' },
    { value: 'Inseguridad', label: 'Inseguridad' },
    { value: 'Orgullo', label: 'Orgullo' },
    { value: 'Confusión', label: 'Confusión' },
    { value: 'Ambivalencia', label: 'Ambivalencia' },
];


export default function CartaDesdeLaEmocionExercise({ content, pathId, onComplete }: CartaDesdeLaEmocionExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [emotion, setEmotion] = useState('');
    const [otherEmotion, setOtherEmotion] = useState('');
    const [tone, setTone] = useState('');
    const [otherTone, setOtherTone] = useState('');
    const [need, setNeed] = useState('');
    const [letterBody, setLetterBody] = useState('');
    
    const finalEmotion = emotion === 'otra' ? otherEmotion : emotion;

    const handleSave = () => {
        if (!need.trim()) {
            toast({
                title: "Campo requerido",
                description: "Por favor, define lo que realmente necesitas para poder guardar la carta.",
                variant: 'destructive',
            });
            return;
        }

        const fullLetter = `
Hola, soy tu emoción: ${finalEmotion}
Aparezco porque hay algo en ti que te importa mucho… y no está siendo cuidado como necesita.
Lo que realmente estás necesitando ahora es: ${need}
No vengo a hacerte daño. Estoy aquí para ayudarte a mirar hacia dentro. Quiero que sepas que te estoy protegiendo, aunque a veces no sepa cómo expresarme.
Me gustaría que me escucharas sin miedo. Solo necesito un espacio para ser vista, sentida y comprendida.
${letterBody}
Con cariño,
Tu emoción: ${finalEmotion}
        `;
        addNotebookEntry({ title: `Carta desde mi ${finalEmotion}`, content: fullLetter, pathId: pathId, userId: user?.id });
        toast({ title: 'Carta Guardada' });
        onComplete();
        setStep(3); // Go to confirmation
    };
    
    const renderStep = () => {
        switch(step) {
            case 0: return <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 1: Elige la emoción que quiere hablar contigo</h4>
                <p className="text-sm text-muted-foreground">Imagina que hay una parte dentro de ti que siente algo muy intensamente… y quiere expresarse.  ¿Qué emoción te está pidiendo ser escuchada hoy?</p>
                <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                    <SelectContent>
                        {emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                        <SelectItem value="otra">Otra...</SelectItem>
                    </SelectContent>
                </Select>
                {emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe tu emoción aquí..." /> }
                <Button onClick={() => setStep(1)} className="w-full mt-2" disabled={!finalEmotion.trim()}>Siguiente <ArrowRight className="mr-2 h-4 w-4" /></Button></div>;
            
            case 1: return <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 2: Elige el Tono de la Carta</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  Según la emoción que elijas, puedes seleccionar un estilo de carta que te ayude a conectar mejor con lo que sientes. Imagina… {'\\n\\n'}
                  Tristeza → Voz compasiva y suave {'\\n\\n'}
                  Ira → Voz clara, firme y directa {'\\n\\n'}
                  Ansiedad → Voz serena y tranquilizadora {'\\n\\n'}
                  Culpa → Voz amable y reparadora {'\\n\\n'}
                  Otra emoción → Elige el tono que más te ayude
                </p>
                <Select value={tone} onValueChange={setTone}><SelectTrigger><SelectValue placeholder="Elige un tono..." /></SelectTrigger><SelectContent><SelectItem value="compasivo">Compasivo y suave</SelectItem><SelectItem value="firme">Claro, firme y directo</SelectItem><SelectItem value="sereno">Sereno y tranquilizador</SelectItem><SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>
                {tone === 'otra' && <Textarea value={otherTone} onChange={e => setOtherTone(e.target.value)} placeholder="Describe el tono..." className="mt-2" />}
                <div className="flex justify-between mt-2">
                    <Button onClick={() => setStep(0)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={() => setStep(2)} className="w-auto">Siguiente <ArrowRight className="mr-2 h-4 w-4" /></Button>
                </div>
              </div>;
              
            case 2:
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Paso 3: Redacta tu carta desde la emoción</h4>
                        <p className="text-sm text-muted-foreground">Ahora deja que tu emoción escriba. No tienes que pensarlo demasiado. Solo deja que salga con sinceridad.</p>
            
                        <div className="p-4 border rounded-md bg-background/50 space-y-4 text-sm">
                            <p>Hola, soy tu emoción: <strong>{finalEmotion}</strong></p>
                            <p>Aparezco porque hay algo en ti que te importa mucho… y no está siendo cuidado como necesita.</p>
                            
                            <div className="space-y-1">
                                <Label htmlFor="need">Lo que realmente estás necesitando ahora es:</Label>
                                <Textarea id="need" value={need} onChange={e => setNeed(e.target.value)} placeholder="Ej: seguridad, calma, respeto..." />
                            </div>
                            
                            <p>No vengo a hacerte daño. Estoy aquí para ayudarte a mirar hacia dentro. Quiero que sepas que te estoy protegiendo, aunque a veces no sepa cómo expresarme.</p>
                            <p>Me gustaría que me escucharas sin miedo. Solo necesito un espacio para ser vista, sentida y comprendida.</p>
            
                            <div className="space-y-1">
                                <Label htmlFor="letterBody">(Opcional) Añade aquí cualquier otra cosa que tu emoción quiera decir:</Label>
                                <Textarea id="letterBody" value={letterBody} onChange={e => setLetterBody(e.target.value)} placeholder="Escribe libremente..." />
                            </div>
                            
                            <p>Con cariño,</p>
                            <p>Tu emoción: <strong>{finalEmotion}</strong></p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground italic text-center">
                          Puedes guardar esta carta en tu Cuaderno Terapéutico, así podrás volver a leerla cuando lo necesites, como recordatorio de que tus emociones también quieren ayudarte. 
                        </p>
            
                        <div className="flex justify-between mt-2">
                            <Button onClick={() => setStep(1)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={handleSave} className="w-auto" disabled={!need.trim()}>
                                <Save className="mr-2 h-4 w-4"/>Guardar Carta en el Cuaderno Terapéutico
                            </Button>
                        </div>
                    </div>
                );

            case 3: 
                return (
                    <div className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Carta Guardada</h4>
                        <p className="text-muted-foreground">Tu carta desde la emoción ha sido guardada en tu cuaderno. Puedes volver a leerla cuando necesites reconectar contigo.</p>
                        <Button onClick={() => {
                            setStep(0);
                            setEmotion(''); setOtherEmotion('');
                            setTone(''); setOtherTone('');
                            setNeed(''); setLetterBody('');
                        }} variant="outline">Escribir otra carta</Button>
                    </div>
                );

            default: return null;
        }
    };
    
    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}<div className="mt-4"><audio controls controlsList="nodownload" className="w-full"><source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6semana2tecnica2.mp3" type="audio/mp3" />Tu navegador no soporta el elemento de audio.</audio></div></CardDescription>}</CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
