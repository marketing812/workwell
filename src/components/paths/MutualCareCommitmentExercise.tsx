
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, CalendarIcon } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MutualCareCommitmentExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MutualCareCommitmentExerciseProps {
  content: MutualCareCommitmentExerciseContent;
  pathId: string;
}

const gestureExamples = [
  'Mandar un mensaje de gratitud.',
  'Llamar para preguntar cómo está.',
  'Invitar a un café o paseo.',
  'Escuchar sin interrumpir.',
  'Recordar un momento especial compartido.',
];

export function MutualCareCommitmentExercise({ content, pathId }: MutualCareCommitmentExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState(['', '', '']);
  const [action, setAction] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isSaved, setIsSaved] = useState(false);
  
  const handlePersonChange = (index: number, value: string) => {
    const newPeople = [...people];
    newPeople[index] = value;
    setPeople(newPeople);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledPeople = people.filter(p => p.trim() !== '');
    if (filledPeople.length === 0 || !action.trim()) {
      toast({ title: 'Ejercicio Incompleto', description: 'Por favor, define al menos una persona y tu gesto de cuidado.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    notebookContent += `**Personas a cuidar:** ${filledPeople.join(', ')}\n`;
    notebookContent += `**Gesto de cuidado elegido:** ${action}\n`;
    if (selectedDate) {
        notebookContent += `**Fecha programada:** ${format(selectedDate, 'PPP', { locale: es })}\n`;
    }

    addNotebookEntry({ title: 'Mi Compromiso de Cuidado Mutuo', content: notebookContent, pathId: pathId });
    toast({ title: 'Compromiso Guardado' });
    setIsSaved(true);
    setStep(prev => prev + 1); // Move to confirmation
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setPeople(['', '', '']);
    setAction('');
    setSelectedDate(undefined);
    setIsSaved(false);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Introducción
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Antes de empezar, piensa en las personas que son importantes para ti. No las que “deberían” estar, sino las que realmente te aportan calma, alegría o fuerza.</p>
            <p className="text-sm text-muted-foreground">En esta técnica vamos a elegir tres gestos sencillos para demostrar cuidado y construir el vínculo.</p>
            <Button onClick={nextStep}>Empezar Ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );

      case 1: // Paso 1: Identificar personas
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Identifica a quién quieres cuidar esta semana</h4>
            <p className="text-sm text-muted-foreground">Escribe el nombre de hasta tres personas con las que quieras reforzar tu conexión. Ejemplo: “Marta – mi amiga de la universidad”, “Mi abuela”, “Compañero/a de trabajo que me apoyó en un proyecto”.</p>
            <div className="space-y-3">
              {people.map((p, i) => (
                <Input key={i} value={p} onChange={e => handlePersonChange(i, e.target.value)} placeholder={`Persona ${i + 1}...`} />
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={people.every(p => p.trim() === '')}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
        
      case 2: // Paso 2: Elegir gestos
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Elige tus tres gestos</h4>
            <p className="text-sm text-muted-foreground">Piensa en acciones simples, pero significativas.</p>
             <div className="space-y-2">
                <Label>Inspírate con estos ejemplos:</Label>
                <Select onValueChange={setAction}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un ejemplo..."/></SelectTrigger>
                  <SelectContent>
                    {gestureExamples.map((ex, i) => <SelectItem key={i} value={ex}>{ex}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="action-text">¿Qué harás exactamente?</Label>
                <Textarea id="action-text" value={action} onChange={e => setAction(e.target.value)} />
             </div>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!action.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );

      case 3: // Paso 3: Programar y comprometerse
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Programa y comprométete</h4>
            <p className="text-sm text-muted-foreground">Selecciona el día y hora aproximada para cada gesto.</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", {locale: es}) : <span>Elige una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm italic text-center pt-4">"Tu compromiso no es solo con la otra persona, también es contigo: con tu decisión de cultivar relaciones que te cuidan y a las que cuidas."</p>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar Compromiso</Button>
            </div>
          </form>
        );

      case 4: // Confirmation
        return (
            <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Compromiso Guardado</h4>
                <p className="text-muted-foreground">Tu plan de cuidado mutuo se ha guardado en el cuaderno. Ahora, ¡a la acción!</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro compromiso</Button>
            </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana4tecnica1.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
