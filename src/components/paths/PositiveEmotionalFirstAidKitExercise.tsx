
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PositiveEmotionalFirstAidKitExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface PositiveEmotionalFirstAidKitExerciseProps {
  content: PositiveEmotionalFirstAidKitExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const resourceCategories = {
  persona: {
    label: 'Persona (Red de apoyo)',
    description: 'La conexión social activa circuitos cerebrales de calma y seguridad.',
    options: ['Llamar a un amigo o amiga', 'Escribir a un familiar', 'Quedar para un café'],
  },
  actividad: {
    label: 'Actividad (Placer o logro)',
    description: 'Actividades gratificantes o de logro liberan dopamina y serotonina.',
    options: ['Caminar', 'Cocinar tu plato favorito', 'Escuchar un pódcast interesante', 'Practicar un hobby'],
  },
  musica: {
    label: 'Música',
    description: 'La música modula el sistema límbico y puede cambiar tu estado emocional en minutos.',
    options: ['Lista favorita', 'Canción que me da energía', 'Música relajante'],
  },
  gesto: {
    label: 'Gesto (Sonrisa o risa)',
    description: 'Reír o sonreír libera endorfinas y reduce tensión.',
    options: ['Ver un vídeo divertido', 'Recordar una anécdota graciosa', 'Sonreír conscientemente'],
  },
  frase: {
    label: 'Frase (Autoinstrucción)',
    description: 'Hablarte de forma constructiva cambia cómo interpretas una situación.',
    options: ['Soy capaz de superar esto.', 'Esto también pasará.', 'Puedo con lo que venga, paso a paso.'],
  },
};

type ResourceKey = keyof typeof resourceCategories;

interface Selections {
  persona: string;
  actividad: string;
  musica: string;
  gesto: string;
  frase: string;
}

const activationOptions = ['Guardar en favoritos del móvil', 'Escribirlo en mi cuaderno terapéutico', 'Tenerlo en un post-it visible'];

export default function PositiveEmotionalFirstAidKitExercise({ content, pathId, onComplete }: PositiveEmotionalFirstAidKitExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({ persona: '', actividad: '', musica: '', gesto: '', frase: '' });
  const [otherValues, setOtherValues] = useState<Partial<Selections>>({});
  const [personalization, setPersonalization] = useState<Record<ResourceKey, { why: string; how: string; otherHow: string; }>>({
    persona: { why: '', how: '', otherHow: '' },
    actividad: { why: '', how: '', otherHow: '' },
    musica: { why: '', how: '', otherHow: '' },
    gesto: { why: '', how: '', otherHow: '' },
    frase: { why: '', how: '', otherHow: '' },
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectionChange = (category: ResourceKey, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleOtherChange = (category: ResourceKey, value: string) => {
    setOtherValues(prev => ({ ...prev, [category]: value }));
  };
  
  const handlePersonalizationChange = (category: ResourceKey, field: 'why' | 'how' | 'otherHow', value: string) => {
    setPersonalization(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleSave = () => {
    const finalSelections = Object.entries(selections).map(([key, value]) => {
        const finalValue = value === 'Otro' ? otherValues[key as ResourceKey] : value;
        const finalHow = personalization[key as ResourceKey].how === 'Otro' ? personalization[key as ResourceKey].otherHow : personalization[key as ResourceKey].how;
        return { category: resourceCategories[key as ResourceKey].label, value: finalValue, why: personalization[key as ResourceKey].why, how: finalHow };
    }).filter(s => s.value);

    if (finalSelections.length === 0) {
        toast({ title: 'Botiquín vacío', description: 'Por favor, selecciona y personaliza al menos un recurso.', variant: 'destructive' });
        return;
    }

    let notebookContent = `**${content.title}**\n\n**Mi Botiquín Emocional Positivo:**\n\n`;
    finalSelections.forEach(s => {
        notebookContent += `**Recurso: ${s.value}** (${s.category})\n`;
        notebookContent += `Pregunta: ¿Por qué me ayuda? | Respuesta: ${s.why || 'No especificado.'}\n`;
        notebookContent += `Pregunta: ¿Cómo lo activaré? | Respuesta: ${s.how || 'No especificado.'}\n\n`;
    });

    addNotebookEntry({ title: 'Mi Botiquín Emocional Positivo', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Botiquín Guardado', description: 'Tu botiquín emocional ha sido guardado.' });
    setIsSaved(true);
    onComplete();
    setStep(4); // Go to summary
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setSelections({ persona: '', actividad: '', musica: '', gesto: '', frase: '' });
    setOtherValues({});
    setPersonalization({
        persona: { why: '', how: '', otherHow: '' },
        actividad: { why: '', how: '', otherHow: '' },
        musica: { why: '', how: '', otherHow: '' },
        gesto: { why: '', how: '', otherHow: '' },
        frase: { why: '', how: '', otherHow: '' },
      });
    setIsSaved(false);
  };
  
  const renderStepContent = () => {
    const finalSelections = Object.fromEntries(
        Object.entries(selections).map(([key, value]) => [
            key,
            value === 'Otro' ? otherValues[key as ResourceKey] : value,
        ])
    );
      
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">¿Alguna vez has tenido un día difícil y, de repente, algo pequeño —una charla con alguien querido, una canción, un paseo— te cambió el estado de ánimo? Con este ejercicio vas a reunir esas estrategias en un solo lugar: tu Botiquín Emocional Positivo, listo para usar cuando lo necesites.</p>
            <Button onClick={() => setStep(1)}>Crear mi botiquín</Button>
          </div>
        );
      case 1: // Resource Selection
        return (
            <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 1: Elige tus recursos</h4>
                <p className="text-sm text-muted-foreground">Cada recurso está basado en estrategias que tu cerebro reconoce como calmantes o estimulantes. Selecciona al menos uno de cada categoría.</p>
                {Object.entries(resourceCategories).map(([key, category]) => (
                    <div key={key} className="space-y-2">
                        <Label className="font-semibold">{category.label}</Label>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                        <RadioGroup value={selections[key as ResourceKey]} onValueChange={(value) => handleSelectionChange(key as ResourceKey, value)}>
                            {category.options.map(opt => <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`${key}-${opt}`} /><Label htmlFor={`${key}-${opt}`} className="font-normal">{opt}</Label></div>)}
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Otro" id={`${key}-other`} /><Label htmlFor={`${key}-other`} className="font-normal">Otro</Label></div>
                        </RadioGroup>
                        {selections[key as ResourceKey] === 'Otro' && <Input value={otherValues[key as ResourceKey] || ''} onChange={e => handleOtherChange(key as ResourceKey, e.target.value)} placeholder="Escribe tu opción personalizada" className="mt-2 ml-6" />}
                    </div>
                ))}
                <div className="flex justify-between mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={() => setStep(2)} className="w-full mt-4">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        );
      case 2: // Personalization
        return (
            <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
                 <h4 className="font-semibold text-lg">Paso 2: Personaliza tu botiquín</h4>
                 <p className="text-sm text-muted-foreground">Haz que cada recurso sea tuyo: cuanta más claridad tengas, más fácil será aplicarlo.</p>
                 {Object.entries(selections).filter(([, value]) => value).map(([key, value]) => (
                    <div key={key} className="p-3 border rounded-md space-y-3 bg-background">
                        <p className="font-medium text-primary">{finalSelections[key as ResourceKey]}</p>
                        <div className="space-y-1">
                            <Label htmlFor={`why-${key}`}>¿Por qué te ayuda?</Label>
                            <Textarea id={`why-${key}`} value={personalization[key as ResourceKey].why} onChange={e => handlePersonalizationChange(key as ResourceKey, 'why', e.target.value)} placeholder="Ej: “Llamar a Marta me calma porque me escucha sin juzgar.”" rows={2}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`how-${key}`}>¿Cómo lo vas a activar?</Label>
                            <Select onValueChange={(val) => handlePersonalizationChange(key as ResourceKey, 'how', val)} value={personalization[key as ResourceKey].how}>
                                <SelectTrigger><SelectValue placeholder="Elige cómo activarlo..." /></SelectTrigger>
                                <SelectContent>
                                    {activationOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                             {personalization[key as ResourceKey].how === 'Otro' && <Textarea value={personalization[key as ResourceKey].otherHow} onChange={e => handlePersonalizationChange(key as ResourceKey, 'otherHow', e.target.value)} placeholder="Describe cómo lo activarás..." className="mt-2 ml-6"/>}
                        </div>
                    </div>
                 ))}
                 <div className="flex justify-between mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={() => setStep(3)} className="w-full mt-4">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                 </div>
            </div>
        );
      case 3: // Summary
        return (
            <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Tu botiquín listo</h4>
                 <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Recurso</TableHead>
                                <TableHead className="text-right">Estrategia de activación</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(selections).filter(([, value]) => value).map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">{resourceCategories[key as ResourceKey].label}</TableCell>
                                    <TableCell>{finalSelections[key as ResourceKey]}</TableCell>
                                    <TableCell className="text-right">{personalization[key as ResourceKey].how === 'Otro' ? personalization[key as ResourceKey].otherHow : personalization[key as ResourceKey].how}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
                 <p className="text-sm italic text-muted-foreground pt-2">“Tu botiquín ya está listo. Cada recurso es una herramienta de apoyo emocional diseñada para ti. Cuanto más lo uses, más automático será para tu mente recurrir a él en los momentos difíciles.”</p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={handleSave} className="w-full mt-4"><Save className="mr-2 h-4 w-4" /> Guardar mi botiquín</Button>
                </div>
            </div>
        );
      case 4: // Confirmation
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Botiquín Guardado</h4>
                <p className="text-muted-foreground">Tu botiquín emocional ha sido guardado. Puedes volver a consultarlo en tu Cuaderno Terapéutico cuando lo necesites.</p>
                <Button onClick={resetExercise} variant="outline">Crear otro botiquín</Button>
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
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta12/tecnicas/Ruta12semana4tecnica2.mp3`} type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
