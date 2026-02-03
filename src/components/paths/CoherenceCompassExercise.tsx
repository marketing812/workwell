"use client";

import { useState, useMemo, type FormEvent } from 'react';
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
    { id: 'desarrollo_personal', label: 'Desarrollo personal' },
    { id: 'trabajo', label: 'Vida laboral/profesional' },
    { id: 'finanzas', label: 'Finanzas y seguridad' },
    { id: 'ocio', label: 'Ocio y tiempo libre' },
];

interface CoherenceCompassExerciseProps {
  content: CoherenceCompassExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function CoherenceCompassExercise({ content, pathId, onComplete }: CoherenceCompassExerciseProps) {
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
            // Puntuación área=(Apoyo) + (10 - Drenaje) / 2
            const score = (rating.support + (10 - rating.drain)) / 2;
            return {
                area: env.label,
                score: parseFloat(score.toFixed(1)),
                fullMark: 10,
            };
        });
    }, [selectedEnvironments, ratings]);
    
    const prevStep = () => setStep(prev => prev - 1);
    const nextStep = () => setStep(prev => prev + 1);

    const resetExercise = () => {
        setStep(0);
        setSelectedEnvs({});
        setRatings({});
        setIsSaved(false);
    };

    const handleSave = () => {
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
                notebookContent += `- Apoyo a mis valores (0-10): ${rating.support}\n`;
                notebookContent += `- Me aleja de mis valores (0-10): ${rating.drain}\n\n`;
            }
        });

        addNotebookEntry({
            title: 'Mi Brújula de Coherencia',
            content: notebookContent,
            pathId,
            userId: user?.id,
        });
        
        toast({ title: 'Brújula Guardada' });
        onComplete();
        setIsSaved(true);
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
                        <Button onClick={() => setStep(1)} className="w-full mt-4" disabled={Object.values(selectedEnvs).every(v => !v)}>Siguiente</Button>
                    </div>
                );
            case 1: return (
                <div className="p-4 space-y-4">
                    {activeAreas.length > 0 ? activeAreas.map(e => (
                        <div key={e.id} className="p-3 border rounded-md">
                            <h4 className="font-semibold">{e.label}</h4>
                            <Label htmlFor={`support-${e.id}`}>¿Cuánto apoya tus valores? {ratings[e.id]?.support ?? 5}/10</Label>
                            <Slider id={`support-${e.id}`} value={[ratings[e.id]?.support || 5]} onValueChange={v => handleRatingChange(e.id, 'support', v)} min={0} max={10} step={1} disabled={isSaved}/>
                            <Label htmlFor={`drain-${e.id}`} className="mt-4 block">¿Cuánto te aleja de ellos? {ratings[e.id]?.drain ?? 5}/10</Label>
                            <Slider id={`drain-${e.id}`} value={[ratings[e.id]?.drain || 5]} onValueChange={v => handleRatingChange(e.id, 'drain', v)} min={0} max={10} step={1} disabled={isSaved}/>
                        </div>
                    )) : <p className="text-muted-foreground text-center">No has seleccionado ningún entorno. Vuelve al paso anterior para elegirlos.</p>}
                     <div className="flex justify-between w-full">
                        <Button onClick={() => setStep(0)} variant="outline">Atrás</Button>
                        <Button onClick={() => setStep(2)} disabled={activeAreas.length === 0}>Ver Síntesis Visual</Button>
                    </div>
                </div>
            );
            case 2:
                return (
                    <div className="p-4 text-center space-y-4">
                        <h4 className="font-semibold text-lg">Tu Mapa de Coherencia</h4>
                        <p className="text-sm text-muted-foreground">Este gráfico muestra la "coherencia" de cada entorno. Una puntuación alta indica que te apoya y no te drena. Una baja, lo contrario.</p>
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
                         <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button onClick={handleSave} disabled={isSaved}>
                                <Save className="mr-2 h-4 w-4"/> {isSaved ? 'Guardado' : 'Guardar en mi Cuaderno'}
                            </Button>
                            <Button onClick={resetExercise} variant="outline">Empezar de nuevo</Button>
                         </div>
                    </div>
                );
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