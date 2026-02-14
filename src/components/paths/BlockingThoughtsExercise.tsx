"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BlockingThoughtsExerciseContent } from '@/data/paths/pathTypes';
import { Checkbox } from '../ui/checkbox';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface BlockingThoughtsExerciseProps {
  content: BlockingThoughtsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const distortionOptions = [
    { value: 'pensamiento-todo-o-nada', label: 'Pensamiento todo o nada' },
    { value: 'sobregeneralizacion', label: 'Sobregeneralización' },
    { value: 'filtro-mental', label: 'Filtro mental' },
    { value: 'descalificar-lo-positivo', label: 'Descalificar lo positivo' },
    { value: 'lectura-de-mente', label: 'Lectura de mente' },
    { value: 'adivinacion-del-futuro', label: 'Adivinación del futuro' },
    { value: 'catastrofismo', label: 'Catastrofismo' },
    { value: 'razonamiento-emocional', label: 'Razonamiento emocional' },
    { value: 'deberias-o-tengo-que', label: 'Deberías o tengo que' },
    { value: 'etiquetado', label: 'Etiquetado' },
    { value: 'personalizacion', label: 'Personalización' },
];

export default function BlockingThoughtsExercise({ content, pathId, onComplete }: BlockingThoughtsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [blockingThought, setBlockingThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [reformulation, setReformulation] = useState('');
  const [finalReflection, setFinalReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const nextStep = () => setStep(prev => prev + 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !blockingThought.trim() || !reformulation.trim() || !finalReflection.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos del ejercicio para guardar.",
        variant: "destructive",
      });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación en la que dudé en pedir ayuda:**
${situation}

**Pensamiento bloqueante que apareció:**
"${blockingThought}"

**Distorsión cognitiva que detecté:**
${distortion || 'No especificada.'}

**Reformulación consciente y amable:**
"${reformulation}"

**Próximo paso/aprendizaje:**
${finalReflection}
    `;
    addNotebookEntry({ title: 'Registro de Pensamientos Bloqueantes', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Registro Guardado' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm">Esta técnica te ayuda a detectar y reformular los pensamientos que te frenan al pedir ayuda. Se basa en la Terapia Cognitivo-Conductual (Beck, 2011) que demuestra que cuestionar creencias disfuncionales reduce la ansiedad y mejora la disposición a buscar apoyo.</p>
            <Button onClick={nextStep}>Empezar registro <ArrowRight className="mr-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">Paso 1: Recuerda una situación reciente</Label>
            <p className="text-sm">Piensa en un momento en el que necesitaste algo, pero dudaste o decidiste no pedirlo.</p>
            <Textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ejemplo: La semana pasada no pedí que me sustituyeran en la reunión aunque estaba enferma." />
            <div className="flex justify-between w-full pt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="thought-blocking" className="font-semibold text-lg">Paso 2: Anota el pensamiento bloqueante</Label>
            <p className="text-sm">¿Qué frase pasó por tu mente en ese momento?</p>
            <Textarea id="thought-blocking" value={blockingThought} onChange={e => setBlockingThought(e.target.value)} placeholder="Ej: No quiero molestar. / Si lo pido, pensarán que no soy capaz." />
            <div className="flex justify-between"><Button onClick={prevStep} variant="outline">Atrás</Button><Button onClick={nextStep} disabled={!blockingThought.trim()}>Siguiente</Button></div>
          </div>
        );
      case 3:
        return (
           <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="distortion-select" className="font-semibold text-lg">Paso 3: Detecta la distorsión cognitiva</Label>
            <p className="text-sm text-muted-foreground">Identifica si tu pensamiento se parece a alguna de estas distorsiones.</p>
            <Select onValueChange={setDistortion} value={distortion} disabled={isSaved}>
                <SelectTrigger id="distortion-select"><SelectValue placeholder="Elige una distorsión..."/></SelectTrigger>
                <SelectContent>
                    {distortionOptions.map(opt => <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex justify-between"><Button onClick={prevStep} variant="outline">Atrás</Button><Button onClick={nextStep}>Siguiente</Button></div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="reformulation-blocking" className="font-semibold text-lg">Paso 4: Reformulación</Label>
            <p className="text-sm">Transforma tu pensamiento en uno más realista y útil.</p>
            <Textarea id="reformulation-blocking" value={reformulation} onChange={e => setReformulation(e.target.value)} placeholder="Ej: Pedir ayuda me permite avanzar más rápido. / A las personas que me aprecian les gusta estar ahí para mí." disabled={isSaved} />
            <div className="flex justify-between"><Button onClick={prevStep} variant="outline">Atrás</Button><Button onClick={nextStep} disabled={!reformulation.trim()}>Siguiente</Button></div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="next-step-blocking" className="font-semibold text-lg">Paso 5: Integra el aprendizaje</Label>
            <p className="text-sm">Piensa en cómo podrías aplicar esta nueva forma de pensar la próxima vez.</p>
            <Textarea id="next-step-blocking" value={finalReflection} onChange={e => setFinalReflection(e.target.value)} placeholder="Ej: La próxima vez que esté enferma pediré a María que me sustituya, así me recupero antes y no afecto al equipo." disabled={isSaved}/>
             <div className="flex justify-between"><Button onClick={prevStep} variant="outline" type="button">Atrás</Button><Button type="submit" disabled={isSaved}><Save className="mr-2 h-4 w-4" /> Guardar registro</Button></div>
          </form>
        );
      case 6: // Confirmation
        return (
          <div className="p-4 space-y-4 text-center">
            <CheckCircle className="h-10 w-10 text-primary mx-auto" />
            <h4 className="font-semibold">¡Registro Guardado!</h4>
            <p>Has dado un paso importante para cambiar tu diálogo interno.</p>
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
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
