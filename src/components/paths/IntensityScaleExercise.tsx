
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { IntensityScaleExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface IntensityScaleExerciseProps {
  content: IntensityScaleExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const IntensityScaleGuide = () => (
    <div className="mb-6 p-3 border rounded-lg bg-background/30">
        <h4 className="font-semibold text-center mb-3 text-sm text-primary">Tu escala de intensidad del 0 al 10</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <li><strong className="text-green-600">0–2:</strong> Tranquilidad – Equilibrio</li>
            <li><strong className="text-yellow-600">3–4:</strong> Activación leve – Incomodidad</li>
            <li><strong className="text-orange-600">5–6:</strong> Tensión moderada – Desconcentración</li>
            <li><strong className="text-red-600">7–8:</strong> Estrés alto – Ansiedad intensa</li>
            <li><strong className="text-red-800">9–10:</strong> Colapso emocional – Bloqueo, desconexión o explosión</li>
        </ul>
    </div>
);


export default function IntensityScaleExercise({ content, pathId, onComplete }: IntensityScaleExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [scale, setScale] = useState({
    '0–2': { signals: '', needs: '', strategy: '' },
    '3–4': { signals: '', needs: '', strategy: '' },
    '5–6': { signals: '', needs: '', strategy: '' },
    '7–8': { signals: '', needs: '', strategy: '' },
    '9–10': { signals: '', needs: '', strategy: '' },
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleScaleChange = (level: keyof typeof scale, field: string, value: string) => {
    setScale(prev => ({ ...prev, [level]: { ...prev[level], [field]: value } }));
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

  const resetExercise = () => {
    setStep(0);
    setScale({
      '0–2': { signals: '', needs: '', strategy: '' },
      '3–4': { signals: '', needs: '', strategy: '' },
      '5–6': { signals: '', needs: '', strategy: '' },
      '7–8': { signals: '', needs: '', strategy: '' },
      '9–10': { signals: '', needs: '', strategy: '' },
    });
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    Object.entries(scale).forEach(([level, data]) => {
      if (data.signals.trim() || data.needs.trim() || data.strategy.trim()) {
        notebookContent += `**Nivel ${level}:**\n`;
        notebookContent += `Pregunta: ¿Qué siento en el cuerpo y en la mente? | Respuesta: ${data.signals || 'No descrito'}\n`;
        notebookContent += `Pregunta: ¿Qué necesito realmente en este nivel? | Respuesta: ${data.needs || 'No descrito'}\n`;
        notebookContent += `Pregunta: ¿Qué estrategias puedo usar para regularme? | Respuesta: ${data.strategy || 'No descrito'}\n\n`;
      }
    });
    addNotebookEntry({ title: 'Mi Escala de Intensidad Emocional', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Escala Guardada', description: 'Tu escala de intensidad emocional se ha guardado.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">No todas las emociones intensas necesitan la misma respuesta. A veces un poco de malestar se resuelve con respirar. Otras veces necesitas parar por completo y pedir ayuda. Este ejercicio te ayudará a crear una brújula emocional para saber qué hacer según cómo te sientes.</p>
            <Button onClick={nextStep}>Crear mi plan <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-center">Ejemplo guía de la escala</h4>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="example">
                <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">Ver ejemplo guía</AccordionTrigger>
                <AccordionContent>
                  <div className="text-xs space-y-2 p-2">
                    <p><strong>Nivel 2:</strong> Siento calma, respiración estable. Necesito mantenerme así. Estrategia: Pasear, música suave.</p>
                    <p><strong>Nivel 4:</strong> Empiezo a agobiarme, tensión en cuello. Necesito soltar presión. Estrategia: Respiración 5-5-5, pausa breve.</p>
                    <p><strong>Nivel 6:</strong> Irritación, mente acelerada. Necesito calmar el sistema nervioso. Estrategia: Visualización segura, gesto de autocuidado.</p>
                    <p><strong>Nivel 8:</strong> Llantos o bloqueo. Necesito protección y contención. Estrategia: Llamar a alguien, salir del entorno, técnica del ancla.</p>
                    <p><strong>Nivel 10:</strong> Siento que no puedo más. Necesito seguridad. Estrategia: Parar, validar lo que siento, buscar apoyo urgente.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-center">Crea tu plan por niveles</h4>
            {Object.keys(scale).map(level => (
              <div key={level} className="p-3 border rounded-md">
                <h5 className="font-medium">Nivel {level}</h5>
                <div className="space-y-2 mt-2">
                  <Label>¿Qué siento en el cuerpo y en la mente?</Label>
                  <Textarea value={scale[level as keyof typeof scale].signals} onChange={e => handleScaleChange(level as keyof typeof scale, 'signals', e.target.value)} disabled={isSaved} />
                  <Label>¿Qué necesito realmente en este nivel?</Label>
                  <Textarea value={scale[level as keyof typeof scale].needs} onChange={e => handleScaleChange(level as keyof typeof scale, 'needs', e.target.value)} disabled={isSaved} />
                  <Label>¿Qué estrategias puedo usar para regularme?</Label>
                  <Textarea value={scale[level as keyof typeof scale].strategy} onChange={e => handleScaleChange(level as keyof typeof scale, 'strategy', e.target.value)} disabled={isSaved} />
                </div>
              </div>
            ))}
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit" disabled={isSaved}>
                <Save className="mr-2 h-4 w-4" /> {isSaved ? 'Guardado' : 'Guardar mi escala'}
              </Button>
            </div>
          </form>
        );
        case 3:
            return (
                <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">Escala Guardada</h4>
                    <p>Ya tienes tu propia escala emocional con recursos asociados. Esta será tu hoja de ruta cuando todo parezca desbordarte. Puedes volver a ella siempre que lo necesites.</p>
                    <p className="text-xs text-muted-foreground italic">Recuerda: tu cuerpo te habla. Cuanto antes lo escuches, más fácil será cuidarte.</p>
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
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
          <audio controls controlsList="nodownload" className="w-full">
            <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        <IntensityScaleGuide />
        {renderStep()}
      </CardContent>
    </Card>
  );
}
