"use client";

import { useState, useMemo, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { EnvironmentEvaluationExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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
import { Textarea } from '../ui/textarea';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

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

interface EnvironmentEvaluationExerciseProps {
  content: EnvironmentEvaluationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function EnvironmentEvaluationExercise({ content, pathId, onComplete }: EnvironmentEvaluationExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [selectedEnvs, setSelectedEnvs] = useState<Record<string, boolean>>({});
    const [otherEnvironment, setOtherEnvironment] = useState('');
    const [ratings, setRatings] = useState<Record<string, { support: number, drain: number, example: string }>>({});
    const [isSaved, setIsSaved] = useState(false);

    const handleRatingChange = (id: string, type: 'support' | 'drain', value: number[]) => {
        setRatings(prev => ({...prev, [id]: {...(prev[id] || {support:5, drain:5, example: ''}), [type]: value[0]}}));
    }
    
    const handleExampleChange = (id: string, value: string) => {
      setRatings(prev => ({...prev, [id]: {...(prev[id] || {support:5, drain:5, example: ''}), example: value }}));
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
            const rating = ratings[env.id] || { support: 5, drain: 5, example: '' };
            const score = (rating.support + (10 - rating.drain)) / 2;
            return {
                area: env.label,
                score: parseFloat(score.toFixed(1)),
                fullMark: 10,
            };
        });
    }, [selectedEnvironments, ratings]);

    const chartConfig = {
        score: {
            label: 'Coherencia del Entorno',
            color: "hsl(var(--primary))",
        },
    };
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
    const resetExercise = () => {
        setStep(0);
        setSelectedEnvs({});
        setOtherEnvironment('');
        setRatings({});
        setIsSaved(false);
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        const activeAreas = selectedEnvironments;
        const filledEnvironments = activeAreas.filter(area => ratings[area.id]);
        if (filledEnvironments.length === 0) {
            toast({ title: 'Ejercicio Incompleto', description: 'Por favor, evalúa al menos un entorno para guardar.', variant: 'destructive' });
            return;
        }

        let notebookContent = `**${content.title}**\n\n**Mi Mapa de Coherencia:**\n\n`;
        filledEnvironments.forEach(area => {
            const rating = ratings[area.id];
            if (rating) {
                notebookContent += `**Área:** ${area.label}\n`;
                notebookContent += `- Apoyo a mis valores (0-10): ${rating.support}\n`;
                notebookContent += `- Me aleja de mis valores (0-10): ${rating.drain}\n`;
                if(rating.example) notebookContent += `- Ejemplo: ${rating.example}\n\n`;
            }
        });

        addNotebookEntry({
            title: 'Mi Mapa de Coherencia',
            content: notebookContent,
            pathId,
            userId: user?.id,
        });
        
        toast({ title: 'Mapa de Coherencia Guardado' });
        setIsSaved(true);
        onComplete();
        nextStep();
    };

    const renderStep = () => {
        const activeAreas = selectedEnvironments;
        switch(step) {
            case 0:
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">Todos tenemos entornos que nos facilitan vivir alineados con lo que valoramos… y otros que nos lo ponen difícil. Hoy vas a analizar los tuyos, sin juicio, para tomar decisiones más conscientes.</p>
                        <Button onClick={nextStep}>Comenzar evaluación</Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: Identifica tus entornos clave</h4>
                        <p className="text-sm text-muted-foreground">Piensa en las áreas más importantes de tu vida. Vamos a evaluarlas una a una.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {environments.map(e => (
                                <div key={e.id} className="flex items-center space-x-2">
                                    <Checkbox id={e.id} checked={!!selectedEnvs[e.id]} onCheckedChange={c => setSelectedEnvs(p => ({...p, [e.id]: !!c}))} />
                                    <Label htmlFor={e.id} className="font-normal">{e.label}</Label>
                                </div>
                            ))}
                             <div className="flex items-center space-x-2">
                                <Checkbox id="otro" checked={!!selectedEnvs['otro']} onCheckedChange={c => setSelectedEnvs(p => ({...p, ['otro']: !!c}))} />
                                <Label htmlFor="otro" className="font-normal">Otro</Label>
                            </div>
                        </div>
                        {selectedEnvs['otro'] && (
                            <Textarea 
                                value={otherEnvironment} 
                                onChange={(e) => setOtherEnvironment(e.target.value)} 
                                placeholder="Describe tu entorno personalizado aquí..."
                                className="mt-2"
                            />
                        )}
                        <div className="flex justify-between w-full pt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                            <Button onClick={nextStep} disabled={Object.values(selectedEnvs).every(v => !v)}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 2: return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Paso 2: Evalúa cada entorno</h4>
                    <p className="text-sm text-muted-foreground">Para cada entorno que elegiste, responde con sinceridad. No hay respuestas correctas o incorrectas.</p>
                    {activeAreas.length > 0 ? activeAreas.map(e => (
                        <div key={e.id} className="p-3 border rounded-md space-y-3 bg-background">
                            <h4 className="font-semibold">{e.label}</h4>
                            <Label htmlFor={`support-${e.id}`}>¿En qué medida este entorno apoya mis valores y me ayuda a ser coherente? {ratings[e.id]?.support ?? 5}/10</Label>
                            <Slider id={`support-${e.id}`} value={[ratings[e.id]?.support || 5]} onValueChange={v => handleRatingChange(e.id, 'support', v)} min={0} max={10} step={1} />
                            
                            <Label htmlFor={`drain-${e.id}`} className="mt-4 block">¿Cuánto me aleja este entorno de lo que quiero sostener? {ratings[e.id]?.drain ?? 5}/10</Label>
                            <Slider id={`drain-${e.id}`} value={[ratings[e.id]?.drain || 5]} onValueChange={v => handleRatingChange(e.id, 'drain', v)} min={0} max={10} step={1} />
                            
                            <Label htmlFor={`example-${e.id}`} className="mt-4 block">Ejemplo de cómo me apoya o me dificulta.</Label>
                            <Textarea id={`example-${e.id}`} value={ratings[e.id]?.example || ''} onChange={v => handleExampleChange(e.id, v.target.value)} rows={2}/>
                        </div>
                    )) : <p className="text-muted-foreground text-center">No has seleccionado ningún entorno. Vuelve al paso anterior para elegirlos.</p>}
                     <div className="flex justify-between w-full mt-4">
                        <Button onClick={prevStep} variant="outline">Atrás</Button>
                        <Button onClick={nextStep} disabled={activeAreas.length === 0}>Ver Síntesis Visual</Button>
                    </div>
                </div>
            );
            case 3:
                return (
                    <form onSubmit={handleSave} className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Síntesis visual</h4>
                        <p className="text-sm text-muted-foreground">Aquí tienes tu mapa de entornos. No es para juzgarte ni para que tomes decisiones inmediatas, sino para que tengas claridad. Y recuerda: un entorno que ahora es saboteador, puede transformarse si introduces cambios.</p>
                         <ChartContainer config={chartConfig} className="w-full aspect-square h-[350px]">
                            <RadarChart data={chartData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
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
                         <div className="flex justify-between w-full mt-4">
                             <Button onClick={prevStep} variant="outline" type="button">Atrás</Button>
                             <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar en mi cuaderno</Button>
                         </div>
                    </form>
                );
            case 4:
                return (
                    <div className="p-6 text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Guardado</h4>
                        <p className="text-muted-foreground">Tu mapa de coherencia ha sido guardado. Puedes volver a él cuando lo necesites.</p>
                        <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
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
