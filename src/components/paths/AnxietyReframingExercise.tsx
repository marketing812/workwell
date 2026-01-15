
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface AnxietyReframingExerciseProps {
  content: ModuleContent;
  pathId: string;
  onComplete: () => void;
}

export function AnxietyReframingExercise({ content, pathId, onComplete }: AnxietyReframingExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  });

  const [isSaved, setIsSaved] = useState(false);
  const storageKey = `exercise-progress-${pathId}-anxietyReframing`;

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const data = JSON.parse(savedState);
        setResponses(data.responses || { q1: '', q2: '', q3: '', q4: '' });
        setStep(data.step || 0);
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      const stateToSave = { step, responses, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, responses, isSaved, storageKey]);


  const handleChange = (question: keyof typeof responses, value: string) => {
    setResponses(prev => ({ ...prev, [question]: value }));
  };

  const handleSave = () => {
    if (Object.values(responses).some(r => r.trim() === '')) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, responde a todas las preguntas para guardar tu reflexión.",
        variant: "destructive",
      });
      return;
    }
    
    const notebookContent = `
**Ejercicio: ${(content as any).title}**

**1. ¿Qué he descubierto sobre la manera en que mi mente anticipa y exagera escenarios?**
${responses.q1}

**2. ¿Qué me pasa cuando confundo posibilidad con probabilidad? ¿Qué efecto tiene en mis decisiones?**
${responses.q2}

**3. ¿Qué me ha servido más para tomar distancia de los pensamientos: la técnica STOP, el cuestionamiento de “¿y si…?” u otra estrategia personal?**
${responses.q3}

**4. ¿Qué compromiso quiero llevarme para el futuro cuando aparezca la ansiedad?**
${responses.q4}
`;

    addNotebookEntry({
      title: `Reflexión: ${(content as any).title}`,
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });
    
    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión ha sido guardada en tu Cuaderno Terapéutico.",
    });
    
    setIsSaved(true);
    onComplete();
    setStep(1); // Go to summary view
  };
  
  const resetExercise = () => {
    setStep(0);
    setResponses({ q1: '', q2: '', q3: '', q4: '' });
    setIsSaved(false);
    localStorage.removeItem(storageKey);
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-primary flex items-center gap-4">
          <Edit3 className="h-6 w-6" />
          <span>{(content as any).title}</span>
          {(content as any).audioUrl && (
            <audio
              src={(content as any).audioUrl}
              controls
              controlsList="nodownload"
              className="h-8 max-w-[200px] sm:max-w-xs"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-6 p-2">
            <p className="text-sm text-muted-foreground">Tómate unos minutos para integrar lo que has trabajado. No busques respuestas correctas, solo honestidad.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="q1">¿Qué he descubierto sobre la manera en que mi mente anticipa y exagera escenarios?</Label>
                <Textarea id="q1" value={responses.q1} onChange={(e) => handleChange('q1', e.target.value)} disabled={isSaved} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q2">¿Qué me pasa cuando confundo posibilidad con probabilidad? ¿Qué efecto tiene en mis decisiones?</Label>
                <Textarea id="q2" value={responses.q2} onChange={(e) => handleChange('q2', e.target.value)} disabled={isSaved} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q3">¿Qué me ha servido más para tomar distancia de los pensamientos: la técnica STOP, el cuestionamiento de “¿y si…?” u otra estrategia personal?</Label>
                <Textarea id="q3" value={responses.q3} onChange={(e) => handleChange('q3', e.target.value)} disabled={isSaved} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q4">¿Qué compromiso quiero llevarme para el futuro cuando aparezca la ansiedad? (ejemplo: “darme una pausa y observar antes de reaccionar”)</Label>
                <Textarea id="q4" value={responses.q4} onChange={(e) => handleChange('q4', e.target.value)} disabled={isSaved} />
              </div>
            </div>
            {!isSaved ? (
              <Button onClick={handleSave} className="w-full mt-4">
                <Save className="mr-2 h-4 w-4" /> Guardar Reflexión
              </Button>
            ) : (
              <div className="flex items-center justify-center p-3 mt-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
            )}
          </div>
        )}
        
        {step === 1 && (
           <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
            <h4 className="font-semibold text-lg">Resumen de tu Reflexión</h4>
            <div className="text-left p-4 border rounded-md bg-background/50 space-y-3 text-sm">
                <p><strong>Anticipación y exageración:</strong><br/>{responses.q1}</p>
                <p><strong>Posibilidad vs. Probabilidad:</strong><br/>{responses.q2}</p>
                <p><strong>Estrategia más útil:</strong><br/>{responses.q3}</p>
                <p><strong>Mi compromiso:</strong><br/>{responses.q4}</p>
            </div>
            <p className="text-xs italic text-muted-foreground pt-2">Vuelve a este resumen en tu cuaderno cuando necesites recordar el poder que tienes para observar tus pensamientos sin que te arrastren.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otra reflexión</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
