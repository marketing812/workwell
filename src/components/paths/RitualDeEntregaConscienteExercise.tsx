
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, Save, PlayCircle, BookOpen, Feather, Wind } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface RitualDeEntregaConscienteExerciseProps {
  content: ModuleContent;
  pathId: string; // Cambiado para recibir solo el ID
  onComplete: () => void;
}

export default function RitualDeEntregaConscienteExercise({ content, pathId, onComplete }: RitualDeEntregaConscienteExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0); // 0: initial choice, 1: write, 2: breathe, 3: gratitude

  // State for "Escribir y soltar"
  const [writtenInquietud, setWrittenInquietud] = useState('');
  const [writtenReflection, setWrittenReflection] = useState('');
  const [writtenReformulation, setWrittenReformulation] = useState('');

  // State for "Cerrar con gratitud"
  const [gratitude, setGratitude] = useState('');
  const [advancement, setAdvancement] = useState('');
  const [calmMoment, setCalmMoment] = useState('');

  const handleSave = (option: string, entryContent: string) => {
    if (option === "Escribir y Soltar" && !writtenInquietud.trim() && !writtenReflection.trim() && !writtenReformulation.trim()) {
        toast({
            title: "Ejercicio Incompleto",
            description: "Por favor, escribe al menos en uno de los campos para guardar tu reflexión.",
            variant: "destructive"
        });
        return;
    }
    if (option === "Cierre con Gratitud" && !gratitude.trim() && !advancement.trim() && !calmMoment.trim()) {
        toast({
            title: "Ejercicio Incompleto",
            description: "Por favor, completa al menos un campo de gratitud para guardar.",
            variant: "destructive"
        });
        return;
    }

    addNotebookEntry({
      title: `Ritual de Entrega Consciente: ${option}`,
      content: entryContent,
      pathId: pathId,
      userId: user?.id,
    });
    toast({
      title: "Ritual Guardado",
      description: `Tu ritual de '${option}' ha sido guardado en el cuaderno.`,
    });
    onComplete();
  };

  const renderInitialChoice = () => (
    <div className="text-center p-4 space-y-4">
        <p className="text-sm text-muted-foreground">Cuando intentas controlarlo todo, tu mente se agota. Este ejercicio te propone soltar por un momento. Elige la forma que hoy más te ayude:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(1)}><BookOpen className="mb-2"/>Escribir y soltar</Button>
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(2)}><Wind className="mb-2"/>Respirar con intención</Button>
            <Button variant="outline" className="h-24 flex-col" onClick={() => setStep(3)}><Feather className="mb-2"/>Cerrar el día con gratitud</Button>
        </div>
    </div>
  );

  const renderWriteAndRelease = () => (
    <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
      <h4 className="font-semibold text-lg">Opción 1: Escribir y Soltar</h4>
      <p className="text-sm text-muted-foreground">Ideal si tu mente está llena de pensamientos anticipatorios o autoexigencias.</p>
      
      <div className="space-y-2">
        <Label htmlFor="inquietud" className="font-semibold">Paso 1: Escribe todo lo que te inquieta</Label>
        <Textarea id="inquietud" value={writtenInquietud} onChange={e => setWrittenInquietud(e.target.value)} placeholder='Ejemplo guía: “Estoy bloqueada con este proyecto. Me exijo tenerlo todo claro desde el principio. Me da miedo equivocarme. Siento que si fallo, decepcionaré a los demás.”'/>
      </div>
      
      <div className="space-y-2">
        <Label className="font-semibold">Paso 2: Léelo en voz baja y reflexiona</Label>
        <p className="text-sm text-muted-foreground">Reflexiona con estas preguntas (pueden mostrarse como desplegables o como texto animado): <br/>• ¿Es esto cierto? <br/>• ¿Me ayuda pensar así? <br/>• ¿Podría verlo de forma más realista?</p>
        <Textarea value={writtenReflection} onChange={e => setWrittenReflection(e.target.value)} placeholder="Tu reflexión..."/>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reformulation" className="font-semibold">Paso 3: Reformula una frase más útil</Label>
        <p className="text-sm text-muted-foreground">Crea tu frase alternativa desde la confianza.</p>
        <Textarea id="reformulation" value={writtenReformulation} onChange={e => setWrittenReformulation(e.target.value)} placeholder='Ejemplo guía: "No tengo que saberlo todo para empezar."'/>
      </div>

      <div className="space-y-2">
        <Label className="font-semibold">Paso 4: Suelta</Label>
        <p className="text-sm text-muted-foreground p-3 border rounded-md bg-background/50">
            Cierra los ojos y repite en voz alta o mentalmente: "Hoy elijo confiar en mi capacidad de avanzar paso a paso." Siente cómo, al decirlo, una parte de ti suelta la necesidad de controlarlo todo.
        </p>
      </div>

      <Button onClick={() => {
          const content = [
            `Pregunta: ¿Qué te inquieta? | Respuesta: ${writtenInquietud || 'No respondido.'}`,
            `Pregunta: Tu reflexión al leerlo | Respuesta: ${writtenReflection || 'No respondido.'}`,
            `Pregunta: Tu reformulación más útil | Respuesta: "${writtenReformulation || 'No respondido.'}"`,
            `Pregunta: Pensamiento final de entrega | Respuesta: "Hoy elijo confiar en mi capacidad de avanzar paso a paso."`
          ].join('\n');
          handleSave("Escribir y Soltar", content);
      }} className="w-full"><Save className="mr-2 h-4 w-4"/> Guardar como "Entrega consciente"</Button>
      
      <Button variant="link" onClick={() => setStep(0)} className="w-full">Volver a opciones</Button>
    </div>
  );

  const renderBreatheWithIntention = () => (
     <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
        <h4 className="font-semibold text-lg">Opción 2: Respirar con Intención</h4>
        <p className="text-sm text-muted-foreground">Ideal si sientes tu cuerpo tenso o activado.</p>
        <p className="text-sm text-muted-foreground">Selecciona una respiración guiada que te ayude a soltar el control:</p>
         <div className="space-y-4">
            <div>
                <h5 className="font-semibold">Respiración 4-2-6</h5>
                <audio controls controlsList="nodownload" className="w-full h-10 mt-1"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1_respiracion_4-2-6.mp3`} type="audio/mp3"/></audio>
            </div>
            <div>
                <h5 className="font-semibold">Respiración diafragmática suave</h5>
                <audio controls controlsList="nodownload" className="w-full h-10 mt-1"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1_respiracion_diafragmatica.mp3`} type="audio/mp3"/></audio>
            </div>
            <div>
                <h5 className="font-semibold">Anclaje corporal con exhalación prolongada</h5>
                <audio controls controlsList="nodownload" className="w-full h-10 mt-1"><source src={`${EXTERNAL_SERVICES_BASE_URL}/audios/rm/R1_anclaje_sensorial_inmediato.m4a`} type="audio/mp3"/></audio>
            </div>
        </div>
        <p className="text-sm italic text-primary pt-2">Respirar no es un descanso menor. Es una señal clara a tu cuerpo de que puede soltar el control.</p>
        <Button variant="link" onClick={() => setStep(0)} className="w-full">Volver a opciones</Button>
    </div>
  );

  const renderGratitudeClosing = () => (
    <div className="space-y-4 p-2 animate-in fade-in-0 duration-500">
        <h4 className="font-semibold text-lg">Opción 3: Cerrar el Día con Gratitud</h4>
        <p className="text-sm text-muted-foreground">Ideal para terminar el día desde la confianza, no desde la exigencia. Cuando cierras el día reconociendo lo bueno —aunque sea pequeño— tu sistema emocional aprende a soltar el control y descansar desde la confianza. Antes de dormir, tómate un momento para responder con calma a estas preguntas:</p>
        <div className="space-y-2">
            <Label htmlFor="gratitude">¿Qué agradezco hoy?</Label>
            <Textarea id="gratitude" value={gratitude} onChange={e => setGratitude(e.target.value)} placeholder='Ejemplo guía: Agradezco que mi amiga me haya escrito solo para saber cómo estaba. Sentí que no estoy solo/a.'/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="advancement">¿Qué pequeño avance hice?</Label>
            <Textarea id="advancement" value={advancement} onChange={e => setAdvancement(e.target.value)} placeholder='Ejemplo guía: “Aunque me sentía inseguro/a, he enviado ese correo que llevaba días posponiendo.”'/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="calm-moment">¿Qué momento me conectó con la calma?</Label>
            <Textarea id="calm-moment" value={calmMoment} onChange={e => setCalmMoment(e.target.value)} placeholder='Ejemplo guía: “Me sentí en paz cuando salí a caminar al atardecer sin mirar el reloj. Solo respiré.”'/>
        </div>
        
        <div className="text-sm text-muted-foreground pt-4 space-y-2">
            <p className="font-semibold">¿Cómo convertir este ritual en hábito?</p>
            <p>Usa este ritual al final del día, antes de una situación incierta o cuando tu mente esté acelerada.<br/>No hace falta hacerlo perfecto.<br/>Solo estar presente en el gesto es suficiente.</p>
        </div>
        
        <Button onClick={() => {
            const content = [
              `Pregunta: ¿Qué agradezco hoy? | Respuesta: ${gratitude || 'No respondido.'}`,
              `Pregunta: ¿Qué pequeño avance hice? | Respuesta: ${advancement || 'No respondido.'}`,
              `Pregunta: ¿Qué momento me conectó con la calma? | Respuesta: ${calmMoment || 'No respondido.'}`
            ].join('\n');
            handleSave("Cierre con Gratitud", content);
        }} className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar en mi cuaderno</Button>
        <Button variant="link" onClick={() => setStep(0)} className="w-full">Volver a opciones</Button>
    </div>
  );
  
  const renderContent = () => {
      switch(step) {
          case 0: return renderInitialChoice();
          case 1: return renderWriteAndRelease();
          case 2: return renderBreatheWithIntention();
          case 3: return renderGratitudeClosing();
          default: return renderInitialChoice();
      }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{(content as any).title}</CardTitle>
        {(content as any).audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full h-10">
                    <source src={(content as any).audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
        {(content as any).objective && <CardDescription className="pt-2">{(content as any).objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
