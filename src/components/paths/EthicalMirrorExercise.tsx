"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { EthicalMirrorExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface EthicalMirrorExerciseProps {
  content: EthicalMirrorExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function EthicalMirrorExercise({ content, pathId, onComplete }: EthicalMirrorExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [decision, setDecision] = useState('');
    const [person, setPerson] = useState('');
    const [otherPerson, setOtherPerson] = useState('');
    const [explanation, setExplanation] = useState('');
    const [motives, setMotives] = useState('');
    const [explanationForOther, setExplanationForOther] = useState('');
    const [values, setValues] = useState<Record<string, boolean>>({});
    const [otherValue, setOtherValue] = useState('');
    const [isProud, setIsProud] = useState(false);
    const [reflectsWhoIAm, setReflectsWhoIAm] = useState(false);
    const [coherence, setCoherence] = useState(5);
    const [adjustment, setAdjustment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const resetExercise = () => {
        setStep(0);
        setDecision('');
        setPerson('');
        setOtherPerson('');
        setExplanation('');
        setMotives('');
        setExplanationForOther('');
        setValues({});
        setOtherValue('');
        setIsProud(false);
        setReflectsWhoIAm(false);
        setCoherence(5);
        setAdjustment('');
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const selectedValues = Object.keys(values).filter(k => values[k] && k !== 'Otra');
        if (values['Otra'] && otherValue) {
            selectedValues.push(otherValue);
        }
        const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a explorar:** ${decision}
**Persona espejo:** ${person === 'Otra' ? otherPerson : person}
**Explicación como si fuera real:** ${explanation}
**Motivos principales:** ${motives}
**Explicación para que lo entienda:** ${explanationForOther}
**Valores en juego:** ${selectedValues.join(', ')}
**¿Me sentiría orgulloso/a?:** ${isProud ? 'Sí' : 'No'}
**¿Refleja quién soy?:** ${reflectsWhoIAm ? 'Sí' : 'No'}
**Nivel de coherencia percibido:** ${coherence}/10
**Ajuste necesario:** ${adjustment || 'Ninguno.'}
        `;
        addNotebookEntry({ title: 'Reflexión: Espejo Ético', content: notebookContent, pathId, userId: user?.id });
        toast({title: "Reflexión Guardada"});
        setIsSaved(true);
        onComplete();
        nextStep();
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <Label className="font-semibold text-lg">Paso 1: ¿Qué decisión estás valorando?</Label>
                        <Textarea value={decision} onChange={e => setDecision(e.target.value)} />
                        <Button onClick={nextStep} className="w-full mt-4" disabled={!decision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <Label className="font-semibold text-lg">Paso 2: ¿A quién se lo explicarías?</Label>
                        <Select value={person} onValueChange={setPerson}>
                            <SelectTrigger><SelectValue placeholder="Elige..."/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                                <SelectItem value="Familiar">Familiar</SelectItem>
                                <SelectItem value="Mentor/a">Mentor/a</SelectItem>
                                <SelectItem value="Mi yo futuro">“Mi yo futuro”</SelectItem>
                                <SelectItem value="Otra">Otra</SelectItem>
                            </SelectContent>
                        </Select>
                        {person === 'Otra' && <Textarea value={otherPerson} onChange={e => setOtherPerson(e.target.value)} placeholder="Describe a la otra persona..."/>}
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={!person || (person === 'Otra' && !otherPerson.trim())}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 2:
                return(
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Explica tu decisión</h4>
                        <div className="space-y-2">
                            <Label>Escribe tu explicación como si fuera real</Label>
                            <Textarea value={explanation} onChange={e => setExplanation(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Los motivos principales de mi decisión son...</Label>
                            <Textarea value={motives} onChange={e => setMotives(e.target.value)} placeholder="Ejemplo: “Quiero crecer y el nuevo puesto me reta.”" />
                        </div>
                        <div className="space-y-2">
                            <Label>¿Cómo se lo explicarías para que lo entienda?</Label>
                            <Textarea value={explanationForOther} onChange={e => setExplanationForOther(e.target.value)} placeholder="Ejemplo: “Quiero mudarme porque siento que esta ciudad me ofrece un entorno más inspirador y me permitirá crecer en mi proyecto creativo…”" />
                        </div>
                        <div className="space-y-2">
                            <Label>Valores implicados</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {valuesList.map(v => (
                                    <div key={v} className="flex items-center space-x-2">
                                        <Checkbox id={v} checked={!!values[v]} onCheckedChange={c => setValues(p => ({...p, [v]: !!c}))} />
                                        <Label htmlFor={v} className="font-normal text-xs">{v}</Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="Otra" checked={!!values['Otra']} onCheckedChange={c => setValues(p => ({...p, ['Otra']: !!c}))} />
                                    <Label htmlFor="Otra" className="font-normal text-xs">Otros</Label>
                                </div>
                            </div>
                            {values['Otra'] && (
                                <Textarea value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Escribe otros valores..." className="mt-2" />
                            )}
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                     </div>
                );
            case 3:
                return(
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Evalúa tu coherencia</h4>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isProud" checked={isProud} onCheckedChange={c => setIsProud(!!c)} />
                            <Label htmlFor="isProud">Me sentiría orgulloso/a de dar esta explicación.</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="reflects" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} />
                            <Label htmlFor="reflects">Refleja quién soy y quiero ser.</Label>
                        </div>
                        <div>
                            <Label>¿Qué nivel de coherencia percibo? {coherence}/10</Label>
                            <p className="text-xs text-muted-foreground italic mb-2">Muévete por sensaciones: no busques un número ‘perfecto’. Piensa en qué medida esta decisión está alineada con tus valores y cómo te gustaría verte actuando en el futuro.</p>
                            <Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0 (Nada)</span>
                                <span>5 (Medio)</span>
                                <span>10 (Total)</span>
                            </div>
                        </div>
                        <div className="flex justify-between w-full mt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Consejo práctico</h4>
                        <p className="p-4 bg-accent/10 border-l-4 border-accent">Si al escribir notas que te justificas demasiado o que sientes tensión, puede que no estés del todo en coherencia. Esto no es malo: es tu oportunidad para ajustar el rumbo antes de decidir.</p>
                        <div className="flex justify-between w-full mt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <form onSubmit={handleSave} className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 6: Ajuste final y Guardado</h4>
                        <Label>Si algo no encaja, ¿qué cambiarías para sentirte en paz con la decisión?</Label>
                        <Textarea value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        <div className="flex justify-between w-full mt-4">
                           <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar en mi Cuaderno</Button>
                        </div>
                    </form>
                );
            case 6:
                return (
                    <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Reflexión Guardada</h4>
                        <p className="text-muted-foreground">Has usado tu espejo ético para ganar claridad. Puedes volver a este registro cuando lo necesites.</p>
                        <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otra reflexión</Button>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                <CardDescription className="pt-2">
                    Cuando tenemos que tomar una decisión difícil, a veces nos quedamos atrapados en un bucle de dudas. Hoy vas a mirarte en un ‘espejo’ muy especial: la mirada de alguien a quien respetas y que siempre te ha inspirado a ser tu mejor versión. Con este ejercicio quiero ayudarte a aclarar si lo que estás a punto de decidir está alineado con lo que eres y lo que valoras. Lo haremos imaginando que explicas tu decisión a alguien importante para ti. Si la explicación te da paz, probablemente sea coherente. En este ejercicio no se trata de que te convenzas, sino de que te escuches con honestidad.
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src="https://workwellfut.com/audios/ruta9/tecnicas/Ruta9semana2tecnica2.mp3" type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
