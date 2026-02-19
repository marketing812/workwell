"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText, Compass } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { TriggerExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { StressCompass } from './StressCompass';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TriggerExerciseProps {
  content: TriggerExerciseContent;
  onComplete: () => void;
  pathId: string;
}

export default function TriggerExercise({ content, onComplete, pathId }: TriggerExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();

  const [situation, setSituation] = useState('');
  const [otherSituation, setOtherSituation] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [hadAutomaticImage, setHadAutomaticImage] = useState<boolean | 'indeterminate'>('indeterminate');
  const [automaticImageDesc, setAutomaticImageDesc] = useState('');
  const [anticipation, setAnticipation] = useState('');
  const [triggerSource, setTriggerSource] = useState<'externo' | 'interno' | 'ambos' | ''>('');
  const [copingResponse, setCopingResponse] = useState('');
  const [otherCopingResponse, setOtherCopingResponse] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompass, setShowCompass] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity1, setEmotionIntensity1] = useState(50);
  const [selectedEmotion2, setSelectedEmotion2] = useState('');
  const [emotionIntensity2, setEmotionIntensity2] = useState(0);
  const [selectedEmotion3, setSelectedEmotion3] = useState('');
  const [emotionIntensity3, setEmotionIntensity3] = useState(0);

  const audioUrl = `${EXTERNAL_SERVICES_BASE_URL}/audios/r1_desc/Tecnica-2-identifica-tu-disparador.mp3`;


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!emotion || !situation || !thoughts || hadAutomaticImage === 'indeterminate' || !triggerSource || !copingResponse) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los campos del ejercicio para guardar tu registro.",
        variant: "destructive",
      });
      return;
    }
    
    const finalSituation = situation === 'otra' ? otherSituation : situation;
    const finalCoping = copingResponse === 'otra' ? otherCopingResponse : copingResponse;

    let emotionsText = `${t[emotions.find(e => e.value === emotion)?.labelKey as keyof typeof t] || emotion} (${emotionIntensity1}%)`;
    if (selectedEmotion2 && emotionIntensity2 > 0) {
      emotionsText += `, ${t[emotions.find(e => e.value === selectedEmotion2)?.labelKey as keyof typeof t] || selectedEmotion2} (${emotionIntensity2}%)`;
    }
    if (selectedEmotion3 && emotionIntensity3 > 0) {
      emotionsText += `, ${t[emotions.find(e => e.value === selectedEmotion3)?.labelKey as keyof typeof t] || selectedEmotion3} (${emotionIntensity3}%)`;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**1. Emoción principal sentida:**
${emotionsText}

**2. Situación que ocurrió:**
${finalSituation}

**3. Pensamientos que pasaron por mi cabeza:**
${thoughts}

**4. ¿Tuve alguna imagen o recuerdo automático?:**
${hadAutomaticImage ? `Sí: ${automaticImageDesc}` : 'No'}

**5. ¿Qué pensé que podría pasar? (Anticipación de amenaza):**
${anticipation}

**6. Origen del disparador principal:**
${triggerSource}

**7. Mi respuesta o acción posterior:**
${finalCoping}
`;
    
    addNotebookEntry({
        title: 'Registro de Disparador',
        content: notebookContent,
        pathId: pathId,
        userId: user?.id
    });
    
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro de 'Identifica tu disparador' ha sido guardado exitosamente.",
    });
    
    setIsSaved(true);
    onComplete();
  };
  

  const situationOptions = [
      { id: 'situation-hurtful-comment', label: 'Alguien me dijo algo que me dolió' },
      { id: 'situation-overwhelmed', label: 'Me exigieron demasiado en poco tiempo' },
      { id: 'situation-memory', label: 'Recordé algo que me afectó' },
      { id: 'situation-physical', label: 'Me sentía mal físicamente' },
  ];

  const copingOptions = [
      { id: 'coping-distraction', label: 'Me distraje con redes' },
      { id: 'coping-overload', label: 'Me sobreexigí para hacerlo perfecto' },
      { id: 'coping-blocked', label: 'Me bloqueé' },
      { id: 'coping-vented', label: 'Lloré o exploté' },
  ];


  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription>
        <div className="space-y-4 text-sm pt-2">
            <p>Cuando sientes que todo te supera, es fácil pensar que lo que te estresa está fuera de ti. Pero muchas veces, lo que más influye es lo que ocurre en tu interior. Por eso, aprender a diferenciar entre lo que pasa fuera (el estresor) y lo que sientes por dentro (la respuesta de estrés) es un paso clave para recuperar el control.   Un estresor puede ser una situación externa como una discusión, un cambio inesperado o una carga laboral. Pero también puede ser algo más invisible: una creencia rígida, una expectativa alta o un recuerdo que se activa sin que te des cuenta.   Entender esta diferencia te permite dejar de reaccionar en automático y empezar a responder desde un lugar más consciente. Porque no puedes controlar todo lo que ocurre a tu alrededor, pero sí puedes aprender a regular lo que ocurre dentro de ti.   Y aquí está lo importante: entre lo que ocurre y lo que haces, hay un espacio. Ese espacio es donde puedes parar, respirar, pensar y decidir. Ese espacio es libertad.   Este ejercicio te ayudará a explorar ese espacio y a entrenar tu capacidad de respuesta. Cada vez que lo haces, aunque sea por unos segundos, estás construyendo una versión más tranquila, consciente y libre de ti misma o de ti mismo.</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm">¿Qué es un estresor y qué es el estrés?</AccordionTrigger>
                <AccordionContent>
                  <p>El estresor es el desencadenante, eso que genera presión o malestar. Puede ser algo externo (como una crítica, una discusión, una fecha límite) o interno (como un pensamiento, un recuerdo o una sensación física).</p>
                  <p className="mt-2">El estrés es cómo lo vives: tensión, ansiedad, insomnio, pensamientos acelerados, bloqueos, irritabilidad...</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-sm">¿Es externo o interno lo que te estresa?</AccordionTrigger>
                <AccordionContent>
                    <p>Muchos estresores son visibles: una carga laboral, una discusión, una demanda del entorno. Pero otras veces el origen está dentro: tus creencias, tus expectativas, tu historia emocional.</p>
                    <p className="font-semibold mt-2">Ejemplos de estresores externos:</p>
                    <ul className="list-disc list-inside ml-4"><li>Cargas laborales excesivas</li><li>Críticas o conflictos</li><li>Cambios inesperados</li><li>Ruido, interrupciones, caos</li></ul>
                    <p className="font-semibold mt-2">Ejemplos de estresores internos:</p>
                    <ul className="list-disc list-inside ml-4"><li>"Tengo que hacerlo perfecto"</li><li>"Seguro que se enfadó conmigo"</li><li>"No puedo fallar"</li><li>Recuerdos dolorosos</li><li>Sensaciones físicas malinterpretadas (como palpitaciones que generan miedo)</li></ul>
                    <p className="mt-2">Saber si lo que te activa es externo, interno o una mezcla te da poder. No puedes controlar todo lo que pasa fuera, pero sí puedes transformar cómo lo interpretas y cómo lo enfrentas.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm">¿Estás reaccionando o estás respondiendo?</AccordionTrigger>
                <AccordionContent>
                  <p>Una reacción es rápida, impulsiva, automática. Viene del miedo o del cansancio. No hay espacio entre lo que pasa y lo que haces.</p>
                  <p className="mt-2">Una respuesta es consciente. Dejas un pequeño espacio entre el estímulo y tu decisión. Ese espacio es libertad. Por ejemplo: alguien te grita → tú sientes el impulso de gritar → respiras → eliges responder con firmeza, pero sin perder el control.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-sm">¿Por qué es importante esta diferencia?</AccordionTrigger>
                <AccordionContent>
                  <p>Porque no puedes controlar todo lo que ocurre, pero sí puedes aprender a regular lo que ocurre dentro de ti.</p>
                  <p className="mt-2">Cuando entiendes qué te estresa y de dónde viene, puedes:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Elegir tus batallas</li>
                    <li>Cuestionar tus pensamientos automáticos</li>
                    <li>Regular tu cuerpo</li>
                    <li>Pedir ayuda cuando lo necesites</li>
                    <li>Poner límites sin culpa</li>
                    <li>Cuidarte con amabilidad</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-sm">Un recordatorio para ti</AccordionTrigger>
                <AccordionContent>
                  <p>No todo lo que duele es una amenaza. No todo lo que piensas es verdad. Y no todo lo que sientes necesita una reacción inmediata.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
        </CardDescription>
        {content.duration && <p className="text-sm text-muted-foreground pt-1">Duración estimada: {content.duration}</p>}
        {audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-foreground/80 italic">Piensa en una situación reciente que te haya generado estrés. Luego, completa paso a paso este registro guiado. Te acompañaré con preguntas breves para que puedas ir registrando lo que viviste: </p>
          
          <div>
            <Label htmlFor="emotion" className="font-semibold">1. ¿Cómo te sentiste en ese momento?</Label>
            <Select value={emotion} onValueChange={setEmotion} disabled={isSaved}>
              <SelectTrigger id="emotion">
                <SelectValue placeholder="Selecciona la emoción principal" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emo) => (
                  <SelectItem key={emo.value} value={emo.value}>
                    {t[emo.labelKey as keyof typeof t] || emo.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="font-semibold">2. ¿Qué situación estaba ocurriendo?</Label>
            <RadioGroup onValueChange={setSituation} value={situation} className="space-y-2 mt-2" disabled={isSaved}>
                {situationOptions.map(opt => (
                     <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.label} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                     </div>
                ))}
                <div className="flex items-center space-x-2">
                     <RadioGroupItem value="otra" id="situation-other" />
                    <Label htmlFor="situation-other" className="font-normal">Otra:</Label>
                </div>
            </RadioGroup>
            {situation === 'otra' && (
                <Textarea 
                    value={otherSituation}
                    onChange={(e) => setOtherSituation(e.target.value)}
                    placeholder="Describe la situación"
                    disabled={isSaved}
                    className="ml-6 mt-2"
                />
            )}
          </div>

          <div>
            <Label htmlFor="thoughts" className="font-semibold">3. ¿Qué pasó por tu cabeza justo antes de sentirte así?</Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Ej: 'No soy capaz', 'Todo va a salir mal'"
              disabled={isSaved}
            />
          </div>

          <div>
            <Label className="font-semibold">4. ¿Te vino alguna imagen o recuerdo automático?</Label>
             <RadioGroup onValueChange={(val) => setHadAutomaticImage(val === 'yes')} value={hadAutomaticImage === 'indeterminate' ? '' : (hadAutomaticImage ? 'yes' : 'no')} className="flex space-x-4 mt-2" disabled={isSaved}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hadImage-yes" />
                    <Label htmlFor="hadImage-yes" className="font-normal">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hadImage-no" />
                    <Label htmlFor="hadImage-no" className="font-normal">No</Label>
                </div>
            </RadioGroup>
            {hadAutomaticImage === true && (
                <Textarea
                    value={automaticImageDesc}
                    onChange={(e) => setAutomaticImageDesc(e.target.value)}
                    placeholder="Describe brevemente la imagen o recuerdo"
                    className="mt-2"
                    disabled={isSaved}
                />
            )}
          </div>
          
          <div>
            <Label htmlFor="anticipation" className="font-semibold">5. ¿Qué pensé que podría pasar? (Anticipación de amenaza)</Label>
            <Textarea
              id="anticipation"
              value={anticipation}
              onChange={(e) => setAnticipation(e.target.value)}
              placeholder="Ej: 'Me van a despedir', 'Voy a hacer el ridículo'."
              disabled={isSaved}
            />
          </div>

           <div>
            <Label className="font-semibold">6. ¿De dónde vino el disparador principal?</Label>
            <RadioGroup onValueChange={(v) => setTriggerSource(v as any)} value={triggerSource} className="space-y-1 mt-2" disabled={isSaved}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="externo" id="source-external" />
                    <Label htmlFor="source-external" className="font-normal">Externo (personas, tareas, entorno)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interno" id="source-internal" />
                    <Label htmlFor="source-internal" className="font-normal">Interno (pensamientos, recuerdos, sensaciones)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ambos" id="source-both" />
                    <Label htmlFor="source-both" className="font-normal">Ambos</Label>
                </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold">7. ¿Qué hiciste para calmarte o evitarlo?</Label>
             <RadioGroup onValueChange={setCopingResponse} value={copingResponse} className="space-y-2 mt-2" disabled={isSaved}>
                {copingOptions.map(opt => (
                     <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.label} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                     </div>
                ))}
                 <div className="flex items-center space-x-2">
                     <RadioGroupItem value="otra" id="coping-other" />
                    <Label htmlFor="coping-other" className="font-normal">Otra:</Label>
                </div>
             </RadioGroup>
             {copingResponse === 'otra' && (
                <Textarea 
                    value={otherCopingResponse}
                    onChange={(e) => setOtherCopingResponse(e.target.value)}
                    placeholder="Describe tu respuesta"
                    disabled={isSaved}
                    className="ml-6 mt-2"
                />
            )}
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Registro
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Tu registro ha sido guardado.</p>
                </div>
                <Dialog open={showCompass} onOpenChange={setShowCompass}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-green-800 dark:text-green-200 mt-2">
                        <Compass className="mr-2 h-4 w-4" /> Ver mi Brújula de Estrés
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Brújula de Estrés</DialogTitle>
                      <DialogDescription>
                        Esta brújula visual muestra si la principal fuente de tu estrés fue interna, externa o una combinación de ambas.
                      </DialogDescription>
                    </DialogHeader>
                    <StressCompass sourceType={triggerSource} />
                  </DialogContent>
                </Dialog>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
