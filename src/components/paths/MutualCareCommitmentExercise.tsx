
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
import { useUser } from '@/contexts/UserContext';

interface MutualCareCommitmentExerciseProps {
  content: MutualCareCommitmentExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const gestureExamples = [
  'Mandar un mensaje de gratitud.',
  'Llamar para preguntar cómo está.',
  'Invitar a un café o paseo.',
  'Escuchar sin interrumpir.',
  'Recordar un momento especial compartido.',
];

interface Commitment {
  name: string;
  action: string;
  date?: Date;
  time: string;
}

export default function MutualCareCommitmentExercise({ content, pathId, onComplete }: MutualCareCommitmentExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [commitments, setCommitments] = useState<Commitment[]>(() =>
    Array(3).fill({ name: '', action: '', time: '' })
  );
  const [isSaved, setIsSaved] = useState(false);
  
  const handleCommitmentChange = <K extends keyof Commitment>(index: number, field: K, value: Commitment[K]) => {
    const newCommitments = [...commitments];
    newCommitments[index] = { ...newCommitments[index], [field]: value };
    setCommitments(newCommitments);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledCommitments = commitments.filter(c => c.name.trim() !== '' && c.action.trim() !== '');
    if (filledCommitments.length === 0) {
      toast({ title: 'Ejercicio Incompleto', description: 'Por favor, define al menos un compromiso completo.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**Ejercicio: ${content.title}**\n\n**Mis Compromisos de Cuidado Mutuo:**\n\n`;
    filledCommitments.forEach(c => {
        notebookContent += `**Persona a cuidar:** ${c.name}\n`;
        notebookContent += `- **Gesto concreto de cuidado:** ${c.action}\n`;
        if (c.date) {
            notebookContent += `- **Cuándo lo haré:** ${format(c.date, "PPP", { locale: es })}${c.time ? ` a las ${c.time}` : ''}\n\n`;
        } else {
            notebookContent += `\n`;
        }
    });

    addNotebookEntry({ title: 'Mi Compromiso de Cuidado Mutuo', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Compromiso Guardado' });
    setIsSaved(true);
    onComplete();
    setStep(prev => prev + 1); // Move to confirmation
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const resetExercise = () => {
    setStep(0);
    setCommitments(Array(3).fill({ name: '', action: '', time: '' }));
    setIsSaved(false);
  };
  
  const renderStep = () => {
    const filledPeople = commitments.filter(c => c.name.trim() !== '');

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
              {commitments.map((c, i) => (
                <Input key={i} value={c.name} onChange={e => handleCommitmentChange(i, 'name', e.target.value)} placeholder={`Persona ${i + 1}...`} />
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={filledPeople.length === 0}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
        
      case 2: // Paso 2: Elegir gestos
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Elige tus gestos de cuidado</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, define una acción simple pero significativa.</p>
            {filledPeople.map((c, i) => (
                 <div key={i} className="p-3 border rounded-md bg-background space-y-3">
                    <p className="font-semibold">{c.name}</p>
                     <div className="space-y-2">
                        <Label className="text-xs">Inspírate con estos ejemplos:</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecciona un ejemplo..."/></SelectTrigger>
                            <SelectContent>
                                {gestureExamples.map((ex, j) => <SelectItem key={j} value={ex}>{ex}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor={`action-text-${i}`}>Escribe un gesto concreto para cuidar o reforzar cada vínculo de tu círculo.</Label>
                        <Textarea id={`action-text-${i}`} value={c.action} onChange={e => handleCommitmentChange(i, 'action', e.target.value)} placeholder="Ejemplo: “Con mi hermano: comer juntos una vez al mes”, “Con Laura: enviarle un audio de ánimo cuando sé que tiene un día difícil”."/>
                     </div>
                 </div>
            ))}
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );

      case 3: // Paso 3: Programar y comprometerse
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Programa y comprométete</h4>
                <p className="text-sm text-muted-foreground">Selecciona el día y hora aproximada para cada gesto.</p>
                {commitments.filter(c => c.name.trim() && c.action.trim()).map((c, i) => (
                    <div key={i} className="p-3 border rounded-md space-y-3 bg-background">
                         <p className="font-semibold">{c.name}: <span className="font-normal italic">"{c.action}"</span></p>
                        <div className="flex flex-wrap gap-2 items-center">
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !c.date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {c.date ? format(c.date, "PPP", {locale: es}) : <span>Elige una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={c.date}
                                onSelect={(date) => handleCommitmentChange(i, 'date', date)}
                                initialFocus
                                locale={es}
                                />
                            </PopoverContent>
                            </Popover>
                            <Input type="time" value={c.time} onChange={(e) => handleCommitmentChange(i, 'time', e.target.value)} className="w-[120px]"/>
                        </div>
                    </div>
                ))}
                 <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={nextStep}>Revisar y Guardar <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
            </div>
        );
      
       case 4: // Paso 4: Revisar y Guardar
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Tu Compromiso</h4>
             {commitments.filter(c => c.name && c.action).map((c, i) => (
                <div key={i} className="p-3 border rounded-md bg-background/50">
                    <p><strong>Persona:</strong> {c.name}</p>
                    <p><strong>Acción:</strong> {c.action}</p>
                    {c.date && <p><strong>Cuándo:</strong> {format(c.date, "PPP", {locale: es})} {c.time && `a las ${c.time}`}</p>}
                </div>
            ))}
            <p className="text-sm italic text-center pt-4">"Tu compromiso no es solo con la otra persona, también es contigo: con tu decisión de cultivar relaciones que te cuidan y a las que cuidas."</p>
             <div className="flex flex-col items-center gap-2 pt-4">
                <p className="text-sm font-semibold">Guardar datos y gesto de cuidado, todo en un esquema circular</p>
                <div className="flex justify-between w-full mt-2">
                    <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button type="submit" disabled={isSaved}><Save className="mr-2 h-4 w-4" /> Guardar Compromiso</Button>
                </div>
            </div>
          </form>
        );

      case 5: // Confirmation
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
