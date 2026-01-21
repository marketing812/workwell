"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PostBoundaryEmotionsExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface PostBoundaryEmotionsExerciseProps {
  content: PostBoundaryEmotionsExerciseContent;
  pathId: string;
}

const emotionOptions = [
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-insecurity', label: 'Inseguridad' },
    { id: 'emo-fear', label: 'Miedo al rechazo' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-anger', label: 'Enfado o irritación' },
];

export function PostBoundaryEmotionsExercise({ content, pathId }: PostBoundaryEmotionsExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [thoughts, setThoughts] = useState<Record<string, {text: string, belief: number}>>({
    thought1: { text: '', belief: 50 },
    thought2: { text: '', belief: 50 }
  });
  const [emotions, setEmotions] = useState<Record<string, {selected: boolean, intensity: number}>>({});
  const [bodySensations, setBodySensations] = useState('');
  const [behavior, setBehavior] = useState('');
  const [emotionFunction, setEmotionFunction] = useState('');
  const [compassionateResponse, setCompassionateResponse] = useState('');
  const [reassessment, setReassessment] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
      setStep(0);
      setSituation('');
      setThoughts({ thought1: { text: '', belief: 50 }, thought2: { text: '', belief: 50 } });
      setEmotions({});
      setBodySensations('');
      setBehavior('');
      setEmotionFunction('');
      setCompassionateResponse('');
      setReassessment('');
      setIsSaved(false);
      setSavedPhrases([]);
  };

  const handleThoughtChange = (key: string, field: 'text' | 'belief', value: string | number) => {
      setThoughts(prev => ({
          ...prev,
          [key]: {
              ...(prev[key] || { text: '', belief: 50 }),
              [field]: value,
          }
      }));
  };

  const handleEmotionChange = (id: string, field: 'selected' | 'intensity', value: boolean | number) => {
    setEmotions(prev => ({
        ...prev,
        [id]: {
            ...(prev[id] || { selected: false, intensity: 50 }),
            [field]: value,
        }
    }));
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!reassessment.trim()) {
        toast({ title: 'Campo incompleto', description: 'Por favor, completa la reevaluación final.', variant: 'destructive' });
        return;
    }
    
    const selectedEmotions = Object.entries(emotions).filter(([, val]) => val.selected).map(([key, val]) => {
        const label = emotionOptions.find(o => o.id === key)?.label || key;
        return `${label} (${val.intensity}%)`;
    }).join(', ');

    const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:**
${situation || 'No especificada.'}

**Pensamientos automáticos (y creencia):**
${Object.values(thoughts).filter(t => t.text).map(t => `- "${t.text}" (${t.belief}%)`).join('\n') || 'No especificados.'}

**Emociones sentidas (e intensidad):**
${selectedEmotions || 'No especificadas.'}

**Sensaciones corporales:**
${bodySensations || 'No especificadas.'}

**Conducta posterior:**
${behavior || 'No especificado.'}

**Función de la emoción:**
${emotionFunction || 'No especificada.'}

**Respuesta compasiva:**
"${compassionateResponse || 'No especificada.'}"

**Reevaluación final:**
${reassessment}
    `;

    addNotebookEntry({
      title: `Registro Post-Límite: ${situation.substring(0, 25) || 'Reflexión'}`,
      content: notebookContent,
      pathId: pathId,
    });

    toast({ title: "Registro Guardado", description: "Tu ejercicio se ha guardado en el cuaderno." });
    setIsSaved(true);
    nextStep();
  };

  const handleSavePhrase = (phrase: string) => {
    addNotebookEntry({ title: "Frase de Autocompasión", content: `"${phrase}"`, pathId: pathId });
    setSavedPhrases(prev => [...prev, phrase]);
    toast({ title: "Frase Guardada", description: "Tu frase de autocuidado se ha guardado." });
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1: Cómo lo harás
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">¿Cómo lo harás?</h4>
            <p className="text-sm text-muted-foreground">Vas a recorrer, paso a paso, lo que ocurrió después de poner un límite. Primero, describirás la situación concreta en la que te expresaste con firmeza. Luego, explorarás lo que pensaste, sentiste y notaste en tu cuerpo. Después, identificarás qué intentaba proteger esa emoción que apareció (porque siempre hay algo valioso detrás). Y por último, te ofrecerás una respuesta más compasiva y realista, que te ayude a sostenerte sin juzgarte.</p>
            <Button onClick={nextStep} className="w-full">Comenzar</Button>
          </div>
        );
      case 1: // Pantalla 2: Ejemplo
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg text-primary text-center">Ejemplo guiado completo</h4>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                    <p><strong>Situación:</strong> “Mi amiga me pidió que le ayudara a organizar su mudanza este fin de semana, pero yo ya tenía planes de descanso. Le dije que no.”</p>
                    <p><strong>Pensamientos:</strong> “Seguro que piensa que soy egoísta” (80%), “Nunca estoy cuando se me necesita” (65%).</p>
                    <p><strong>Emociones:</strong> Culpa (70%), inseguridad (40%).</p>
                    <p><strong>Cuerpo:</strong> Tensión en el pecho, respiración superficial.</p>
                    <p><strong>Conducta:</strong> Me sentí incómoda durante un rato. Luego le escribí un mensaje para suavizar.</p>
                    <p><strong>Función de la emoción:</strong> La culpa me muestra que me importa mi amiga y quiero cuidar el vínculo.</p>
                    <p><strong>Respuesta compasiva:</strong> “Puedo querer a alguien y decir que no. Estoy aprendiendo a respetar mis propios límites sin dejar de cuidar la relación.”</p>
                    <p><strong>Resultado:</strong> Me sentí más tranquila. Pude dejar de rumiar.</p>
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
      case 2: // Pantalla 3: Situación
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label htmlFor="sit-desc" className="font-semibold text-lg">¿Qué ocurrió exactamente? ¿Qué dijiste o hiciste que supusiera un límite?</Label>
            <Textarea id="sit-desc" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ej: “Le dije a mi compañero que no podía cubrirle el turno.”" />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4: Pensamientos
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <Label className="font-semibold text-lg">¿Qué frases surgieron en tu mente? ¿Cuánto las creíste (0–100%)?</Label>
            <p className="text-sm text-muted-foreground">Ej: “Va a pensar que soy egoísta” (85%).</p>
            <div className="space-y-2">
                <Input value={thoughts.thought1.text} onChange={e => handleThoughtChange('thought1', 'text', e.target.value)} placeholder="Pensamiento 1..."/>
                <Slider value={[thoughts.thought1.belief]} onValueChange={v => handleThoughtChange('thought1', 'belief', v[0])} />
            </div>
             <div className="space-y-2">
                <Input value={thoughts.thought2.text} onChange={e => handleThoughtChange('thought2', 'text', e.target.value)} placeholder="Pensamiento 2 (opcional)..."/>
                {thoughts.thought2.text && <Slider value={[thoughts.thought2.belief]} onValueChange={v => handleThoughtChange('thought2', 'belief', v[0])} />}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: // Pantalla 5: Emociones
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <Label className="font-semibold text-lg">¿Qué emociones aparecieron y con qué intensidad (0–100%)?</Label>
                {emotionOptions.map(opt => (
                    <div key={opt.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id={opt.id} checked={emotions[opt.id]?.selected || false} onCheckedChange={c => handleEmotionChange(opt.id, 'selected', !!c)} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                        {emotions[opt.id]?.selected && <Slider value={[emotions[opt.id]?.intensity || 50]} onValueChange={v => handleEmotionChange(opt.id, 'intensity', v[0])}/>}
                    </div>
                ))}
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente</Button>
                 </div>
            </div>
        );
      case 5: // Pantalla 6: Cuerpo y Conducta
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <div className="space-y-2">
                    <Label htmlFor="body-sens">¿Qué notaste en tu cuerpo?</Label>
                    <Textarea id="body-sens" value={bodySensations} onChange={e => setBodySensations(e.target.value)} placeholder="Ej: Tensión en el pecho, mandíbula apretada."/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="behavior">¿Qué hiciste o evitaste hacer tras el límite?</Label>
                    <Textarea id="behavior" value={behavior} onChange={e => setBehavior(e.target.value)} placeholder="Ej: Me fui sin hablar mucho más. Le estuve dando vueltas todo el día."/>
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente</Button>
                 </div>
            </div>
        );
      case 6: // Pantalla 7: Función y respuesta compasiva
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                 <div className="space-y-2">
                    <Label htmlFor="emo-func">¿Qué estaba protegiendo esta emoción? ¿Qué valor estaba detrás?</Label>
                    <Textarea id="emo-func" value={emotionFunction} onChange={e => setEmotionFunction(e.target.value)} placeholder="Ej: La culpa me muestra que me importa el otro y quiero cuidar el vínculo."/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="comp-resp">¿Qué podrías decirte para validar lo que sientes sin dejarte arrastrar?</Label>
                    <Textarea id="comp-resp" value={compassionateResponse} onChange={e => setCompassionateResponse(e.target.value)} placeholder="Ej: 'Es normal sentirme culpable. Estoy aprendiendo. Cuidarme no es egoísmo.'"/>
                </div>
                 <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={nextStep}>Siguiente</Button>
                 </div>
            </div>
        );
      case 7: // Pantalla 8: Reevaluación
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <div className="space-y-2">
                    <Label htmlFor="reassess" className="font-semibold text-lg">¿Cómo ves ahora esa situación? ¿Cambió algo en tu percepción?</Label>
                    <Textarea id="reassess" value={reassessment} onChange={e => setReassessment(e.target.value)} placeholder="Ej: 'Ya no creo que fui egoísta. Estoy empezando a respetarme.'" disabled={isSaved}/>
                </div>
                {!isSaved ? (
                     <div className="flex justify-between w-full mt-4">
                        <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                        <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Registro</Button>
                    </div>
                ) : <Button onClick={nextStep} className="w-full">Ver frases de apoyo</Button>}
            </form>
        );
      case 8: // Pantalla 9: Frases sugeridas
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500 text-center">
                <h4 className="font-semibold text-lg text-primary">Frases de Autocompasión Sugeridas</h4>
                <p className="text-sm text-muted-foreground">Puedes repetir mentalmente o guardar estas frases:</p>
                <ul className="space-y-2 text-left">
                    {["Es incómodo poner límites, pero no es peligroso.", "Puedo sentir culpa y seguir cuidándome.", "Estoy aprendiendo. No necesito hacerlo perfecto.", "Esta emoción me habla, no me define.", "La incomodidad es pasajera. Mi bienestar es más importante que el juicio externo."].map(phrase => (
                        <li key={phrase} className="flex items-center justify-between p-2 border rounded-md bg-background">
                            <span className="text-sm italic">"{phrase}"</span>
                            <Button size="sm" variant="ghost" onClick={() => handleSavePhrase(phrase)} disabled={savedPhrases.includes(phrase)}>{savedPhrases.includes(phrase) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4"/>}</Button>
                        </li>
                    ))}
                </ul>
                <Button onClick={resetExercise} variant="outline" className="w-full mt-4">Finalizar y hacer otro registro</Button>
            </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && 
          <CardDescription className="pt-2">
            {content.objective}
            {content.audioUrl && (
              <div className="mt-4">
                  <audio controls controlsList="nodownload" className="w-full">
                      <source src={content.audioUrl} type="audio/mp3" />
                      Tu navegador no soporta el elemento de audio.
                  </audio>
              </div>
            )}
          </CardDescription>
        }
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
