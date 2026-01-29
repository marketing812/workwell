
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MapaEmocionalRepetidoExerciseContent } from '@/data/paths/pathTypes';
import { emotions as emotionOptions } from '@/components/dashboard/EmotionalEntryForm';
import { useTranslations } from '@/lib/translations';

interface MapaEmocionalRepetidoExerciseProps {
  content: MapaEmocionalRepetidoExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const mapaEmocionalRepetidoEmotionOptions = [
    { value: 'Tristeza', label: 'Tristeza' },
    { value: 'Ira / Enfado', label: 'Ira / Enfado' },
    { value: 'Ansiedad / Miedo', label: 'Ansiedad / Miedo' },
    { value: 'Culpa', label: 'Culpa' },
    { value: 'Vergüenza', label: 'Vergüenza' },
    { value: 'Frustración', label: 'Frustración' },
    { value: 'Soledad', label: 'Soledad' },
];

const schemaOptions = [
    { value: 'abandono', label: 'Miedo al abandono: Siento que me van a dejar o que no puedo contar con los demás.' },
    { value: 'desconfianza', label: 'Desconfianza: Me cuesta confiar. Creo que me pueden dañar, engañar o traicionar.' },
    { value: 'falta_cuidado', label: 'Falta de cuidado o apoyo: Siento que no me entienden, no me cuidan o no están para mí.' },
    { value: 'verguenza', label: 'Vergüenza o sensación de no valer: Me siento defectuoso/a, inadecuado/a o poco digno/a de amor.' },
    { value: 'no_pertenecer', label: 'No pertenecer: Me siento diferente, como si no encajara en ningún grupo.' },
    { value: 'dudas', label: 'Dudas sobre mí o dependencia: No confío en mis decisiones o siento que necesito a alguien para todo.' },
    { value: 'miedo_constante', label: 'Miedo constante a que algo malo ocurra: Vivo con la sensación de que algo malo va a pasar.' },
    { value: 'no_saber_quien_soy', label: 'No saber quién soy: Me cuesta identificar mis propias ideas, gustos o emociones.' },
    { value: 'fracaso', label: 'Sentimiento de fracaso: Siento que no soy suficientemente bueno/a o que los demás son mejores.' },
    { value: 'perfeccionismo', label: 'Exigencia o perfeccionismo: Me siento obligado/a a hacerlo todo bien, sin errores ni descanso.' },
    { value: 'autoexigencia', label: 'Autoexigencia o culpa excesiva: Me critico mucho o siento que debo pagar por lo que hago mal.' },
    { value: 'anularme', label: 'Anularme para agradar: Callo lo que siento o necesito para no molestar o no generar conflictos.' },
    { value: 'aprobacion', label: 'Necesidad constante de aprobación: Necesito que me reconozcan o valoren para sentirme bien.' },
    { value: 'tener_razon', label: 'Necesidad de tener la razón o de ser especial: Me cuesta aceptar límites o frustraciones. A veces siento que no me aplican las reglas.' },
    { value: 'impulsividad', label: 'Impulsividad o descontrol emocional: Me cuesta parar. Actúo o exploto cuando algo me afecta, sin pensar.' },
];

export function MapaEmocionalRepetidoExercise({ content, pathId, onComplete }: MapaEmocionalRepetidoExerciseProps) {
  const { toast } = useToast();
  const t = useTranslations();
  
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [otherEmotion, setOtherEmotion] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [behavior, setBehavior] = useState('');
  const [isRepeated, setIsRepeated] = useState('');
  const [schema, setSchema] = useState('');
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setEmotion('');
    setOtherEmotion('');
    setAutomaticThought('');
    setBehavior('');
    setIsRepeated('');
    setSchema('');
  };

  const handleSave = () => {
    const finalEmotion = emotion === 'otra' ? otherEmotion : emotion;
    const notebookContent = `
**Ejercicio: ${content.title}**

*Situación vivida:*
${situation || 'No especificada.'}

*Emoción(es) sentida(s):*
${finalEmotion}

*Pensamiento automático:*
"${automaticThought || 'No especificado.'}"

*Conducta o reacción:*
${behavior || 'No especificado.'}

*Patrón Repetido:*
${isRepeated || 'No especificado.'}

*Esquema Activado:*
${schema || 'No especificado.'}
`;
    addNotebookEntry({ title: 'Mi Mapa Emocional Repetido', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado', description: 'Tu registro se ha guardado en el cuaderno.' });
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    const finalEmotion = emotion === 'otra' ? otherEmotion : emotion;

    switch (step) {
      case 0: return <div className="p-4"><p className="text-center mb-4">Piensa en una situación reciente que te haya movido emocionalmente.</p><Button onClick={nextStep} className="w-full">Comenzar <ArrowRight className="ml-2 h-4 w-4" /></Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label htmlFor="situation-detective" className="font-semibold">¿Qué ocurrió?</Label><p className="text-sm text-muted-foreground">Describe brevemente una situación concreta que te haya movido emocionalmente esta semana. Céntrate solo en lo que ocurrió —los hechos visibles o verificables— sin añadir aún cómo te sentiste ni lo que pensaste. Piensa que lo estás contando como si fueras una cámara que graba la escena: ¿qué pasó?, ¿quién estaba?, ¿dónde y cuándo fue?</p><Textarea id="situation-detective" value={situation} onChange={e => setSituation(e.target.value)} placeholder={'“Ayer envié un mensaje importante a una amiga y no me contestó.” \n(No pongas: “Me sentí ignorada” o “Seguro que está enfadada conmigo” → eso lo veremos después)'} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 2: return <div className="p-4 space-y-4"><Label>Nombra la emoción principal:</Label><p className="text-sm text-muted-foreground">Selecciona entre una lista o escribe libremente</p><Select value={emotion} onValueChange={setEmotion}><SelectTrigger><SelectValue placeholder="..." /></SelectTrigger><SelectContent>{mapaEmocionalRepetidoEmotionOptions.map(e => <SelectItem key={e.value} value={e.label}>{e.label}</SelectItem>)}<SelectItem value="otra">Otra...</SelectItem></SelectContent></Select>{emotion === 'otra' && <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Escribe tu emoción aquí..." className="mt-2" />}<div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!emotion || (emotion === 'otra' && !otherEmotion.trim())}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 3: return <div className="p-4 space-y-4"><Label htmlFor="automaticThought">¿Qué historia o interpretación surgió en tu mente en ese momento?</Label><Textarea id="automaticThought" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} placeholder={'"No le importo."\n"Soy un desastre."\n"Siempre me dejan fuera."\n"Seguro se están burlando de mí."'} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!automaticThought}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 4: return <div className="p-4 space-y-4"><Label htmlFor="behavior">¿Cómo reaccionaste? ¿Qué hiciste o cómo te comportaste después de esa emoción?</Label><Textarea id="behavior" value={behavior} onChange={e => setBehavior(e.target.value)} placeholder={'"Me encerré en mi habitación."\n"Mandé un mensaje cortante."\n"Me bloqueé y no dije nada."\n"Me mostré sonriente, pero me dolía por dentro."'} /><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!behavior}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 5: return <div className="p-4 space-y-4"><Label>¿Te suena esta reacción?</Label><RadioGroup value={isRepeated} onValueChange={setIsRepeated}><div className="flex items-center gap-2"><RadioGroupItem value="si" id="r_si"/><Label htmlFor="r_si" className="font-normal">Sí, me pasa a menudo</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="algunas" id="r_algunas" /><Label htmlFor="r_algunas" className="font-normal">Algunas veces</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="no" id="r_no"/><Label htmlFor="r_no" className="font-normal">No, fue algo nuevo para mí</Label></div></RadioGroup><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} className="w-auto" disabled={!isRepeated}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
      case 6: return <div className="p-4 space-y-4"><Label>¿Qué patrón crees que se activó?</Label><Select value={schema} onValueChange={setSchema}><SelectTrigger><SelectValue placeholder="Elige un patrón..." /></SelectTrigger><SelectContent>{schemaOptions.map(s=><SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}</SelectContent></Select><div className="flex justify-between w-full mt-2"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={handleSave} className="w-auto" disabled={!schema}>Guardar y ver resumen</Button></div></div>;
      case 7: 
        return (
            <div className="p-4 text-center space-y-4">
                <h4 className="font-bold text-center text-lg">Tu Mapa Emocional</h4>
                <p>Hoy diste un paso más hacia tu autoconocimiento. Nombrar lo que sientes te permite cuidarte mejor.</p>
                <div className="text-left border p-2 rounded-md bg-background"><p className="font-semibold">Tu registro:</p><p>Situación: {situation}</p><p>😔 <strong>Emoción:</strong> {finalEmotion}</p><p>💭 <strong>Pensamiento automático:</strong> {automaticThought}</p><p>🧠 <strong>Esquema activado:</strong> {schema}</p><p>🔄 <strong>Conducta:</strong> {behavior}</p></div>
                <p className="text-sm italic text-center pt-2">
                    Este es tu primer paso para interrumpir el patrón y empezar a transformarlo.
                </p>
                <div className="flex justify-between w-full mt-2">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                    <Button onClick={nextStep} className="w-auto">Finalizar</Button>
                </div>
            </div>
        );
      case 8:
        return (
            <div className="p-4 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">Recuerda:</h4>
                 <ul className="list-disc list-inside text-left mx-auto max-w-md text-muted-foreground text-sm">
                    <li>Lo que sientes tiene sentido.</li>
                    <li>No se trata de eliminar tus emociones, sino de entenderlas.</li>
                    <li>Cuanto más te conoces, más puedes cuidarte.</li>
                 </ul>
                 <p className="italic text-primary pt-2">“Entender tus emociones no te cambia de un día para otro… pero sí cambia la dirección en la que caminas.”</p>
                 <Button onClick={resetExercise} variant="outline">Hacer otro registro</Button>
            </div>
        );
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
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
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}

    