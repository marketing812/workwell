
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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

const butAlsoOptions = [
  'Pero también podría aprender de ello.',
  'Pero también puedo pedir ayuda si lo necesito.',
  'Pero también he salido adelante en otras ocasiones.',
  'Pero también puedo adaptarme si las cosas no salen como quiero.',
];

const feelingOptions = [
  { id: 'calma', label: 'Me siento un poco más en calma' },
  { id: 'menos_atrapado', label: 'Me siento menos atrapado/a por el pensamiento' },
  { id: 'igual_pero_intento', label: 'Me sigo sintiendo igual, pero agradezco haberlo intentado' },
];

export default function MantraExercise({ content, pathId, onComplete }: MantraExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const isIfButAlsoExercise = content.title.includes('¿Y si…?') && content.title.includes('pero también');

  const [blockingThought, setBlockingThought] = useState('');
  const [ideaBase, setIdeaBase] = useState('');
  const [customIdeaBase, setCustomIdeaBase] = useState('');
  const [personalMantra, setPersonalMantra] = useState('');
  const [ifThought, setIfThought] = useState('');
  const [butAlsoSelected, setButAlsoSelected] = useState('');
  const [butAlsoCustom, setButAlsoCustom] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [otherFeeling, setOtherFeeling] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setBlockingThought('');
    setIdeaBase('');
    setCustomIdeaBase('');
    setPersonalMantra('');
    setIfThought('');
    setButAlsoSelected('');
    setButAlsoCustom('');
    setSelectedFeeling('');
    setOtherFeeling('');
    setIsSaved(false);
  };

  const getFinalButAlsoPhrase = () => {
    return butAlsoSelected === 'other' ? butAlsoCustom.trim() : butAlsoSelected;
  };

  const getCombinedPhrase = () => {
    const thought = ifThought.trim();
    const butAlsoPhrase = getFinalButAlsoPhrase();
    if (!thought || !butAlsoPhrase) return '';
    return `${thought} ${butAlsoPhrase}`;
  };

  const handleSaveIfButAlso = () => {
    const finalButAlsoPhrase = getFinalButAlsoPhrase();
    if (!ifThought.trim() || !finalButAlsoPhrase.trim()) {
      toast({
        title: "Ejercicio Incompleto",
        description: "Completa tu pensamiento y el 'pero también' para guardar.",
        variant: "destructive",
      });
      return;
    }

    const feelingText = selectedFeeling
      ? (selectedFeeling === 'other' ? (otherFeeling.trim() || 'Otro (sin especificar)') : feelingOptions.find(f => f.id === selectedFeeling)?.label)
      : 'No especificado';

    const notebookContent = [
      `Pregunta: ¿Qué “¿Y si...?” apareció en tu mente? | Respuesta: "${ifThought}"`,
      `Pregunta: ¿Con qué “pero también...” lo completaste? | Respuesta: "${finalButAlsoPhrase}"`,
      `Pregunta: Frase completa | Respuesta: "${getCombinedPhrase()}"`,
      `Pregunta: ¿Cómo te sientes después de completar la frase? | Respuesta: "${feelingText}"`,
    ].join('\n');

    addNotebookEntry({
      title: '¿Y si...? pero también...',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión se ha guardado en el cuaderno terapéutico." });
    setIsSaved(true);
    onComplete();
    nextStep();
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

    const notebookContent = [
      `Pregunta: Identifica tu pensamiento de bloqueo. ¿Qué te dices cuando sientes que necesitas tenerlo todo bajo control? | Respuesta: "${blockingThought}"`,
      `Pregunta: Elige una idea base para reformular. ¿Qué te gustaría recordarte cuando el miedo empiece a apretar? | Respuesta: "${finalIdeaBase}"`,
      `Pregunta: Crea tu frase personal | Respuesta: "${personalMantra}"`
    ].join('\n');

    addNotebookEntry({ title: 'Mi Mantra de Confianza', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu mantra de confianza ha sido guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
      const finalIdeaBase = ideaBase === 'Otra:' ? customIdeaBase : ideaBase;
      const finalButAlsoPhrase = getFinalButAlsoPhrase();

      if (isIfButAlsoExercise) {
        switch (step) {
          case 0:
            return (
              <div className="p-4 space-y-4 text-center">
                <Button onClick={nextStep}>Comenzar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            );
          case 1:
            return (
              <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Escribe un pensamiento tipo “¿Y si…?”</h4>
                <p className="text-sm text-muted-foreground">
                  Cuando te enfrentas a algo incierto o que te genera ansiedad, es común que aparezcan pensamientos automáticos del tipo:
                </p>
                <p className="text-sm">“¿Y si no puedo?”, “¿Y si me equivoco?”, “¿Y si sale mal?”</p>
                <p className="text-sm text-muted-foreground">
                  Estos pensamientos suelen activar el miedo y la ansiedad porque tu mente está intentando prepararte para lo peor, aunque eso que imagina no haya ocurrido.
                </p>
                <p className="text-sm text-muted-foreground">
                  Lo que vamos a hacer es detectar uno de esos pensamientos en ti, escribirlo con tus propias palabras y luego aprender a equilibrarlo.
                </p>
                <p className="text-sm text-muted-foreground">
                  Piensa en una situación reciente que te haya generado inseguridad o duda. ¿Qué “¿Y si…?” apareció en tu mente?
                </p>
                <div className="p-3 border rounded-md bg-accent/10 text-sm">
                  <p className="font-medium mb-1">Ejemplos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>“¿Y si digo algo que no tiene sentido?”</li>
                    <li>“¿Y si se enfadan conmigo?”</li>
                    <li>“¿Y si me quedo en blanco durante la reunión?”</li>
                    <li>“¿Y si no soy suficiente?”</li>
                  </ul>
                </div>
                <Label htmlFor="if-thought">Escríbelo aquí, tal y como te viene a la cabeza:</Label>
                <Textarea id="if-thought" value={ifThought} placeholder="Y si..." onChange={e => setIfThought(e.target.value)} />
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                  <Button onClick={nextStep} disabled={!ifThought.trim()}>Siguiente</Button>
                </div>
              </div>
            );
          case 2:
            return (
              <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Completa tu pensamiento con un “pero también…”</h4>
                <p className="text-sm text-muted-foreground">
                  A veces no puedes evitar que tu mente imagine lo peor: ¿Y si me equivoco? ¿Y si no puedo? ¿Y si sale mal?
                </p>
                <p className="text-sm text-muted-foreground">
                  Esta técnica no busca que niegues ese pensamiento, sino que lo completes con otra parte de la historia que también es real:
                  la que recuerda tu experiencia, tu fuerza, tu capacidad de adaptarte incluso cuando las cosas no salen como esperabas.
                </p>
                <p className="text-sm text-muted-foreground">
                  Se trata de decirte: “Sí, puede pasar… pero también puedo con ello.”
                </p>
                <p className="text-sm font-medium">Elige la frase que más te ayude hoy para añadir a tu pensamiento:</p>
                <div className="space-y-3">
                  {butAlsoOptions.map((option, idx) => {
                    const optionId = `but-also-${idx}`;
                    return (
                      <div key={optionId} className="flex items-start gap-2">
                        <Checkbox
                          id={optionId}
                          checked={butAlsoSelected === option}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setButAlsoSelected(option);
                              setButAlsoCustom('');
                            } else if (butAlsoSelected === option) {
                              setButAlsoSelected('');
                            }
                          }}
                        />
                        <Label htmlFor={optionId} className="font-normal">{option}</Label>
                      </div>
                    );
                  })}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="but-also-other"
                      checked={butAlsoSelected === 'other'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setButAlsoSelected('other');
                        } else if (butAlsoSelected === 'other') {
                          setButAlsoSelected('');
                          setButAlsoCustom('');
                        }
                      }}
                    />
                    <Label htmlFor="but-also-other" className="font-normal">Otra opción:</Label>
                  </div>
                  {butAlsoSelected === 'other' && (
                    <Textarea
                      value={butAlsoCustom}
                      onChange={e => setButAlsoCustom(e.target.value)}
                      placeholder='Escribe tu "pero también..."'
                      className="ml-6"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta parte del ejercicio te ayuda a ampliar tu mirada y confiar más en ti.
                  Aunque ocurra lo que temes, también hay algo dentro de ti que sabe sostenerse.
                </p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                  <Button onClick={nextStep} disabled={!finalButAlsoPhrase.trim()}>Siguiente</Button>
                </div>
              </div>
            );
          case 3:
            return (
              <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">Lee tu frase completa… y date un momento para sentirla</h4>
                <p className="text-sm text-muted-foreground">
                  Ahora une las dos partes de tu pensamiento: el “¿Y si…?” que apareció al principio + el “pero también…” que has elegido o escrito.
                </p>
                <div className="p-3 border rounded-md bg-background/60">
                  <p className="text-sm italic">
                    “¿Y si me bloqueo en mitad de la reunión?” vale, pero también puedo respirar, seguir adelante y recuperarme poco a poco.
                  </p>
                </div>
                <div className="p-3 border rounded-md bg-accent/10">
                  <p className="text-sm font-medium">Tu frase completa:</p>
                  <p className="text-sm mt-1">{getCombinedPhrase()}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Léelo en voz alta o en silencio. Haz una pausa. Respira.
                  Permite que esta frase no solo suene distinta, sino que se sienta distinta en ti.
                </p>
                <p className="text-sm text-muted-foreground">
                  Este ejercicio no elimina el miedo, pero te recuerda que puedes sostenerlo con más recursos de los que crees.
                  Esa también es parte de tu historia.
                </p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                  <Button onClick={nextStep}>Siguiente</Button>
                </div>
              </div>
            );
          case 4:
            return (
              <div className="p-4 space-y-4">
                <h4 className="font-semibold text-lg">¿Cómo te sientes después de completar la frase?</h4>
                <p className="text-sm text-muted-foreground">
                  Ahora que has escrito y leído tu frase completa, detente un momento.
                </p>
                <p className="text-sm text-muted-foreground">
                  ¿Qué ha cambiado en ti, aunque sea sutil? ¿Notas algo diferente en tu cuerpo, tu respiración o tu forma de mirar la situación?
                </p>
                <p className="text-sm font-medium">Elige lo que más se parezca a lo que estás sintiendo ahora:</p>
                <div className="space-y-3">
                  {feelingOptions.map(option => (
                    <div key={option.id} className="flex items-start gap-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedFeeling === option.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeeling(option.id);
                            setOtherFeeling('');
                          } else if (selectedFeeling === option.id) {
                            setSelectedFeeling('');
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                    </div>
                  ))}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="feeling-other"
                      checked={selectedFeeling === 'other'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFeeling('other');
                        } else if (selectedFeeling === 'other') {
                          setSelectedFeeling('');
                          setOtherFeeling('');
                        }
                      }}
                    />
                    <Label htmlFor="feeling-other" className="font-normal">Otro (escríbelo si quieres):</Label>
                  </div>
                  {selectedFeeling === 'other' && (
                    <Textarea value={otherFeeling} onChange={e => setOtherFeeling(e.target.value)} className="ml-6" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  No hace falta que todo cambie de golpe.
                  A veces, darle otra forma a un pensamiento es el primer paso para vivirlo de otra manera.
                </p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                  <Button onClick={handleSaveIfButAlso} disabled={isSaved}>
                    <Save className="mr-2 h-4 w-4" /> Guardar en mi cuaderno terapéutico
                  </Button>
                </div>
              </div>
            );
          case 5:
            return (
              <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Ejercicio guardado</h4>
                <p>Tu escenario “¿Y si...? pero también...” se ha guardado en el cuaderno terapéutico.</p>
                <Button onClick={resetExercise} variant="outline" className="w-full">
                  Repetir ejercicio
                </Button>
              </div>
            );
          default:
            return null;
        }
      }

      switch (step) {
        case 0: // Intro
            return (
                <div className="p-4 space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">Cuando no tienes certezas, tu mente busca control. Esta técnica te ayuda a entrenar lo contrario: una confianza activa. Vas a crear una frase breve, realista y significativa que funcione como una autoinstrucción emocional. Una especie de brújula interna que puedas repetirte cuando la inseguridad aparezca. No se trata de frases vacías, sino de una afirmación que te recuerde que puedes sostenerte aunque no tengas todo resuelto.</p>
                    <Button onClick={nextStep}>Empezar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            );
        case 1: // PANTALLA 1 – Identifica tu pensamiento de bloqueo
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Identifica tu pensamiento de bloqueo</h4>
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
        case 2: // PANTALLA 2 – Elige una idea base para reformular
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Elige una idea base para reformular</h4>
                    <p className="text-sm text-muted-foreground">¿Qué te gustaría recordarte cuando el miedo empiece a apretar?</p>
                    <RadioGroup value={ideaBase} onValueChange={setIdeaBase} className="space-y-1">
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
                        <Textarea value={customIdeaBase} onChange={e => setCustomIdeaBase(e.target.value)} className="ml-6 mt-2" />
                    )}
                    <div className="flex justify-between w-full mt-4">
                        <Button onClick={prevStep} variant="outline">Atrás</Button>
                        <Button onClick={nextStep} disabled={!finalIdeaBase?.trim()}>Siguiente</Button>
                    </div>
                </div>
            );
        case 3: // PANTALLA 3 – Crea tu frase personal
            return (
                <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                    <h4 className="font-semibold text-lg">Crea tu frase personal</h4>
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
                        <Button onClick={prevStep} variant="outline">Atrás</Button>
                        <Button onClick={nextStep} disabled={!personalMantra.trim()}>Siguiente</Button>
                    </div>
                </div>
            );
        case 4: // PANTALLA 4 – Usa tu mantra en acción
            return (
              <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Usa tu mantra en acción</h4>
                <p className="text-muted-foreground">Tu mantra no es solo para tranquilizarte. Es para recordarte quién eres cuando el miedo quiera tomar las riendas.</p>
                <p className="text-muted-foreground">Úsalo:</p>
                <ul className="list-disc list-inside text-left mx-auto max-w-md text-sm">
                    <li>Antes de una situación que te active inseguridad</li>
                    <li>Cuando notes que estás anticipando demasiado</li>
                    <li>Como ritual diario para conectar con tu centro</li>
                </ul>
                <p className="italic text-primary pt-2">Repetirlo te entrena. Cuanto más lo digas, más fácil será que tu cuerpo lo reconozca como una señal de seguridad.</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline" type="button">Atrás</Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
                    </Button>
                </div>
              </form>
            );
        case 5: // Confirmation
            return (
                <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h4 className="font-bold text-lg">Mantra Guardado</h4>
                    <p>Tu mantra se ha guardado en el Cuaderno Terapéutico. Puedes volver a él cuando necesites recordar tu fuerza.</p>
                    <Button onClick={resetExercise} variant="outline" className="w-full">
                        Crear otro mantra
                    </Button>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription>{content.objective}</CardDescription>
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

