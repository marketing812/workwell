
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { IntegrityDecisionsExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { useUser } from '@/contexts/UserContext';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Pareja / Amor romántico', 'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

const emotionOptions = [
    { value: 'tristeza', labelKey: 'emotionSadness' },
    { value: 'miedo', labelKey: 'emotionFear' },
    { value: 'ira', labelKey: 'emotionAnger' },
    { value: 'asco', labelKey: 'emotionDisgust' },
    { value: 'estres', labelKey: 'emotionStress' },
    { value: 'ansiedad', labelKey: 'emotionAnxiety' },
    { value: 'agobio', labelKey: 'emotionOverwhelm' },
    { value: 'ilusion', labelKey: 'emotionHope' },
    { value: 'entusiasmo', labelKey: 'emotionEnthusiasm' },
    { value: 'esperanza', labelKey: 'emotionHopefulness' },
    { value: 'culpa', labelKey: 'emotionGuilt' },
    { value: 'inseguridad', labelKey: 'emotionInsecurity' },
    { value: 'confusion', labelKey: 'emotionConfusion' },
    { value: 'ambivalencia', labelKey: 'emotionAmbivalence' },
];

interface IntegrityDecisionsExerciseProps {
  content: IntegrityDecisionsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function IntegrityDecisionsExercise({ content, pathId, onComplete }: IntegrityDecisionsExerciseProps) {
    const { toast } = useToast();
    const t = useTranslations();
    const { user } = useUser();
    const [step, setStep] = useState(0);

    const [decision, setDecision] = useState('');
    const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
    const [otherValue, setOtherValue] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [impact, setImpact] = useState('');
    const [isProud, setIsProud] = useState(false);
    const [reflectsWhoIAm, setReflectsWhoIAm] = useState(false);
    const [coherence, setCoherence] = useState(1);
    const [adjustment, setAdjustment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
    
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
        setCoherence(1);
        setAdjustment('');
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const finalValues = valuesList.filter(v => selectedValues[v]);
        if (selectedValues['Otro'] && otherValue) finalValues.push(otherValue);

        const finalEmotions = emotionOptions.filter(e => selectedEmotions[e.value]).map(e => t[e.labelKey as keyof typeof t]);
        if (selectedEmotions['otra'] && otherEmotion) finalEmotions.push(otherEmotion);

        if (finalValues.length === 0 || finalEmotions.length === 0 || !decision.trim()) {
            toast({ title: 'Campos incompletos', description: 'Por favor, completa los pasos principales.', variant: 'destructive'});
            return;
        }

        const notebookContent = `
**Ejercicio: ${content.title}**

**Decisión a tomar:** ${decision}
**Valores implicados:** ${finalValues.join(', ')}
**Emociones predominantes:** ${finalEmotions.join(', ')}
**Impacto a largo plazo:** ${impact || 'No especificado.'}
**¿Me sentiría orgulloso/a?:** ${isProud ? 'Sí' : 'No'}
**¿Refleja quién soy?:** ${reflectsWhoIAm ? 'Sí' : 'No'}
**Nivel de coherencia percibido:** ${coherence}/10
**Ajuste necesario:** ${adjustment || 'Ninguno.'}
        `;
        addNotebookEntry({ title: 'Reflexión: Decisiones con Integridad', content: notebookContent, pathId, userId: user?.id });
        toast({title: "Reflexión Guardada"});
        setIsSaved(true);
        onComplete();
        nextStep();
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">A veces tomamos decisiones rápidas para salir de la incomodidad, y luego nos quedamos con la sensación de que algo no encaja. Esta herramienta es como una linterna que ilumina tres puntos clave para decidir con calma: lo que valoras, lo que sientes y cómo te afectará en el tiempo.</p>
                        <Button onClick={nextStep}>Empezar a decidir con integridad <ArrowRight className="mr-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <Label className="font-semibold text-lg">Paso 1: ¿Qué decisión tienes que tomar?</Label>
                        <p className="text-sm text-muted-foreground">Describe la decisión de forma concreta y breve.</p>
                        <Textarea value={decision} onChange={e => setDecision(e.target.value)} placeholder="Ejemplo: “Estoy pensando en mudarme a otra ciudad para un proyecto creativo, aunque me preocupa la reacción de mi familia.”"/>
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep} disabled={!decision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: Filtro 1 – Tus valores</h4>
                        <p className="text-sm text-muted-foreground">Piensa en lo que es importante para ti, no en lo que crees que es importante para los demás.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {valuesList.map(v => (
                                <div key={v} className="flex items-center space-x-2">
                                    <Checkbox id={`val-${v}`} checked={!!selectedValues[v]} onCheckedChange={c => setSelectedValues(p => ({ ...p, [v]: !!c }))} />
                                    <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="val-otro" checked={!!selectedValues['Otro']} onCheckedChange={c => setSelectedValues(p => ({ ...p, 'Otro': !!c }))} />
                                <Label htmlFor="val-otro" className="font-normal text-xs">Otro</Label>
                            </div>
                        </div>
                        {selectedValues['Otro'] && (
                            <Textarea value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Describe tu valor personalizado..." className="mt-2" />
                        )}
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(selectedValues).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Filtro 2 – Tus emociones</h4>
                        <p className="text-sm text-muted-foreground">Ejemplo: "Ilusión, miedo, curiosidad, inseguridad."</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {emotionOptions.map(e => (
                                <div key={e.value} className="flex items-center space-x-2">
                                    <Checkbox id={`emo-${e.value}`} checked={!!selectedEmotions[e.value]} onCheckedChange={c => setSelectedEmotions(p => ({...p, [e.value]: !!c}))} />
                                    <Label htmlFor={`emo-${e.value}`} className="font-normal text-xs">{t[e.labelKey as keyof typeof t]}</Label>
                                </div>
                            ))}
                             <div className="flex items-center space-x-2">
                                <Checkbox id="emo-otra" checked={!!selectedEmotions['otra']} onCheckedChange={c => setSelectedEmotions(p => ({...p, 'otra': !!c}))} />
                                <Label htmlFor="emo-otra" className="font-normal text-xs">Otra</Label>
                            </div>
                        </div>
                        {selectedEmotions['otra'] && (
                            <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2 ml-6" />
                        )}
                        <p className="text-xs italic text-center pt-2">Sentir emociones encontradas es normal. Aquí no hay emociones correctas o incorrectas.</p>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(selectedEmotions).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Filtro 3 – Impacto a largo plazo</h4>
                        <Label>Si tomo esta decisión, ¿cómo me afectará dentro de 1 año? ¿Y dentro de 5 años?</Label>
                        <Textarea value={impact} onChange={e => setImpact(e.target.value)} placeholder='Ejemplo: "A 1 año: tendré más ingresos pero estaré lejos de mi familia. A 5 años: habré crecido profesionalmente y podré volver con más opciones."' />
                        <div className="flex justify-between w-full mt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Autoevaluación</h4>
                        <p className="text-base text-muted-foreground">Haz un chequeo rápido: ¿Esta decisión me representa? ¿Me sentiría orgulloso/a de contarla? Usa las casillas y el medidor para verlo con claridad.</p>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isProud" checked={isProud} onCheckedChange={c => setIsProud(!!c)} />
                            <Label htmlFor="isProud">Me sentiría orgulloso/a de dar esta explicación.</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="reflects" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} />
                            <Label htmlFor="reflects">Refleja quién soy y quiero ser.</Label>
                        </div>
                        <div>
                            <Label className="font-semibold text-xl">¿Qué nivel de coherencia percibo? {coherence}/10</Label>
                            <p className="text-base text-foreground mb-2">Muévete por sensaciones: no busques un número ‘perfecto’. Piensa en qué medida esta decisión está alineada con tus valores y cómo te gustaría verte actuando en el futuro.</p>
                            <Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0 (Nada coherente)</span>
                                <span>5 (Medio)</span>
                                <span>10 (Total)</span>
                            </div>
                        </div>
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 6: Ajusta si es necesario</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p className="font-semibold text-foreground">Guía de uso:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>“Escribe cualquier cambio, por pequeño que parezca, que haría que la decisión se sintiera más tuya.”</li>
                                <li>“Piensa en ajustes de forma, de tiempos, de condiciones o de manera de comunicarla.”</li>
                                <li>“No es un compromiso inmediato, es una exploración para ver si hay un punto intermedio que te acerque a tu coherencia.”</li>
                            </ul>
                            <p className="italic pt-2">Ejemplo: “Antes de mudarme definitivamente, podría hacer una estancia de prueba de unos meses para adaptarme y también dar más tranquilidad a mi familia.”</p>
                        </div>
                        <Label htmlFor="adjustment" className='pt-2 block'>Escribe aquí qué cambiarias</Label>
                        <Textarea id="adjustment" value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Ir al Cierre <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 7:
                 return (
                    <form onSubmit={handleSave} className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">Lo importante no es decidir rápido, sino decidir en paz. Guarda esta reflexión en tu cuaderno para revisarla cuando lo necesites.</p>
                        <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar en mi cuaderno</Button>
                        <Button onClick={prevStep} variant="outline" type="button" className="w-full">Atrás</Button>
                    </form>
                );
            case 8:
                return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Reflexión Guardada</h4>
                        <p className="text-muted-foreground">Has usado tu brújula interna para ganar claridad. Puedes volver a este registro cuando lo necesites.</p>
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
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}

    