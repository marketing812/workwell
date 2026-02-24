
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NonNegotiablesExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Input } from '../ui/input';

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad', 'Pareja / Amor romántico',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

interface NonNegotiablesExerciseProps {
  content: NonNegotiablesExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function NonNegotiablesExercise({ content, pathId, onComplete }: NonNegotiablesExerciseProps) {
  const [step, setStep] = useState(0);
  const [pastSituation, setPastSituation] = useState('');
  const [initialValues, setInitialValues] = useState<Record<string, boolean>>({});
  const [otherInitialValue, setOtherInitialValue] = useState('');
  const [nonNegotiables, setNonNegotiables] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(false);

  const handleInitialValueChange = (value: string, checked: boolean) => {
    setInitialValues(prev => ({...prev, [value]: checked }));
    if (!checked) {
        setNonNegotiables(prev => prev.filter(v => v !== value));
    }
  };
  
  const handleNonNegotiableSelect = (value: string, checked: boolean) => {
    if (checked) {
      if (nonNegotiables.length < 3) {
        setNonNegotiables(prev => [...prev, value]);
      } else {
        toast({ title: "Límite alcanzado", description: "Solo puedes elegir hasta 3 valores no negociables.", variant: "destructive"});
      }
    } else {
      setNonNegotiables(prev => prev.filter(v => v !== value));
    }
  };

  const handleCommitmentChange = (value: string, text: string) => {
    setCommitments(prev => ({...prev, [value]: text}));
  };

  const getFilteredValues = () => {
      const selected = valuesList.filter(v => initialValues[v]);
      if (initialValues['Otro'] && otherInitialValue) {
          selected.push(otherInitialValue);
      }
      return selected;
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (nonNegotiables.length !== 3 || nonNegotiables.some(v => !commitments[v]?.trim())) {
        toast({ title: 'Ejercicio Incompleto', description: 'Por favor, elige 3 no negociables y escribe un compromiso para cada uno.', variant: 'destructive'});
        return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Situación en la que actué en contra de mis valores | Respuesta: ${pastSituation || 'No especificada.'}
Pregunta: Valores que se rompieron | Respuesta: ${getFilteredValues().join(', ') || 'No especificados.'}

**Mis 3 no negociables:**
${nonNegotiables.map((v, i) => `Pregunta: No negociable ${i + 1} | Respuesta: ${v}`).join('\n')}

**Mis compromisos para cuidarlos:**
${nonNegotiables.map((v) => `Pregunta: Compromiso para: ${v} | Respuesta: ${commitments[v]}`).join('\n')}
    `;
    addNotebookEntry({ title: 'Mis No Negociables', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'No Negociables Guardados' });
    setIsSaved(true);
    onComplete();
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);
  const nextStep = () => setStep(prev => prev + 1);

  const resetExercise = () => {
    setStep(0);
    setPastSituation('');
    setInitialValues({});
    setOtherInitialValue('');
    setNonNegotiables([]);
    setCommitments({});
    setIsSaved(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Un no negociable no es una norma impuesta por otros. Es una elección interna que nace de tus valores y tu experiencia. No se trata de tener una lista enorme, sino de elegir lo que realmente es esencial para ti.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Piensa en tu historia y explora tus valores</h4>
            <div className="space-y-2">
                <Label htmlFor="past-situation">Recuerda una situación en la que actuaste en contra de lo que sentías correcto y eso te dejó malestar. ¿Qué valor se rompió? (Opcional)</Label>
                <Textarea id="past-situation" value={pastSituation} onChange={e => setPastSituation(e.target.value)} placeholder='Ejemplo: "Acepté un trato injusto por miedo a perder el trabajo. El valor que se rompió fue la justicia."' />
            </div>
            <div className="space-y-2">
              <Label>Elige los valores que, si los traicionas, sentirías que te pierdes a ti mismo o a ti misma. (Puedes elegir más de uno)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {valuesList.map(v => (
                      <div key={v} className="flex items-center space-x-2">
                          <Checkbox id={`val-${v}`} checked={!!initialValues[v]} onCheckedChange={c => handleInitialValueChange(v, !!c)} />
                          <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                      </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="val-otro" checked={!!initialValues['Otro']} onCheckedChange={c => handleInitialValueChange('Otro', !!c)} />
                    <Label htmlFor="val-otro" className="font-normal text-xs">Otro</Label>
                  </div>
              </div>
              {initialValues['Otro'] && (
                  <Input value={otherInitialValue} onChange={e => setOtherInitialValue(e.target.value)} placeholder="Describe tu valor personalizado..." className="mt-2" />
              )}
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={Object.values(initialValues).every(v => !v)}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        const availableValues = getFilteredValues();
        return (
            <div className="p-4 space-y-2 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 2: Elige tus 3 no negociables</h4>
                <p className="text-sm text-muted-foreground">Menos es más. Elige solo los tres que sean tu línea roja de entre los que has seleccionado. ({nonNegotiables.length}/3)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md">
                    {availableValues.map(v => (
                        <div key={v} className="flex items-center space-x-2">
                            <Checkbox id={`nn-${v}`} checked={nonNegotiables.includes(v)} onCheckedChange={c => handleNonNegotiableSelect(v, !!c)} disabled={nonNegotiables.length >= 3 && !nonNegotiables.includes(v)} />
                            <Label htmlFor={`nn-${v}`} className="font-normal text-xs">{v}</Label>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep} disabled={nonNegotiables.length !== 3}>Siguiente <ArrowRight className="mr-2 h-4 w-4"/></Button>
                </div>
            </div>
        );
      case 3:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Escríbelos como compromisos</h4>
                 <p className="text-sm text-muted-foreground italic">Ejemplo: "Me comprometo a decir la verdad, incluso cuando es incómodo."</p>
                {nonNegotiables.map((v, i) => (
                    <div key={i} className="space-y-1">
                        <Label htmlFor={`commit-${i}`}>Compromiso para: <strong>{v}</strong></Label>
                        <Textarea id={`commit-${i}`} value={commitments[v] || ''} onChange={e => handleCommitmentChange(v, e.target.value)} />
                    </div>
                ))}
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Revisar y Guardar <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </div>
            </div>
        );
      case 4:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-center">Paso 4: Revisión y guardado</h4>
                <p className="text-sm text-muted-foreground">Estos no negociables son tu ancla. Guárdalos en tu cuaderno y revísalos cada vez que enfrentes una decisión difícil.</p>
                <div className="p-4 border rounded-md bg-background/50 space-y-2">
                    {nonNegotiables.map(v => (
                        <div key={v}>
                            <p className="font-bold">{v}:</p>
                            <p className="italic text-muted-foreground pl-2">{commitments[v] || "Sin compromiso definido."}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar en mi Cuaderno</Button>
                </div>
            </div>
        );
      case 5:
          return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Guardado</h4>
                <p className="text-muted-foreground">Tus no negociables han sido guardados. Puedes volver a ellos cuando lo necesites.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">
                  Empezar de nuevo
                </Button>
            </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
