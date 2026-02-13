
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

const peroTambienOptions = [
    'Pero también podría aprender de ello.',
    'Pero también puedo pedir ayuda si lo necesito.',
    'Pero también he salido adelante en otras ocasiones.',
    'Pero también puedo adaptarme si las cosas no salen como quiero.',
];

const feelingOptions = [
    'Me siento un poco más en calma',
    'Me siento menos atrapado/a por el pensamiento',
    'Me sigo sintiendo igual, pero agradezco haberlo intentado',
];

export default function MantraExercise({ content, pathId, onComplete }: MantraExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [ySiThought, setYSiThought] = useState('');
  const [peroTambienThought, setPeroTambienThought] = useState('');
  const [customPeroTambien, setCustomPeroTambien] = useState('');
  const [finalFeeling, setFinalFeeling] = useState('');
  const [customFinalFeeling, setCustomFinalFeeling] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setYSiThought('');
    setPeroTambienThought('');
    setCustomPeroTambien('');
    setFinalFeeling('');
    setCustomFinalFeeling('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const finalPeroTambien = peroTambienThought === 'Otra opción:' ? customPeroTambien : peroTambienThought;
    const finalFeelingText = finalFeeling === 'Otro (escríbelo si quieres):' ? customFinalFeeling : finalFeeling;

    if (!ySiThought.trim() || !finalPeroTambien?.trim() || !finalFeelingText?.trim()) {
      toast({
        title: "Ejercicio Incompleto",
        description: "Por favor, completa todos los pasos para guardar.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi pensamiento "¿Y si...?":*
"${ySiThought}"

*Mi pensamiento "...pero también...":*
"${finalPeroTambien}"

*Frase completa:*
"¿Y si ${ySiThought}? ...vale, pero también ${finalPeroTambien}."

*Cómo me siento después:*
${finalFeelingText}
    `;

    addNotebookEntry({
      title: "Cuestionando mis '¿Y si...?'",
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico.",
    });
    setIsSaved(true);
    onComplete();
    nextStep(); // Ir a la pantalla de confirmación
  };
  
  const finalPeroTambien = peroTambienThought === 'Otra opción:' ? customPeroTambien : peroTambienThought;

  const renderStep = () => {
      switch (step) {
        case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Cuando te enfrentas a algo incierto o que te genera ansiedad, es común que aparezcan pensamientos automáticos del tipo: “¿Y si no puedo?”, “¿Y si me equivoco?”, “¿Y si sale mal?” Estos pensamientos suelen activar el miedo y la ansiedad porque tu mente está intentando prepararte para lo peor, aunque eso que imagina no haya ocurrido. Lo que vamos a hacer es detectar uno de esos pensamientos en ti, escribirlo con tus propias palabras y luego aprender a equilibrarlo.
            </p>
            <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Escribe un pensamiento tipo “¿Y si…?”</h4>
            <p className="text-sm text-muted-foreground">Escribe aquí, tal y como te viene a la cabeza:</p>
            <p className="text-xs text-muted-foreground italic">Ejemplo: “¿Y si digo algo que no tiene sentido?”, “¿Y si se enfadan conmigo?”, “¿Y si me quedo en blanco durante la reunión?”, “¿Y si no soy suficiente?”</p>
            <Label htmlFor="ySiThought" className="sr-only">Escríbelo aquí, tal y como te viene a la cabeza:</Label>
            <Textarea id="ySiThought" value={ySiThought} onChange={e => setYSiThought(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!ySiThought.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 2: Completa tu pensamiento con un “pero también…”</h4>
                <p className="text-sm text-muted-foreground">A veces no puedes evitar que tu mente imagine lo peor: ¿Y si me equivoco? ¿Y si no puedo? ¿Y si sale mal? Esta técnica no busca que niegues ese pensamiento, sino que lo completes con otra parte de la historia que también es real: la que recuerda tu experiencia, tu fuerza, tu capacidad de adaptarte incluso cuando las cosas no salen como esperabas. Se trata de decirte: “Sí, puede pasar… pero también puedo con ello.”</p>
                <Label>Elige la frase que más te ayude hoy para añadir a tu pensamiento:</Label>
                <RadioGroup value={peroTambienThought} onValueChange={setPeroTambienThought}>
                    {peroTambienOptions.map((opt, i) => (
                        <div className="flex items-center space-x-2" key={i}>
                            <RadioGroupItem value={opt} id={`pero-${i}`} />
                            <Label htmlFor={`pero-${i}`} className="font-normal">{opt}</Label>
                        </div>
                    ))}
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Otra opción:" id="pero-other" />
                        <Label htmlFor="pero-other" className="font-normal">Otra opción:</Label>
                    </div>
                </RadioGroup>
                {peroTambienThought === 'Otra opción:' && (
                    <Textarea value={customPeroTambien} onChange={e => setCustomPeroTambien(e.target.value)} className="ml-6" />
                )}
                <p className="text-sm text-muted-foreground italic">Esta parte del ejercicio te ayuda a ampliar tu mirada y confiar más en ti. Aunque ocurra lo que temes, también hay algo dentro de ti que sabe sostenerse.</p>
                <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline">Atrás</Button>
                    <Button onClick={nextStep} disabled={!finalPeroTambien?.trim()}>Siguiente</Button>
                </div>
            </div>
        );
      case 3:
        return (
            <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 3: Lee tu frase completa… y date un momento para sentirla</h4>
                <p className="text-sm text-muted-foreground">Ahora une las dos partes de tu pensamiento: el “¿Y si…?” que apareció al principio + el “pero también…” que has elegido o escrito.</p>
                <blockquote className="p-4 border-l-4 border-accent bg-accent/10 italic text-left">
                    “¿Y si ${ySiThought}? ...vale, pero también ${finalPeroTambien}.”
                </blockquote>
                <p className="text-sm text-muted-foreground">Léelo en voz alta o en silencio. Haz una pausa. Respira. Permite que esta frase no solo suene distinta, sino que se sienta distinta en ti. Este ejercicio no elimina el miedo, pero te recuerda que puedes sostenerlo con más recursos de los que crees. Esa también es parte de tu historia.</p>
                <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline">Atrás</Button>
                    <Button onClick={nextStep}>Siguiente</Button>
                </div>
            </div>
        );
      case 4:
        return (
            <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 4: ¿Cómo te sientes después de completar la frase?</h4>
                <p className="text-sm text-muted-foreground">Ahora que has escrito y leído tu frase completa, detente un momento. ¿Qué ha cambiado en ti, aunque sea sutil? ¿Notas algo diferente en tu cuerpo, tu respiración o tu forma de mirar la situación? Elige lo que más se parezca a lo que estás sintiendo ahora:</p>
                <RadioGroup value={finalFeeling} onValueChange={setFinalFeeling}>
                    {feelingOptions.map((opt, i) => (
                        <div className="flex items-center space-x-2" key={i}>
                            <RadioGroupItem value={opt} id={`feel-${i}`} />
                            <Label htmlFor={`feel-${i}`} className="font-normal">{opt}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Otro (escríbelo si quieres):" id="feel-other" />
                        <Label htmlFor="feel-other" className="font-normal">Otro (escríbelo si quieres):</Label>
                    </div>
                </RadioGroup>
                 {finalFeeling === 'Otro (escríbelo si quieres):' && (
                    <Textarea value={customFinalFeeling} onChange={e => setCustomFinalFeeling(e.target.value)} className="ml-6" />
                )}
                <p className="text-xs text-muted-foreground italic">No hace falta que todo cambie de golpe. A veces, darle otra forma a un pensamiento es el primer paso para vivirlo de otra manera.</p>
                <div className="flex justify-between w-full">
                    <Button onClick={prevStep} variant="outline" type="button">Atrás</Button>
                    <Button type="submit" disabled={isSaved}>
                        <Save className="mr-2 h-4 w-4" /> Guardar en mi cuaderno terapeútico
                    </Button>
                </div>
            </form>
        );
      case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Guardado!</h4>
            <p className="text-muted-foreground">
              Tu reflexión se ha guardado correctamente. Puedes volver a ella en tu cuaderno cuando lo necesites.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={resetExercise} variant="outline">
                Hacer otro registro
              </Button>
            </div>
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
