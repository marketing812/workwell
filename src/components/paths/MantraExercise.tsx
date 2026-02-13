"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MantraExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface MantraExerciseProps {
  content: MantraExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const ideaBaseOptions = [
    'Puedo avanzar, aunque no lo tenga todo claro',
    'No necesito controlar todo para estar bien',
    'Puedo sostenerme incluso si tengo miedo',
    'Aprenderé pase lo que pase',
    'Soy capaz de adaptarme',
];

export default function MantraExercise({ content, pathId, onComplete }: MantraExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [blockingThought, setBlockingThought] = useState('');
  const [ideaBase, setIdeaBase] = useState('');
  const [customIdeaBase, setCustomIdeaBase] = useState('');
  const [personalMantra, setPersonalMantra] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setBlockingThought('');
    setIdeaBase('');
    setCustomIdeaBase('');
    setPersonalMantra('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!personalMantra.trim()) {
      toast({
        title: "Ejercicio Incompleto",
        description: "Por favor, crea tu frase personal para guardar.",
        variant: "destructive",
      });
      return;
    }

    const finalIdeaBase = ideaBase === 'Otra:' ? customIdeaBase : ideaBase;

    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi pensamiento de bloqueo:*
"${blockingThought}"

*Idea base elegida para reformular:*
"${finalIdeaBase}"

*Mi mantra personal es:*
"${personalMantra}"
    `;

    addNotebookEntry({
      title: "Mi Mantra de Confianza",
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu mantra de confianza se ha guardado en el Cuaderno Terapéutico.",
    });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
      const finalIdeaBase = ideaBase === 'Otra:' ? customIdeaBase : ideaBase;
      switch (step) {
        case 0:
            return (
                <div className="p-4 space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">Cuando no tienes certezas, tu mente busca control. Esta técnica te ayuda a entrenar lo contrario: una confianza activa. Vas a crear una frase breve, realista y significativa que funcione como una autoinstrucción emocional. Una especie de brújula interna que puedas repetirte cuando la inseguridad aparezca. No se trata de frases vacías, sino de una afirmación que te recuerde que puedes sostenerte aunque no tengas todo resuelto.</p>
                    <Button onClick={nextStep}>Empezar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Identifica tu pensamiento de bloqueo</h4>
            <p className="text-sm text-muted-foreground">Piensa en lo que te sueles decir cuando el miedo o la inseguridad aparecen:</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p><strong>Ejemplos:</strong></p>
                <ul className="list-disc list-inside">
                    <li>“No voy a poder.”</li>
                    <li>“Todo tiene que salir perfecto.”</li>
                    <li>“Si me equivoco, será un desastre.”</li>
                    <li>“Si no lo controlo, algo malo va a pasar.”</li>
                </ul>
            </div>
            <Label htmlFor="blockingThought">¿Qué te dices cuando sientes que necesitas tenerlo todo bajo control?</Label>
            <Textarea id="blockingThought" value={blockingThought} onChange={e => setBlockingThought(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!blockingThought.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 2: Elige una idea base para reformular</h4>
                <p className="text-sm text-muted-foreground">¿Qué te gustaría recordarte cuando el miedo empiece a apretar?</p>
                <RadioGroup value={ideaBase} onValueChange={setIdeaBase}>
                    {ideaBaseOptions.map((opt, i) => (
                        <div className="flex items-center space-x-2" key={i}>
                            <RadioGroupItem value={opt} id={`idea-${i}`} />
                            <Label htmlFor={`idea-${i}`} className="font-normal">{opt}</Label>
                        </div>
                    ))}
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Otra:" id="idea-other" />
                        <Label htmlFor="idea-other" className="font-normal">Otra:</Label>
                    </div>
                </RadioGroup>
                {ideaBase === 'Otra:' && (
                    <Textarea value={customIdeaBase} onChange={e => setCustomIdeaBase(e.target.value)} className="ml-6" />
                )}
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline">Atrás</Button>
                    <Button onClick={nextStep} disabled={!finalIdeaBase?.trim()}>Siguiente</Button>
                </div>
            </div>
        );
      case 3:
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Crea tu frase personal</h4>
                <p className="text-sm text-muted-foreground">Usa tus propias palabras o inspírate con estas fórmulas:</p>
                <ul className="list-disc list-inside text-sm pl-4">
                    <li>“Aunque ___, puedo ___.”</li>
                    <li>“Estoy eligiendo confiar en ___.”</li>
                    <li>“No necesito ___ para ___.”</li>
                </ul>
                <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                    <p><strong>Ejemplos:</strong></p>
                    <ul className="list-disc list-inside">
                        <li>“No necesito tenerlo todo resuelto para seguir avanzando.”</li>
                        <li>“Aunque me dé miedo, puedo afrontarlo paso a paso.”</li>
                        <li>“Estoy eligiendo confiar en mi capacidad de adaptarme.”</li>
                    </ul>
                </div>
                <Label htmlFor="personalMantra">Escribe tu frase aquí:</Label>
                <Textarea id="personalMantra" value={personalMantra} onChange={e => setPersonalMantra(e.target.value)} />

                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline" type="button">Atrás</Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Guardar mi mantra
                    </Button>
                </div>
            </form>
        );
      case 4:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Paso 4: Usa tu mantra en acción</h4>
            <p className="text-muted-foreground">Tu mantra no es solo para tranquilizarte. Es para recordarte quién eres cuando el miedo quiera tomar las riendas. Úsalo:</p>
            <ul className="list-disc list-inside text-left mx-auto max-w-md text-sm">
                <li>Antes de una situación que te active inseguridad</li>
                <li>Cuando notes que estás anticipando demasiado</li>
                <li>Como ritual diario para conectar con tu centro</li>
            </ul>
             <p className="italic text-primary pt-2">Repetirlo te entrena. Cuanto más lo digas, más fácil será que tu cuerpo lo reconozca como una señal de seguridad.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full mt-4">
              Crear otro mantra
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
