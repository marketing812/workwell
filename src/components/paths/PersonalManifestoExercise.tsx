
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PersonalManifestoExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '../ui/input';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

const reactionOptions = [
    { id: 'reac-prisa', label: 'Actué desde la prisa.' },
    { id: 'reac-miedo', label: 'Actué desde el miedo.' },
    { id: 'reac-presion', label: 'Cedí por presión externa.' },
    { id: 'reac-desconecte', label: 'Me desconecté de lo que sentía.' },
];

interface PersonalManifestoExerciseProps {
  content: PersonalManifestoExerciseContent;
  pathId: string;
}

export function PersonalManifestoExercise({ content, pathId }: PersonalManifestoExerciseProps) {
    const { toast } = useToast();
    const [step, setStep] = useState(0);
    const [situation, setSituation] = useState('');
    const [reactions, setReactions] = useState<Record<string, boolean>>({});
    const [otherReaction, setOtherReaction] = useState('');
    const [coherenceChoice, setCoherenceChoice] = useState<'flexibilidad' | 'incoherencia' | 'duda' | ''>('');
    const [compassionatePhrase, setCompassionatePhrase] = useState('');
    const [adjustment, setAdjustment] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const resetExercise = () => {
        setStep(0);
        setSituation('');
        setReactions({});
        setOtherReaction('');
        setCoherenceChoice('');
        setCompassionatePhrase('');
        setAdjustment('');
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const selectedReactions = reactionOptions.filter(o => reactions[o.id]).map(o => o.label);
        if (reactions['reac-otro']) selectedReactions.push(otherReaction);

        const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation}
**Reacción:** ${selectedReactions.join(', ')}
**Evaluación:** ${coherenceChoice}
**Frase Compasiva:** ${compassionatePhrase}
**Ajuste Sencillo:** ${adjustment}
        `;
        addNotebookEntry({ title: 'Ajuste Compasivo', content: notebookContent, pathId });
        toast({title: "Reflexión Guardada"});
        setIsSaved(true);
        nextStep();
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">A veces no actuamos como nos hubiera gustado. Y está bien. Somos humanos y la vida está llena de presiones, miedos y hábitos. Hoy vas a mirar un momento reciente en el que no actuaste en coherencia… pero lo harás desde la comprensión, no desde la culpa. El objetivo no es juzgarte, sino aprender y elegir un nuevo paso.</p>
                        <Button onClick={nextStep}>Comenzar ejercicio</Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Paso 1: Recuerda la situación</h4>
                        <Textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="“Ayer acepté una tarea extra en el trabajo, aunque necesitaba descansar, y lo hice solo por miedo a decepcionar.”"/>
                        <div className="flex justify-between mt-2">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 2: Nombra tu reacción sin juicio</h4>
                        <p className="text-sm text-muted-foreground">Piensa en cómo actuaste en esa situación y nómbralo sin culparte.</p>
                        <div className="space-y-2">
                            {reactionOptions.map(opt => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <Checkbox id={opt.id} checked={!!reactions[opt.id]} onCheckedChange={c => setReactions(p => ({...p, [opt.id]: !!c}))} />
                                    <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="reac-otro" checked={!!reactions['reac-otro']} onCheckedChange={c => setReactions(p => ({...p, 'reac-otro': !!c}))} />
                                <Label htmlFor="reac-otro" className="font-normal">Otro:</Label>
                            </div>
                            {reactions['reac-otro'] && <Textarea value={otherReaction} onChange={e => setOtherReaction(e.target.value)} />}
                        </div>
                        <div className="space-y-2 pt-4">
                            <Label>¿Lo que hiciste fue una adaptación consciente o una incoherencia?</Label>
                            <RadioGroup value={coherenceChoice} onValueChange={v => setCoherenceChoice(v as any)}>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="flexibilidad" id="choice-flex" /><Label htmlFor="choice-flex" className="font-normal">Flexibilidad consciente → Adapté mi decisión, pero sin traicionar lo esencial de mis valores.</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="incoherencia" id="choice-incoh" /><Label htmlFor="choice-incoh" className="font-normal">Incoherencia → Actué de forma contraria a lo que valoro, por miedo, presión o costumbre.</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="duda" id="choice-duda" /><Label htmlFor="choice-duda" className="font-normal">No lo tengo claro → Necesito reflexionar un poco más.</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="flex justify-between mt-2">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep} disabled={!coherenceChoice}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 3:
                let reminderText;
                if (coherenceChoice === 'flexibilidad') {
                    reminderText = "✨ “Esto no es incoherencia, es cuidar lo importante. Adaptarte también puede ser coherente. Reconócelo como un acto de equilibrio.”";
                } else if (coherenceChoice === 'incoherencia') {
                    reminderText = "✨ “Está bien. Todos nos salimos del camino alguna vez. Lo importante no es castigarte, sino aprender de lo que pasó y ajustar para la próxima vez.”";
                } else {
                    reminderText = "✨ “La duda también enseña. Pregúntate: ¿qué valor estaba en juego y qué emoción pesó más en mi decisión? Ahí encontrarás la respuesta.”";
                }
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 3: Mira con compasión</h4>
                        <p className="p-4 bg-accent/10 border-l-4 border-accent text-sm">{reminderText}</p>
                        <div className="space-y-2">
                            <Label htmlFor="compassion-phrase">Si pudieras hablarte con ternura, ¿qué frase te dirías ahora?</Label>
                            <Textarea id="compassion-phrase" value={compassionatePhrase} onChange={e => setCompassionatePhrase(e.target.value)} placeholder="Ejemplo: “Entiendo que estabas cansada y no querías problemas. Está bien, lo importante es cómo eliges a partir de ahora.”"/>
                        </div>
                        <div className="flex justify-between mt-2">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold">Paso 4: Elige un ajuste sencillo</h4>
                        <p className="text-sm text-muted-foreground">Piensa en un pequeño paso para la próxima vez que te ayude a sentirte más coherente.</p>
                        <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                            <p>Ejemplo:</p>
                            <ul className="list-disc list-inside">
                                <li>Si fue flexibilidad consciente: “Me recordaré que adaptarme no significa perder coherencia.”</li>
                                <li>Si fue incoherencia: “La próxima vez, diré que necesito pensarlo antes de aceptar un compromiso.”</li>
                            </ul>
                        </div>
                        <Label htmlFor="adjustment">Pequeño paso:</Label>
                        <Textarea id="adjustment" value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        <div className="flex justify-between mt-2">
                            <Button variant="outline" onClick={prevStep}>Atrás</Button>
                            <Button onClick={handleSave} disabled={!adjustment.trim()}><Save className="mr-2 h-4 w-4"/> Guardar mi ajuste compasivo</Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="p-4 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-semibold text-lg">Cierre motivador</h4>
                        <p className="text-muted-foreground">La coherencia no se mide por un tropiezo, sino por cómo eliges levantarte. Cada vez que te miras con compasión y eliges un ajuste, fortaleces tu dirección interna.</p>
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
                {content.objective && <CardDescription className="pt-2">{content.objective}
                {content.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src={content.audioUrl} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
                </CardDescription>}
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
