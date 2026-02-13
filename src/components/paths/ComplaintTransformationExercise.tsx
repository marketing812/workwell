"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface ComplaintTransformationExerciseProps {
  content: ComplaintTransformationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ComplaintTransformationExercise({ content, pathId, onComplete }: ComplaintTransformationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [questioning, setQuestioning] = useState('');
  const [attribution, setAttribution] = useState('');
  const [decatastrophizing, setDecatastrophizing] = useState('');
  const [action, setAction] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetExercise = () => {
    setStep(0);
    setSituation('');
    setThought('');
    setQuestioning('');
    setAttribution('');
    setDecatastrophizing('');
    setAction('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !action.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa al menos la situación y la acción final.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*1. Situación (hechos):*
${situation}

*2. Pensamiento detectado:*
${thought}

*3. Cuestionamiento (evidencia a favor/en contra):*
${questioning}

*4. Atribución realista (mi parte vs. la que no es mía):*
${attribution}

*5. Descatastrofización (¿qué haría si pasara lo peor?):*
${decatastrophizing}

*6. Acción pequeña y concreta:*
${action}
    `;
    addNotebookEntry({ title: 'Transformación de Queja a Acción', content: notebookContent, pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación de queja a acción ha sido guardada.' });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">La queja te mantiene en un bucle de frustración. En este ejercicio vas a transformar ese malestar en una acción concreta, recuperando tu poder de elección.</p>
            <Button onClick={nextStep}>Empezar Transformación <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1: Describe la situación
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Describe la situación</h4>
            <p className="text-sm text-muted-foreground">Piensa en algo que te haya molestado y escríbelo como hechos, sin juicios. Ejemplo: “Mi compañero entregó el informe tarde.”</p>
            <Textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="Describe la situación objetivamente..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
       case 2: // Step 2: Detecta tu pensamiento
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Detecta tu pensamiento</h4>
            <p className="text-sm text-muted-foreground">¿Qué pensamiento automático surgió? Ejemplo: “Siempre me toca a mí arreglarlo todo.”</p>
            <Textarea value={thought} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setThought(e.target.value)} placeholder="Escribe el pensamiento que tuviste..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!thought.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Step 3: Cuestiónalo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Cuestiónalo</h4>
            <p className="text-sm text-muted-foreground">¿Qué pruebas tienes a favor y en contra de ese pensamiento?</p>
            <Textarea value={questioning} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestioning(e.target.value)} placeholder="A favor: ... En contra: ..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!questioning.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Step 4: Atribuye con realismo
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Atribuye con realismo</h4>
            <p className="text-sm text-muted-foreground">¿Qué parte es tuya y cuál no? ¿Qué sí depende de ti? Ejemplo: “No depende de mí que él cumpla, pero sí depende de mí cómo comunico el impacto que tiene.”</p>
            <Textarea value={attribution} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAttribution(e.target.value)} placeholder="Mi parte es... Lo que no es mío es..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!attribution.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 5: // Step 5: Descatastrofización
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 5: Si pasara lo que temo, ¿qué haría?</h4>
            <p className="text-sm text-muted-foreground">Anticipar una estrategia de afrontamiento reduce el miedo. Ejemplo: “Si se enfada, me daré un momento para respirar y responderé con calma.”</p>
            <Textarea value={decatastrophizing} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDecatastrophizing(e.target.value)} placeholder="Si ocurriera lo peor, yo podría..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!decatastrophizing.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 6: // Step 6: Acción concreta
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 6: Define un paso pequeño y concreto</h4>
            <p className="text-sm text-muted-foreground">Cambia la queja por una acción que puedas hacer hoy o mañana. Ejemplo: “Voy a proponer una reunión breve para revisar los plazos.”</p>
            <Textarea value={action} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAction(e.target.value)} placeholder="Mi próximo pequeño paso es..." />
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Transformación</Button>
            </div>
          </form>
        );
       case 7: // Confirmation
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Tu transformación ha sido guardada. Puedes volver a ella en tu cuaderno cuando lo necesites.</p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
          </div>
        );
      default:
        return null;
    }
  }

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
                            <source src={`${EXTERNAL_SERVICES_BASE_URL}${content.audioUrl}`} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
