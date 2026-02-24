
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SymbolicSupportCircleExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface SymbolicSupportCircleExerciseProps {
  content: SymbolicSupportCircleExerciseContent;
  pathId: string;
  onComplete: () => void;
}

interface Pillar {
    name: string;
    contribution: string;
    careAction: string;
}

export default function SymbolicSupportCircleExercise({ content, pathId, onComplete }: SymbolicSupportCircleExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [pillars, setPillars] = useState<Pillar[]>(Array(4).fill({ name: '', contribution: '', careAction: ''}));
  const [isSaved, setIsSaved] = useState(false);

  const handlePillarChange = <K extends keyof Pillar>(index: number, field: K, value: Pillar[K]) => {
      const newPillars = [...pillars];
      newPillars[index] = { ...newPillars[index], [field]: value };
      setPillars(newPillars);
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledPillars = pillars.filter(p => p.name.trim() !== '');
    if (filledPillars.length === 0) {
      toast({ title: 'Círculo vacío', description: 'Por favor, añade al menos un pilar a tu círculo de sostén.', variant: 'destructive' });
      return;
    }
    let notebookContent = `**${content.title}**\n\n`;
    filledPillars.forEach(p => {
        notebookContent += `**Pilar de mi red: ${p.name}**\n`;
        notebookContent += `Pregunta: Palabra que describe lo que aporta | Respuesta: ${p.contribution || 'No especificado'}\n`;
        notebookContent += `Pregunta: Gesto concreto para cuidar el vínculo | Respuesta: ${p.careAction || 'No especificado'}\n\n`;
    });
    addNotebookEntry({ title: 'Mi Círculo de Sostén Simbólico', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Círculo Guardado' });
    setIsSaved(true);
    onComplete();
    setStep(prev => prev + 1); // Move to confirmation
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setPillars(Array(4).fill({ name: '', contribution: '', careAction: ''}));
    setIsSaved(false);
  };

  const renderStep = () => {
    const filledPillars = pillars.filter(p => p.name.trim() !== '');
    
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Tu círculo de sostén es como un “mapa emocional” de las personas y recursos que te apoyan. No tiene por qué ser perfecto ni incluir solo personas cercanas: pueden estar amigos, familiares, profesionales, comunidades o incluso hábitos que te sostienen.</p>
            <Button onClick={nextStep}>Empezar a dibujar mi círculo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Elige a tus pilares</h4>
            <p className="text-sm text-muted-foreground">Escribe los nombres o roles de quienes forman parte de tu red. Ejemplo: “Mi pareja”, “Mi vecina de confianza”, “Mi terapeuta”, “Grupo de senderismo”.</p>
            <div className="space-y-3">
              {pillars.map((p, i) => (
                <Input key={i} value={p.name} onChange={e => handlePillarChange(i, 'name', e.target.value)} placeholder={`Pilar ${i + 1}...`} disabled={isSaved} />
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={filledPillars.length === 0}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-6 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2 y 3: Representa y Cuida tu Red</h4>
            <p className="text-sm text-muted-foreground">Para cada pilar, define qué te aporta y cómo puedes cuidar tú esa relación.</p>
            {filledPillars.map((p, i) => (
              <div key={i} className="p-4 border rounded-md bg-background/50 space-y-3">
                <p className="font-semibold">{p.name}</p>
                <div className="space-y-1">
                  <Label htmlFor={`contribution-${i}`}>¿Qué palabra describe lo que te aporta?</Label>
                  <Textarea id={`contribution-${i}`} value={p.contribution} onChange={e => handlePillarChange(i, 'contribution', e.target.value)} placeholder="Ej: apoyo, calma, diversión..." disabled={isSaved} rows={1}/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`care-${i}`}>¿Qué gesto concreto harás para cuidar el vínculo?</Label>
                  <Textarea id={`care-${i}`} value={p.careAction} onChange={e => handlePillarChange(i, 'careAction', e.target.value)} placeholder="Ej: Comer juntos una vez al mes..." disabled={isSaved} rows={2}/>
                </div>
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit" disabled={isSaved}>
                <Save className="mr-2 h-4 w-4" /> Guardar Círculo
              </Button>
            </div>
          </form>
        );
       case 3: // Confirmation
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Círculo Guardado</h4>
            <p className="text-muted-foreground">"Este círculo es tu recordatorio de que no tienes que sostenerte solo o sola. Y también, de que tú eres parte del círculo de alguien más."</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/ruta11/tecnicas/Ruta11semana4tecnica2.mp3`} type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
