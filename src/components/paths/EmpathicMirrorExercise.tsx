"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import type { EmpathicMirrorExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';

const empathicMirrorEmotionOptions = [
  'Tristeza',
  'Miedo',
  'Ira',
  'Asco',
  'Estrés',
  'Ansiedad',
  'Agobio',
  'Tensión',
  'Alarma',
  'Cansancio emocional',
  'Desaliento',
  'Vacío',
  'Frustración',
  'Rechazo',
  'Soledad',
  'Celos',
  'Envidia',
  'Vergüenza',
  'Culpa',
  'Inseguridad',
  'Confusión',
  'Ambivalencia',
  'Alegría',
  'Sorpresa',
  'Ilusión',
  'Entusiasmo',
  'Esperanza',
  'Amor',
  'Confianza',
  'Orgullo'
];


interface EmpathicMirrorExerciseProps {
  content: EmpathicMirrorExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function EmpathicMirrorExercise({ content, pathId, onComplete }: EmpathicMirrorExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [perceivedEmotion, setPerceivedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [mirrorPhrase, setMirrorPhrase] = useState('');
  const [selectedInvalidating, setSelectedInvalidating] = useState<Record<string, boolean>>({});
  const [otherInvalidating, setOtherInvalidating] = useState('');
  const [commitment, setCommitment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setPerceivedEmotion('');
    setOtherEmotion('');
    setMirrorPhrase('');
    setSelectedInvalidating({});
    setOtherInvalidating('');
    setCommitment('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!mirrorPhrase.trim() && !commitment.trim()) {
      toast({ title: "Ejercicio Incompleto", description: "Por favor, completa al menos tu frase-espejo y tu compromiso.", variant: "destructive" });
      return;
    }
    const finalEmotion = perceivedEmotion === 'otra' ? otherEmotion : perceivedEmotion;

    const invalidatingPhrases = invalidatingPhrasesOptions.filter(opt => selectedInvalidating[opt.id]).map(opt => opt.label);
    if (selectedInvalidating['inv-other'] && otherInvalidating.trim()) {
      invalidatingPhrases.push(`Otra: ${otherInvalidating.trim()}`);
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Emoción percibida en el otro:**
${finalEmotion || 'No especificada.'}

**Mi frase-espejo:**
"${mirrorPhrase}"

**Posibles bloqueos que tiendo a usar:**
${invalidatingPhrases.length > 0 ? invalidatingPhrases.map(p => `- ${p}`).join('\n') : 'Ninguno seleccionado.'}

**Mi compromiso para practicar:**
${commitment || 'No especificado.'}
`;

    addNotebookEntry({ 
      title: 'Mi Práctica de Espejo Empático', 
      content: notebookContent, 
      pathId: pathId,
      userId: user?.id,
    });
    
    toast({ title: "Ejercicio Guardado", description: "Tu práctica de Espejo Empático se ha guardado en el cuaderno." });
    setIsSaved(true);
    onComplete();
    next();
  };

  const invalidatingPhrasesOptions = [
      { id: 'inv-not-big-deal', label: 'No es para tanto.' },
      { id: 'inv-positive-side', label: 'Tienes que ver el lado positivo.' },
      { id: 'inv-i-would', label: 'Yo en tu lugar haría…' },
      { id: 'inv-i-went-through', label: 'Yo también pasé por eso y no me afectó tanto.' },
      { id: 'inv-at-least', label: 'Bueno, al menos no fue peor.' },
  ];
  
  const renderStep = () => {
    switch(step) {
      case 0: // Intro with example
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="italic text-muted-foreground">Antes de empezar, te mostramos un ejemplo para guiarte. Lo importante es que uses tus propias palabras y seas honesto/a contigo.</p>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="example">
                <AccordionTrigger>Ver ejemplo completo</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm p-2 border bg-background rounded-md">
                    <p><strong>Situación:</strong> Una amiga te cuenta que está muy agobiada con el trabajo.</p>
                    <p><strong>Emoción que percibes:</strong> Agobio, cansancio.</p>
                    <p><strong>Frase-espejo:</strong> “Veo que estás agotada porque sientes que no llegas a todo.”</p>
                    <p><strong>Reflexión final:</strong> Al decirlo así, sentí que ella se relajaba. No tuve que solucionar nada, solo acompañar.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: ¿Qué emoción estaba detrás?</h4>
             <p className="text-sm text-muted-foreground">Conecta con lo que percibiste en esa persona. No hace falta que sea exacto: simplemente sintoniza con su tono, su expresión, su energía.</p>
             <div className="space-y-2">
                <Label htmlFor="perceived-emotion">¿Qué emoción crees que predominaba en su mensaje?</Label>
                <Select value={perceivedEmotion} onValueChange={setPerceivedEmotion}>
                    <SelectTrigger id="perceived-emotion"><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                    <SelectContent>
                        {empathicMirrorEmotionOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        <SelectItem value="otra">Otra...</SelectItem>
                    </SelectContent>
                </Select>
                {perceivedEmotion === 'otra' && (
                     <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2" />
                )}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );
      case 2:
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 2: Practica tu frase-espejo</h4>
                <p className="text-sm text-muted-foreground">Ahora vas a reflejar esa emoción, sin interpretar ni corregir. Usa esta fórmula como guía: “Entiendo que estés [emoción] porque [situación].”</p>
                <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                    <p>Ejemplo: “Entiendo que estés frustrada porque sentías que habías dado mucho y nadie lo valoró.”</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mirror-phrase">Tu frase-espejo:</Label>
                    <Textarea id="mirror-phrase" value={mirrorPhrase} onChange={e => setMirrorPhrase(e.target.value)} />
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        );
      case 3:
        return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 3: Detecta frases que invalidan (para evitarlas)</h4>
                <p className="text-sm text-muted-foreground">Reflexiona con honestidad: ¿Qué tipo de frases dices a veces, sin querer, que podrían invalidar emocionalmente al otro?</p>
                 <div className="space-y-2">
                    {invalidatingPhrasesOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={selectedInvalidating[opt.id] || false} onCheckedChange={c => setSelectedInvalidating(p => ({ ...p, [opt.id]: !!c }))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="inv-other" checked={selectedInvalidating['inv-other'] || false} onCheckedChange={c => setSelectedInvalidating(p => ({ ...p, 'inv-other': !!c }))} />
                        <Label htmlFor="inv-other" className="font-normal">Otra:</Label>
                    </div>
                    {selectedInvalidating['inv-other'] && <Textarea value={otherInvalidating} onChange={e => setOtherInvalidating(e.target.value)} placeholder="Escribe otra frase que suelas usar..." className="ml-6"/>}
                </div>
                <p className="text-xs text-muted-foreground italic">Tu intención: Quiero intentar evitar estas respuestas automáticas y practicar el silencio como espacio seguro para el otro.</p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        );
      case 4:
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Paso 4: Define tu próxima microacción empática</h4>
                <p className="text-sm text-muted-foreground">Para integrar este aprendizaje, elige una acción pequeña y concreta que pondrás en práctica en tu próxima conversación.</p>
                <div className="space-y-2">
                    <Label htmlFor="commitment">Mi compromiso (Ej: “Voy a dejar más silencios, sin interrumpir.”):</Label>
                    <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} />
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> Guardar y Finalizar
                  </Button>
                </div>
            </form>
        );
      case 5:
        return (
            <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Práctica guardada y completada!</h4>
                 <p className="text-muted-foreground">Cuando escuchas sin corregir ni compararte, regalas al otro algo muy poderoso: el permiso de ser quien es.</p>
                 <Button onClick={resetExercise} variant="outline" className="w-full">Practicar de nuevo</Button>
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
