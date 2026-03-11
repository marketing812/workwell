"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, Save, ArrowLeft } from 'lucide-react';
import type { ValidationIn3StepsExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';

interface ValidationIn3StepsExerciseProps {
  content: ValidationIn3StepsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ValidationIn3StepsExercise({ content, pathId, onComplete }: ValidationIn3StepsExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [perceivedEmotion, setPerceivedEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [step1Phrase, setStep1Phrase] = useState('');
  const [step2Phrase, setStep2Phrase] = useState('');
  const [step3Phrase, setStep3Phrase] = useState('');
  const [blockageReflection, setBlockageReflection] = useState('');
  const [nextStepReflection, setNextStepReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const next = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleComplete = () => {
    if (step === 3 && (!blockageReflection.trim() || !nextStepReflection.trim())) {
      toast({ title: 'ReflexiÃ³n incompleta', description: 'Por favor, completa ambos campos de reflexiÃ³n.', variant: 'destructive' });
      return;
    }

    const finalEmotion = perceivedEmotion === 'otra' ? otherEmotion : (t[perceivedEmotion as keyof typeof t] || perceivedEmotion);

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Â¿QuÃ© emociÃ³n crees que sentÃ­a? | Respuesta: ${finalEmotion || 'No especificada.'}
Pregunta: Tu frase empÃ¡tica para reconocer la emociÃ³n | Respuesta: "${step1Phrase || 'No escrita.'}"
Pregunta: Tu frase completa | Respuesta: "${step2Phrase || 'No escrita.'}"
Pregunta: Tu frase para normalizar | Respuesta: "${step3Phrase || 'No escrita.'}"
Pregunta: Â¿En quÃ© situaciones me resulta mÃ¡s difÃ­cil validar emocionalmente a alguien? | Respuesta: ${blockageReflection || 'No especificado.'}
Pregunta: Â¿QuÃ© podrÃ­a empezar a hacer diferente para estar mÃ¡s presente? | Respuesta: ${nextStepReflection || 'No especificado.'}
    `;

    addNotebookEntry({
      title: 'PrÃ¡ctica: ValidaciÃ³n en 3 Pasos',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: 'Ejercicio finalizado y guardado', description: 'Has completado la prÃ¡ctica de ValidaciÃ³n en 3 Pasos.' });
    setIsCompleted(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Reconoce la emociÃ³n del otro</h4>
            <p className="text-sm text-muted-foreground">
              Piensa en una situaciÃ³n reciente en la que alguien te compartiÃ³ algo con carga emocional. Trata de identificar quÃ© sentÃ­a esa persona.
            </p>
            <div className="space-y-2">
              <Label htmlFor="perceived-emotion">Â¿QuÃ© emociÃ³n crees que sentÃ­a?</Label>
              <Select value={perceivedEmotion} onValueChange={setPerceivedEmotion}>
                <SelectTrigger id="perceived-emotion">
                  <SelectValue placeholder="Elige una emociÃ³n..." />
                </SelectTrigger>
                <SelectContent>
                  {emotionOptions.map((e) => (
                    <SelectItem key={e.value} value={e.labelKey}>
                      {t[e.labelKey as keyof typeof t]}
                    </SelectItem>
                  ))}
                  <SelectItem value="otra">Otra...</SelectItem>
                </SelectContent>
              </Select>
              {perceivedEmotion === 'otra' && (
                <Textarea value={otherEmotion} onChange={(e) => setOtherEmotion(e.target.value)} placeholder="Describe la otra emociÃ³n..." className="mt-2" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="step1-phrase">Tu frase empÃ¡tica para reconocer la emociÃ³n:</Label>
              <Textarea id="step1-phrase" value={step1Phrase} onChange={(e) => setStep1Phrase(e.target.value)} placeholder="Ej: Entiendo que estÃ©s triste..." />
            </div>
            <Button onClick={next} className="w-full">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: NÃ³mbralo y dale sentido</h4>
            <p className="text-sm text-muted-foreground">
              Conecta esa emociÃ³n con la situaciÃ³n que la generÃ³. Usa esta fÃ³rmula como guÃ­a: "Entiendo que estÃ©s [emociÃ³n] porque [situaciÃ³n]".
            </p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p>Ejemplo: "Entiendo que estÃ©s frustrada porque sentÃ­as que habÃ­as dado mucho y nadie lo valorÃ³".</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="step2-phrase">Tu frase completa:</Label>
              <Textarea id="step2-phrase" value={step2Phrase} onChange={(e) => setStep2Phrase(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={next} className="w-auto">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Normaliza sin justificar</h4>
            <p className="text-sm text-muted-foreground">Elige una frase que le diga al otro: "Tu emociÃ³n tiene sentido en este contexto".</p>
            <ul className="list-disc list-inside text-sm pl-4">
              <li>"Cualquiera en tu lugar podrÃ­a sentirse asÃ­".</li>
              <li>"Es natural que te sientas asÃ­ despuÃ©s de lo que ha ocurrido".</li>
              <li>"No es raro sentirse asÃ­ cuando uno se esfuerza tanto y no recibe respuesta".</li>
            </ul>
            <div className="space-y-2">
              <Label htmlFor="step3-phrase">Tu frase para normalizar:</Label>
              <Textarea id="step3-phrase" value={step3Phrase} onChange={(e) => setStep3Phrase(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={next} className="w-auto">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Toma conciencia de tus bloqueos</h4>
            <p className="text-sm text-muted-foreground">A veces, sin querer, nos cuesta validar a los demÃ¡s. QuizÃ¡ por incomodidad, cansancio o automatismos aprendidos.</p>
            <div className="space-y-2">
              <Label htmlFor="blockage-reflection">Â¿En quÃ© situaciones me resulta mÃ¡s difÃ­cil validar emocionalmente a alguien?</Label>
              <Textarea id="blockage-reflection" value={blockageReflection} onChange={(e) => setBlockageReflection(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-step-reflection">Â¿QuÃ© podrÃ­a empezar a hacer diferente para estar mÃ¡s presente?</Label>
              <Textarea id="next-step-reflection" value={nextStepReflection} onChange={(e) => setNextStepReflection(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={handleComplete} className="w-auto">
                <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapÃ©utico
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
          renderStep()
        ) : (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Â¡PrÃ¡ctica finalizada!</h4>
            <p className="text-muted-foreground">
              Cuando validas, no estÃ¡s diciendo "tienes razÃ³n", estÃ¡s diciendo: "lo que sientes importa y estoy aquÃ­ contigo".
            </p>
            
          </div>
        )}
      </CardContent>
    </Card>
  );
}

