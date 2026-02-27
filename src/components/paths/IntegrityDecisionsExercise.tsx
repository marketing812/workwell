
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
import { useUser } from '@/contexts/UserContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Pareja / Amor romántico', 'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface IntegrityDecisionsExerciseProps {
  content: IntegrityDecisionsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function IntegrityDecisionsExercise({ content, pathId, onComplete }: IntegrityDecisionsExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const t = useTranslations();
    const [step, setStep] = useState(0);
    const [decision, setDecision] = useState('');
    const [values, setValues] = useState<Record<string, boolean>>({});
    const [otherValue, setOtherValue] = useState('');
    const [emotions, setEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [longTermImpact, setLongTermImpact] = useState('');
    const [isProud, setIsProud] = useState(false);
    const [reflectsWhoIAm, setReflectsWhoIAm] = useState(false);
    const [coherence, setCoherence] = useState(1);
    const [adjustment, setAdjustment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

    const handleValuesNext = () => {
      const selectedCount = Object.values(values).filter(Boolean).length;
      if (selectedCount < 3) {
        toast({
          title: "Selección insuficiente",
          description: "Por favor, selecciona al menos 3 valores.",
          variant: "destructive",
        });
      } else {
        nextStep();
      }
    };
    
    const resetExercise = () => {
        setStep(0);
        setDecision('');
        setValues({});
        setOtherValue('');
        setEmotions({});
        setOtherEmotion('');
        setLongTermImpact('');
        setIsProud(false);
        setReflectsWhoIAm(false);
        setCoherence(1);
        setAdjustment('');
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const selectedValues = valuesList.filter(v => values[v]);
        if (values['Otro'] && otherValue) {
            selectedValues.push(otherValue);
        }
        
        const selectedEmotions = emotionOptions
            .filter(e => emotions[e.value])
            .map(e => t[e.labelKey as keyof typeof t]);
        if (emotions['otra'] && otherEmotion) {
            selectedEmotions.push(otherEmotion);
        }

        if (!decision.trim()){
            toast({ title: 'Ejercicio Incompleto', description: 'Por favor, completa al menos la descripción de tu decisión para guardar.', variant: 'destructive'});
            return;
        }

        const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Elige la decisión que quieres explorar | Respuesta: ${decision || 'No especificada.'}
Pregunta: ¿Qué valores están implicados en esta decisión? | Respuesta: ${selectedValues.join(', ') || 'Ninguno seleccionado.'}
Pregunta: ¿Qué emociones predominan cuando piensas en esta decisión? | Respuesta: ${selectedEmotions.join(', ') || 'No especificadas.'}
Pregunta: Si tomo esta decisión, ¿cómo me afectará dentro de 1 año? ¿Y dentro de 5 años? | Respuesta: ${longTermImpact || 'No especificado.'}

**Autoevaluación:**
Pregunta: ¿Me sentiría orgulloso/a de dar esta explicación? | Respuesta: ${isProud ? 'Sí' : 'No'}
Pregunta: ¿Refleja quién soy y quiero ser? | Respuesta: ${reflectsWhoIAm ? 'Sí' : 'No'}
Nivel de coherencia percibida: ${coherence}/10

Pregunta: ¿Qué cambiarías para sentirte en paz con la decisión? | Respuesta: ${adjustment || 'Ninguno.'}
    `;
        addNotebookEntry({ title: 'Decisiones con Integridad', content: notebookContent, pathId: pathId, userId: user?.id });
        toast({title: "Reflexión Guardada"});
        setIsSaved(true);
        onComplete();
        setStep(8); // Go to confirmation screen
    };

    const renderStep = () => {
        switch (step) {
            case 0: // Introducción
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">A veces tomamos decisiones rápidas para salir de la incomodidad, y luego nos quedamos con la sensación de que algo no encaja. Esta herramienta es como una linterna que ilumina tres puntos clave para decidir con calma: lo que valoras, lo que sientes y cómo te afectará en el tiempo.</p>
                        <Button onClick={nextStep}>Empezar mi registro <ArrowRight className="mr-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1: // Ejemplo guiado
                return (
                    <div className="p-4 space-y-4 text-center">
                        <Accordion type="single" defaultValue="example" className="w-full text-left">
                            <AccordionItem value="example">
                                <AccordionTrigger>Ver ejemplo guiado</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 text-sm p-2">
                                        <p>Al finalizar el ejercicio podrías descubrir algo como esto…</p>
                                        <p className="italic">Luis quiere mudarse a otra ciudad por un proyecto creativo, pero teme la opinión de su familia. En el ejercicio, se lo explica a su hermano mayor, resaltando que busca crecimiento personal y un entorno más inspirador. Al leerlo, siente que esa explicación le representa y confirma que es la decisión correcta para él.</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Empezar mi registro <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 2: // Paso 1: Elige la decisión
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: Describe la decisión</h4>
                        <Label htmlFor="decision">¿Qué decisión tienes que tomar?</Label>
                        <Textarea value={decision} onChange={e => setDecision(e.target.value)} placeholder="Ejemplo: “Estoy pensando en mudarme a otra ciudad para un proyecto creativo, aunque me preocupa la reacción de mi familia.”"/>
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep} disabled={!decision.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 3: // Paso 2: Filtro 1 – Tus valores
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: Filtro 1 – Tus valores</h4>
                        <Label>¿Qué valores están implicados en esta decisión? (Selecciona los que mejor representen lo que quieres respetar con tu decisión. Puedes elegir más de uno)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md">
                            {valuesList.map(v => (
                                <div key={v} className="flex items-center space-x-2">
                                    <Checkbox id={`val-${v}`} checked={!!values[v]} onCheckedChange={c => setValues(p => ({...p, [v]: !!c}))} />
                                    <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="val-otro" checked={!!values['Otro']} onCheckedChange={c => setValues(p => ({...p, 'Otro': !!c}))} />
                                <Label htmlFor="val-otro" className="font-normal text-xs">Otro</Label>
                            </div>
                        </div>
                        {values['Otro'] && <Textarea value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Escribe otros valores..." className="mt-2" />}
                         <p className="text-sm text-muted-foreground pt-2">Piensa en lo que es importante para ti, no en lo que crees que es importante para los demás.</p>
                        <div className="flex justify-between w-full pt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={handleValuesNext}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4: // Paso 3: Filtro 2 – Tus emociones
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Filtro 2 – Tus emociones</h4>
                        <Label>¿Qué emociones predominan cuando piensas en esta decisión?</Label>
                        <p className="text-sm italic text-muted-foreground">Ejemplo: "Ilusión, miedo, curiosidad, inseguridad."</p>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {emotionOptions.map(emo => (
                                <div key={emo.value} className="flex items-center space-x-2">
                                    <Checkbox id={`emo-${emo.value}`} checked={emotions[emo.value] || false} onCheckedChange={(checked) => setEmotions(p => ({...p, [emo.value]: !!checked}))} />
                                    <Label htmlFor={`emo-${emo.value}`} className="font-normal text-sm">{t[emo.labelKey as keyof typeof t]}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="emo-otra" checked={emotions['otra'] || false} onCheckedChange={(checked) => setEmotions(p => ({...p, otra: !!checked}))} />
                                <Label htmlFor="emo-otra" className="font-normal text-sm">Otra</Label>
                            </div>
                        </div>
                        {emotions['otra'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Escribe otra emoción..." className="mt-2" />}
                        <p className="text-sm text-muted-foreground pt-2">Sentir emociones encontradas es normal. Aquí no hay emociones correctas o incorrectas.</p>
                         <div className="flex justify-between w-full pt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(emotions).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 5: // Paso 4: Filtro 3 – Impacto a largo plazo
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Filtro 3 – Impacto a largo plazo</h4>
                        <Label htmlFor="long-term-impact">Si tomo esta decisión, ¿cómo me afectará dentro de 1 año? ¿Y dentro de 5 años?</Label>
                        <p className="text-sm italic text-muted-foreground">Ejemplo: "A 1 año: tendré más ingresos pero estaré lejos de mi familia. A 5 años: habré crecido profesionalmente y podré volver con más opciones."</p>
                        <Textarea id="long-term-impact" value={longTermImpact} onChange={e => setLongTermImpact(e.target.value)} rows={4} />
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep} disabled={!longTermImpact.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 6: // Paso 5: Autoevaluación
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Autoevaluación</h4>
                        <p className="text-base text-muted-foreground">Haz un chequeo rápido: ¿Esta decisión me representa? ¿Me sentiría orgulloso/a de contarla? Usa las casillas y el medidor para verlo con claridad.</p>
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="isProud" checked={isProud} onCheckedChange={c => setIsProud(!!c)} />
                                <Label htmlFor="isProud" className="font-normal">Me sentiría orgulloso/a de dar esta explicación.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="reflects" checked={reflectsWhoIAm} onCheckedChange={c => setReflectsWhoIAm(!!c)} />
                                <Label htmlFor="reflects" className="font-normal">Refleja quién soy y quiero ser.</Label>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Label className="font-semibold">Nivel de coherencia percibida: {coherence}/10</Label>
                            <Slider value={[coherence]} onValueChange={v => setCoherence(v[0])} min={0} max={10} step={1} className="mt-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Nada coherente</span>
                                <span>Totalmente coherente</span>
                            </div>
                        </div>
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 7: // Paso 6: Ajusta si es necesario
                return (
                     <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 6: Ajusta si es necesario</h4>
                         <div className="text-sm text-muted-foreground space-y-2">
                            <p className="font-semibold text-foreground">Guía de uso:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>“Escribe cualquier cambio, por pequeño que parezca, que haría que la decisión se sintiera más tuya.”</li>
                                <li>“Piensa en ajustes de forma, de tiempos, de condiciones o de manera de comunicarla.”</li>
                                <li>“No es un compromiso inmediato, es una exploración para ver si hay un punto intermedio que te acerque a tu coherencia.”</li>
                            </ul>
                        </div>
                        <blockquote className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm mt-2">
                            Ejemplo: “Antes de mudarme definitivamente, podría hacer una estancia de prueba de unos meses para adaptarme y también dar más tranquilidad a mi familia.”
                        </blockquote>
                        <Label htmlFor="adjustment">Escribe aquí lo qué cambiarías</Label>
                        <Textarea id="adjustment" value={adjustment} onChange={e => setAdjustment(e.target.value)} />
                        <div className="flex justify-between w-full pt-4">
                           <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                           <Button onClick={nextStep}>Ir al Cierre <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 8: // Cierre y guardado
                 return (
                    <form onSubmit={handleSave} className="p-4 space-y-4 text-center">
                       <p className="text-sm text-muted-foreground">"Lo importante no es decidir rápido, sino decidir en paz. Guarda esta reflexión en tu cuaderno para revisarla cuando lo necesites."</p>
                        <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar en mi cuaderno terapéutico</Button>
                        <Button onClick={prevStep} variant="outline" type="button" className="w-full">Atrás</Button>
                    </form>
                );
            case 9: // Confirmation
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
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                <CardDescription className="pt-2">
                    {content.objective}
                     <p className="text-xs text-muted-foreground mt-1">Tiempo aproximado: {content.duration}</p>
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

  
