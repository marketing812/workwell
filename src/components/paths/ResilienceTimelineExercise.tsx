
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
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface ResilienceTimelineExerciseProps {
  content: ResilienceTimelineExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ResilienceTimelineExercise({ content, pathId, onComplete }: ResilienceTimelineExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
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
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

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
          notebookContent += `Pregunta: ¿Qué fue lo más difícil? | Respuesta: ${item.reflection.difficult || 'No especificado.'}\n`;
          notebookContent += `Pregunta: ¿Qué recursos usé? | Respuesta: ${item.reflection.resources || 'No especificado.'}\n`;
          notebookContent += `Pregunta: ¿Qué aprendí? | Respuesta: ${item.reflection.learned || 'No especificado.'}\n`;
          notebookContent += `Pregunta: ¿Qué me sorprendió de mí? | Respuesta: ${item.reflection.surprised || 'No especificado.'}\n\n---\n\n`;
      });
      
      addNotebookEntry({ title: 'Mi Línea del Tiempo Resiliente', content: notebookContent, pathId, userId: user?.id });
      toast({ title: "Línea de Tiempo Guardada" });
      setIsSaved(true);
      onComplete();
      next(); // Move to confirmation screen
  }
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Si quieres, antes de hacer tu línea del tiempo, puedes leer unos ejemplos que te servirán de inspiración.</p>
            <Accordion type="single" defaultValue="example" className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplos, recuerda: tu historia es única. Este ejemplo solo es una inspiración para ayudarte a conectar con tus propias vivencias y recursos. </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="example-1">
                        <AccordionTrigger>Situación 1: Cambio de ciudad sin red de apoyo</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p><strong className="text-foreground">¿Qué fue lo más difícil?</strong><br />Sentirme sola. Dejar a mi familia y amistades para empezar desde cero en una ciudad donde no conocía a nadie. Me sentía pequeña y fuera de lugar.</p>
                            <p><strong className="text-foreground">¿Qué recursos usé?</strong><br />Empecé a hacer pequeñas rutinas: salir a caminar por el mismo parque, ir a una cafetería fija… eso me dio sensación de estabilidad. También me animé a apuntarme a un taller de escritura, donde conocí gente. Aunque me daba vergüenza, me empujé con cariño.</p>
                            <p><strong className="text-foreground">¿Qué aprendí?</strong><br />Que puedo adaptarme incluso cuando me siento desubicada. Que construir vínculos lleva tiempo, pero vale la pena. Aprendí que la soledad no me define y que puedo buscar compañía sin perder mi esencia.</p>
                            <p><strong className="text-foreground">¿Qué me sorprendió de mí?</strong><br />La capacidad que tuve de cuidar de mí en lo cotidiano, aunque no me sintiera fuerte. El coraje silencioso que no se nota desde fuera, pero que sostiene desde dentro.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="example-2">
                        <AccordionTrigger>Situación 2: Ruptura amorosa inesperada</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p><strong className="text-foreground">¿Qué fue lo más difícil?</strong><br />Sentí que se rompía un futuro que ya me había imaginado. Me dolió la pérdida, pero también la sensación de no haber visto venir la ruptura.</p>
                            <p><strong className="text-foreground">¿Qué recursos usé?</strong><br />Pedí ayuda a una terapeuta. Empecé a escribir un diario donde no me juzgaba. Me permití llorar sin culpa. Dejé de intentar entenderlo todo y me centré en cuidar lo que quedaba de mí.</p>
                            <p><strong className="text-foreground">¿Qué aprendí?</strong><br />Que puedo sostenerme incluso cuando lo que soñaba se desvanece. Que la tristeza tiene su lugar, pero no es mi hogar permanente. Que a veces cerrar una puerta es abrir el paso a algo más verdadero.</p>
                            <p><strong className="text-foreground">¿Qué me sorprendió de mí?</strong><br />Que no necesité reconstruirme deprisa. Me di tiempo. Y en ese tiempo, me reencontré con partes de mí que había dejado en pausa.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="example-3">
                        <AccordionTrigger>Situación 3: Enfermedad de un familiar cercano</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p><strong className="text-foreground">¿Qué fue lo más difícil?</strong><br />Ver sufrir a alguien que amo y no poder hacer mucho para aliviarlo. Sentirme impotente y, a la vez, tener que estar “entera” para acompañar.</p>
                            <p><strong className="text-foreground">¿Qué recursos usé?</strong><br />Me apoyé en otros familiares. Hablé de lo que sentía con amistades de confianza. Hice pausas breves para respirar, caminar o simplemente estar conmigo. Aprendí a estar presente sin exigirme ser perfecta.</p>
                            <p><strong className="text-foreground">¿Qué aprendí?</strong><br />Que puedo ser sostén sin desbordarme. Que incluso en medio del dolor, hay espacios de ternura, risa y conexión. Y que ser vulnerable no me resta valor como cuidadora.</p>
                            <p><strong className="text-foreground">¿Qué me sorprendió de mí?</strong><br />La serenidad que logré encontrar en medio de todo. Nunca pensé que pudiera sentir paz en algo tan duro.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <p className="text-sm text-muted-foreground">Tu línea del tiempo puede estar hecha de pérdidas, cambios, duelos o decisiones difíciles. Pero también está hecha de ti: de la fuerza que no se vio desde fuera, de las pequeñas elecciones conscientes, de tu forma única de levantarte.</p>
                    <p className="text-sm text-muted-foreground">Es hora de reconocerlo con claridad y con cariño.</p>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between w-full mt-4">
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
                    {isSaved ? 'Guardado' : 'Guardar en el cuaderno terapéutico'}
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
              <source src={content.audioUrl} type="audio/mpeg" />
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

