
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { UnfulfilledNeedsExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface UnfulfilledNeedsExerciseProps {
  content: UnfulfilledNeedsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function UnfulfilledNeedsExercise({ content, pathId, onComplete }: UnfulfilledNeedsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [unfulfilledAction, setUnfulfilledAction] = useState('');
  const [associatedValue, setAssociatedValue] = useState('');
  const [reason, setReason] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!unfulfilledAction || !associatedValue || !reason || !tomorrowPlan) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los campos.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Identifica una pequeña acción que hoy no hiciste y que sabes que te habría hecho bien | Respuesta: ${unfulfilledAction}

Pregunta: ¿Qué valor estaba asociado a eso que postergaste? | Respuesta: ${associatedValue}

Pregunta: ¿Qué te impidió hacerlo? (miedo, prisa, presión, distracción) | Respuesta: ${reason}

Pregunta: ¿Qué puedes hacer mañana para proteger mejor ese valor? | Respuesta: ${tomorrowPlan}
    `;
    addNotebookEntry({ title: `Micropráctica: Necesidades No Atendidas`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Reflexión Guardada", description: "Tu reflexión ha sido guardada en el cuaderno." });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        <CardDescription>
            {content.objective}
             <p className='text-xs'>Duración: 3–5 minutos diarios. Realizar al final del día o antes de dormir.</p>
        </CardDescription>
         <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="example">
            <AccordionTrigger className="text-sm">Ver ejemplo guía</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-2 border bg-background rounded-md text-sm">
                <p><strong>Acción que me habría hecho bien:</strong> No salí a caminar, aunque sabía que me despejaba.</p>
                <p><strong>Valor asociado:</strong> bienestar y conexión con la naturaleza.</p>
                <p><strong>Razón:</strong> me atrapó la urgencia de contestar correos.</p>
                <p><strong>Plan para mañana:</strong> reservar 20 minutos sin móvil justo después de comer.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unfulfilled-action">Identifica una pequeña acción que hoy no hiciste y que sabes que te habría hecho bien:</Label>
            <Textarea id="unfulfilled-action" value={unfulfilledAction} onChange={e => setUnfulfilledAction(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assoc-value">¿Qué valor estaba asociado a eso que postergaste?</Label>
            <Textarea id="assoc-value" value={associatedValue} onChange={e => setAssociatedValue(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">¿Qué te impidió hacerlo? (miedo, prisa, presión, distracción)</Label>
            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tomorrow-plan">¿Qué puedes hacer mañana para proteger mejor ese valor?</Label>
            <Textarea id="tomorrow-plan" value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} disabled={isSaved} />
          </div>
           {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Reflexión</Button>
          ) : (
            <div className="p-4 text-center space-y-2">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <p className="font-semibold">Reflexión Guardada</p>
                <p className="italic">“Reconocer lo que no hice desde el cuidado… ya es un acto de cuidado.”</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
