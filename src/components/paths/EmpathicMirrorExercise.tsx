
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
import { Input } from '../ui/input';

// New emotion options specific for this exercise
const empathicMirrorEmotionOptions = [
  'Tristeza',
  'Miedo',
  'Ira',
  'Culpa',
  'Frustración',
  'Alegría contenida',
];

interface EmpathicMirrorExerciseProps {
  content: EmpathicMirrorExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function EmpathicMirrorExercise({ content, pathId, onComplete }: EmpathicMirrorExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  // New states for Step 1
  const [conversationWith, setConversationWith] = useState('');
  const [conversationTopic, setConversationTopic] = useState('');

  // States for subsequent steps
  const [perceivedEmotion, setPerceivedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [mirrorPhrase, setMirrorPhrase] = useState('');
  const [selectedInvalidating, setSelectedInvalidating] = useState<Record<string, boolean>>({});
  const [otherInvalidating, setOtherInvalidating] = useState('');
  const [commitment, setCommitment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setConversationWith('');
    setConversationTopic('');
    setPerceivedEmotion('');
    setOtherEmotion('');
    setMirrorPhrase('');
    setSelectedInvalidating({});
    setOtherInvalidating('');
    setCommitment('');
    setIsSaved(false);
  };
  
  const invalidatingPhrasesOptions = [
      { id: 'inv-not-big-deal', label: 'No es para tanto.' },
      { id: 'inv-positive-side', label: 'Tienes que ver el lado positivo.' },
      { id: 'inv-i-would', label: 'Yo en tu lugar haría…' },
      { id: 'inv-i-went-through', label: 'Yo también pasé por eso y no me afectó tanto.' },
      { id: 'inv-at-least', label: 'Bueno, al menos no fue peor.' },
  ];

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!commitment.trim()) {
      toast({ title: "Ejercicio Incompleto", description: "Por favor, define tu microacción empática.", variant: "destructive" });
      return;
    }

    const finalEmotion = perceivedEmotion === 'otra' ? otherEmotion : perceivedEmotion;
    const invalidatingPhrases = invalidatingPhrasesOptions.filter(opt => selectedInvalidating[opt.id]).map(opt => opt.label);
    if (selectedInvalidating['inv-other'] && otherInvalidating.trim()) {
      invalidatingPhrases.push(`Otra: ${otherInvalidating.trim()}`);
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: ¿Con quién fue esa conversación? | Respuesta: ${conversationWith || 'No especificado.'}
Pregunta: ¿Qué te compartió o qué tema estaba en juego? | Respuesta: ${conversationTopic || 'No especificado.'}
Pregunta: ¿Qué emoción crees que predominaba en su mensaje? | Respuesta: ${finalEmotion || 'No especificada.'}
Pregunta: Tu frase-espejo | Respuesta: "${mirrorPhrase || 'No escrita.'}"
Pregunta: Posibles frases invalidantes que suelo usar (para evitar) | Respuesta: ${invalidatingPhrases.length > 0 ? `[${invalidatingPhrases.join(', ')}]` : 'Ninguna seleccionada.'}
Pregunta: Mi compromiso (Ej: “Voy a dejar más silencios, sin interrumpir.”) | Respuesta: ${commitment}
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
    setStep(6);
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Intro with example
        return (
          <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
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
            <Button onClick={nextStep}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
          </div>
        );
      case 1: // Pantalla 1: Recuerda una conversación reciente
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Recuerda una conversación reciente</h4>
            <p className="text-sm text-muted-foreground">Piensa en una conversación reciente o habitual en la que alguien te compartió algo con carga emocional.</p>
            <div className="space-y-2">
                <Label htmlFor="conversation-with">¿Con quién fue esa conversación?</Label>
                <Input id="conversation-with" value={conversationWith} onChange={e => setConversationWith(e.target.value)} placeholder="Nombre o inicial..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="conversation-topic">¿Qué te compartió o qué tema estaba en juego?</Label>
                <Textarea id="conversation-topic" value={conversationTopic} onChange={e => setConversationTopic(e.target.value)} />
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!conversationWith.trim() || !conversationTopic.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2: // Pantalla 2: ¿Qué emoción estaba detrás?
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: ¿Qué emoción estaba detrás?</h4>
            <p className="text-sm text-muted-foreground">Ahora, conecta con lo que percibiste en esa persona. No hace falta que sea exacto: simplemente sintoniza con su tono, su expresión, su energía.</p>
            <div className="space-y-2">
              <Label htmlFor="perceived-emotion">¿Qué emoción crees que predominaba en su mensaje?</Label>
              <Select value={perceivedEmotion} onValueChange={setPerceivedEmotion}>
                <SelectTrigger id="perceived-emotion"><SelectValue placeholder="Elige una emoción..." /></SelectTrigger>
                <SelectContent>
                    {empathicMirrorEmotionOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    <SelectItem value="otra">Otra...</SelectItem>
                </SelectContent>
              </Select>
              {perceivedEmotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="mt-2" />}
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!perceivedEmotion}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Pantalla 3: Practica tu frase-espejo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Practica tu frase-espejo</h4>
            <p className="text-sm text-muted-foreground">Ahora vas a reflejar esa emoción, sin interpretar ni corregir. Usa esta fórmula como guía:</p>
            <blockquote className="p-2 border-l-2 border-accent bg-accent/10 italic">“Entiendo que estés [emoción] porque [situación].”</blockquote>
            <p className="text-xs text-muted-foreground">Ejemplo: “Entiendo que estés agotada porque llevas muchos días tirando sola de todo esto.”</p>
            <div className="space-y-2">
                <Label htmlFor="mirror-phrase">Tu frase-espejo:</Label>
                <Textarea id="mirror-phrase" value={mirrorPhrase} onChange={e => setMirrorPhrase(e.target.value)} />
            </div>
            <div className="text-sm mt-2 p-3 border rounded-md bg-background/50">
              <p className="font-semibold">Consejo para la vida real:</p>
              <p>Hablar desde “Entiendo que estés…” transmite empatía y validación emocional sin juzgar ni exagerar. No hace falta tener razón. Basta con estar presente con el otro, sin minimizar ni comparar.</p>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!mirrorPhrase.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 4: // Pantalla 4: Detecta frases que invalidan
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Detecta frases que invalidan (para evitarlas)</h4>
            <p className="text-sm text-muted-foreground">Reflexiona con honestidad: ¿Qué tipo de frases dices a veces, sin querer, que podrían invalidar emocionalmente al otro? Selecciona las que más te resuenen o escribe otras:</p>
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
            <p className="text-sm italic pt-2">Tu intención: Quiero intentar evitar estas respuestas automáticas y practicar el silencio como espacio seguro para el otro.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente</Button>
            </div>
          </div>
        );
      case 5: // Pantalla 5: Define tu próxima microacción empática
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 5: Define tu próxima microacción empática</h4>
            <p className="text-sm text-muted-foreground">Para integrar este aprendizaje, elige una acción pequeña y concreta que pondrás en práctica en tu próxima conversación.</p>
            <div className="space-y-2">
              <Label htmlFor="commitment">Mi compromiso (Ej: “Voy a dejar más silencios, sin interrumpir.”):</Label>
              <Textarea id="commitment" value={commitment} onChange={e => setCommitment(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Marcar como completado</Button>
            </div>
          </form>
        );
      case 6: // Confirmation Screen
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Práctica guardada y completada!</h4>
            <blockquote className="italic text-primary pt-2">“Cuando escuchas sin corregir ni compararte, regalas al otro algo muy poderoso: el permiso de ser quien es.”</blockquote>
            <Button onClick={resetExercise} variant="outline" className="w-full">Practicar de nuevo</Button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && 
          <CardDescription className="pt-2">
            {content.objective}
            {content.duration && <span className="block text-xs mt-1">Duración estimada: {content.duration}</span>}
          </CardDescription>
        }
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
