
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapOfUnsaidThingsExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';

interface MapOfUnsaidThingsExerciseProps {
  content: MapOfUnsaidThingsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const emotionOptions = [
    { id: 'emo-anxiety', label: 'Ansiedad' },
    { id: 'emo-guilt', label: 'Culpa' },
    { id: 'emo-shame', label: 'Vergüenza' },
    { id: 'emo-frustration', label: 'Frustración' },
    { id: 'emo-sadness', label: 'Tristeza' },
    { id: 'emo-apathy', label: 'Apatía / desconexión' },
    { id: 'emo-insecurity', label: 'Inseguridad' },
    { id: 'emo-overwhelm', label: 'Agobio' },
    { id: 'emo-fear-judgment', label: 'Miedo al juicio' },
    { id: 'emo-passive-resistance', label: 'Resistencia pasiva' },
];

const blockageOptions = [
    { id: 'block-conflict-fear', label: 'Miedo al conflicto' },
    { id: 'block-desire-to-please', label: 'Deseo de agradar o no decepcionar' },
    { id: 'block-guilt', label: 'Culpa por priorizarme' },
    { id: 'block-low-self-esteem', label: 'Baja autoestima o inseguridad' },
    { id: 'block-negative-anticipation', label: 'Anticipación negativa de consecuencias' },
    { id: 'block-belief-better-silent', label: 'Creencia de que “mejor callar que incomodar”' },
];

const openerSuggestions = [
  {
    id: 'opener-1',
    text: 'Sé que puede sonar incómodo, pero necesito poner en palabras algo que me ha hecho sentir mal.',
  },
  {
    id: 'opener-2',
    text: 'No suelo hablar de esto, pero prefiero contártelo antes que seguir guardándomelo.',
  },
  {
    id: 'opener-3',
    text: 'Me cuesta un poco expresarlo, pero quiero ser honesta/o contigo.',
  },
];

export default function MapOfUnsaidThingsExercise({ content, pathId, onComplete }: MapOfUnsaidThingsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  // State for the user's reflection
  const [situation, setSituation] = useState('');
  const [whatIWanted, setWhatIWanted] = useState('');
  const [whatIDid, setWhatIDid] = useState('');
  const [emotions, setEmotions] = useState<Record<string, boolean>>({});
  const [otherEmotion, setOtherEmotion] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [aftermath, setAftermath] = useState('');

  // State for pattern detection
  const [repeatedEmotions, setRepeatedEmotions] = useState('');
  const [difficultContexts, setDifficultContexts] = useState('');
  const [fears, setFears] = useState('');
  const [blockages, setBlockages] = useState<Record<string, boolean>>({});

  // State for reframing
  const [friendAdvice, setFriendAdvice] = useState('');
  const [fearOrChoice, setFearOrChoice] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [howToSayIt, setHowToSayIt] = useState('');
  
  // State for next step
  const [nextStepPhrase, setNextStepPhrase] = useState('');
  const [nextStepContext, setNextStepContext] = useState('');
  const [nextStepOpener, setNextStepOpener] = useState('');
  const [selectedOpenerSuggestion, setSelectedOpenerSuggestion] = useState('');
  
  const [patternName, setPatternName] = useState('');


  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);
  const reset = () => {
    setStep(0);
    setSituation('');
    setWhatIWanted('');
    setWhatIDid('');
    setEmotions({});
    setOtherEmotion('');
    setThoughts('');
    setAftermath('');
    setRepeatedEmotions('');
    setDifficultContexts('');
    setFears('');
    setBlockages({});
    setFriendAdvice('');
    setFearOrChoice('');
    setWorstCase('');
    setHowToSayIt('');
    setNextStepPhrase('');
    setNextStepContext('');
    setNextStepOpener('');
    setSelectedOpenerSuggestion('');
    setPatternName('');
  };

  const handleSave = () => {
     const getSelectedLabels = (options: {id: string, label: string}[], selections: Record<string, boolean>) => {
        return options.filter(opt => selections[opt.id]).map(opt => opt.label);
    };

    const selectedEmotions = getSelectedLabels(emotionOptions, emotions);
    if (emotions['emo-other'] && otherEmotion) selectedEmotions.push(otherEmotion);
    
    const selectedBlockages = getSelectedLabels(blockageOptions, blockages);

    const notebookContent = `
**Ejercicio: ${content.title}**
${patternName ? `\n**Nombre del Patrón:** ${patternName}\n` : ''}
---
**SITUACIÓN REGISTRADA**

**¿Qué ocurrió?:**
${situation || 'No especificado.'}

**¿Qué querías decir o hacer, pero no lo hiciste?:**
${whatIWanted || 'No especificado.'}

**¿Qué hiciste en su lugar?:**
${whatIDid || 'No especificado.'}

**¿Qué emoción sentiste?:**
${selectedEmotions.length > 0 ? selectedEmotions.map(e => `- ${e}`).join('\n') : 'No especificado.'}

**¿Qué pensamientos pasaron por tu mente?:**
${thoughts || 'No especificado.'}

**¿Qué pasó después?:**
${aftermath || 'No especificado.'}

---
**MI PATRÓN PERSONAL**

**Emociones que se repiten cuando callo:**
${repeatedEmotions || 'No especificado.'}

**Contextos difíciles (personas o situaciones):**
${difficultContexts || 'No especificado.'}

**Temores si hablo:**
${fears || 'No especificado.'}

**Bloqueos identificados:**
${selectedBlockages.length > 0 ? selectedBlockages.map(b => `- ${b}`).join('\n') : 'Ninguno seleccionado.'}

---
**MI ALTERNATIVA ADAPTATIVA**

**Consejo de un buen amigo:**
${friendAdvice || 'No especificado.'}

**¿Actúo por miedo o elección?:**
${fearOrChoice || 'No especificado.'}

**Peor escenario y cómo lo afrontaría:**
${worstCase || 'No especificado.'}

**¿Cómo podría decirlo con respeto y firmeza?:**
${howToSayIt || 'No especificado.'}

---
**MI PRIMER PASO DE ACCIÓN**

**Frase límite que podría decir:**
${nextStepPhrase || 'No especificado.'}

**Contexto para practicar:**
${nextStepContext || 'No especificado.'}

**Frase para iniciar la conversación:**
${nextStepOpener || 'No especificado.'}
`;

    addNotebookEntry({
      title: `Mapa de mis no dichos: ${patternName || 'Reflexión'}`,
      content: notebookContent,
      pathId: pathId,
      userId: user?.id,
    });

    toast({
      title: "Ejercicio Guardado",
      description: "Tu 'Mapa de mis no dichos' se ha guardado en el Cuaderno Terapéutico.",
    });
    onComplete();
    setStep(prev => prev + 1); // Go to final confirmation screen
  };


  const renderStep = () => {
    switch(step) {
      case 0: // Intro with example
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="italic">
              Antes de hacer tu propio registro, te muestro un ejemplo completo del ejercicio que vas a realizar.
            </p>
            <p className="text-sm text-muted-foreground">
              Leerlo con calma puede ayudarte a ponerle palabras a lo que te pasa y a comprender mejor cómo observar lo
              que piensas, sientes y haces cuando eliges no expresarte.
            </p>
            <p className="text-sm text-muted-foreground">
              No tienes que seguir este modelo. Es solo una brújula. Lo importante es que uses tus propias palabras y
              seas honesta u honesto contigo.
            </p>
            <p className="text-sm text-muted-foreground">
              Después de varios registros, podrás mirar tus respuestas con perspectiva para detectar patrones y decidir
              cómo actuar distinto la próxima vez.
            </p>
            <Accordion type="single" defaultValue="example-situation" className="w-full text-left">
              <AccordionItem value="example-situation">
                <AccordionTrigger>Pantalla 2: Ejemplo de situación no expresada</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-2 border bg-background rounded-md">
                    <p><strong>¿Qué ocurrió?</strong> Estaba en una reunión del trabajo. Mi jefa pidió voluntarios para asumir un nuevo proyecto urgente.</p>
                    <p><strong>¿Qué querías decir o hacer, pero no lo hiciste?</strong> Quería decir que no podía asumirlo porque ya tenía demasiada carga y me sentía saturado/a.</p>
                    <p><strong>¿Qué hiciste en su lugar?</strong> Me quedé en silencio. No levanté la mano, pero tampoco expresé que no estaba disponible. Me limité a asentir, como si todo estuviera bien.</p>
                    <p><strong>¿Qué sentiste en ese momento?</strong> Ansiedad, frustración y una especie de tensión interna, como si me estuviera traicionando a mí mismo/a.</p>
                    <p><strong>¿Qué pensamientos pasaron por tu mente?</strong> “Si digo que no, pensarán que no soy profesional.”  “No quiero parecer que me estoy quejando.”  “Mejor me callo, no quiero que se lo tomen mal.”</p>
                    <p><strong>¿Qué pasó después?</strong> Me fui con un nudo en el estómago. Estuve rumiando toda la tarde y sintiéndome invisible. Me frustró no haber podido ser honesto/a sobre mis límites.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="example-pattern">
                <AccordionTrigger>Pantalla 4: Ejemplo de detección de patrón</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-2 border bg-background rounded-md">
                    <p><strong>¿Qué emociones se repiten cuando callas?</strong> Ansiedad, culpa y tristeza.</p>
                    <p><strong>¿Con qué personas o contextos te cuesta más expresarte?</strong> Con figuras de autoridad, como mi jefa. También en contextos formales o cuando hay muchas personas delante.</p>
                    <p><strong>¿Qué temes que ocurra si hablas?</strong> Que me juzguen, que piensen que no soy válido/a profesionalmente, o que se decepcionen conmigo.</p>
                    <p><strong>Bloqueos con los que me identifico:</strong></p>
                    <ul className="list-disc list-inside text-sm">
                      <li>Miedo al conflicto</li>
                      <li>Deseo de agradar o no decepcionar</li>
                      <li>Culpa por priorizarme</li>
                      <li>Anticipación negativa de consecuencias</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={next}><ArrowRight className="mr-2 h-4 w-4" />Empezar mi registro</Button>
          </div>
        );
      case 1: // REGISTRA UNA SITUACIÓN
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
             <h4 className="font-semibold text-lg text-primary">Registra una Situación Concreta</h4>
             <p>Recuerda una situación reciente en la que no dijiste algo que era importante para ti. No importa si fue algo grande o pequeño. Lo importante es que tú lo sentiste así.</p>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-happened">¿Qué ocurrió?</Label>
                 <p className="text-xs text-muted-foreground">Describe brevemente la situación: ¿dónde estabas?, ¿con quién?, ¿qué pasó?</p>
                 <Textarea id="sit-what-happened" value={situation} onChange={e => setSituation(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-i-wanted">¿Qué querías decir o hacer, pero no lo hiciste?</Label>
                 <p className="text-xs text-muted-foreground">Ej.: Quería pedir ayuda, poner un límite, decir que algo me dolió.</p>
                 <Textarea id="sit-what-i-wanted" value={whatIWanted} onChange={e => setWhatIWanted(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-what-i-did">¿Qué hiciste en su lugar?</Label>
                 <p className="text-xs text-muted-foreground">Ej.: Cambié de tema, puse buena cara, dije que estaba todo bien.</p>
                 <Textarea id="sit-what-i-did" value={whatIDid} onChange={e => setWhatIDid(e.target.value)} />
             </div>
              <div className="space-y-2">
                 <Label>¿Qué emoción sentiste?</Label>
                 <p className="text-xs text-muted-foreground">Selecciona las que más se ajusten a tu experiencia. Puedes marcar más de una.</p>
                 <div className="grid grid-cols-2 gap-2">
                     {emotionOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox id={opt.id} checked={emotions[opt.id] || false} onCheckedChange={c => setEmotions(p => ({...p, [opt.id]:!!c}))} />
                            <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                        </div>
                     ))}
                 </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="emo-other" checked={emotions['emo-other'] || false} onCheckedChange={c => setEmotions(p => ({...p, 'emo-other':!!c}))} />
                    <Label htmlFor="emo-other" className="font-normal">Otra:</Label>
                 </div>
                 {emotions['emo-other'] && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción" className="ml-6"/>}
              </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-thoughts">¿Qué pensamientos pasaron por tu mente?</Label>
                 <p className="text-xs text-muted-foreground">Escribe las frases que te dijiste o sentiste. Ej.: “Mejor me callo”, “No quiero molestar”.</p>
                 <Textarea id="sit-thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} />
             </div>
             <div className="space-y-2">
                 <Label htmlFor="sit-aftermath">¿Qué pasó después?</Label>
                 <p className="text-xs text-muted-foreground">¿Cómo te sentiste después? ¿Hubo consecuencias en ti o en la relación?</p>
                 <Textarea id="sit-aftermath" value={aftermath} onChange={e => setAftermath(e.target.value)} />
             </div>
             <div className="flex justify-between w-full">
                <Button onClick={back} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                <Button onClick={next}>Siguiente: Detectar Patrón <ArrowRight className="ml-2 h-4 w-4" /></Button>
             </div>
          </div>
        );
      case 2: // DETECTA TU PATRÓN
         return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Detecta tu Patrón</h4>
                <p>Después de hacer este ejercicio varias veces, estás lista o listo para observar patrones. No es para etiquetarte, sino para entender cómo funcionas.</p>
                <div className="space-y-2"><Label htmlFor="pat-emotions">¿Qué emociones se repiten cuando callas?</Label><Textarea id="pat-emotions" value={repeatedEmotions} onChange={e => setRepeatedEmotions(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="pat-contexts">¿Con qué personas o contextos te cuesta más expresarte?</Label><Textarea id="pat-contexts" value={difficultContexts} onChange={e => setDifficultContexts(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="pat-fears">¿Qué temes que ocurra si hablas?</Label><Textarea id="pat-fears" value={fears} onChange={e => setFears(e.target.value)} /></div>
                <div>
                    <Label>Checklist de bloqueos (elige los que se parezcan a ti):</Label>
                    <div className="space-y-1 mt-1">
                        {blockageOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                                <Checkbox id={opt.id} checked={blockages[opt.id] || false} onCheckedChange={c => setBlockages(p => ({...p, [opt.id]:!!c}))} />
                                <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Replantear <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
             </div>
         );
       case 3: // REPLANTEA
         return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Replantea la Situación</h4>
                <p>Mira la situación desde otro ángulo. A veces, una sola pregunta puede abrir una nueva forma de actuar.</p>
                <div className="space-y-2"><Label htmlFor="reframe-friend">¿Qué me diría un buen amigo si supiera esto?</Label><Textarea id="reframe-friend" value={friendAdvice} onChange={e => setFriendAdvice(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-choice">¿Estoy actuando por miedo o por elección?</Label><Textarea id="reframe-choice" value={fearOrChoice} onChange={e => setFearOrChoice(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-worstcase">¿Qué es lo peor que podría pasar si hablo? ¿Y qué haría si eso ocurre?</Label><Textarea id="reframe-worstcase" value={worstCase} onChange={e => setWorstCase(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="reframe-how">¿Cómo podría decirlo con respeto y firmeza?</Label><Textarea id="reframe-how" value={howToSayIt} onChange={e => setHowToSayIt(e.target.value)} /></div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Dar el Primer Paso <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            </div>
         );
       case 4: // DA TU PRIMER PASO
         return (
             <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">Da tu Primer Paso</h4>
                <p>Prepárate para actuar diferente la próxima vez. No tiene que ser perfecto, solo un paso adelante.</p>
                <div className="space-y-2">
                  <Label htmlFor="opener-suggestions">Frases inspiradoras sugeridas (desplegable)</Label>
                  <p className="text-xs text-muted-foreground">Puedes usarlas tal cual o adaptarlas a tu estilo.</p>
                  <Select
                    value={selectedOpenerSuggestion}
                    onValueChange={(value) => {
                      const selected = openerSuggestions.find((option) => option.id === value);
                      setSelectedOpenerSuggestion(value);
                      if (selected) setNextStepOpener(selected.text);
                    }}
                  >
                    <SelectTrigger id="opener-suggestions">
                      <SelectValue placeholder="Selecciona una frase sugerida" />
                    </SelectTrigger>
                    <SelectContent>
                      {openerSuggestions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="step-phrase">¿Qué podrías intentar decir la próxima vez que ocurra algo parecido?</Label>
                  <p className="text-xs text-muted-foreground">Esta frase te ayudará a decir con claridad tu límite o necesidad.</p>
                  <Textarea id="step-phrase" value={nextStepPhrase} onChange={e => setNextStepPhrase(e.target.value)} placeholder="Ej: Gracias por contar conmigo, pero no puedo..." />
                </div>
                <div className="space-y-2"><Label htmlFor="step-context">¿En qué contexto podrías practicarlo con más confianza?</Label><Textarea id="step-context" value={nextStepContext} onChange={e => setNextStepContext(e.target.value)} placeholder="Ej: En una conversación individual..." /></div>
                <div className="space-y-2">
                  <Label htmlFor="step-opener">¿Qué frase podrías tener preparada para empezar?</Label>
                  <p className="text-xs text-muted-foreground">Esta frase te ayudará a empezar la conversación cuando te cuesta romper el hielo.</p>
                  <Textarea id="step-opener" value={nextStepOpener} onChange={e => setNextStepOpener(e.target.value)} placeholder="Ej: Hay algo que quiero comentarte y me cuesta un poco expresarlo..." />
                </div>
                <div className="flex justify-between w-full"><Button onClick={back} variant="outline">Atrás</Button><Button onClick={next} className="w-auto">Siguiente: Guardar <Save className="ml-2 h-4 w-4" /></Button></div>
            </div>
         );
       case 5: // Guardar
        return (
             <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg text-primary">¿Quieres guardar lo que has descubierto hoy?</h4>
                <p>
                  Has recorrido un camino importante: has detectado un patrón que se repite en ti cuando te cuesta expresarte, y
                  también has construido una forma más clara y respetuosa de afrontarlo.
                </p>
                <p className="text-sm text-muted-foreground">
                  Puedes guardarlo en tu Cuaderno Terapéutico para recordarte lo que ya sabes, entrenarte en una alternativa más
                  libre y celebrar tus avances.
                </p>
                <div className="space-y-2 text-left">
                    <Label htmlFor="pattern-name">Ponle un nombre a este patrón (opcional)</Label>
                    <Textarea id="pattern-name" value={patternName} onChange={e => setPatternName(e.target.value)} placeholder="Ej: Cuando me callo en el trabajo" />
                </div>
                 <div className="flex justify-between w-full gap-2">
                    <Button onClick={back} variant="outline">Atrás</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Guardar patrón y alternativa adaptativa en mi cuaderno</Button>
                 </div>
             </div>
        );
       case 6: // Final confirmation
        return (
             <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Guardado con éxito!</h4>
                 <p>Podrás volver a consultarlo siempre que lo necesites en tu Cuaderno Terapéutico.</p>
                 <Button onClick={reset} variant="outline" className="w-full">Registrar otra situación</Button>
             </div>
        );
      default: return null;
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
        {content.objective && <CardDescription>{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

