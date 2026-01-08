
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SupportMapExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '../ui/slider';

interface SupportMapExerciseProps {
  content: SupportMapExerciseContent;
  pathId: string;
}

interface Relation {
    name: string;
    supportType: {
        emocional: boolean;
        practico: boolean;
        validacion: boolean;
    };
    quality: number;
}

const supportTypes = [
    { id: 'emocional', label: 'Emocional: te escucha, valida tus sentimientos, te acompaña.' },
    { id: 'practico', label: 'Práctico: te ayuda con tareas, gestiones o recursos.' },
    { id: 'validacion', label: 'Validación/Consejo: te orienta o comparte experiencias.' },
];

export function SupportMapExercise({ content, pathId }: SupportMapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState<Relation[]>(() => 
    Array(5).fill(null).map(() => ({ name: '', supportType: { emocional: false, practico: false, validacion: false }, quality: 3 }))
  );
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleRelationNameChange = (index: number, value: string) => {
    const newRelations = [...relations];
    newRelations[index].name = value;
    setRelations(newRelations);
  };

  const handleSupportTypeChange = (relationIndex: number, typeId: keyof Relation['supportType'], checked: boolean) => {
    const newRelations = [...relations];
    newRelations[relationIndex].supportType[typeId] = checked;
    setRelations(newRelations);
  };

  const handleQualityChange = (relationIndex: number, value: number[]) => {
      const newRelations = [...relations];
      newRelations[relationIndex].quality = value[0];
      setRelations(newRelations);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledRelations = relations.filter(r => r.name.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: "Mapa vacío", description: "Añade al menos una persona para guardar tu mapa.", variant: 'destructive' });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledRelations.forEach(r => {
        const selectedSupport = Object.entries(r.supportType)
            .filter(([, checked]) => checked)
            .map(([key]) => supportTypes.find(st => st.id === key)?.label.split(':')[0])
            .join(', ');
        notebookContent += `**Persona:** ${r.name}\n`;
        notebookContent += `- Tipo de apoyo: ${selectedSupport || 'No especificado'}\n`;
        notebookContent += `- Calidad percibida: ${r.quality}/5\n\n`;
    });
    notebookContent += `**Reflexión:**\n${reflection || 'Sin reflexión.'}`;
    
    addNotebookEntry({ title: 'Mi Mapa de Relaciones y Apoyo', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado', description: 'Tu mapa de relaciones se ha guardado en el cuaderno.' });
    setIsSaved(true);
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Saber quién está ahí para ti es como tener un mapa en mitad de un viaje: no garantiza que el camino sea fácil, pero sí que no tendrás que recorrerlo en soledad.</p>
            <p className="text-sm text-muted-foreground">Hoy vas a dibujar tu propio Mapa de Relaciones y Apoyo, para identificar qué personas forman tu red y de qué manera te sostienen.</p>
            <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Identifica a tus personas clave</h4>
            <p className="text-sm text-muted-foreground">Piensa en familiares, amistades, compañeros/as de trabajo, o cualquier persona con quien tengas un vínculo significativo.</p>
            {relations.map((rel, index) => (
              <Input key={index} value={rel.name} onChange={e => handleRelationNameChange(index, e.target.value)} placeholder={`Persona ${index + 1}... (Ej: Ana, Carlos, María)`} />
            ))}
            <div className="flex justify-end"><Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button></div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Clasifica el tipo de apoyo</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, selecciona qué tipo de apoyo recibes.</p>
            {relations.filter(r => r.name.trim()).map((rel, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-semibold">{rel.name}</p>
                <div className="space-y-2 mt-2">
                    {supportTypes.map(type => (
                        <div key={type.id} className="flex items-start space-x-2">
                            <Checkbox id={`support-${index}-${type.id}`} checked={rel.supportType[type.id as keyof Relation['supportType']]} onCheckedChange={checked => handleSupportTypeChange(index, type.id as keyof Relation['supportType'], !!checked)} />
                            <Label htmlFor={`support-${index}-${type.id}`} className="font-normal text-sm">{type.label}</Label>
                        </div>
                    ))}
                </div>
              </div>
            ))}
            <div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button></div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Valora la calidad del apoyo</h4>
            <p className="text-sm text-muted-foreground">Del 1 al 5, puntúa la calidad del apoyo (1 = muy bajo, 5 = muy alto). Recuerda: calidad significa que es genuino, consistente y respetuoso.</p>
            {relations.filter(r => r.name.trim()).map((rel, index) => (
              <div key={index} className="p-3 border rounded-md">
                <Label htmlFor={`quality-${index}`} className="font-semibold">{rel.name}: Nivel {rel.quality}</Label>
                <Slider id={`quality-${index}`} value={[rel.quality]} onValueChange={v => handleQualityChange(index, v)} min={1} max={5} step={1} className="mt-2"/>
              </div>
            ))}
            <div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button></div>
          </div>
        );
       case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Reflexión y síntesis</h4>
            <div className="space-y-2">
              <Label htmlFor="reflection">Observa tu mapa y responde:</Label>
              <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
                  <li>¿Tienes apoyos muy concentrados en una sola persona?</li>
                  <li>¿Faltan ciertos tipos de apoyo?</li>
                  <li>¿Hay vínculos que sería bueno cuidar más?</li>
              </ul>
              <Textarea id="reflection" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Ej: Me doy cuenta de que recibo mucho apoyo emocional de Ana, pero casi nada práctico..." />
            </div>
            <div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline" type="button">Atrás</Button><Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar y continuar</Button></div>
          </form>
        );
        case 5:
            return (
                <div className="p-4 text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">Mapa Guardado</h4>
                    <p className="text-muted-foreground">Tu mapa de relaciones se ha guardado. Puedes consultarlo en tu Cuaderno Terapéutico cuando lo necesites.</p>
                    <Button onClick={() => setStep(0)} variant="outline">Hacer otro mapa</Button>
                </div>
            );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
