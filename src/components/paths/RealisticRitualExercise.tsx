
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { RealisticRitualExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface RealisticRitualExerciseProps {
  content: RealisticRitualExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function RealisticRitualExercise({ content, pathId, onComplete }: RealisticRitualExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [habit, setHabit] = useState('');
  const [minVersion, setMinVersion] = useState('');
  const [link, setLink] = useState('');
  const [reminder, setReminder] = useState('');
  const [saved, setSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setHabit('');
    setMinVersion('');
    setLink('');
    setReminder('');
    setSaved(false);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!habit || !minVersion || !link || !reminder) {
      toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
      return;
    }
    const notebookContent = [
        `**Ejercicio: ${content.title}**`,
        `Pregunta: HÃ¡bito que quiero mantener | Respuesta: ${habit}`,
        `Pregunta: Mi versiÃ³n mÃ­nima viable | Respuesta: ${minVersion}`,
        `Pregunta: Lo vincularÃ© a | Respuesta: ${link}`,
        `Pregunta: Para recordarlo o facilitarlo, voy a | Respuesta: ${reminder}`
    ].join('\n\n');
    
    addNotebookEntry({ 
      title: 'Mi Ritual Realista', 
      content: notebookContent, 
      pathId, 
      ruta: 'Superar la ProcrastinaciÃ³n y Crear HÃ¡bitos',
      userId: user?.id 
    });
    toast({ title: 'Ritual Guardado', description: 'Tu ritual ha sido guardado.' });
    setSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-4 space-y-4">
            <p>Un ritual realista es un hÃ¡bito que se adapta a ti, no al revÃ©s. AquÃ­ vas a diseÃ±ar una versiÃ³n mÃ­nima, clara y posible de lo que quieres sostener en el tiempo.</p>
            <Button onClick={nextStep}>DiseÃ±ar mi ritual <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Â¿QuÃ© hÃ¡bito quiero mantener?</h4>
            <p>Ejemplos: â€œRevisar mi agenda cada maÃ±anaâ€, â€œHacer 3 minutos de respiraciÃ³nâ€, â€œCaminar 10 minutos despuÃ©s de comerâ€</p>
            <Label htmlFor="habit-ritual" className="sr-only">Â¿QuÃ© hÃ¡bito quiero mantener?</Label>
            <Textarea id="habit-ritual" value={habit} onChange={e => setHabit(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button onClick={nextStep} disabled={!habit.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 p-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Â¿CuÃ¡l es su versiÃ³n mÃ­nima viable?</h4>
            <p>Ejemplos: â€œEscribir solo una lÃ­neaâ€, â€œMoverme durante 2 minutosâ€, â€œPreparar la ropa de deporteâ€</p>
            <Label htmlFor="min-version" className="sr-only">Â¿CuÃ¡l es su versiÃ³n mÃ­nima viable?</Label>
            <Textarea id="min-version" value={minVersion} onChange={e => setMinVersion(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                <Button onClick={nextStep} disabled={!minVersion.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Â¿CuÃ¡ndo o con quÃ© lo vincularÃ¡s?</h4>
            <p>Ejemplos: â€œDespuÃ©s de lavarme los dientesâ€, â€œCuando cierre el portÃ¡tilâ€, â€œAl volver de dejar a mi hijo o hijaâ€</p>
            <Label htmlFor="link" className="sr-only">Â¿CuÃ¡ndo o con quÃ© lo vincularÃ¡s?</Label>
            <Textarea id="link" value={link} onChange={e => setLink(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>AtrÃ¡s</Button>
                <Button onClick={nextStep} disabled={!link.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Â¿QuÃ© puedo hacer para recordarlo o facilitarlo?</h4>
            <p>Ejemplos: â€œDejar una nota visibleâ€, â€œPoner una alarma suaveâ€, â€œDejar el libro preparado sobre la mesaâ€</p>
            <Label htmlFor="reminder" className="sr-only">Â¿QuÃ© puedo hacer para recordarlo o facilitarlo?</Label>
            <Textarea id="reminder" value={reminder} onChange={e => setReminder(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4" />AtrÃ¡s</Button>
              <Button type="submit" disabled={!reminder.trim()}>
                <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapÃ©utico
              </Button>
            </div>
          </form>
        );
      case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Â¡Ritual Guardado!</h4>
            
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {(content.audioUrl || content.objective) && (
          <CardDescription>
            {content.audioUrl && (
              <div className="mb-4">
                <audio controls controlsList="nodownload" className="w-full">
                  <source src={content.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
            {content.objective}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
          {renderStep()}
      </CardContent>
    </Card>
  );
}

