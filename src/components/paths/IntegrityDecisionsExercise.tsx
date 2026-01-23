
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { IntegrityDecisionsExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm'; // Import emotions
import { useTranslations } from '@/lib/translations'; // Import translations hook

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface IntegrityDecisionsExerciseProps {
  content: IntegrityDecisionsExerciseContent;
  pathId: string;
}

export function IntegrityDecisionsExercise({ content, pathId }: IntegrityDecisionsExerciseProps) {
    const { toast } = useToast();
    const t = useTranslations();
    const [step, setStep] = useState(0);

    const [decision, setDecision] = useState('');
    const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
    const [otherValue, setOtherValue] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [impact, setImpact] = useState('');
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
        setSelectedValues({});
        setOtherValue('');
        setSelectedEmotions({});
        setOtherEmotion('');
        setImpact('');
        setIsProud(false);
        setReflectsWhoIAm(false);
        setCoherence(5);
        setAdjustment('');
        setIsSaved(false);
    }

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const finalValues = valuesList.filter(v => selectedValues[v]);
        if (selectedValues['Otro'] && otherValue) finalValues.push(otherValue);

        const finalEmotions = emotionOptions.filter(e => selectedEmotions[e.value]).map(e => t[e.labelKey as keyof typeof t]);
        if (selectedEmotions['otra'] && otherEmotion) finalEmotions.push(otherEmotion);

        if (finalValues.length === 0 || finalEmotions.length === 0) {
            toast({ title: 'Campos incompletos', description: 'Por favor, selecciona al menos un valor y una emoción.', variant: 'destructive'});
            return;
        }

        const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a tomar:** ${decision}
**Valores implicados:** ${finalValues.join(', ')}
**Emociones predominantes:** ${finalEmotions.join(', ')}
**Impacto a largo plazo:** ${impact}
**¿Me sentiría orgulloso/a?:** ${isProud ? 'Sí' : 'No'}
**¿Refleja quién soy?:** ${reflectsWhoIAm ? 'Sí' : 'No'}
**Nivel de coherencia percibido:** ${coherence}/10
**Ajuste necesario:** ${adjustment || 'Ninguno.'}
        `;
        addNotebookEntry({ title: 'Reflexión: Espejo Ético', content: notebookContent, pathId });
        toast({title: "Reflexión Guardada"});
        setIsSaved(true);
        nextStep();
    };

    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: ¿Qué decisión estás valorando?</h4>
                        <Label htmlFor="decision" className="sr-only">Decisión</Label>
                        <Textarea id="decision" value={decision} onChange={e => setDecision(e.target.value)} />
                        <Button onClick={nextStep} className="w-full mt-4" disabled={!decision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: ¿Qué valores están implicados?</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {valuesList.map(v => (
                                <div key={v} className="flex items-center space-x-2">
                                    <Checkbox id={`val-${v}`} checked={!!selectedValues[v]} onCheckedChange={c => setSelectedValues(p => ({ ...p, [v]: !!c }))} />
                                    <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="val-otro" checked={!!selectedValues['Otro']} onCheckedChange={c => setSelectedValues(p => ({ ...p, 'Otro': !!c }))} />
                            <Label htmlFor="val-otro" className="font-normal text-xs">Otro</Label>
                        </div>
                        {selectedValues['Otro'] && (
                            <Textarea value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Describe tu valor personalizado..." className="mt-2 ml-6" />
                        )}
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(selectedValues).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: ¿Qué emociones predominan cuando piensas en esta decisión?</h4>
                        <p className="text-sm text-muted-foreground">Ejemplo: "Ilusión, miedo, curiosidad, inseguridad."</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {emotionOptions.map(e => (
                                <div key={e.value} className="flex items-center space-x-2">
                                    <Checkbox id={`emo-${e.value}`} checked={!!selectedEmotions[e.value]} onCheckedChange={c => setSelectedEmotions(p => ({...p, [e.value]: !!c}))} />
                                    <Label htmlFor={`emo-${e.value}`} className="font-normal text-xs">{t[e.labelKey as keyof typeof t]}</Label>
                                </div>
                            ))}
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="emo-otra" checked={!!selectedEmotions['otra']} onCheckedChange={c => setSelectedEmotions(p => ({...p, 'otra': !!c}))} />
                            <Label htmlFor="emo-otra" className="font-normal text-xs">Otra</Label>
                        </div>
                        {selectedEmotions['otra'] && (
                            <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2 ml-6" />
                        )}
                        <p className="text-xs italic text-center pt-2">Sentir emociones encontradas es normal. Aquí no hay emociones correctas o incorrectas.</p>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(selectedEmotions).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Evalúa tu coherencia</h4>
                        <div className="space-y-2">
                            <Label>Si tomo esta decisión, ¿cómo me afectará dentro de 1 año? ¿Y dentro de 5 años?</Label>
                            <Textarea value={impact} onChange={e => setImpact(e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isProud" checked={isProud} onCheckedChange={c => setIsProud(!!c)} />
                            <Label htmlFor="isProud">Me sentiría orgulloso/a de esta decisión.</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="reflects" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} />
                            <Label htmlFor="reflects">Refleja quién soy y quiero ser.</Label>
                        </div>
                        <div>
                            <Label>¿Qué nivel de coherencia percibo? {coherence}/10</Label>
                            <Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                     <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Ajuste final y Guardado</h4>
                        <div className="space-y-2">
                            <Label>Si algo no encaja, ¿qué cambiarías para sentirte en paz con la decisión?</Label>
                            <Textarea value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                           <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar en mi Cuaderno</Button>
                        </div>
                    </form>
                );
             case 5:
                return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Reflexión Guardada</h4>
                        <p className="text-muted-foreground">Lo importante no es decidir rápido, sino decidir en paz. Guarda esta reflexión en tu cuaderno para revisarla cuando lo necesites.</p>
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

    