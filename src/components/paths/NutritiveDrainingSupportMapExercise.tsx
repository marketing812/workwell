"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NutritiveDrainingSupportMapExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface NutritiveDrainingSupportMapExerciseProps {
  content: NutritiveDrainingSupportMapExerciseContent;
  pathId: string;
}

interface Relation {
    name: string;
    sensation: 'nutritivo' | 'drenante' | 'neutral' | '';
}

export function NutritiveDrainingSupportMapExercise({ content, pathId }: NutritiveDrainingSupportMapExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState<Relation[]>(Array(5).fill({ name: '', sensation: '' }));
  const [reflection, setReflection] = useState({ approach: '', distance: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleRelationChange = <K extends keyof Relation>(index: number, field: K, value: Relation[K]) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledRelations = relations.filter(r => r.name.trim() !== '' && r.sensation.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: 'Ejercicio Incompleto', description: 'Completa al menos una relación con su sensación para guardar.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    notebookContent += "**Mapa de relaciones y su color:**\n";
    filledRelations.forEach(r => {
        let sensationLabel = r.sensation.charAt(0).toUpperCase() + r.sensation.slice(1);
        if (r.sensation === 'nutritivo') sensationLabel = 'Apoyo nutritivo (Verde)';
        if (r.sensation === 'drenante') sensationLabel = 'Apoyo drenante (Rojo)';
        if (r.sensation === 'neutral') sensationLabel = 'Neutral (Ámbar)';
        notebookContent += `- ${r.name}: ${sensationLabel}\n`;
    });
    notebookContent += `\n**Reflexión guiada:**\n`;
    notebookContent += `- Quiero acercarme a: ${reflection.approach || 'No respondido.'}\n`;
    notebookContent += `- Necesito tomar distancia de: ${reflection.distance || 'No respondido.'}\n`;

    addNotebookEntry({ title: 'Mapa de Apoyos Nutritivos y Drenantes', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado' });
    setIsSaved(true);
    setStep(prev => prev + 1); // Move to final screen
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1 – Introducción
        return (
          <div className="p-4 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Imagina que tu energía emocional es como una mochila. Algunas personas la llenan con ánimo, comprensión y apoyo… y otras, sin darse cuenta, la vacían. Esta técnica te ayudará a dibujar un mapa claro de quiénes son tus verdaderas “personas vitamina” y quiénes podrían estar drenando tu fuerza.</p>
            <Button onClick={nextStep}>Empezar mi semáforo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 2 – Paso 1: Lista inicial
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Lista inicial</h4>
            <Label>Escribe los nombres de las personas con las que interactúas de forma frecuente (familia, amistades, trabajo, comunidad).</Label>
            {relations.map((rel, index) => (
              <Input key={index} value={rel.name} onChange={e => handleRelationChange(index, 'name', e.target.value)} placeholder={`Persona ${index + 1}... (Ej: Ana, Carlos, Marta)`}/>
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Clasificar Sensación <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Pantalla 3 – Paso 2: Sensación después de interactuar
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Sensación después de interactuar</h4>
            <p className="text-sm text-muted-foreground">Para cada nombre, elige la sensación más habitual después de pasar tiempo con esa persona.</p>
            {relations.filter(r => r.name.trim()).map((rel, index) => (
              <div key={index} className="p-3 border rounded-md space-y-2 bg-background">
                <Label className="font-semibold">{rel.name}</Label>
                <RadioGroup value={rel.sensation} onValueChange={v => handleRelationChange(index, 'sensation', v as any)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nutritivo" id={`s-${index}-n`} /><Label htmlFor={`s-${index}-n`} className="font-normal">Me siento más tranquilo/a y animado/a</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="neutral" id={`s-${index}-neu`} /><Label htmlFor={`s-${index}-neu`} className="font-normal">Me siento igual que antes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="drenante" id={`s-${index}-d`} /><Label htmlFor={`s-${index}-d`} className="font-normal">Me siento agotado/a o tenso/a</Label></div>
                </RadioGroup>
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Clasificación Visual <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4 – Paso 3: Clasificación visual
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Clasificación visual</h4>
            <p className="text-sm text-muted-foreground">Ahora, marca a cada persona como Apoyo nutritivo (verde) o Apoyo drenante (rojo), según la sensación que predomina.</p>
            {relations.filter(r => r.name.trim()).map((rel, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-background">
                <Label className="font-semibold">{rel.name}</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant={rel.sensation === 'nutritivo' ? 'default' : 'outline'} className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleRelationChange(index, 'sensation', 'nutritivo')}>Verde</Button>
                  <Button size="sm" variant={rel.sensation === 'drenante' ? 'destructive' : 'outline'} onClick={() => handleRelationChange(index, 'sensation', 'drenante')}>Rojo</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Reflexión <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Pantalla 5 – Paso 4: Reflexión guiada
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Reflexión guiada</h4>
            <div className="space-y-2">
              <Label htmlFor="reflection-approach">¿A quién quieres acercarte más en las próximas semanas?</Label>
              <Textarea id="reflection-approach" value={reflection.approach} onChange={e => setReflection(p => ({ ...p, approach: e.target.value }))} placeholder="Ej: Quiero pasar más tiempo con Ana y mis tíos..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection-distance">¿De quién necesitas poner distancia o limitar el contacto?</Label>
              <Textarea id="reflection-distance" value={reflection.distance} onChange={e => setReflection(p => ({ ...p, distance: e.target.value }))} placeholder="Ej: Voy a limitar los cafés con Marta..." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Mapa</Button>
            </div>
          </form>
        );
      case 5: // Confirmation Screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Mapa Guardado</h4>
            <p className="text-muted-foreground">Tu mapa de relaciones se ha guardado. Puedes consultarlo en tu Cuaderno Terapéutico cuando lo necesites.</p>
            <Button onClick={() => { setStep(0); setIsSaved(false); }} variant="outline" className="w-full">Hacer otro mapa</Button>
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
                    <source src="https://workwellfut.com/audios/ruta11/tecnicas/Ruta11semana2tecnica1.mp3" type="audio/mp3" />
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
