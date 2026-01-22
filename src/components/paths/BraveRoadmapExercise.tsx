
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { BraveRoadmapExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '../ui/input';

interface BraveRoadmapExerciseProps {
  content: BraveRoadmapExerciseContent;
  pathId: string;
}

const valueOptions = [
    { id: 'care', label: 'Cuidado personal', description: 'Priorizar tu bienestar físico, emocional y mental sin culpa.' },
    { id: 'auth', label: 'Autenticidad', description: 'Ser tú misma o tú mismo, sin máscaras ni autoengaños.' },
    { id: 'freedom', label: 'Libertad', description: 'Elegir desde lo que te mueve por dentro, no desde la obligación o la presión.' },
    { id: 'connect', label: 'Conexión', description: 'Sentirte en sintonía con otras personas desde el respeto y la empatía.' },
    { id: 'calm', label: 'Calma', description: 'Vivir con más serenidad, sin dejarte arrastrar por la prisa o la ansiedad.' },
    { id: 'respect', label: 'Respeto', description: 'Tratarte a ti y a los demás con dignidad y cuidado, incluso en el conflicto.' },
    { id: 'coherence', label: 'Coherencia interna', description: 'Actuar en línea con lo que piensas y sientes, sin dividirte por dentro.' },
    { id: 'bravery', label: 'Valentía', description: 'Dar pasos aunque sientas miedo, si eso te acerca a lo que de verdad importa.' },
    { id: 'compassion', label: 'Compasión', description: 'Tratarte con amabilidad, sobre todo cuando te equivocas o estás en dolor.' },
    { id: 'responsibility', label: 'Responsabilidad', description: 'Hacerte cargo de tus elecciones, con honestidad y sin culpas innecesarias.' },
    { id: 'gratitude', label: 'Gratitud', description: 'Reconocer lo que sí hay, lo que funciona, lo que te ha sostenido.' },
    { id: 'presence', label: 'Presencia', description: 'Estar en el aquí y ahora, sin quedarte atrapada/o en el pasado o el futuro.' },
    { id: 'creativity', label: 'Creatividad', description: 'Expresarte con libertad, explorar nuevas ideas y soluciones.' },
    { id: 'confidence', label: 'Confianza', description: 'Creer en tus recursos internos y en la posibilidad de que las cosas pueden ir bien.' },
    { id: 'simplicity', label: 'Simplicidad', description: 'Dejar de cargar con lo innecesario para enfocarte en lo que sí cuenta.' },
    { id: 'self-love', label: 'Amor propio', description: 'Reconocer tu valor sin tener que demostrar nada.' },
    { id: 'justice', label: 'Justicia', description: 'Buscar el equilibrio y la equidad en tu vida y en tus relaciones.' },
    { id: 'integrity', label: 'Integridad', description: 'Ser fiel a tus principios, aunque eso implique tomar decisiones difíciles.' },
    { id: 'collaboration', label: 'Colaboración', description: 'Construir juntas o juntos, sumar, confiar en el apoyo mutuo.' },
    { id: 'tenderness', label: 'Ternura', description: 'Aportar dulzura, sensibilidad y cuidado en cómo te tratas y cómo te relacionas.' },
];

export function BraveRoadmapExercise({ content, pathId }: BraveRoadmapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [chosenValue, setChosenValue] = useState('');
  const [otherChosenValue, setOtherChosenValue] = useState('');

  const [actions, setActions] = useState(() => 
    Array(3).fill({ action: '', courage: '', value: '', otherValue: '' })
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleActionChange = (index: number, field: keyof typeof actions[0], value: string) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setActions(newActions);
  };
  
  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setChosenValue('');
    setOtherChosenValue('');
    setActions(Array(3).fill({ action: '', courage: '', value: '', otherValue: '' }));
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const finalChosenValue = chosenValue === 'Otro' ? otherChosenValue : chosenValue;
    const filledActions = actions.filter(a => a.action.trim() !== '');
    if (!finalChosenValue.trim() || filledActions.length === 0) {
      toast({ title: 'Ejercicio Incompleto', description: 'Por favor, define tu valor guía y al menos una acción.', variant: 'destructive' });
      return;
    }

    let notebookContent = `
**Ejercicio: ${content.title}**

**Valor ancla de la semana:** ${finalChosenValue}

`;
    filledActions.forEach((a, i) => {
      const finalValue = a.value === 'Otro' ? `Otro: ${a.otherValue || ''}` : a.value;
      notebookContent += `**Acción ${i + 1}:** ${a.action} (Coraje: ${a.courage}/3, Valor: ${finalValue})\n`;
    });

    addNotebookEntry({ title: `Mi Hoja de Ruta Valiente`, content: notebookContent, pathId: pathId });
    toast({ title: "Hoja de Ruta Guardada", description: "Tus acciones han sido guardadas." });
    setIsSaved(true);
    next();
  };

  const renderActionStep = (index: number) => {
    const action = actions[index];
    return (
        <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Define tu acción {index + 1}</h4>
            <div className="space-y-4 p-3 border rounded-md bg-background">
                <div>
                    <Label htmlFor={`action${index}`}>Acción concreta:</Label>
                    <Textarea id={`action${index}`} value={action.action} onChange={e => handleActionChange(index, 'action', e.target.value)}/>
                </div>
                
                <div>
                    <Label>Coraje requerido:</Label>
                    <p className="text-xs text-muted-foreground">Bajo: 1, Medio: 2, Alto: 3</p>
                    <RadioGroup value={action.courage} onValueChange={v => handleActionChange(index, 'courage', v)} className="flex gap-4 mt-1">
                        <div className="flex items-center gap-1"><RadioGroupItem value="1" id={`c${index}-1`}/><Label htmlFor={`c${index}-1`} className="font-normal">1</Label></div>
                        <div className="flex items-center gap-1"><RadioGroupItem value="2" id={`c${index}-2`}/><Label htmlFor={`c${index}-2`} className="font-normal">2</Label></div>
                        <div className="flex items-center gap-1"><RadioGroupItem value="3" id={`c${index}-3`}/><Label htmlFor={`c${index}-3`} className="font-normal">3</Label></div>
                    </RadioGroup>
                </div>
                
                <div>
                    <Label htmlFor={`value-${index}`}>¿Qué valor representa esta acción?</Label>
                     <Select value={action.value} onValueChange={v => handleActionChange(index, 'value', v)}>
                        <SelectTrigger id={`value-${index}`}><SelectValue placeholder="Elige un valor..." /></SelectTrigger>
                        <SelectContent>
                            {valueOptions.map(opt => <SelectItem key={opt.id} value={opt.label}>{opt.label}</SelectItem>)}
                            <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                    {action.value === 'Otro' && (
                      <Textarea 
                        value={action.otherValue || ''} 
                        onChange={e => handleActionChange(index, 'otherValue', e.target.value)} 
                        placeholder="Describe el valor personalizado"
                        className="mt-2"
                      />
                    )}
                </div>
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={back} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>{index === 2 ? 'Revisar mi hoja de ruta' : 'Siguiente Acción'}</Button>
            </div>
        </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>Una vida con sentido no se construye en grandes saltos, sino en pequeños actos valientes. Hoy vas a elegir tres acciones que reflejen quién eres y hacia dónde quieres ir.</p>
            <Button onClick={next}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elige tu valor guía</h4>
             <RadioGroup value={chosenValue} onValueChange={setChosenValue}>
                <Accordion type="single" collapsible className="w-full">
                    {valueOptions.map(opt => (
                        <AccordionItem value={opt.id} key={opt.id} className="border-b">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value={opt.label} id={opt.id} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                                <AccordionTrigger className="p-2 hover:no-underline [&>svg]:size-5"><Info className="h-4 w-4 text-muted-foreground" /></AccordionTrigger>
                            </div>
                            <AccordionContent className="text-sm text-muted-foreground pl-9 pr-4 pb-3">{opt.description}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                 <div className="flex items-center space-x-2 pt-2">
                    <RadioGroupItem value="Otro" id="val-other" />
                    <Label htmlFor="val-other" className="font-normal">Otro</Label>
                </div>
            </RadioGroup>
            {chosenValue === 'Otro' && <Textarea value={otherChosenValue} onChange={e => setOtherChosenValue(e.target.value)} placeholder="Describe tu valor personalizado..." className="mt-2 ml-6" />}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={back} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next} disabled={!chosenValue.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return renderActionStep(0);
      case 3:
        return renderActionStep(1);
      case 4:
        return renderActionStep(2);
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-center">Resumen de tu Hoja de Ruta Valiente</h4>
            <div className="space-y-4">
              {actions.filter(a => a.action.trim()).map((action, index) => (
                <div key={index} className="p-3 border rounded-md bg-background/50">
                    <p><strong>Acción {index + 1}:</strong> {action.action}</p>
                    <p className="text-sm"><strong>Coraje Requerido:</strong> {action.courage}/3</p>
                    <p className="text-sm"><strong>Valor Asociado:</strong> {action.value === 'Otro' ? action.otherValue : action.value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={back} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Guardar en mi hoja de ruta
              </Button>
            </div>
          </form>
        );
      case 6:
        return (
            <div className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <h4 className="font-semibold text-lg">Hoja de Ruta Guardada</h4>
                <p className="italic text-muted-foreground">"Tus decisiones crean tu camino. No importa si es grande o pequeño: cada paso desde el propósito cuenta."</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">Crear otra hoja de ruta</Button>
            </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && 
            <CardDescription className="pt-2">
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
        }
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
