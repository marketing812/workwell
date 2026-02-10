
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetectiveDeEmocionesExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { useUser } from '@/contexts/UserContext';

interface DetectiveDeEmocionesExerciseProps {
  content: DetectiveDeEmocionesExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const reflectionOptions = [
    { id: 'reacciono-rapido', label: 'Me doy cuenta de que reacciono rápido sin pensar' },
    { id: 'emocion-no-intensa', label: 'La emoción no era tan intensa como parecía' },
    { id: 'confundi-pensamiento', label: 'Confundí mi pensamiento con lo que sentía' },
    { id: 'mas-tranquilo', label: 'Me sentí más tranquilo/a al escribirlo' },
];

export default function DetectiveDeEmocionesExercise({ content, pathId, onComplete }: DetectiveDeEmocionesExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const { user } = useUser();
  
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Record<string, boolean>>({});
  const [otherEmotion, setOtherEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [impulse, setImpulse] = useState('');
  const [reflectionSelections, setReflectionSelections] = useState<Record<string, boolean>>({});
  const [otherReflection, setOtherReflection] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setAutomaticThought('');
    setSelectedEmotions({});
    setOtherEmotion('');
    setEmotionIntensity(50);
    setImpulse('');
    setReflectionSelections({});
    setOtherReflection('');
  };

  const handleSave = () => {
    const finalEmotions = emotionOptions
        .filter(e => selectedEmotions[e.value])
        .map(e => t[e.labelKey as keyof typeof t]);

    if (selectedEmotions['otra'] && otherEmotion.trim()) {
        finalEmotions.push(otherEmotion.trim());
    }

    const selectedReflections = reflectionOptions
        .filter(opt => reflectionSelections[opt.id])
        .map(opt => opt.label);

    if (reflectionSelections['otra'] && otherReflection.trim()) {
        selectedReflections.push(otherReflection.trim());
    }
    
    if(selectedReflections.length === 0) {
        toast({ title: 'Reflexión requerida', description: 'Por favor, selecciona al menos un aprendizaje o añade el tuyo propio.', variant: 'destructive'});
        return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación vivida:*
${situation || 'No especificada.'}

*Pensamiento automático:*
"${automaticThought || 'No especificado.'}"

*Emoción(es) sentida(s):*
${finalEmotions.length > 0 ? finalEmotions.join(', ') : 'No especificada'} (Intensidad: ${emotionIntensity}%)

*Impulso o conducta:*
${impulse || 'No especificado.'}

*Reflexión (¿Qué aprendiste?):*
${selectedReflections.length > 0 ? selectedReflections.map(r => `- ${r}`).join('\n') : 'Sin reflexión.'}
`;
    addNotebookEntry({ title: 'Mi Registro de Detective de Emociones', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Registro Guardado', description: 'Tu registro se ha guardado en el cuaderno.' });
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    const finalEmotions = emotionOptions
        .filter(e => selectedEmotions[e.value])
        .map(e => t[e.labelKey as keyof typeof t]);

    if (selectedEmotions['otra'] && otherEmotion.trim()) {
        finalEmotions.push(otherEmotion.trim());
    }

    switch (step) {
      case 0: return <div className="p-4"><p className="text-center mb-4">Piensa en una situación reciente que te haya movido emocionalmente.</p><Button onClick={nextStep} className="w-full">Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button></div>;
      case 1: return <div className="p-4 space-y-4"><h4 className="font-semibold text-lg">Paso 1: ¿Qué ocurrió?</h4><p className="text-sm text-muted-foreground">Describe brevemente una situación concreta que te haya movido emocionalmente esta semana. Céntrate solo en lo que ocurrió —los hechos visibles o verificables— sin añadir aún cómo te sentiste ni lo que pensaste. Piensa que lo estás contando como si fueras una cámara que graba la escena: ¿qué pasó?, ¿quién estaba?, ¿dónde y cuándo fue?</p><Textarea id="situation-detective" value={situation} onChange={e => setSituation(e.target.value)} placeholder={'“Ayer envié un mensaje importante a una amiga y no me contestó.” \n(No pongas: “Me sentí ignorada” o “Seguro que está enfadada conmigo” → eso lo veremos después)'} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 2: return <div className="p-4 space-y-4"><h4 className="font-semibold text-lg">Paso 2: ¿Qué pensaste en ese momento?</h4><p className="text-sm text-muted-foreground">Captura la primera idea o ideas que pasaron por tu mente. No las juzgues. Solo obsérvalas y escríbelas.  </p><Textarea id="automaticThought" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} placeholder="“Seguro que está enfadada conmigo.”" /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 3: return <div className="p-4 space-y-4"><h4 className="font-semibold text-lg">Paso 3: ¿Qué emoción sentiste con más fuerza?</h4><p className="text-sm text-muted-foreground">Elige una emoción o varias del diccionario de emociones o escríbela tú. También puedes añadir otras emociones que hayan estado presentes.</p><div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">{emotionOptions.map(e => <div key={e.value} className="flex items-center gap-2"><Checkbox id={e.value} checked={selectedEmotions[e.value] || false} onCheckedChange={c => setSelectedEmotions(prev => ({ ...prev, [e.value]: !!c }))} /><Label htmlFor={e.value} className="font-normal">{t[e.labelKey as keyof typeof t]}</Label></div>)}</div><div className="flex items-center gap-2"><Checkbox id="emotion-other" checked={selectedEmotions['otra'] || false} onCheckedChange={c => setSelectedEmotions(prev => ({ ...prev, ['otra']: !!c }))} /><Label htmlFor="emotion-other" className="font-normal">Otra:</Label></div>{selectedEmotions['otra'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} />}<div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={Object.values(selectedEmotions).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 4: return <div className="p-4 space-y-4"><h4 className="font-semibold text-lg">Paso 4: ¿Qué tan fuerte fue la emoción principal? ({emotionIntensity}%)</h4><p className="text-sm text-muted-foreground">“0%” = apenas la noté · “100%” = me desbordó completamente</p><Slider value={[emotionIntensity]} onValueChange={v => setEmotionIntensity(v[0])} max={100} step={5} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 5: return <div className="p-4 space-y-4"><h4 className="font-semibold text-lg">Paso 5: ¿Qué hiciste o te dieron ganas de hacer?</h4><p className="text-sm text-muted-foreground">Puedes describir lo que hiciste… o lo que te contuviste de hacer. </p><Textarea value={impulse} onChange={e => setImpulse(e.target.value)} placeholder="“Me dieron ganas de escribirle otro mensaje pasivo-agresivo, pero me aguanté.”" /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 6: return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 6: ¿Qué aprendiste al observar esta cadena?</h4>
                 <p className="text-sm text-muted-foreground">Selecciona una o varias opciones:</p>
                <div className="space-y-2">
                    {reflectionOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={reflectionSelections[opt.id] || false} onCheckedChange={c => setReflectionSelections(p => ({...p, [opt.id]: !!c}))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="reflection-other" checked={reflectionSelections['otra'] || false} onCheckedChange={c => setReflectionSelections(p => ({...p, ['otra']: !!c}))} />
                        <Label htmlFor="reflection-other" className="font-normal">Otra (campo libre)</Label>
                    </div>
                    {reflectionSelections['otra'] && (
                        <Textarea value={otherReflection} onChange={e => setOtherReflection(e.target.value)} placeholder="Escribe tu propio aprendizaje..." className="ml-6" />
                    )}
                </div>
                <div className="flex justify-between w-full mt-2">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                    <Button onClick={handleSave} className="w-auto" disabled={Object.values(reflectionSelections).every(v => !v) && !otherReflection.trim()}><Save className="mr-2 h-4 w-4"/>Guardar</Button>
                </div>
            </div>
        );
      case 7: 
        const selectedReflections = reflectionOptions.filter(opt => reflectionSelections[opt.id]).map(opt => opt.label);
        if (reflectionSelections['otra'] && otherReflection) selectedReflections.push(otherReflection);
        return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><h4 className="font-bold text-center text-lg">Tu Mapa Emocional</h4><p>Hoy diste un paso más hacia tu autoconocimiento. Nombrar lo que sientes te permite cuidarte mejor.</p><div className="text-left border p-2 rounded-md bg-background"><p className="font-semibold">Tu registro:</p><p>Situación: {situation}</p><p>Pensamiento: {automaticThought}</p><p>Emoción(es): {finalEmotions.join(', ')}</p><p>Impulso: {impulse}</p><p>Aprendizaje: {selectedReflections.join(', ')}</p></div><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={resetExercise} variant="outline">Hacer otro registro</Button></div></div>;
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
                        <source src="https://workwellfut.com/audios/ruta6/tecnicas/Ruta6sesion1tecnica1.mp3" type="audio/mp3" />
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
