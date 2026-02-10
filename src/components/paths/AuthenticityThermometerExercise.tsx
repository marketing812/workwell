
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { AuthenticityThermometerExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface AuthenticityThermometerExerciseProps {
  content: AuthenticityThermometerExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function AuthenticityThermometerExercise({ content, pathId, onComplete }: AuthenticityThermometerExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [relations, setRelations] = useState(Array(6).fill({ name: '', howIShow: '', whatIHide: '', whyIHide: '', authenticity: 5 }));
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const storageKey = `exercise-progress-${pathId}-authenticityThermometer`;

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setRelations(data.relations || Array(6).fill({ name: '', howIShow: '', whatIHide: '', whyIHide: '', authenticity: 5 }));
        setReflection(data.reflection || { q1: '', q2: '', q3: '', q4: '' });
        setStep(data.step || 0);
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { relations, reflection, step, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [relations, reflection, step, isSaved, storageKey, isClient]);


  const handleRelationChange = (index: number, field: string, value: any) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleReflectionChange = (field: string, value: string) => {
    setReflection(prev => ({...prev, [field]: value}));
  };

  const nextStep = () => {
    if (step === 1) { // When leaving the names step
      const filledRelationsCount = relations.filter(r => r.name.trim() !== '').length;
      if (filledRelationsCount < 4) {
        toast({
          title: "Se requieren más relaciones",
          description: "Por favor, completa los nombres de al menos 4 personas para continuar.",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    const filledRelations = relations.filter(r => r.name.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: 'Ejercicio Incompleto', description: 'Por favor, completa al menos una relación.', variant: 'destructive' });
      return;
    }
    
    let notebookContent = `**${content.title}**\n\n`;

    filledRelations.forEach(r => {
      notebookContent += `**Relación con: ${r.name}**\n`;
      notebookContent += `- Cómo me muestro: ${r.howIShow || 'No especificado.'}\n`;
      notebookContent += `- Qué me callo: ${r.whatIHide || 'No especificado.'}\n`;
      notebookContent += `- Por qué lo hago: ${r.whyIHide || 'No especificado.'}\n`;
      notebookContent += `- Nivel de autenticidad: ${r.authenticity}/10\n\n`;
    });

    notebookContent += `**Reflexión Integradora:**\n`;
    notebookContent += `- Vínculos más libres: ${reflection.q1 || 'No respondido.'}\n`;
    notebookContent += `- ¿Qué lo permite?: ${reflection.q2 || 'No respondido.'}\n`;
    notebookContent += `- Patrón en relaciones difíciles: ${reflection.q3 || 'No respondido.'}\n`;
    notebookContent += `- Próximo pequeño paso: ${reflection.q4 || 'No respondido.'}\n`;

    addNotebookEntry({ title: 'Mi Termómetro de Autenticidad', content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión ha sido guardada en el Cuaderno Terapéutico." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Piensa en hasta 6 personas con las que te relaciones de forma habitual. Para cada una, responderás con sinceridad a unas preguntas para medir tu nivel de autenticidad en ese vínculo.</p>
            <Button onClick={nextStep}>Empezar mi termómetro</Button>
          </div>
        );
      case 1: // Names
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Nombra tus relaciones</h4>
            <p className="text-sm text-muted-foreground">Escribe el nombre o inicial de hasta 6 personas de tu entorno (personal, laboral, etc.). Debes completar al menos 4.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relations.map((relation, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Persona {index + 1}</Label>
                  <Input id={`name-${index}`} value={relation.name} onChange={(e) => handleRelationChange(index, 'name', e.target.value)} />
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Detallar <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Details
        return (
          <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Mide tu autenticidad</h4>
             <p className="text-sm text-muted-foreground">Ahora, para cada persona que nombraste, responde con sinceridad.</p>
            {relations.filter(r => r.name.trim()).map((relation, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md bg-background">
                <h5 className="font-bold text-primary">{relation.name}</h5>
                <Label htmlFor={`how-${index}`}>¿Cómo me suelo mostrar con esta persona?</Label>
                <Textarea id={`how-${index}`} value={relation.howIShow} onChange={(e) => handleRelationChange(index, 'howIShow', e.target.value)} placeholder="Ej: complaciente, distante..."/>
                <Label htmlFor={`hide-${index}`}>¿Qué emociones suelo callarme o modificar?</Label>
                <Textarea id={`hide-${index}`} value={relation.whatIHide} onChange={(e) => handleRelationChange(index, 'whatIHide', e.target.value)} placeholder="Ej: tristeza, enfado..."/>
                <Label htmlFor={`why-${index}`}>¿Qué me lo impide?</Label>
                <Textarea id={`why-${index}`} value={relation.whyIHide} onChange={(e) => handleRelationChange(index, 'whyIHide', e.target.value)} placeholder="Ej: miedo a decepcionar..."/>
                <Label htmlFor={`auth-${index}`}>¿Qué tan auténtico/a me siento? {relation.authenticity}/10</Label>
                <Slider id={`auth-${index}`} value={[relation.authenticity]} onValueChange={(v) => handleRelationChange(index, 'authenticity', v[0])} max={10} step={1} />
              </div>
            ))}
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Ir a la reflexión <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Reflection
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
             <h4 className="font-semibold text-lg">Paso 3: Reflexión Integradora</h4>
             <p className="text-sm text-muted-foreground">Después de completar tus relaciones, responde a estas preguntas.</p>
             <div className="space-y-2">
                <Label>¿En qué tipo de vínculos me siento más libre para ser yo?</Label>
                <Textarea value={reflection.q1} onChange={(e) => handleReflectionChange('q1', e.target.value)} />
             </div>
              <div className="space-y-2">
                <Label>¿Qué me lo permite? (¿Hay confianza, escucha real, poco juicio?)</Label>
                <Textarea value={reflection.q2} onChange={(e) => handleReflectionChange('q2', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>¿Qué patrón detecto en las relaciones donde me cuesta más mostrarme auténtico/a?</Label>
                <Textarea value={reflection.q3} onChange={(e) => handleReflectionChange('q3', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>¿Qué pequeña acción podría probar para empezar a mostrarme un poco más como soy?</Label>
                <Textarea value={reflection.q4} onChange={(e) => handleReflectionChange('q4', e.target.value)} />
             </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar Ejercicio y Reflexión</Button>
             </div>
          </div>
        );
      case 4: // Saved
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Tu reflexión ha sido guardada en el Cuaderno Terapéutico. Puedes revisarla cuando quieras.</p>
            <Button onClick={() => {
                setStep(0);
                setIsSaved(false);
                setRelations(Array(6).fill({ name: '', howIShow: '', whatIHide: '', whyIHide: '', authenticity: 5 }));
                setReflection({ q1: '', q2: '', q3: '', q4: '' });
            }} variant="outline">Empezar de nuevo</Button>
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
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
            <div className="mt-2">
                <audio controls controlsList="nodownload" className="w-full h-10">
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
