
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CompassionateFirmnessExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface CompassionateFirmnessExerciseProps {
  content: CompassionateFirmnessExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CompassionateFirmnessExercise({ content, pathId, onComplete }: CompassionateFirmnessExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [otherEmotion, setOtherEmotion] = useState('');
  const [myNeed, setMyNeed] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const finalPhrase = `Veo que te sientes ${otherEmotion}, y al mismo tiempo, yo necesito ${myNeed}.`;

  const handleSave = () => {
    if (!otherEmotion.trim() || !myNeed.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todas las partes de la frase.', variant: 'destructive' });
      return;
    }
    
    addNotebookEntry({ title: "Mi Frase de Firmeza Compasiva", content: `"${finalPhrase}"`, pathId: pathId, userId: user?.id });
    toast({ title: "Frase Guardada", description: "Tu frase se ha guardado en el cuaderno." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setOtherEmotion('');
    setMyNeed('');
    setIsSaved(false);
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Pantalla 1: Instrucciones
        return (
          <div className="p-4 space-y-4 text-center">
            <p>Recuerda una situación reciente en la que alguien reaccionó con incomodidad a un límite que pusiste. Observa cómo se sintió esa persona y qué necesidad estabas defendiendo tú. Luego, completa tu frase usando el siguiente modelo.</p>
            <blockquote className="p-3 border-l-4 border-accent bg-accent/10 italic text-left">
              Veo que te sientes [emoción del otro]… y al mismo tiempo, yo necesito [tu necesidad o límite].
            </blockquote>
            <Button onClick={nextStep}>Ver ejemplos guía <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );

      case 1: // Pantalla 2 (era 3): Ejemplos guía
        return (
          <div className="p-4 space-y-4 text-center">
            <h4 className="font-semibold text-lg">Ejemplos guía</h4>
            <p>A veces, encontrar las palabras justas no es fácil. Por eso, te dejamos aquí algunas frases que pueden inspirarte. No se trata de copiarlas tal cual, sino de usarlas como punto de partida para expresar tu verdad con firmeza y cuidado.</p>
            <ul className="list-disc list-inside space-y-2 p-4 bg-background rounded-md border text-sm text-left">
                <li className="italic">“Sé que esto te está afectando… y aun así, necesito mantener mi decisión.”</li>
                <li className="italic">“Entiendo que esperabas otra cosa, pero esta vez necesito respetar mis tiempos.”</li>
                <li className="italic">“Me doy cuenta de que esto te duele, y al mismo tiempo no puedo encargarme de eso ahora.”</li>
            </ul>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep}>Crear mi frase <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );

      case 2: // Pantalla 3 (era 4): Tu frase personalizada (The form)
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Tu frase personalizada</h4>
             <p>Ahora es tu turno. Piensa en una situación concreta en la que te haya costado mantener tu decisión ante la incomodidad del otro o la otra. A partir de esa situación, escribe una frase que te ayude a validar la emoción ajena sin perder tu centro. Usa el modelo como guía, pero hazla tuya.</p>
             <blockquote className="p-3 border-l-4 border-accent bg-accent/10 italic text-sm text-left">
                Veo que te sientes <strong>[emoción del otro]</strong>, y al mismo tiempo necesito <strong>[tu necesidad o límite]</strong>.
            </blockquote>
             <div className="space-y-2">
                <Label htmlFor="other-emotion">Veo que te sientes...</Label>
                <Textarea id="other-emotion" value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Ej: frustrado/a, decepcionado/a..." disabled={isSaved}/>
             </div>
              <div className="space-y-2">
                <Label htmlFor="my-need">...y al mismo tiempo, yo necesito...</Label>
                <Textarea id="my-need" value={myNeed} onChange={e => setMyNeed(e.target.value)} placeholder="Ej: mantener mi decisión, cuidar mi tiempo..." disabled={isSaved}/>
             </div>
             <p className="text-xs italic">Puedes escribirla en tu cuaderno emocional, repetirla en voz alta o guardarla para futuras conversaciones difíciles.</p>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={handleSave} disabled={isSaved}>
                  {isSaved ? <><CheckCircle className="mr-2 h-4 w-4"/> Guardado</> : <><Save className="mr-2 h-4 w-4" /> Guardar mi Frase</>}
                </Button>
            </div>
          </div>
        );

      case 3: // Confirmation screen
        return (
             <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">¡Frase Guardada!</h4>
                 <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic text-left">
                  "{finalPhrase}"
                </blockquote>
                <p>Recuerda: validar al otro no significa invalidarte a ti. Puedes practicar esta frase para que te salga con naturalidad.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">Crear otra frase</Button>
            </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription>{content.objective}</CardDescription>}
        {content.audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
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
