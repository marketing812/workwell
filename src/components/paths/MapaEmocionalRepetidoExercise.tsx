
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapaEmocionalRepetidoExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface MapaEmocionalRepetidoExerciseProps {
  content: MapaEmocionalRepetidoExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const schemaOptions = [
    { value: 'abandono', label: 'Miedo al abandono' },
    { value: 'desconfianza', label: 'Desconfianza' },
    { value: 'falta_cuidado', label: 'Falta de cuidado o apoyo' },
    { value: 'verguenza', label: 'Vergüenza o sensación de no valer' },
    { value: 'no_pertenecer', label: 'No pertenecer' },
];

export function MapaEmocionalRepetidoExercise({ content, pathId, onComplete }: MapaEmocionalRepetidoExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [behavior, setBehavior] = useState('');
  const [isRepeated, setIsRepeated] = useState('');
  const [schema, setSchema] = useState('');
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setEmotion('');
    setAutomaticThought('');
    setBehavior('');
    setIsRepeated('');
    setSchema('');
  };

  const handleSave = () => {
    const notebookContent = `
**Ejercicio: ${content.title}**
Situación: ${situation}
Emoción: ${emotion}
Pensamiento: ${automaticThought}
Conducta: ${behavior}
Patrón Repetido: ${isRepeated}
Esquema Activado: ${schema}
`;
    addNotebookEntry({ title: 'Mi Mapa Emocional Repetido', content: notebookContent, pathId: pathId });
    toast({ title: 'Mapa Guardado' });
    onComplete();
    setStep(prev => prev + 1);
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4"><p className="text-center mb-4">Piensa en una situación reciente que te haya movido emocionalmente.</p><Button onClick={nextStep} className="w-full">Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label htmlFor="situation-detective" className="font-semibold">Describe brevemente una situación reciente en la que hayas sentido una emoción fuerte o repetitiva.</Label><Textarea id="situation-detective" value={situation} onChange={e => setSituation(e.target.value)} placeholder={'“Mi pareja no me escribió en todo el día.”\n“Mi jefe criticó mi trabajo frente a otros.”\n“Sentí que no me tenían en cuenta en una decisión.”'} /><Button onClick={nextStep} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4"><Label>Nombra la emoción principal:</Label><Select value={emotion} onValueChange={setEmotion}><SelectTrigger><SelectValue placeholder="..." /></SelectTrigger><SelectContent>{emotionOptions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}</SelectContent></Select><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!emotion}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 3: return <div className="p-4 space-y-4"><Label>¿Qué fue lo primero que pensaste?</Label><Textarea value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!automaticThought}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 4: return <div className="p-4 space-y-4"><Label>¿Qué hiciste después?</Label><Textarea value={behavior} onChange={e => setBehavior(e.target.value)} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!behavior}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 5: return <div className="p-4 space-y-4"><Label>¿Te suena esta reacción?</Label><RadioGroup value={isRepeated} onValueChange={setIsRepeated}><div className="flex items-center gap-2"><RadioGroupItem value="si" id="r_si"/><Label htmlFor="r_si" className="font-normal">Sí, me pasa a menudo</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="no" id="r_no"/><Label htmlFor="r_no" className="font-normal">No, fue algo nuevo</Label></div></RadioGroup><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!isRepeated}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 6: return <div className="p-4 space-y-4"><Label>¿Qué patrón crees que se activó?</Label><Select value={schema} onValueChange={setSchema}><SelectTrigger><SelectValue placeholder="Elige un patrón..." /></SelectTrigger><SelectContent>{schemaOptions.map(s=><SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}</SelectContent></Select><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={handleSave} className="w-auto" disabled={!schema}>Ver Resumen</Button></div></div>;
      case 7: return <div className="p-4 space-y-2 text-center"><CheckCircle className="h-10 w-10 mx-auto text-primary" /><h4 className="font-bold text-center">Tu Mapa Emocional</h4><p>Situación: {situation}</p><p>Emoción: {emotion}</p><p>Pensamiento: {automaticThought}</p><p>Esquema: {schema}</p><p>Conducta: {behavior}</p><Button onClick={() => setStep(0)} variant="outline" className="w-full mt-4">Registrar otro</Button></div>;
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && 
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6semana3tecnica1.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        }
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
