
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowRight, ArrowLeft, CalendarIcon } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IlluminatingMemoriesAlbumExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Slider } from '../ui/slider';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface IlluminatingMemoriesAlbumExerciseProps {
  content: IlluminatingMemoriesAlbumExerciseContent;
  pathId: string;
  onComplete: () => void;
}

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

export default function IlluminatingMemoriesAlbumExercise({ content, pathId, onComplete }: IlluminatingMemoriesAlbumExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [moments, setMoments] = useState(['', '', '']);
  const [sensoryDetails, setSensoryDetails] = useState(['', '', '']);
  
  const [selectedActivity, setSelectedActivity] = useState('');
  const [otherActivity, setOtherActivity] = useState('');
  const [activityDate, setActivityDate] = useState<Date | undefined>(new Date());
  const [activityTime, setActivityTime] = useState('08:00');
  const [activityDuration, setActivityDuration] = useState(5);

  const [uncomfortableSituation, setUncomfortableSituation] = useState('');
  const [positiveLearning, setPositiveLearning] = useState('');
  
  const [starResource, setStarResource] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const handleMomentChange = (index: number, value: string) => {
    const newMoments = [...moments];
    newMoments[index] = value;
    setMoments(newMoments);
  };

  const handleSensoryChange = (index: number, value: string) => {
    const newSensoryDetails = [...sensoryDetails];
    newSensoryDetails[index] = value;
    setSensoryDetails(newSensoryDetails);
  };
  
  const handleSavePlan = () => {
    toast({
        title: "Plan Guardado",
        description: `Actividad programada: ${selectedActivity === 'Otro' ? otherActivity : selectedActivity} para el ${activityDate ? format(activityDate, "PPP", {locale: es}) : 'día seleccionado'}.`
    });
  };

  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    let hasContent = false;
    
    const filledMoments = moments.map((m, i) => ({ moment: m, details: sensoryDetails[i] })).filter(item => item.moment.trim());
    if (filledMoments.length > 0) {
        hasContent = true;
        notebookContent += '**Momentos que iluminan:**\n';
        filledMoments.forEach((item, index) => {
            notebookContent += `*Momento ${index + 1}:* ${item.moment}\n`;
            if (item.details.trim()) {
                notebookContent += `*Detalles sensoriales:* ${item.details}\n`;
            }
            notebookContent += '\n';
        });
    }

    if (uncomfortableSituation.trim() || positiveLearning.trim()) {
        hasContent = true;
        notebookContent += `**Reencuadre de situación difícil:**\n`;
        notebookContent += `- *Situación incómoda:* ${uncomfortableSituation || 'No especificada.'}\n`;
        notebookContent += `- *Aprendizaje o fortaleza:* ${positiveLearning || 'No especificado.'}\n\n`;
    }
    
    if (starResource.trim()) {
        hasContent = true;
        notebookContent += `**Mi recurso estrella de la semana:**\n${starResource}\n`;
    }
    
    if(!hasContent) {
        toast({ title: 'Ejercicio vacío', description: 'Por favor, añade al menos un recuerdo o reflexión para guardar.', variant: 'destructive'});
        return;
    }

    addNotebookEntry({ title: 'Mi Álbum de Recuerdos que Iluminan', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Álbum Guardado', description: 'Tus recuerdos y reflexiones han sido guardados.' });
    setIsSaved(true);
    onComplete();
    setStep(6);
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1: Captura tus momentos
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Captura tus momentos</h4>
            <p className="text-sm text-muted-foreground">Elige 3 momentos que te hicieron sentir bien. Pueden ser sencillos o significativos.</p>
            <div className="text-xs p-2 border rounded-md bg-background/30">
                <p className="font-semibold">Chips de inspiración:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {inspirationChips.map(chip => <span key={chip} className="bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{chip}</span>)}
                </div>
            </div>
            <div className="space-y-4">
              {moments.map((moment, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-md">
                    <Label htmlFor={`moment-${index}`}>Momento {index + 1}</Label>
                    <Textarea id={`moment-${index}`} value={moment} onChange={e => handleMomentChange(index, e.target.value)} placeholder={`Ej: “Llamada con mi amiga Marta, nos reímos mucho”`} />
                    
                    <Label htmlFor={`sensory-${index}`} className="text-sm pt-2">Añade detalles sensoriales</Label>
                    <Textarea id={`sensory-${index}`} value={sensoryDetails[index]} onChange={e => handleSensoryChange(index, e.target.value)} rows={2} placeholder="Lo que vi, oí, sentí, olí o probé..."/>
                </div>
              ))}
            </div>
            <Button onClick={nextStep} className="w-full mt-4">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 2: Dale vida a tu galería
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Dale vida a tu galería</h4>
            <p className="text-sm text-muted-foreground">Al revivir un buen recuerdo, tu cerebro reacciona como si lo estuvieras viviendo de nuevo.</p>
            <div className="p-4 border rounded-md bg-background/50">
              <p className="font-semibold">Paso a paso:</p>
              <p className="text-sm text-muted-foreground">Cierra los ojos… Imagínate dentro de cada momento: observa colores, sonidos, olores, la temperatura, la emoción que sentías. Quédate ahí, en ese recuerdo, el tiempo que desees.</p>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Continuar</Button>
            </div>
          </div>
        );
      case 2: // Pantalla 3: Amplía tu colección
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Amplía tu colección</h4>
            <p className="text-sm text-muted-foreground">Las emociones positivas se entrenan. Elige y programa una actividad placentera para hoy.</p>
            <div className="space-y-2">
                <Label>Actividad:</Label>
                <Select onValueChange={setSelectedActivity} value={selectedActivity}>
                    <SelectTrigger><SelectValue placeholder="Elige una actividad de inspiración..."/></SelectTrigger>
                    <SelectContent>
                        {activityChips.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedActivity === 'Otro' && <Input value={otherActivity} onChange={e => setOtherActivity(e.target.value)} placeholder="Escribe otra actividad" className="mt-2"/>}
            </div>
             <div className="space-y-2">
                <Label>¿Cuándo la harás?</Label>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {activityDate ? format(activityDate, "PPP", {locale: es}) : <span>Elige fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={activityDate} onSelect={setActivityDate} initialFocus /></PopoverContent>
                    </Popover>
                    <Input type="time" value={activityTime} onChange={e => setActivityTime(e.target.value)} className="w-[120px]"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Duración: {activityDuration} minutos</Label>
                <Slider defaultValue={[activityDuration]} onValueChange={(v) => setActivityDuration(v[0])} min={1} max={15} step={1} />
            </div>
            <Button onClick={handleSavePlan} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar plan de hoy</Button>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4: Reencuadra
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Reencuadra y fortalece</h4>
            <p className="text-sm text-muted-foreground">Incluso en situaciones difíciles puede haber algo valioso. Elige una situación incómoda reciente y busca un aprendizaje o una señal de tu fortaleza.</p>
            <div className="space-y-2">
              <Label htmlFor="uncomfortable-sit">Situación incómoda reciente:</Label>
              <Textarea id="uncomfortable-sit" value={uncomfortableSituation} onChange={e => setUncomfortableSituation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positive-learning">Aspecto positivo, aprendizaje o fortaleza encontrada:</Label>
              <Textarea id="positive-learning" value={positiveLearning} onChange={e => setPositiveLearning(e.target.value)} placeholder="Ej: Aunque fue duro, descubrí que soy más fuerte de lo que pensaba." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: // Pantalla 5: Recurso Estrella
        const filledMomentsForSelection = moments.map((m, i) => ({ moment: m, details: sensoryDetails[i] })).filter(item => item.moment.trim());
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Elige tu recurso estrella</h4>
                <p className="text-sm text-muted-foreground">Revisa tus momentos guardados y elige uno para que sea tu "recurso estrella" esta semana. Será tu ancla de bienestar.</p>
                <RadioGroup value={starResource} onValueChange={setStarResource}>
                    {filledMomentsForSelection.map((item, index) => (
                        <div key={index} className="p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={item.moment} id={`star-${index}`} />
                                <Label htmlFor={`star-${index}`} className="font-semibold">{item.moment}</Label>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">{item.details}</p>
                        </div>
                    ))}
                </RadioGroup>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar mi álbum</Button>
                </div>
            </div>
        );
      case 5: // Pantalla 6, se convierte en la pantalla de Guardado
        return null; // El handleSave pasa directamente al paso 6
      case 6: // Pantalla final
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Álbum Guardado</h4>
                <blockquote className="italic text-muted-foreground">“Cada recuerdo positivo que eliges guardar es como encender una luz en tu interior. No elimina la oscuridad, pero sí te recuerda que siempre hay algo que puede iluminar tu camino.”</blockquote>
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
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription className="pt-2 whitespace-pre-line">
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
      </Card