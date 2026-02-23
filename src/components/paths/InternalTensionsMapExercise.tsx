"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InternalTensionsMapExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface InternalTensionsMapExerciseProps {
  content: InternalTensionsMapExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const emotionOptions = [
    { id: 'ansiedad', label: 'Ansiedad' },
    { id: 'culpa', label: 'Culpa' },
    { id: 'alivio', label: 'Alivio' },
    { id: 'tristeza', label: 'Tristeza' },
    { id: 'enojo', label: 'Enojo' },
    { id: 'verguenza', label: 'Vergüenza' },
    { id: 'miedo', label: 'Miedo' },
    { id: 'frustracion', label: 'Frustración' },
];

export default function InternalTensionsMapExercise({ content, pathId, onComplete }: InternalTensionsMapExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);

    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState('');
    const [emotions, setEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [action, setAction] = useState('');
    const [alignment, setAlignment] = useState<'alineado/a' | 'parcialmente' | 'desalineado/a' | ''>('');
    const [needed, setNeeded] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const resetExercise = () => {
        setStep(0);
        setSituation('');
        setThought('');
        setEmotions({});
        setOtherEmotion('');
        setAction('');
        setAlignment('');
        setNeeded('');
        setIsSaved(false);
    };

    const handleSave = () => {
        const selectedEmotions = emotionOptions.filter(e => emotions[e.id]).map(e => e.label);
        if (emotions['otra'] && otherEmotion) selectedEmotions.push(otherEmotion);

        const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation}
**Pensamiento:** ${thought}
**Emoción(es):** ${selectedEmotions.join(', ') || 'No especificada'}
**Acción:** ${action}
**Alineación:** ${alignment}
**¿Qué habría necesitado?:** ${needed}
        `;
        addNotebookEntry({ title: 'Mapa de Tensiones Internas', content: notebookContent, pathId, userId: user?.id });
        toast({ title: 'Mapa Guardado' });
        onComplete();
        setIsSaved(true);
        nextStep();
    };
  
    const renderStep = () => {
        const finalEmotions = emotionOptions.filter(e => emotions[e.id]).map(e => e.label);
        if (emotions['otra'] && otherEmotion.trim()) {
            finalEmotions.push(otherEmotion.trim());
        }

        switch (step) {
            case 0: // Intro
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p>¿Alguna vez has sentido que una parte de ti quiere ir en una dirección… pero otra parte tira hacia el lado opuesto? Ese estirón interno cansa, confunde y a veces te deja con la sensación de que no sabes qué quieres. Hoy vamos a ponerle orden a esa cuerda interna para que puedas aflojarla.</p>
                        <Button onClick={nextStep}>Empezar mi mapa <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            case 1: // Ejemplo guiado
                 return (
                    <div className="p-4 space-y-4 text-center">
                        <p>Al finalizar el ejercicio te darás cuenta de algo así…</p>
                        <Accordion type="single" collapsible className="w-full text-left">
                            <AccordionItem value="example">
                                <AccordionTrigger>Ver ejemplo</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm">María nota que se enfada cuando acepta encargos extra en el trabajo. Al hacer el mapa, ve que siempre piensa: “Si digo que no, decepcionaré a mi jefe”. La emoción que surge es ansiedad. La acción es aceptar. Conclusión: necesita practicar pedir más tiempo o negociar plazos.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Empezar mi registro <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                 );
            case 2: // Paso 1: Situación
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 1: Elige una situación reciente</h4>
                        <Label htmlFor="situation">¿Qué ocurrió?</Label>
                        <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ejemplo: “Ayer acepté un plan aunque quería quedarme en casa.”" />
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 3: // Paso 2: Pensamiento
                return (
                     <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 2: Escribe tu pensamiento principal en ese momento</h4>
                        <Label htmlFor="thought">¿Qué te dijiste?</Label>
                        <Textarea id="thought" value={thought} onChange={e => setThought(e.target.value)} placeholder="Ejemplo: “Si digo que no, pensarán que soy una aburrida.”" />
                        <p className="text-sm text-muted-foreground">Escribe las frases que pasaron por tu mente, tal y como las recuerdes</p>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!thought.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4: // Paso 3: Emoción
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 3: Identifica la emoción dominante</h4>
                        <p>Selecciona todas las que apliquen. Si no ves tu emoción, escríbela.</p>
                        <div className="grid grid-cols-2 gap-2">
                          {emotionOptions.map(opt => (
                              <div key={opt.id} className="flex items-center space-x-2">
                                  <Checkbox id={opt.id} checked={!!emotions[opt.id]} onCheckedChange={c => setEmotions(p => ({...p, [opt.id]: !!c}))} />
                                  <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                              </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox id="otra" checked={!!emotions['otra']} onCheckedChange={c => setEmotions(p => ({...p, otra: !!c}))} />
                          <Label htmlFor="otra" className="font-normal">Otra:</Label>
                        </div>
                        {emotions['otra'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} />}
                        <div className="flex justify-between w-full mt-2">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep} className="w-auto" disabled={Object.values(emotions).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                );
             case 5: // Paso 4: Acción
                return (
                     <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 4: Describe la acción que tomaste</h4>
                        <Label htmlFor="action">¿Qué hiciste finalmente?</Label>
                        <Textarea id="action" value={action} onChange={e => setAction(e.target.value)} placeholder="Ejemplo: Fui al plan y volví tarde, cansado/a y molesto/a conmigo mismo/a." />
                         <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!action.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 6: // Paso 5: Alineación
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 5: Evalúa la alineación</h4>
                        <RadioGroup value={alignment} onValueChange={v => setAlignment(v as any)}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="alineado/a" id="align-1" /><Label htmlFor="align-1">100% alineado/a</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="parcialmente" id="align-2" /><Label htmlFor="align-2">Parcialmente alineado/a</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="desalineado/a" id="align-3" /><Label htmlFor="align-3">Desalineado/a</Label></div>
                        </RadioGroup>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!alignment}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 7: // Paso 6: Reflexión
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 6: Reflexiona</h4>
                        <Label htmlFor="needed">¿Qué hubiera necesitado para actuar de forma más coherente con lo que sentía y pensaba?</Label>
                        <Textarea id="needed" value={needed} onChange={e => setNeeded(e.target.value)} placeholder="Ejemplo: “Haberme dado permiso para decir que no y descansar.”" />
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!needed.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 8: // Consejo y Guardado
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="italic">“No se trata de señalarte con el dedo, sino de conocerte mejor. La autocrítica frena, la curiosidad impulsa.”</p>
                        <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi mapa</Button>
                        <Button onClick={prevStep} variant="outline" className="w-full">Atrás</Button>
                    </div>
                );
            case 9: // Confirmation
                return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Mapa Guardado</h4>
                        <p>Tu mapa de tensiones internas ha sido guardado. Puedes volver a él cuando necesites claridad.</p>
                        <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                <CardDescription className="pt-2">
                    {content.objective}
                    <div className="text-sm mt-2">Tiempo aproximado: {content.duration}. Te recomiendo hacerlo 3 o 4 veces esta semana, sobre todo después de una situación que te haya dejado malestar o duda.</div>
                </CardDescription>
                {content.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
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
