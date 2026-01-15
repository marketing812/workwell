
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowRight, BookOpen, Camera, Sun, Music, Ear } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IlluminatingMemoriesAlbumExerciseContent } from '@/data/paths/pathTypes';

interface IlluminatingMemoriesAlbumExerciseProps {
  content: IlluminatingMemoriesAlbumExerciseContent;
  pathId: string;
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
];

export function IlluminatingMemoriesAlbumExercise({ content, pathId }: IlluminatingMemoriesAlbumExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [moments, setMoments] = useState(['', '', '']);
  const [sensoryDetails, setSensoryDetails] = useState(['', '', '']);
  const [isSaved, setIsSaved] = useState(false);
  
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedDate, setSelectedDate] = useState('Hoy');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [duration, setDuration] = useState(5);
  
  const [finalReflection, setFinalReflection] = useState('');

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

  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    moments.forEach((moment, index) => {
      if (moment.trim()) {
        notebookContent += `**Recuerdo ${index + 1}:** ${moment}\n`;
        if (sensoryDetails[index].trim()) {
            notebookContent += `*Detalles sensoriales:* ${sensoryDetails[index]}\n`;
        }
        notebookContent += '\n';
      }
    });

    if (finalReflection.trim()) {
        notebookContent += `**Reencuadre de situación difícil:**\n${finalReflection}\n`;
    }

    addNotebookEntry({ title: 'Mi Álbum de Recuerdos que Iluminan', content: notebookContent, pathId: pathId });
    toast({ title: 'Álbum Guardado', description: 'Tus recuerdos han sido guardados.' });
    setIsSaved(true);
    setStep(5); // Go to final confirmation
  };
  
  const nextStep = () => setStep(prev => prev + 1);

  const renderStep = () => {
    switch(step) {
      case 0: // Pantalla 1: Captura tus momentos
        return (
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">La mente tiene un “sesgo negativo”: recuerda con más facilidad lo que te dolió. Este ejercicio es un antídoto. Aquí vas a decidir qué momentos guardar intencionalmente.</p>
            <div className="text-xs text-muted-foreground space-x-1 space-y-1">
                <span className="font-semibold">Inspiración:</span>
                {inspirationChips.map(chip => <Button key={chip} size="sm" variant="outline" className="h-auto py-1 px-2 text-xs" onClick={() => {
                    const firstEmpty = moments.findIndex(m => m === '');
                    if (firstEmpty !== -1) handleMomentChange(firstEmpty, chip);
                }}>{chip}</Button>)}
            </div>
            <div className="space-y-3">
              {moments.map((moment, index) => (
                <div key={index}>
                    <Label htmlFor={`moment-${index}`}>Momento {index + 1}</Label>
                    <Textarea id={`moment-${index}`} value={moment} onChange={e => handleMomentChange(index, e.target.value)} placeholder={`Ej: ${inspirationChips[index]}`}/>
                    <Label htmlFor={`sensory-${index}`} className="text-xs text-muted-foreground">Añade detalles sensoriales (lo que viste, oíste, sentiste...)</Label>
                    <Textarea id={`sensory-${index}`} value={sensoryDetails[index]} onChange={e => handleSensoryChange(index, e.target.value)} rows={2}/>
                </div>
              ))}
            </div>
            <Button onClick={nextStep} className="w-full">Continuar</Button>
          </div>
        );
      case 1: // Pantalla 2: Dale vida a tu galería
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">Paso 2: Dale vida a tu galería</h4>
            <p className="text-sm text-muted-foreground">Al revivir un buen recuerdo, tu cerebro reacciona como si lo estuvieras viviendo de nuevo.</p>
            <p className="font-medium p-3 border rounded-md bg-background">Cierra los ojos. Imagínate dentro de cada momento: observa colores, sonidos, olores. Quédate ahí el tiempo que desees.</p>
            <Button onClick={nextStep} className="w-full">Continuar</Button>
          </div>
        );
      case 2: // Pantalla 3: Amplía tu colección
        return (
           <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 3: Amplía tu colección</h4>
                <p className="text-sm text-muted-foreground">Las emociones positivas se entrenan. Elige una actividad placentera para hoy y prográmala.</p>
                <div className="space-y-2">
                    <Label>Actividad:</Label>
                    <Select onValueChange={setSelectedActivity}>
                        <SelectTrigger><SelectValue placeholder="Elige una actividad..." /></SelectTrigger>
                        <SelectContent>{activityChips.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <Button onClick={nextStep} className="w-full">Continuar</Button>
           </div>
        );
      case 3: // Pantalla 4: Reencuadra y fortalece
        return (
            <div className="p-4 space-y-4">
                 <h4 className="font-semibold text-lg">Paso 4: Reencuadra y fortalece</h4>
                <p className="text-sm text-muted-foreground">Incluso en situaciones difíciles puede haber algo valioso. Elige una situación incómoda reciente y busca un aprendizaje o una señal de tu fortaleza.</p>
                <Textarea value={finalReflection} onChange={e => setFinalReflection(e.target.value)} placeholder="Ej: Aunque fue duro, descubrí que soy más fuerte de lo que pensaba." />
                <Button onClick={nextStep} className="w-full">Continuar</Button>
            </div>
        );
      case 4: // Pantalla 5: Tu galería siempre contigo
        return (
            <div className="p-4 space-y-4 text-center">
                <h4 className="font-semibold text-lg">Paso 5: Tu galería siempre contigo</h4>
                <p className="text-sm text-muted-foreground">Revisa tus momentos y guárdalos como tus "recursos estrella".</p>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar mi álbum</Button>
            </div>
        );
      case 5: // Pantalla 6: Final
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Álbum Guardado</h4>
                <p className="italic text-muted-foreground">"Cada recuerdo positivo que eliges guardar es como encender una luz en tu interior. No elimina la oscuridad, pero sí te recuerda que siempre hay algo que puede iluminar tu camino."</p>
                <Button onClick={() => setStep(0)} variant="outline">Añadir más recuerdos</Button>
            </div>
        );
      default: return null;
    }
  }

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
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
