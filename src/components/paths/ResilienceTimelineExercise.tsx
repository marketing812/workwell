
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, Save, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ResilienceTimelineExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ResilienceTimelineExerciseProps {
  content: ResilienceTimelineExerciseContent;
  pathId: string;
}

export function ResilienceTimelineExercise({ content, pathId }: ResilienceTimelineExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [situations, setSituations] = useState(['', '', '']);
  const [reflections, setReflections] = useState(Array(3).fill({ difficult: '', resources: '', learned: '', surprised: '' }));
  const [isSaved, setIsSaved] = useState(false);

  const handleSituationChange = (index: number, value: string) => {
    const newSituations = [...situations];
    newSituations[index] = value;
    setSituations(newSituations);
  };

  const handleReflectionChange = (index: number, field: string, value: string) => {
    const newReflections = [...reflections];
    newReflections[index] = { ...newReflections[index], [field]: value };
    setReflections(newReflections);
  };

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setSituations(['', '', '']);
    setReflections(Array(3).fill({ difficult: '', resources: '', learned: '', surprised: '' }));
    setIsSaved(false);
  };

  const handleSave = () => {
      const filledSituations = situations.map((sit, index) => ({ situation: sit, reflection: reflections[index] })).filter(item => item.situation.trim() !== '');

      if(filledSituations.length === 0) {
          toast({
              title: "Ejercicio incompleto",
              description: "Por favor, describe al menos una situación para guardar tu línea de tiempo.",
              variant: "destructive",
          });
          return;
      }
      
      let notebookContent = `**${content.title}**\n\n`;

      filledSituations.forEach(item => {
          notebookContent += `**Situación:** ${item.situation}\n`;
          notebookContent += `- Lo más difícil: ${item.reflection.difficult || 'No especificado.'}\n`;
          notebookContent += `- Recursos que usé: ${item.reflection.resources || 'No especificado.'}\n`;
          notebookContent += `- Lo que aprendí: ${item.reflection.learned || 'No especificado.'}\n`;
          notebookContent += `- Lo que me sorprendió de mí: ${item.reflection.surprised || 'No especificado.'}\n\n---\n\n`;
      });
      
      addNotebookEntry({ title: 'Mi Línea del Tiempo Resiliente', content: notebookContent, pathId });
      toast({ title: "Línea de Tiempo Guardada" });
      setIsSaved(true);
      next(); // Move to confirmation screen
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Todos hemos atravesado dificultades. Hoy te propongo mirar atrás no para quedarte ahí, sino para descubrir qué te ayudó a salir adelante.</p>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplos</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    <div>
                      <h4 className="font-semibold">Cambio de ciudad sin red de apoyo</h4>
                      <p className="text-sm text-muted-foreground">Lo más difícil fue sentirme sola. Usé rutinas como salir a caminar para darme estabilidad. Aprendí que puedo adaptarme y que el coraje silencioso sostiene desde dentro.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Ruptura amorosa inesperada</h4>
                      <p className="text-sm text-muted-foreground">Lo más difícil fue la pérdida de un futuro imaginado. Pedí ayuda a una terapeuta, escribí en un diario y me permití llorar. Aprendí que puedo sostenerme incluso cuando lo que soñaba se desvanece.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}>Empezar mi línea del tiempo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 1: Selecciona tres momentos difíciles</h4>
            <p className="text-sm text-muted-foreground">Elige 3 situaciones importantes en tu vida en las que sentiste que estabas en crisis o pasándolo mal.</p>
            {situations.map((sit, index) => (
              <Textarea key={index} value={sit} onChange={e => handleSituationChange(index, e.target.value)} placeholder={`Situación ${index + 1}`} />
            ))}
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next} disabled={situations.every(s => !s.trim())}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold">Paso 2: Reflexiona sobre cada una</h4>
            {situations.map((sit, index) => sit.trim() && (
              <div key={index} className="p-3 border rounded-md">
                <h5 className="font-medium">{sit}</h5>
                <div className="space-y-2 mt-2">
                  <Label>¿Qué fue lo más difícil?</Label>
                  <Textarea value={reflections[index].difficult} onChange={e => handleReflectionChange(index, 'difficult', e.target.value)} />
                  <Label>¿Qué recursos usé?</Label>
                  <Textarea value={reflections[index].resources} onChange={e => handleReflectionChange(index, 'resources', e.target.value)} />
                  <Label>¿Qué aprendí?</Label>
                  <Textarea value={reflections[index].learned} onChange={e => handleReflectionChange(index, 'learned', e.target.value)} />
                  <Label>¿Qué me sorprendió de mí?</Label>
                  <Textarea value={reflections[index].surprised} onChange={e => handleReflectionChange(index, 'surprised', e.target.value)} />
                </div>
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>Ver mi línea de resiliencia</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="font-bold text-center text-lg text-primary">Tu Línea de Resiliencia</h3>
            <p className="text-sm text-center text-muted-foreground">Esta es una síntesis de lo que has explorado. Cada punto es un testimonio de tu capacidad para seguir adelante.</p>
            <div className="relative pl-8 pt-4">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-8">
                {situations.map((sit, index) => {
                  if (!sit.trim()) return null;
                  const reflection = reflections[index];
                  return (
                    <div key={index} className="relative">
                      <div className="absolute -left-1.5 top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
                      <div className="ml-4">
                        <Card className="bg-background/50">
                          <CardHeader>
                            <CardTitle className="text-base">{sit}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><strong>Lo más difícil:</strong> {reflection.difficult || 'No especificado.'}</p>
                            <p><strong>Recursos que usé:</strong> {reflection.resources || 'No especificado.'}</p>
                            <p><strong>Lo que aprendí:</strong> {reflection.learned || 'No especificado.'}</p>
                            <p><strong>Lo que me sorprendió de mí:</strong> {reflection.surprised || 'No especificado.'}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
                <Button onClick={prevStep} variant="outline">Atrás</Button>
                <Button onClick={handleSave} disabled={isSaved}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaved ? 'Guardado' : 'Guardar en mi Cuaderno'}
                </Button>
            </div>
          </div>
        );
    case 4:
        return (
            <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Línea de Tiempo Guardada</h4>
                <p className="text-muted-foreground">Tu historia de resiliencia ha sido guardada. Puedes volver a consultarla en tu cuaderno para recordar tu fortaleza.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">
                  Empezar de nuevo
                </Button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        <CardDescription className="pt-2">
          {content.objective}
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src="https://workwellfut.com/audios/ruta8/tecnicas/Ruta8semana1tecnica1.mp3" type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
