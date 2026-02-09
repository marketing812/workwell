"use client";

import { useState, useMemo, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { CoherenceCompassExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis
} from "recharts";
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';
import { Textarea } from '../ui/textarea';

const environments = [
    { id: 'salud_fisica', label: 'Salud física' },
    { id: 'salud_mental', label: 'Salud mental y emocional' },
    { id: 'familia', label: 'Relaciones familiares' },
    { id: 'pareja', label: 'Pareja / vida afectiva' },
    { id: 'amistades', label: 'Amistades y red social' },
    { id: 'desarrollo_personal', label: 'Desarrollo personal o espiritual' },
    { id: 'trabajo', label: 'Vida laboral/profesional' },
    { id: 'finanzas', label: 'Finanzas y seguridad' },
    { id: 'ocio', label: 'Ocio y tiempo libre' },
];

interface CoherenceCompassExerciseProps {
  content: CoherenceCompassExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CoherenceCompassExercise({ content, pathId, onComplete }: CoherenceCompassExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [selectedEnvs, setSelectedEnvs] = useState<Record<string, boolean>>({});
    const [otherEnvironment, setOtherEnvironment] = useState('');
    const [ratings, setRatings] = useState<Record<string, { support: number, drain: number, example: string }>>({});
    const [highCoherenceReflection, setHighCoherenceReflection] = useState('');
    const [highCoherenceEmotions, setHighCoherenceEmotions] = useState('');
    const [disconnectionReflection, setDisconnectionReflection] = useState('');
    const [smallGesture, setSmallGesture] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleRatingChange = (id: string, type: 'support' | 'drain', value: number[]) => {
        setRatings(prev => ({...prev, [id]: {...(prev[id] || {support:1, drain:1, example: ''}), [type]: value[0]}}));
    }
    
    const handleExampleChange = (id: string, value: string) => {
      setRatings(prev => ({...prev, [id]: {...(prev[id] || {support:1, drain:1, example: ''}), example: value }}));
    }

    const selectedEnvironments = useMemo(() => {
        const selected = environments.filter(e => selectedEnvs[e.id]);
        if (selectedEnvs['otro'] && otherEnvironment) {
            selected.push({ id: 'otro', label: otherEnvironment });
        }
        return selected;
    }, [selectedEnvs, otherEnvironment]);

    const chartData = useMemo(() => {
        return selectedEnvironments.map(env => {
            const rating = ratings[env.id] || { support: 1, drain: 1, example: '' };
            const score = (rating.support + (6 - rating.drain)) / 2;
            return {
                area: env.label,
                score: parseFloat(score.toFixed(1)),
                fullMark: 5,
            };
        });
    }, [selectedEnvironments, ratings]);
    
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
    const nextStep = () => setStep(prev => prev + 1);

    const resetExercise = () => {
        setStep(0);
        setSelectedEnvs({});
        setRatings({});
        setHighCoherenceReflection('');
        setHighCoherenceEmotions('');
        setDisconnectionReflection('');
        setSmallGesture('');
        setIsSaved(false);
    };

    const handleSave = () => {
        const activeAreas = environments.filter(e => selectedEnvs[e.id]);
        const filledEnvironments = activeAreas.filter(area => ratings[area.id]);
        if (filledEnvironments.length === 0) {
            toast({
                title: "Ejercicio Incompleto",
                description: "Por favor, evalúa al menos un entorno para guardar.",
                variant: "destructive",
            });
            return;
        }

        let notebookContent = `**${content.title}**\n\n**Mi Brújula de Coherencia:**\n\n`;
        filledEnvironments.forEach(area => {
            const rating = ratings[area.id];
            if (rating) {
                notebookContent += `**Área:** ${area.label}\n`;
                notebookContent += `- Apoyo a mis valores (1-5): ${rating.support}\n`;
                notebookContent += `- Me aleja de mis valores (1-5): ${rating.drain}\n\n`;
            }
        });
        
        notebookContent += `\n**Reflexión sobre zonas de alineación:**\n`;
        notebookContent += `- Lo que hago bien: ${highCoherenceReflection || 'No respondido.'}\n`;
        notebookContent += `- Emociones que despierta: ${highCoherenceEmotions || 'No respondido.'}\n\n`;
        
        notebookContent += `**Reflexión sobre zona de desconexión:**\n`;
        notebookContent += `- Lo que me impide ser coherente: ${disconnectionReflection || 'No respondido.'}\n\n`;
        
        notebookContent += `**Pequeño gesto para ser más coherente:**\n${smallGesture || 'No especificado.'}\n`;

        addNotebookEntry({
            title: 'Mi Brújula de Coherencia',
            content: notebookContent,
            pathId,
            userId: user?.id,
        });
        
        toast({ title: 'Brújula Guardada' });
        onComplete();
        setIsSaved(true);
        nextStep();
    };


    const activeAreas = useMemo(() => {
        return environments.filter(e => selectedEnvs[e.id]);
    }, [selectedEnvs]);

    const chartConfig = {
        score: {
            label: 'Coherencia del Entorno',
            color: "hsl(var(--primary))",
        },
    };

    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <div className="p-4 space-y-2">
                        <p>A veces vivimos en piloto automático, sin darnos cuenta de que algunos de nuestros entornos o relaciones nos alejan de lo que de verdad nos importa. Este ejercicio te invita a hacer una pausa y dibujar tu propio “mapa de coherencia”. No es para juzgarte, sino para que tomes conciencia y recuperes el poder de elegir dónde poner tu energía.</p>
                        <Label className="font-semibold">Identifica tus entornos clave:</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {environments.map(e => (
                                <div key={e.id} className="flex items-center space-x-2">
                                    <Checkbox id={e.id} checked={!!selectedEnvs[e.id]} onCheckedChange={c => setSelectedEnvs(p => ({...p, [e.id]: !!c}))} disabled={isSaved}/>
                                    <Label htmlFor={e.id} className="font-normal">{e.label}</Label>
                                </div>
                            ))}
                             <div className="flex items-center space-x-2">
                                <Checkbox id="otro" checked={!!selectedEnvs['otro']} onCheckedChange={c => setSelectedEnvs(p => ({...p, ['otro']: !!c}))} disabled={isSaved}/>
                                <Label htmlFor="otro" className="font-normal">Otro</Label>
                            </div>
                        </div>
                        {selectedEnvs['otro'] && (
                            <Textarea 
                                value={otherEnvironment} 
                                onChange={(e) => setOtherEnvironment(e.target.value)} 
                                placeholder="Describe tu entorno personalizado aquí..."
                                className="mt-2"
                                disabled={isSaved}
                            />
                        )}
                        <Button onClick={nextStep} className="w-full mt-4" disabled={Object.values(selectedEnvs).every(v => !v)}>Siguiente</Button>
                    </div>
                );
            case 1: 
                return (
                    <div className="p-4 space-y-4">
                        {activeAreas.length > 0 ? activeAreas.map(e => (
                            <div key={e.id} className="p-3 border rounded-md">
                                <h4 className="font-semibold">{e.label}</h4>
                                <Label htmlFor={`support-${e.id}`}>Pregunta 1: ¿En qué medida este entorno apoya mis valores y me ayuda a ser coherente? {ratings[e.id]?.support ?? 1}/5</Label>
                                <Slider id={`support-${e.id}`} value={[ratings[e.id]?.support || 1]} onValueChange={v => handleRatingChange(e.id, 'support', v)} min={1} max={5} step={1} disabled={isSaved}/>
                                
                                <Label htmlFor={`drain-${e.id}`} className="mt-4 block">Pregunta 2: ¿Cuánto me aleja este entorno de lo que quiero sostener? {ratings[e.id]?.drain ?? 1}/5</Label>
                                <Slider id={`drain-${e.id}`} value={[ratings[e.id]?.drain || 1]} onValueChange={v => handleRatingChange(e.id, 'drain', v)} min={1} max={5} step={1} disabled={isSaved}/>
                                
                                <Label htmlFor={`example-${e.id}`} className="mt-4 block">Pregunta 3: Ejemplo de cómo me apoya o me dificulta.</Label>
                                <Textarea id={`example-${e.id}`} value={ratings[e.id]?.example || ''} onChange={v => handleExampleChange(e.id, v.target.value)} />
                            </div>
                        )) : <p className="text-center">No has seleccionado ningún entorno. Vuelve al paso anterior para elegirlos.</p>}
                        <div className="flex justify-between w-full">
                            <Button onClick={prevStep} variant="outline">Atrás</Button>
                            <Button onClick={nextStep} disabled={activeAreas.length === 0}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Selecciona tus dos zonas de mayor alineación</h4>
                        <p>Ahora observa: ¿en qué dos áreas sientes más coherencia contigo misma/o? Elige esas dos y responde:</p>
                        <blockquote className="p-3 border-l-2 border-accent bg-accent/10 italic text-sm">
                            Ejemplo de inspiración: “En mi relación con mi hermana he aprendido a decir lo que pienso sin miedo. Eso me da calma y orgullo.”
                        </blockquote>
                        <div className="space-y-2">
                            <Label htmlFor="high-coherence-doing-well">¿Qué estás haciendo bien en ellas que te hace sentirte en paz o en equilibrio?</Label>
                            <Textarea id="high-coherence-doing-well" value={highCoherenceReflection} onChange={e => setHighCoherenceReflection(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="high-coherence-emotions">¿Qué emociones te despierta vivir en coherencia en esas áreas?</Label>
                            <Textarea id="high-coherence-emotions" value={highCoherenceEmotions} onChange={e => setHighCoherenceEmotions(e.target.value)} />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
             case 3:
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Detecta una zona de desconexión</h4>
                        <p>Ahora identifica una de las áreas donde sientes más contradicción o conflicto interno. ¿Qué crees que te impide ser más coherente en esa parte de tu vida? Puedes explorar si hay miedo, necesidad de agradar, cansancio, confusión…</p>
                         <blockquote className="p-3 border-l-2 border-accent bg-accent/10 italic text-sm">
                            Ejemplo: “En el trabajo, valoro la honestidad, pero suelo callarme para no incomodar. Me frustra y me desconecta de mí.”
                        </blockquote>
                        <div className="space-y-2">
                            <Label htmlFor="disconnection-reason">¿Qué te impide ser más coherente en esa área?</Label>
                            <Textarea id="disconnection-reason" value={disconnectionReflection} onChange={e => setDisconnectionReflection(e.target.value)} />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep}>Ver Síntesis Visual <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 text-center space-y-4">
                        <h4 className="font-semibold text-lg">Tu Mapa de Coherencia</h4>
                        <p>Este gráfico muestra la "coherencia" de cada entorno. Una puntuación alta indica que te apoya y no te drena. Una baja, lo contrario.</p>
                         <ChartContainer config={chartConfig} className="w-full aspect-square h-[350px]">
                            <RadarChart data={chartData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
                                <PolarGrid />
                                <Radar
                                    dataKey="score"
                                    fill="var(--color-score)"
                                    fillOpacity={0.6}
                                    dot={{
                                        r: 4,
                                        fillOpacity: 1,
                                    }}
                                />
                            </RadarChart>
                        </ChartContainer>
                         <div className="flex flex-col sm:flex-row gap-2 justify-center">
                             <Button onClick={prevStep} variant="outline">Atrás</Button>
                             <Button onClick={nextStep}>Ir al cierre y reflexión final</Button>
                         </div>
                    </div>
                );
            case 5:
                return (
                    <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                      <h4 className="font-semibold text-lg text-center">Cierre y reflexión</h4>
                      <p className="text-sm text-center">
                        Esta brújula no tiene por qué darte todas las respuestas ahora. Solo busca que empieces a mirarte con más claridad y menos juicio. El primer paso hacia la coherencia es atreverte a ver.
                      </p>
                      <div className="space-y-2 pt-4">
                        <Label htmlFor="small-gesture">
                          Pregunta interactiva opcional: ¿Qué pequeño gesto podrías dar esta semana para ser un poco más coherente en el área que te duele?
                        </Label>
                        <Textarea id="small-gesture" value={smallGesture} onChange={(e) => setSmallGesture(e.target.value)} disabled={isSaved} />
                      </div>
                      <div className="flex justify-between w-full mt-4">
                        <Button onClick={prevStep} variant="outline" type="button">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Atrás
                        </Button>
                        {!isSaved ? (
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Guardar en mi Cuaderno
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <p className="font-medium">Guardado.</p>
                          </div>
                        )}
                      </div>
                    </form>
                  );
            case 6:
                return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Brújula Guardada</h4>
                        <p>Tu brújula de valores ha sido guardada en el cuaderno. Puedes volver a consultarla cuando quieras.</p>
                        <Button onClick={resetExercise} variant="outline">Empezar de nuevo</Button>
                    </div>
                )
            default: return null;
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
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
