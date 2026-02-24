
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, PlusCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SupportMapExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/UserContext';

interface SupportMapExerciseProps {
  content: SupportMapExerciseContent;
  pathId: string;
  pathTitle: string; 
  moduleTitle: string; 
  onComplete: () => void;
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
    { id: 'practico', label: 'Práctico: te ayuda con tareas, gestiones o recursos materiales.' },
    { id: 'validacion', label: 'Validación/Consejo: te orienta o comparte experiencias que te sirven de guía.' },
];


export default function SupportMapExercise({ content, pathId, pathTitle, moduleTitle, onComplete }: SupportMapExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState<Relation[]>(() => 
    Array.from({ length: 5 }, () => ({ name: '', supportType: { emocional: false, practico: false, validacion: false }, quality: 3 }))
  );
  
  const handleRelationNameChange = (index: number, value: string) => {
    const newRelations = [...relations];
    newRelations[index].name = value;
    setRelations(newRelations);
  };
  
  const addRelationField = () => {
    setRelations(prev => [...prev, { name: '', supportType: { emocional: false, practico: false, validacion: false }, quality: 3 }]);
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
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  
  const resetExercise = () => {
    setStep(0);
    setRelations(Array.from({ length: 5 }, () => ({ name: '', supportType: { emocional: false, practico: false, validacion: false }, quality: 3 })));
    setReflection('');
    setIsSaved(false);
  };
  
  const handleSave = () => {
    const filledRelations = relations.filter(r => r.name.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: 'Mapa vacío', description: 'Añade al menos una persona para guardar tu mapa.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**${content.title}**\n\n`;
    filledRelations.forEach(r => {
        const selectedSupport = Object.entries(r.supportType)
            .filter(([, checked]) => checked)
            .map(([key]) => supportTypes.find(st => st.id === key)?.label.split(':')[0].trim())
            .join(', ');

        notebookContent += `**Relación: ${r.name}**\n`;
        notebookContent += `Pregunta: Tipo de apoyo que me ofrece | Respuesta: ${selectedSupport || 'No especificado'}\n`;
        notebookContent += `Pregunta: Calidad del apoyo (1-5) | Respuesta: ${r.quality}/5\n\n`;
    });
    notebookContent += `--- \n**Reflexión Final**\n\n`;
    notebookContent += `Pregunta: ¿Qué he descubierto sobre mi red de apoyo? | Respuesta: ${reflection || 'Sin reflexión.'}\n`;

    addNotebookEntry({ 
      title: 'Mi Mapa de Relaciones y Apoyo', 
      content: notebookContent, 
      pathId: pathId,
      ruta: pathTitle,
      userId: user?.id,
    });

    toast({ title: 'Mapa Guardado', description: 'Tu mapa se ha guardado en el Cuaderno Terapéutico.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Esta técnica te ayudará a visualizar de forma clara tu red de apoyo y reflexionar sobre cómo te relacionas con las personas que forman parte de ella.</p>
            <Button onClick={nextStep}>Empezar mi mapa <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 1: Identifica a tus personas clave</h4>
                <div className="space-y-3">
                  {relations.map((rel, index) => (
                    <Input key={index} value={rel.name} onChange={e => handleRelationNameChange(index, e.target.value)} placeholder={`Persona ${index + 1}...`} />
                  ))}
                </div>
                <Button onClick={addRelationField} variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir otra persona
                </Button>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
                 </div>
            </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Clasifica el tipo de apoyo</h4>
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
            <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Paso 4: Reflexión y síntesis</h4>
                <div className="space-y-2">
                    <Label htmlFor="reflection">Observa tu mapa y responde: ¿Tienes apoyos muy concentrados en una sola persona? ¿Faltan ciertos tipos de apoyo? ¿Hay vínculos que sería bueno cuidar más?</Label>
                    <Textarea id="reflection" value={reflection} onChange={e => setReflection(e.target.value)} />
                </div>
                <div className="flex justify-between w-full"><Button onClick={prevStep} variant="outline">Atrás</Button><Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar y continuar</Button></div>
            </div>
        );
       case 5:
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Mapa Guardado</h4>
                <p>Tu mapa ha sido guardado. Puedes volver a él cuando necesites recordar quiénes te sostienen.</p>
                <Button onClick={resetExercise} variant="outline">Hacer otro registro</Button>
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
