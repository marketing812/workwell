
"use client";

import { useState, type FormEvent, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetoursInventoryExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';

interface DetoursInventoryExerciseProps {
  content: DetoursInventoryExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const frequentDetours = [
  { id: 'detour-yes', label: 'Decir “sí” por compromiso, aunque quería decir “no”.' },
  { id: 'detour-social', label: 'Revisar redes sociales como escape.' },
  { id: 'detour-eating', label: 'Comer sin hambre por ansiedad o aburrimiento.' },
  { id: 'detour-postpone', label: 'Posponer decisiones importantes por miedo.' },
  { id: 'detour-thoughts', label: 'Pensamientos como: “No soy suficiente”, “Tengo que hacerlo perfecto”, “Si fallo, me rechazarán”.' },
  { id: 'detour-toxic-env', label: 'Rodearme de personas o ambientes que no me hacen bien.' },
];

const valueOptions = [
    { id: 'val-auth', label: 'Autenticidad (ser yo mismo/a)'},
    { id: 'val-care', label: 'Salud y autocuidado'},
    { id: 'val-connect', label: 'Conexión con los demás'},
    { id: 'val-calm', label: 'Calma y equilibrio'},
    { id: 'val-respect', label: 'Respeto hacia mí mismo/a'},
    { id: 'val-growth', label: 'Crecimiento personal'},
    { id: 'val-responsibility', label: 'Responsabilidad' },
    { id: 'val-freedom', label: 'Libertad' },
    { id: 'val-security', label: 'Seguridad' },
];

const emotionOptions = [
    { id: 'emo-guilt', label: 'Culpa'},
    { id: 'emo-frustration', label: 'Frustración'},
    { id: 'emo-sadness', label: 'Tristeza'},
    { id: 'emo-relief', label: 'Alivio momentáneo'},
    { id: 'emo-anxiety', label: 'Ansiedad'},
    { id: 'emo-shame', label: 'Vergüenza'},
    { id: 'emo-disconnect', label: 'Desconexión' },
    { id: 'emo-resentment', label: 'Resentimiento' },
    { id: 'emo-emptiness', label: 'Indiferencia / vacío' },
];

const partOptions = [
    { id: 'part-insecure', label: 'Mi parte insegura'},
    { id: 'part-fearful', label: 'Mi parte que teme al rechazo'},
    { id: 'part-pleaser', label: 'Mi parte que busca aprobación'},
    { id: 'part-controlling', label: 'Mi parte que quiere sentirse en control'},
    { id: 'part-avoider', label: 'Mi parte que evita el dolor o el conflicto' },
    { id: 'part-needy', label: 'Mi parte que necesita afecto o reconocimiento' },
    { id: 'part-lonely', label: 'Mi parte que se siente sola' },
    { id: 'part-failure-fear', label: 'Mi parte que teme fracasar' },
];


interface Reflection {
    values: Record<string, boolean>;
    emotions: Record<string, boolean>;
    parts: Record<string, boolean>;
    otherValue: string;
    otherEmotion: string;
    otherPart: string;
}

export function DetoursInventoryExercise({ content, pathId, onComplete }: DetoursInventoryExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [detours, setDetours] = useState<Record<string, boolean>>({});
  const [otherDetour, setOtherDetour] = useState('');
  
  const [reflections, setReflections] = useState<Record<string, Partial<Reflection>>>({});

  const [commitment, setCommitment] = useState('');
  const [reconnectionGestures, setReconnectionGestures] = useState('');
  
  const selectedDetours = useMemo(() => {
      const common = frequentDetours.filter(d => detours[d.id]);
      if (detours['detour-other'] && otherDetour) {
          common.push({ id: 'detour-other', label: otherDetour });
      }
      return common;
  }, [detours, otherDetour]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleReflectionCheckboxChange = (detourId: string, field: 'values' | 'emotions' | 'parts', subfield: string, checked: boolean) => {
    setReflections(prev => ({
        ...prev,
        [detourId]: {
            ...(prev[detourId] || {}),
            [field]: {
                ...(prev[detourId]?.[field] || {}),
                [subfield]: checked,
            }
        }
    }));
  };

  const handleOtherReflectionTextChange = (detourId: string, field: 'otherValue' | 'otherEmotion' | 'otherPart', value: string) => {
      setReflections(prev => ({
          ...prev,
          [detourId]: {
              ...(prev[detourId] || {}),
              [field]: value
          }
      }));
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const selectedDetours = frequentDetours.filter(d => detours[d.id]);
    if(detours['detour-other'] && otherDetour) {
        selectedDetours.push({id: 'detour-other', label: otherDetour});
    }

    if (!commitment.trim() || !reconnectionGestures.trim()) {
        toast({ title: 'Ejercicio Incompleto', description: 'Por favor, completa el compromiso y los gestos de reconexión.', variant: 'destructive' });
        return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;

    selectedDetours.forEach(detour => {
        const reflection = reflections[detour.id];
        if (!reflection) return;

        const selectedValues = valueOptions.filter(v => reflection.values?.[v.id]).map(v => v.label);
        if(reflection.values?.['val-other'] && reflection.otherValue) selectedValues.push(reflection.otherValue);
        
        const selectedEmotions = emotionOptions.filter(em => reflection.emotions?.[em.id]).map(em => em.label);
        if(reflection.emotions?.['emo-other'] && reflection.otherEmotion) selectedEmotions.push(reflection.otherEmotion);

        const selectedParts = partOptions.filter(p => reflection.parts?.[p.id]).map(p => p.label);
        if(reflection.parts?.['part-other'] && reflection.otherPart) selectedParts.push(reflection.otherPart);

        notebookContent += `**Reflexión sobre el desvío: "${detour.label}"**\n`;
        notebookContent += ` - Valores afectados: ${selectedValues.length > 0 ? selectedValues.join(', ') : 'No especificados.'}\n`;
        notebookContent += ` - Emociones que deja: ${selectedEmotions.length > 0 ? selectedEmotions.join(', ') : 'No especificadas.'}\n`;
        notebookContent += ` - Parte de mí que se activa: ${selectedParts.length > 0 ? selectedParts.join(', ') : 'No especificada.'}\n\n`;
    });
    
    notebookContent += `**Mi compromiso de cambio:**\nSi... entonces... ${commitment || 'No especificado.'}\n\n`;
    notebookContent += `**Mis gestos de reconexión:**\n${reconnectionGestures || 'No especificados.'}`;
    
    addNotebookEntry({ title: `Inventario de Desvíos`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu inventario ha sido guardado." });
    onComplete();
    nextStep(); // Move to confirmation
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // NEW Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p>A veces no es que no sepas lo que quieres… sino que hay interferencias que te desvían del camino. Hoy vamos a ponerles nombre para empezar a recuperar dirección.</p>
            <Button onClick={nextStep}>Empezar mi inventario <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // NEW Example
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Antes de mirar tus propios desvíos, observa un ejemplo realista. No es para copiarlo, sino para inspirarte en cómo se identifica un desvío, el valor que toca y la reflexión que ayuda a reconectar.</p>
            <div className="p-4 border rounded-md bg-background/50 text-left text-sm">
                <p><strong>Desvío:</strong> Postergar el autocuidado por miedo a parecer egoísta.</p>
                <p><strong>Valor afectado:</strong> Autorrespeto y bienestar.</p>
                <p><strong>Reflexión:</strong> Cada vez que dejo de cuidarme para que los demás no me juzguen, me alejo de mi autenticidad.</p>
            </div>
            <p className="text-sm italic text-muted-foreground pt-2">Piensa: ¿qué cosas en tu vida se parecen a esto?</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} className="w-auto">Ir a mis desvíos <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2: // Frequent detours
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Tus desvíos más frecuentes</h4>
            <p className="text-sm text-muted-foreground">Marca o escribe los desvíos que reconoces en tu vida actual. Elige máximo 3 para trabajar hoy.</p>
            <div className="space-y-2">
                {frequentDetours.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} checked={!!detours[opt.id]} onCheckedChange={c => setDetours(p => ({...p, [opt.id]: !!c}))} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
                 <div className="flex items-center space-x-2">
                    <Checkbox id="detour-other" checked={!!detours['detour-other']} onCheckedChange={c => setDetours(p => ({...p, 'detour-other': !!c}))} />
                    <Label htmlFor="detour-other" className="font-normal">Otro:</Label>
                </div>
                {detours['detour-other'] && <Textarea value={otherDetour} onChange={e => setOtherDetour(e.target.value)} />}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={() => {
                if (selectedDetours.length === 0) {
                  toast({
                    title: "Selección requerida",
                    description: "Por favor, marca al menos un desvío para continuar.",
                    variant: "destructive"
                  });
                  return;
                }
                nextStep();
              }} className="w-auto">Continuar</Button>
            </div>
          </div>
        );
      case 3: // Reflection on one or more detours
        return (
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 2: Profundiza en tus desvíos</h4>
                {selectedDetours.map(detour => (
                    <Accordion key={detour.id} type="single" collapsible className="w-full border rounded-md p-2 bg-background/50">
                        <AccordionItem value={detour.id}>
                            <AccordionTrigger className="font-semibold text-primary">{detour.label}</AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>¿Qué valor personal estás dejando de lado?</Label>
                                    {valueOptions.map(v => <div key={v.id} className="flex items-center space-x-2"><Checkbox id={`${detour.id}-${v.id}`} checked={!!reflections[detour.id]?.values?.[v.id]} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'values', v.id, !!c)} /><Label htmlFor={`${detour.id}-${v.id}`} className="font-normal">{v.label}</Label></div>)}
                                    <div className="flex items-center space-x-2"><Checkbox id={`${detour.id}-val-other`} checked={!!reflections[detour.id]?.values?.['val-other']} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'values', 'val-other', !!c)} /><Label htmlFor={`${detour.id}-val-other`} className="font-normal">Otro</Label></div>
                                    {reflections[detour.id]?.values?.['val-other'] && <Textarea value={reflections[detour.id]?.otherValue || ''} onChange={e => handleOtherReflectionTextChange(detour.id, 'otherValue', e.target.value)} placeholder="Escribe otro valor..."/>}
                                </div>
                                <div className="space-y-2">
                                    <Label>¿Qué sientes después de actuar así?</Label>
                                    {emotionOptions.map(e_opt => <div key={e_opt.id} className="flex items-center space-x-2"><Checkbox id={`${detour.id}-${e_opt.id}`} checked={!!reflections[detour.id]?.emotions?.[e_opt.id]} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'emotions', e_opt.id, !!c)} /><Label htmlFor={`${detour.id}-${e_opt.id}`} className="font-normal">{e_opt.label}</Label></div>)}
                                    <div className="flex items-center space-x-2"><Checkbox id={`${detour.id}-emo-other`} checked={!!reflections[detour.id]?.emotions?.['emo-other']} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'emotions', 'emo-other', !!c)} /><Label htmlFor={`${detour.id}-emo-other`} className="font-normal">Otro</Label></div>
                                    {reflections[detour.id]?.emotions?.['emo-other'] && <Textarea value={reflections[detour.id]?.otherEmotion || ''} onChange={e => handleOtherReflectionTextChange(detour.id, 'otherEmotion', e.target.value)} placeholder="Escribe otra emoción..."/>}
                                </div>
                                <div className="space-y-2">
                                    <Label>¿Qué parte de ti busca protección o alivio en ese desvío?</Label>
                                    {partOptions.map(p_opt => <div key={p_opt.id} className="flex items-center space-x-2"><Checkbox id={`${detour.id}-${p_opt.id}`} checked={!!reflections[detour.id]?.parts?.[p_opt.id]} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'parts', p_opt.id, !!c)} /><Label htmlFor={`${detour.id}-${p_opt.id}`} className="font-normal">{p_opt.label}</Label></div>)}
                                    <div className="flex items-center space-x-2"><Checkbox id={`${detour.id}-part-other`} checked={!!reflections[detour.id]?.parts?.['part-other']} onCheckedChange={c => handleReflectionCheckboxChange(detour.id, 'parts', 'part-other', !!c)} /><Label htmlFor={`${detour.id}-part-other`} className="font-normal">Otro</Label></div>
                                    {reflections[detour.id]?.parts?.['part-other'] && <Textarea value={reflections[detour.id]?.otherPart || ''} onChange={e => handleOtherReflectionTextChange(detour.id, 'otherPart', e.target.value)} placeholder="Describe otra parte de ti..."/>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep} className="w-auto">Ir al compromiso de cambio</Button>
                </div>
            </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Primer compromiso de cambio</h4>
            <p className="text-sm text-muted-foreground">Ahora toca pasar a la acción. Un pequeño gesto concreto puede ayudarte a reducir el desvío y volver a lo importante.</p>
            <p className="text-sm text-muted-foreground">Elige un gesto sencillo (1–3 minutos) formulado en positivo. Usa la estructura “si–entonces” para hacerlo más fácil.</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p>Ejemplo: Si me pongo a revisar redes por soledad, entonces enviaré un mensaje sincero a alguien cercano.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="commitment-si">Escribe aquí tu gesto de cambio en formato: Si… entonces…</Label>
                <Textarea id="commitment-si" value={commitment} onChange={e => setCommitment(e.target.value)} placeholder="Escribe aquí tu gesto de cambio en formato: Si… entonces…" />
            </div>
            <p className="text-sm text-muted-foreground italic">Mejor un paso pequeño y seguro que uno grande que nunca darás.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} className="w-auto" disabled={!commitment.trim()}>Siguiente paso</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Guarda tus gestos valiosos</h4>
            <p className="text-sm text-muted-foreground">A veces, cuando más lo necesitamos, se nos olvidan esas pequeñas cosas que nos devuelven la calma y la conexión con lo que importa.</p>
            <p className="text-sm text-muted-foreground">Aquí puedes crear tu kit personal de reconexión: una lista de gestos sencillos que siempre te ayudan a volver a ti cuando sientes que te desvías.</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>Ejemplo guía: Poner mi canción favorita y moverme un rato. Escribir tres cosas por las que me siento agradecido/a.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="reconnection-gestures">Escribe aquí tu gesto de reconexión:</Label>
                <Textarea id="reconnection-gestures" value={reconnectionGestures} onChange={e => setReconnectionGestures(e.target.value)} placeholder="Salir a caminar sin móvil durante 10 minutos. Respirar profundo tres veces y repetirme: “Estoy aquí, estoy a salvo”." />
            </div>
            <p className="text-sm text-muted-foreground italic">No hace falta que sean grandes cambios. Lo importante es que sean gestos simples y realistas, que de verdad puedas aplicar en tu día a día.</p>
            <p className="text-sm text-muted-foreground font-semibold text-center">Cada gesto guardado será un recordatorio de tu fuerza y de tu camino.</p>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit" className="w-auto"><Save className="mr-2 h-4 w-4"/>Guardar en Mis gestos de reconexión</Button>
            </div>
          </form>
        );
      case 6: // Confirmation
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Inventario Guardado!</h4>
                <p className="text-muted-foreground">Tu inventario de desvíos ha sido guardado. Puedes consultarlo en tu Cuaderno Terapéutico cuando necesites recordar tu compromiso y tus gestos de reconexión.</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={() => setStep(0)} variant="outline">Hacer otro registro</Button>
                </div>
            </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
          <audio controls controlsList="nodownload" className="w-full">
            <source src="https://workwellfut.com/audios/ruta7/tecnicas/Ruta7semana2tecnica1.mp3" type="audio/mp3" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

    