
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmotionalGratificationMapExerciseContent } from '@/data/paths/pathTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface EmotionalGratificationMapExerciseProps {
  content: EmotionalGratificationMapExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const activityOptions = [
    'Escuchar música que me emocione', 'Cocinar algo que me guste', 'Hacer deporte o mover el cuerpo',
    'Leer o aprender algo nuevo', 'Estar en la naturaleza', 'Jugar con mi mascota', 'Compartir tiempo con familia o amistades',
    'Escribir o dibujar', 'Viajar o descubrir lugares nuevos', 'Otro'
];
const peopleOptions = [
    'Amigo o amiga cercana', 'Pareja o expareja', 'Hermano/a', 'Figura de apoyo (profesor/a, mentor/a, terapeuta)',
    'Compañero/a de trabajo', 'Otro'
];
const placesOptions = [
    'Un lugar en la naturaleza', 'Una parte de mi casa', 'Un sitio donde practico un hobby',
    'Un lugar con buena música', 'Un espacio donde puedo estar en silencio', 'Otro'
];


export default function EmotionalGratificationMapExercise({ content, pathId, onComplete }: EmotionalGratificationMapExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [activities, setActivities] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [otherActivity, setOtherActivity] = useState('');

  const [people, setPeople] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [otherPerson, setOtherPerson] = useState('');

  const [places, setPlaces] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [otherPlace, setOtherPlace] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>, otherSetter: React.Dispatch<React.SetStateAction<string>>, mainSetter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (value !== 'Otro') {
        otherSetter('');
        mainSetter(prev => prev ? `${prev}\n- ${value}`.trim() : `- ${value}`);
    }
  };

  const handleSave = () => {
    const finalActivities = activities || 'No especificado.';
    const finalPeople = people || 'No especificado.';
    const finalPlaces = places || 'No especificado.';

    const notebookContent = [
        `**Ejercicio: ${content.title}**`,
        `Pregunta: Actividades que me recargan | Respuesta:\n${finalActivities}`,
        `Pregunta: Personas que me inspiran o dan calma | Respuesta:\n${finalPeople}`,
        `Pregunta: Lugares que me llenan de energía | Respuesta:\n${finalPlaces}`,
    ].join('\n\n');

    addNotebookEntry({ title: 'Mi Mapa de Gratificación Emocional', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Mapa Guardado', description: 'Tu mapa ha sido guardado en el cuaderno.' });
    setIsSaved(true);
    onComplete();
    setStep(4); // Go to final confirmation
  };
  
  const resetExercise = () => {
    setStep(0);
    setActivities('');
    setSelectedActivity('');
    setOtherActivity('');
    setPeople('');
    setSelectedPerson('');
    setOtherPerson('');
    setPlaces('');
    setSelectedPlace('');
    setOtherPlace('');
    setIsSaved(false);
  }

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <div className="text-center p-4">
            <Button onClick={nextStep}>Empezar mi mapa</Button>
          </div>
        );
      case 1: // Step 1: Activities
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Recuerda actividades que te hacían sentir bien</h4>
            <p className="text-sm text-muted-foreground">Piensa en acciones concretas que antes te producían disfrute, calma o motivación. Ejemplo: “Caminar por la playa”, “Cocinar mi receta favorita”.</p>
            <Textarea id="activities" value={activities} onChange={e => setActivities(e.target.value)} placeholder="Escribe aquí las actividades..." rows={4}/>
            <div className="space-y-2">
                <Label htmlFor="activity-select" className="text-sm">O elige de esta lista para inspirarte:</Label>
                <Select onValueChange={(value) => handleSelectChange(setSelectedActivity, setOtherActivity, setActivities, value)} value={selectedActivity}>
                    <SelectTrigger id="activity-select"><SelectValue placeholder="Selecciona una actividad..."/></SelectTrigger>
                    <SelectContent>
                        {activityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedActivity === 'Otro' && <Input value={otherActivity} onChange={e => {setOtherActivity(e.target.value); setActivities(p => p ? `${p}\n- ${e.target.value}`.trim() : `- ${e.target.value}`)}} placeholder="Escribe otra actividad" className="mt-2"/>}
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Continuar</Button>
            </div>
          </div>
        );
      case 2: // Step 2: People
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Recuerda personas con las que te sentías bien</h4>
            <p className="text-sm text-muted-foreground">Piensa en personas con las que has sentido calma, apoyo o diversión. Ejemplo: “Mi mejor amigo de la universidad”.</p>
            <Textarea id="people" value={people} onChange={e => setPeople(e.target.value)} placeholder="Escribe aquí los nombres..." rows={4}/>
             <div className="space-y-2">
                <Label htmlFor="people-select" className="text-sm">O elige de esta lista:</Label>
                <Select onValueChange={(value) => handleSelectChange(setSelectedPerson, setOtherPerson, setPeople, value)} value={selectedPerson}>
                    <SelectTrigger id="people-select"><SelectValue placeholder="Selecciona un tipo de persona..."/></SelectTrigger>
                    <SelectContent>
                        {peopleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedPerson === 'Otro' && <Input value={otherPerson} onChange={e => {setOtherPerson(e.target.value); setPeople(p => p ? `${p}\n- ${e.target.value}`.trim() : `- ${e.target.value}`)}} placeholder="Describe a otra persona" className="mt-2"/>}
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Continuar</Button>
            </div>
          </div>
        );
      case 3: // Step 3: Places
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 3: Lugares que te recargaban</h4>
            <p className="text-sm text-muted-foreground">Recuerda entornos en los que te hayas sentido tranquilo/a, inspirado/a o con energía. Ejemplo: “Una cafetería acogedora”.</p>
            <Textarea id="places" value={places} onChange={e => setPlaces(e.target.value)} placeholder="Escribe aquí los lugares..." rows={4}/>
             <div className="space-y-2">
                <Label htmlFor="places-select" className="text-sm">O elige de esta lista:</Label>
                <Select onValueChange={(value) => handleSelectChange(setSelectedPlace, setOtherPlace, setPlaces, value)} value={selectedPlace}>
                    <SelectTrigger id="places-select"><SelectValue placeholder="Selecciona un tipo de lugar..."/></SelectTrigger>
                    <SelectContent>
                        {placesOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedPlace === 'Otro' && <Input value={otherPlace} onChange={e => {setOtherPlace(e.target.value); setPlaces(p => p ? `${p}\n- ${e.target.value}`.trim() : `- ${e.target.value}`)}} placeholder="Describe otro lugar" className="mt-2"/>}
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave}>Guardar mi mapa de gratificación</Button>
            </div>
          </div>
        );
      case 4: // Final Confirmation
         return (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Mi mapa de gratificación emocional</h4>
                <p className="text-sm text-muted-foreground">Aquí tienes tu mapa, para revisarlo cuando quieras:</p>
                <div className="text-left p-4 border rounded-md bg-background/50 space-y-3">
                    <div>
                        <h5 className="font-semibold">Actividades que me recargan:</h5>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{activities || 'Sin definir'}</pre>
                    </div>
                     <div>
                        <h5 className="font-semibold">Personas que me inspiran o me dan calma:</h5>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{people || 'Sin definir'}</pre>
                    </div>
                     <div>
                        <h5 className="font-semibold">Lugares que me llenan de energía:</h5>
                        <pre className="text-sm whitespace-pre-wrap font-sans">{places || 'Sin definir'}</pre>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground italic pt-2">Recuerda: No tienes que hacerlas todas a la vez. Incluso una sola de estas actividades, personas o lugares puede marcar la diferencia en tu día.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                     <Button onClick={() => setStep(1)} variant="outline">Editar mi mapa</Button>
                     <Button onClick={resetExercise}>Finalizar ejercicio</Button>
                </div>
            </div>
         );
      default:
        return null;
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
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
