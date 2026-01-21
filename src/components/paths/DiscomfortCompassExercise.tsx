
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DiscomfortCompassExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DiscomfortCompassExerciseProps {
  content: DiscomfortCompassExerciseContent;
  pathId: string;
}

const bodySensationOptions = [
    { id: 'body-neck-tension', label: 'Tensión en cuello o mandíbula' },
    { id: 'body-stomach-knot', label: 'Nudo en el estómago' },
    { id: 'body-fast-breathing', label: 'Respiración acelerada' },
    { id: 'body-sweating', label: 'Sudoración o calor' },
    { id: 'body-palpitations', label: 'Palpitaciones' },
    { id: 'body-desire-to-flee', label: 'Ganas de huir o congelación' },
];

const localEmotionOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad' },
    { id: 'emo-anger', label: 'Enfado' },
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-shame', label: 'Vergüenza' },
    { id: 'emo-frustration', label: 'Frustración' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-overwhelm', label: 'Agobio' },
];

const impulseOptions = [
    { id: 'impulse-say-yes', label: 'Decir que sí, aunque no quería' },
    { id: 'impulse-avoid-convo', label: 'Evitar la conversación' },
    { id: 'impulse-change-topic', label: 'Cambiar de tema o callarme' },
];

const suggestionPhrases = [
    'Me sabe mal decirlo, pero hoy no puedo con más.',
    'Ahora mismo no me viene bien, prefiero ser sincera/o contigo.',
    'Quiero contarte algo que me dejó un poco mal, ¿puedo?',
    'Sé que puede ser incómodo, pero necesito decirte cómo me sentí.',
    'No es fácil para mí decirte esto, pero creo que es importante…',
    'Me cuesta un poco hablar de esto, pero prefiero hacerlo a quedarme con este malestar.',
];

export function DiscomfortCompassExercise({ content, pathId }: DiscomfortCompassExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  // State for user inputs
  const [situation, setSituation] = useState('');
  const [bodySensations, setBodySensations] = useState<Record<string, boolean>>({});
  const [otherBodySensation, setOtherBodySensation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [thoughts, setThoughts] = useState('');
  const [thoughtBelief, setThoughtBelief] = useState(5);
  const [impulse, setImpulse] = useState('');
  const [otherImpulse, setOtherImpulse] = useState('');
  const [neededLimit, setNeededLimit] = useState('');
  const [bodyToldMe, setBodyToldMe] = useState('');
  const [alternativeResponse, setAlternativeResponse] = useState('');
  const [responseConfidence, setResponseConfidence] = useState(5);
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
      setStep(0);
      setSituation('');
      setBodySensations({});
      setOtherBodySensation('');
      setEmotion('');
      setOtherEmotion('');
      setEmotionIntensity(5);
      setThoughts('');
      setThoughtBelief(5);
      setImpulse('');
      setOtherImpulse('');
      setNeededLimit('');
      setBodyToldMe('');
      setAlternativeResponse('');
      setResponseConfidence(5);
      setIsSaved(false);
  }

  const handleSave = () => {
    const getSelectedLabels = (options: {id: string, label: string}[], selections: Record<string, boolean>, otherValue: string) => {
        const labels = options.filter(opt => selections[opt.id]).map(opt => opt.label);
        if (selections['other'] && otherValue) labels.push(otherValue);
        return labels;
    };

    const selectedBodySensations = getSelectedLabels(bodySensationOptions, bodySensations, otherBodySensation);
    let finalEmotion = emotion === 'otra' ? otherEmotion : localEmotionOptions.find(o => o.id === emotion)?.label;
    let finalImpulse = impulse === 'Otra opción (campo abierto)' ? otherImpulse : impulse;
    
    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación que me activó:**
${situation || 'No especificada.'}

**Señales de mi cuerpo:**
${selectedBodySensations.length > 0 ? selectedBodySensations.join(', ') : 'Ninguna especificada.'}

**Emoción y pensamientos:**
- Emoción: ${finalEmotion || 'No especificada'} (Intensidad: ${emotionIntensity}%)
- Pensamiento: "${thoughts || 'No especificado'}" (Creído al ${thoughtBelief}%)

**Impulso y necesidad:**
- Ganas de hacer: ${finalImpulse || 'No especificado.'}
- ¿Necesitaba poner un límite?: ${neededLimit || 'No especificado.'}
- ¿Mi cuerpo me decía algo?: ${bodyToldMe || 'No especificado.'}

**Respuesta alternativa:**
- Podría decir: "${alternativeResponse || 'No especificada'}" (Confianza en esta respuesta: ${responseConfidence}%)
`;

    addNotebookEntry({
      title: `Brújula del Malestar: ${situation.substring(0,25) || 'Reflexión'}`,
      content: notebookContent,
      pathId: pathId,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Brújula del Malestar' ha sido guardada en el cuaderno.",
    });
    setIsSaved(true);
    setStep(7); // Go to final confirmation
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
            <p className="italic text-muted-foreground">Te muestro a continuación un ejemplo completo de cómo se realiza este ejercicio. Leerlo antes puede ayudarte a identificar tus propias señales, ponerle palabras a lo que sentiste y conectar mejor con tu experiencia corporal y emocional.</p>
            <p className="text-sm text-muted-foreground">No tienes que hacerlo igual. Este ejemplo es solo una guía para que encuentres tu propia voz.</p>
            <Button onClick={nextStep}><ArrowRight className="mr-2 h-4 w-4" />Ver ejemplo guiado</Button>
          </div>
        );
      case 1: // Ejemplo guiado
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary text-center">Ejemplo guiado: Brújula del malestar</h4>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                    <p><strong>¿Qué situación te activó emocionalmente?</strong> Estaba por salir del trabajo cuando mi jefa pidió que me quedara para asumir una tarea urgente.</p>
                    <p><strong>¿Qué notaste en tu cuerpo?</strong> Tensión en la mandíbula y presión en el pecho. Sentí calor en la cara y el estómago se me cerró.</p>
                    <p><strong>¿Qué emoción sentiste? ¿Con qué intensidad la sentiste (0–100)?</strong> Frustración (80%).</p>
                    <p><strong>¿Qué pensaste en ese momento?</strong> “Si digo que no, pensará que no soy profesional”.</p>
                    <p><strong>¿Cuánto te creíste ese pensamiento en el momento que pasó por tu cabeza (0-100)?</strong> 85%.</p>
                    <p><strong>¿Qué te dieron ganas de hacer?</strong> Aceptar la tarea sin discutir, aunque no me apetecía. Quería evitar el conflicto.</p>
                    <p><strong>¿Crees que necesitabas poner un límite?</strong> Sí. Me di cuenta de que estaba sobrepasado/a y que mi cuerpo me estaba avisando con tensión y cansancio. No tenía energía para más.</p>
                    <p><strong>¿Qué podrías decir la próxima vez?</strong> “Me encantaría ayudar, pero ya tenía planes para hoy. Si lo necesitas mañana, puedo reorganizarme.”</p>
                    <p><strong>¿Qué grado de seguridad te genera esta frase (0-100)?</strong> 65%.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Empezar mi registro <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Detecta la señal
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 1: Detecta la señal</h4>
                <div className="space-y-2">
                    <Label htmlFor="discomfort-situation">¿Qué situación te activó emocionalmente?</Label>
                    <p className="text-sm text-muted-foreground">Vamos a observar qué te pasó a ti. Recuerda una situación reciente en la que sentiste malestar, incomodidad o sobrecarga emocional. </p>
                    <Textarea id="discomfort-situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe con tus palabras lo que ocurrió: qué pasó, dónde estabas, con quién…" />
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
                </div>
            </div>
        );
      case 3: // Escucha tu cuerpo
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 2: Escucha tu Cuerpo</h4>
                 <div className="space-y-2">
                    <Label>¿Qué notaste en tu cuerpo?</Label>
                    {bodySensationOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={bodySensations[opt.id] || false} onCheckedChange={c => setBodySensations(p => ({...p, [opt.id]:!!c}))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2 pt-1"><Checkbox id="body-other" checked={bodySensations['other'] || false} onCheckedChange={c => setBodySensations(p => ({...p, other:!!c}))} /><Label htmlFor="body-other" className="font-normal">Otra:</Label></div>
                    {bodySensations['other'] && <Textarea value={otherBodySensation} onChange={e => setOtherBodySensation(e.target.value)} placeholder="Tensión en la mandíbula y presión en el pecho. Sentí calor en la cara y el estómago se me cerró." className="ml-6"/>}
                </div>
                 <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente</Button></div>
            </div>
        );
      case 4: // Emociones y pensamientos
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 3: Emociones y Pensamientos</h4>
                <div className="space-y-2">
                    <Label>¿Qué emoción sentiste?</Label>
                    <RadioGroup value={emotion} onValueChange={setEmotion} className="space-y-1">
                        {localEmotionOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.id} id={opt.id}/><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}
                        <div className="flex items-center space-x-2"><RadioGroupItem value="otra" id="emo-other-radio"/><Label htmlFor="emo-other-radio" className="font-normal">Otra:</Label></div>
                    </RadioGroup>
                    {emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la emoción" className="ml-6"/>}
                    <Label htmlFor="emo-intensity">Intensidad: {emotionIntensity}%</Label>
                    <Slider id="emo-intensity" value={[emotionIntensity]} onValueChange={v => setEmotionIntensity(v[0])} max={100} step={5} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="discomfort-thoughts">¿Qué pensaste en ese momento?</Label>
                    <Textarea id="discomfort-thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} placeholder="Ej.: 'No quiero parecer egoísta', 'Mejor no digo nada'..."/>
                    <Label htmlFor="thought-belief">¿Cuánto te creíste ese pensamiento? {thoughtBelief}%</Label>
                    <Slider id="thought-belief" value={[thoughtBelief]} onValueChange={v => setThoughtBelief(v[0])} max={100} step={5} />
                </div>
                <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente</Button></div>
            </div>
        );
       case 5: // Impulso e intuición
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Impulso e Intuición</h4>
                <div className="space-y-2">
                    <Label>¿Qué te dieron ganas de hacer?</Label>
                    <RadioGroup value={impulse} onValueChange={setImpulse} className="space-y-1">
                        {impulseOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.label} id={opt.id}/><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Otra opción (campo abierto)" id="impulse-other-radio"/><Label htmlFor="impulse-other-radio" className="font-normal">Otra opción (campo abierto)</Label></div>
                    </RadioGroup>
                     {impulse === 'Otra opción (campo abierto)' && <Textarea value={otherImpulse} onChange={e => setOtherImpulse(e.target.value)} placeholder="Aceptar la tarea sin discutir, aunque no me apetecía. Quería evitar el conflicto." className="ml-6"/>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="needed-limit">¿Crees que necesitabas poner un límite?</Label>
                    <Textarea id="needed-limit" value={neededLimit} onChange={e => setNeededLimit(e.target.value)} placeholder="Campo abierto de reflexión libre." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="body-told-me">¿Tu cuerpo y tus emociones estaban intentando decirte algo?</Label>
                    <Textarea id="body-told-me" value={bodyToldMe} onChange={e => setBodyToldMe(e.target.value)} placeholder="Campo abierto de reflexión libre." />
                </div>
                <div className="flex justify-between w-full mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button><Button onClick={nextStep}>Siguiente</Button></div>
            </div>
        );
      case 6: // Respuesta alternativa
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 5: Respuesta Alternativa</h4>
                <p className="text-sm text-muted-foreground">Ahora vamos a entrenar una posible forma de expresarte la próxima vez. No tiene que ser perfecta. Solo honesta.</p>
                <div className="space-y-2">
                    <Label>Frases inspiradoras sugeridas:</Label>
                    <Select onValueChange={(value) => setAlternativeResponse(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Elige una frase para inspirarte..." />
                        </SelectTrigger>
                        <SelectContent>
                            {suggestionPhrases.map((phrase, index) => (
                                <SelectItem key={index} value={phrase}>{phrase}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alt-response">¿Qué podrías decir la próxima vez en una situación parecida?</Label>
                    <Textarea id="alt-response" value={alternativeResponse} onChange={e => setAlternativeResponse(e.target.value)} placeholder="Me encantaría ayudar, pero ya tenía planes para hoy. Si lo necesitas mañana, puedo reorganizarme."/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="response-confidence">¿Qué grado de seguridad te genera esta nueva respuesta? {responseConfidence}%</Label>
                    <Slider id="response-confidence" value={[responseConfidence]} onValueChange={v => setResponseConfidence(v[0])} max={100} step={5} />
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={handleSave} className="w-auto" disabled={isSaved}>
                    {isSaved ? <CheckCircle className="mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4" />}
                    {isSaved ? 'Guardado' : 'Guardar mi Brújula'}
                  </Button>
                </div>
            </div>
        );
      case 7: // Beneficio adicional
        return (
             <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">Beneficio Adicional</h4>
                 <p className="text-muted-foreground">Cada vez que practicas este ejercicio, estás entrenando tu capacidad de reconocer tus límites, regular tus emociones y expresarte con mayor claridad.</p>
                 <p className="italic text-primary pt-2">Tu cuerpo te habla. Este ejercicio te ayuda a escucharlo.</p>
                 <Button onClick={resetExercise} variant="outline" className="w-full">Registrar otra situación</Button>
             </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
            <div className="mt-4">
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
