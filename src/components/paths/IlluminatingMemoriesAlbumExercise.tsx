
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Loader2, CalendarIcon, PlusCircle, Star } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IlluminatingMemoriesAlbumExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const LoaderComponent = () => <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

const inspirationChips = [
    'Risas con alguien querido', 'Olor de un café reciente', 'Terminar una tarea pendiente',
    'Caminar bajo el sol', 'Escuchar una canción que te emociona', 'Ver una planta/paisaje que te calma',
    'Recibir un mensaje bonito',
];

const activityChips = [
    'Dar un paseo de 5–10 min', 'Escuchar mi canción favorita', 'Cocinar algo que disfruto',
    'Tomar un café/infusión con calma', 'Llamar/enviar audio a alguien especial',
    'Asomarme a la ventana y respirar 1 min', 'Leer 1 página', 'Estirar 2 minutos',
    'Otro'
];

const sensoryOptions = [
    { key: 'vi', label: 'Lo que vi (colores, luz, formas)', example: 'Vi cómo se iluminaba su cara con una sonrisa sincera.' },
    { key: 'oi', label: 'Lo que oí (voces, música, naturaleza)', example: 'El sonido de su risa me contagió.' },
    { key: 'senti', label: 'Lo que sentí en el cuerpo (temperatura, postura, respiración)', example: 'Noté el calorcito del sol en la cara.' },
    { key: 'oli', label: 'Lo que olí (café, pan, césped, perfume)', example: 'Olía a café recién molido.' },
    { key: 'probe', label: 'Lo que probé (sabores, textura)', example: 'El sabor dulce y cremoso del chocolate me dio una calma instantánea.' },
];

interface IlluminatingMemoriesAlbumExerciseProps {
  content: IlluminatingMemoriesAlbumExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function IlluminatingMemoriesAlbumExercise({ content, pathId, onComplete }: IlluminatingMemoriesAlbumExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const [moments, setMoments] = useState(['', '', '']);
    const [sensoryDetails, setSensoryDetails] = useState<Record<number, string[]>>({ 0: [], 1: [], 2: [] });
    const [customSensoryDetails, setCustomSensoryDetails] = useState<Record<number, string>>({ 0: '', 1: '', 2: '' });
    const [selectedActivity, setSelectedActivity] = useState('');
    const [otherActivity, setOtherActivity] = useState('');
    const [activityDate, setActivityDate] = useState<Date | undefined>(new Date());
    const [activityTime, setActivityTime] = useState('08:00');
    const [activityDuration, setActivityDuration] = useState(1);
    const [uncomfortableSituation, setUncomfortableSituation] = useState('');
    const [positiveLearning, setPositiveLearning] = useState('');
    const [starResource, setStarResource] = useState<string[]>([]);

    const storageKey = `exercise-progress-${pathId}-illuminatingMemories`;

    useEffect(() => {
        setIsClient(true);
        try {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
                const data = JSON.parse(savedState);
                setStep(data.step || 0);
                setMoments(data.moments || ['', '', '']);
                setSensoryDetails(data.sensoryDetails || { 0: [], 1: [], 2: [] });
                setCustomSensoryDetails(data.customSensoryDetails || { 0: '', 1: '', 2: '' });
                setSelectedActivity(data.selectedActivity || '');
                setOtherActivity(data.otherActivity || '');
                setActivityDate(data.activityDate ? new Date(data.activityDate) : new Date());
                setActivityTime(data.activityTime || '08:00');
                setActivityDuration(data.activityDuration || 1);
                setUncomfortableSituation(data.uncomfortableSituation || '');
                setPositiveLearning(data.positiveLearning || '');
                setStarResource(data.starResource || []);
                setIsSaved(data.isSaved || false);
            }
        } catch (error) {
            console.error("Error loading exercise state:", error);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!isClient) return;
        try {
            const stateToSave = { step, moments, sensoryDetails, customSensoryDetails, selectedActivity, otherActivity, activityDate: activityDate?.toISOString(), activityTime, activityDuration, uncomfortableSituation, positiveLearning, starResource, isSaved };
            localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Error saving exercise state:", error);
        }
    }, [step, moments, sensoryDetails, customSensoryDetails, selectedActivity, otherActivity, activityDate, activityTime, activityDuration, uncomfortableSituation, positiveLearning, starResource, isSaved, storageKey, isClient]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
    const resetExercise = () => {
        setStep(0);
        setMoments(['', '', '']);
        setSensoryDetails({ 0: [], 1: [], 2: [] });
        setCustomSensoryDetails({ 0: '', 1: '', 2: '' });
        setSelectedActivity('');
        setOtherActivity('');
        setActivityDate(new Date());
        setActivityTime('08:00');
        setActivityDuration(1);
        setUncomfortableSituation('');
        setPositiveLearning('');
        setStarResource([]);
        setIsSaved(false);
        localStorage.removeItem(storageKey);
    };

    const handleMomentChange = (index: number, value: string) => {
        const newMoments = [...moments];
        newMoments[index] = value;
        setMoments(newMoments);
    };

    const handleSensoryDetailChange = (momentIndex: number, detail: string, isChecked: boolean) => {
        setSensoryDetails(prev => {
            const currentDetails = prev[momentIndex] || [];
            if (isChecked) {
                return { ...prev, [momentIndex]: [...currentDetails, detail] };
            } else {
                return { ...prev, [momentIndex]: currentDetails.filter(d => d !== detail) };
            }
        });
    };

    const handleSavePlan = () => {
        toast({
            title: "Plan Guardado",
            description: `Actividad programada: ${selectedActivity === 'Otro' ? otherActivity : selectedActivity} para el ${activityDate ? format(activityDate, "PPP", { locale: es }) : 'día seleccionado'}.`
        });
        nextStep();
    };

    const handleSave = () => {
        const filledMoments = moments.map((m, i) => ({
            moment: m,
            details: [...(sensoryDetails[i] || []), customSensoryDetails[i]].filter(Boolean)
        })).filter(item => item.moment.trim());

        if (filledMoments.length === 0) {
            toast({ title: 'Ejercicio vacío', description: 'Añade al menos un recuerdo para guardar.', variant: 'destructive' });
            return;
        }

        let notebookContent = `**${content.title}**\n\n`;
        
        const momentChunks = filledMoments.map((item, index) => {
            let chunk = `Pregunta: Momento que ilumina ${index + 1} | Respuesta: ${item.moment}`;
            if (item.details.length > 0) {
                chunk += `\nPregunta: Detalles sensoriales | Respuesta: ${item.details.join(', ')}`;
            }
            return chunk;
        });

        if(momentChunks.length > 0) {
          notebookContent += "**Momentos que iluminan:**\n" + momentChunks.join('\n\n');
        }

        if (uncomfortableSituation.trim() || positiveLearning.trim()) {
            notebookContent += `\n\n**Reencuadre de situación difícil:**\n`;
            notebookContent += `Pregunta: Situación incómoda | Respuesta: ${uncomfortableSituation || 'No especificada.'}\n`;
            notebookContent += `Pregunta: Aprendizaje o fortaleza | Respuesta: ${positiveLearning || 'No especificado.'}`;
        }

        if (starResource.length > 0) {
            notebookContent += `\n\n**Mi recurso estrella de la semana:**\nPregunta: Recuerdo estrella | Respuesta: ${starResource.join(', ')}`;
        }

        addNotebookEntry({ title: 'Mi Álbum de Recuerdos que Iluminan', content: notebookContent, pathId: pathId, userId: user?.id });
        toast({ title: 'Álbum Guardado', description: 'Tus recuerdos y reflexiones han sido guardados.' });
        setIsSaved(true);
        onComplete();
        setStep(6);
    };

    if (!isClient) return <LoaderComponent />;

    const renderStep = () => {
        const filledMomentsForSelection = moments.map((m, i) => ({ moment: m, details: [...(sensoryDetails[i] || []), customSensoryDetails[i]].filter(Boolean) })).filter(item => item.moment.trim());
        
        switch (step) {
            case 0: // Intro
                return (
                    <div className="p-4 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">{content.objective}</p>
                        <p className="text-xs text-muted-foreground">Tiempo estimado: {content.duration}. Te recomiendo revisarla o añadir un nuevo momento al menos 3 veces por semana.</p>
                        <Button onClick={nextStep}>Empezar mi álbum <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            case 1: // Pantalla 1: Captura tus momentos
                return (
                    <div className="p-4 space-y-6">
                        <div className="text-center">
                            <h4 className="font-semibold text-lg text-primary">Paso 1: Captura tus momentos</h4>
                            <p className="text-sm text-muted-foreground">Elige 3 momentos que te hicieron sentir bien. Pueden ser sencillos o significativos.</p>
                        </div>
                        <div className="p-2 border rounded-md bg-background/30">
                            <p className="font-semibold text-xs">Chips de inspiración:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {inspirationChips.map(chip => <Button key={chip} size="sm" variant="outline" className="text-xs h-auto py-0.5" onClick={() => handleMomentChange(moments.findIndex(m => m === ''), chip)}>{chip}</Button>)}
                            </div>
                        </div>
                        {moments.map((moment, index) => (
                            <div key={index} className="space-y-3 p-3 border rounded-md bg-background">
                                <Label htmlFor={`moment-${index}`} className="font-semibold">Momento {index + 1}</Label>
                                <Textarea id={`moment-${index}`} value={moment} onChange={e => handleMomentChange(index, e.target.value)} placeholder={`Ej: “Llamada con mi amiga Marta, nos reímos mucho”`} />
                                {moment.trim() && (
                                    <div className="space-y-2 pt-2">
                                        <Label className="text-sm">Añade detalles sensoriales (opcional):</Label>
                                        {sensoryOptions.map(opt => (
                                            <div key={opt.key} className="flex items-start space-x-2">
                                                <Checkbox id={`sensory-${index}-${opt.key}`} onCheckedChange={(checked) => handleSensoryDetailChange(index, opt.label, checked as boolean)} checked={sensoryDetails[index]?.includes(opt.label)} />
                                                <div className="grid gap-1.5 leading-none">
                                                    <Label htmlFor={`sensory-${index}-${opt.key}`} className="font-normal text-xs">{opt.label}</Label>
                                                    <p className="text-xs text-muted-foreground italic">Ej: {opt.example}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Textarea value={customSensoryDetails[index]} onChange={e => setCustomSensoryDetails(p => ({ ...p, [index]: e.target.value }))} placeholder="Otros detalles..." rows={2} className="text-xs mt-2" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <p className="text-xs italic text-center">No busques “algo perfecto”. Lo pequeño vale: un olor, una frase, una sensación corporal.</p>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep} disabled={moments.every(m => !m.trim())}>Continuar</Button>
                        </div>
                    </div>
                );
            case 2: // Pantalla 2: Dale vida a tu galería
                return (
                    <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg text-primary">Paso 2: Dale vida a tu galería</h4>
                        <p className="text-sm text-muted-foreground">Al recrear mentalmente una escena positiva, activas circuitos cerebrales que generan bienestar. Esto significa que no solo recuerdas: también revives la emoción.</p>
                        <p className="text-sm font-semibold">Cierra los ojos… Imagínate dentro de cada momento: observa colores, sonidos, olores, la temperatura, la emoción que sentías. Quédate ahí, en ese recuerdo, el tiempo que desees.</p>
                        <p className="text-xs italic border-l-2 p-2 text-left">Ejemplo: si recuerdas un paseo, imagina el color del cielo, el sonido de tus pasos, el olor del aire y la calma que te envolvía.</p>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep}>Continuar</Button>
                        </div>
                    </div>
                );
            case 3: // Pantalla 3: Amplía tu colección
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg text-primary">Paso 3: Amplía tu colección</h4>
                        <p className="text-sm text-muted-foreground">Si incorporas acciones agradables y sencillas en tu día, estarás generando nuevos momentos para añadir a tu galería.</p>
                        <div className="space-y-2">
                            <Label>Elige una actividad placentera para hoy:</Label>
                            <Select onValueChange={setSelectedActivity} value={selectedActivity}>
                                <SelectTrigger><SelectValue placeholder="Elige una actividad..." /></SelectTrigger>
                                <SelectContent>
                                    {activityChips.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {selectedActivity === 'Otro' && <Input value={otherActivity} onChange={e => setOtherActivity(e.target.value)} placeholder="Escribe otra actividad" className="mt-2" />}
                        </div>
                        <div className="space-y-2">
                            <Label>Decide cuándo la harás y, si lo necesitas, programa un recordatorio.</Label>
                            <div className="flex gap-2">
                                <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{activityDate ? format(activityDate, "PPP", { locale: es }) : <span>Elige fecha</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={activityDate} onSelect={setActivityDate} initialFocus /></PopoverContent></Popover>
                                <Input type="time" value={activityTime} onChange={e => setActivityTime(e.target.value)} className="w-[120px]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Duración: {activityDuration} minutos (Hazlo ridículamente fácil: si dudas, elige 3–5 minutos)</Label>
                            <Slider defaultValue={[activityDuration]} onValueChange={(v) => setActivityDuration(v[0])} min={1} max={15} step={1} />
                        </div>
                        <Button onClick={handleSavePlan} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar plan de hoy</Button>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 4: // Pantalla 4: Reencuadra y fortalece
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg text-primary">Paso 4: Reencuadra y fortalece</h4>
                        <p className="text-sm text-muted-foreground">Aprender a reencuadrar significa mirar lo ocurrido con otros ojos: en vez de quedarte solo con lo doloroso, encuentras un aprendizaje o una señal de avance.</p>
                        <div className="space-y-2">
                            <Label htmlFor="uncomfortable-sit">Elige una situación incómoda reciente:</Label>
                            <Textarea id="uncomfortable-sit" value={uncomfortableSituation} onChange={e => setUncomfortableSituation(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="positive-learning">Busca un aspecto positivo, un aprendizaje o un signo de tu fortaleza, como si aconsejaras a un amigo o amiga:</Label>
                            <Textarea id="positive-learning" value={positiveLearning} onChange={e => setPositiveLearning(e.target.value)} placeholder="Ej: Aunque fue duro, descubrí que soy más fuerte de lo que pensaba." />
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </div>
                    </div>
                );
            case 5: // Pantalla 5: Tu galería siempre contigo
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg text-primary">Paso 5: Tu galería siempre contigo</h4>
                        <p className="text-sm text-muted-foreground">Elige el recuerdo que quieras tener más presente como fuente de fuerza, o selecciona todos.</p>
                        <div className="space-y-2">
                            <Label>¿Cuál de los momentos de hoy quieres guardar como tu “recurso estrella” para esta semana?</Label>
                            {filledMomentsForSelection.map((item, index) => (
                                <div key={index} className="p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex items-center justify-between">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox id={`star-${index}`} onCheckedChange={(checked) => {
                                            setStarResource(prev => checked ? [...prev, item.moment] : prev.filter(m => m !== item.moment));
                                        }} checked={starResource.includes(item.moment)} />
                                        <div>
                                            <Label htmlFor={`star-${index}`} className="font-semibold">{item.moment}</Label>
                                            <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1">
                                                {item.details.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setStarResource(filledMomentsForSelection.map(item => item.moment))} variant="secondary" className="w-full">Seleccionar todos mis recuerdos</Button>
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Guardar mi álbum</Button>
                        </div>
                    </div>
                );
            case 6: // Pantalla 6 - final
                return (
                    <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <blockquote className="italic text-primary pt-2">“Cada recuerdo positivo que eliges guardar es como encender una luz en tu interior. No elimina la oscuridad, pero sí te recuerda que siempre hay algo que puede iluminar tu camino.”</blockquote>
                        <Button onClick={resetExercise} variant="outline" className="w-full">
                            Añadir nuevos recuerdos
                        </Button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderStep()}
            </CardContent>
        </Card>
    );
}

    