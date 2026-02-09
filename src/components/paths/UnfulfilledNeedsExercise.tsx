

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

*Acción que me habría hecho bien hoy:*
${unfulfilledAction}

*Valor asociado:*
${associatedValue}

*¿Qué me impidió hacerlo?:*
${reason}

*Plan para mañana:*
${tomorrowPlan}
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
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 1: Identifica la Acción No Realizada</h4>
            <p className="text-sm text-muted-foreground">Identifica una pequeña acción que hoy no hiciste y que sabes que te habría hecho bien.</p>
            <Textarea id="unfulfilled-action" value={unfulfilledAction} onChange={e => setUnfulfilledAction(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 2: Conecta con el Valor</h4>
            <p className="text-sm text-muted-foreground">¿Qué valor estaba asociado a eso que postergaste?</p>
            <Textarea id="assoc-value" value={associatedValue} onChange={e => setAssociatedValue(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 3: ¿Qué te Impidió Hacerlo?</h4>
            <p className="text-sm text-muted-foreground">Sé honesto/a contigo: ¿fue miedo, prisa, presión, distracción?</p>
            <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 4: Plan para Mañana</h4>
            <p className="text-sm text-muted-foreground">¿Qué puedes hacer mañana para proteger mejor ese valor?</p>
            <Textarea id="tomorrow-plan" value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} disabled={isSaved} />
          </div>
           {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4"/>Guardar Reflexión</Button>
          ) : (
            <div className="p-4 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                <p className="italic text-muted-foreground">Reconocer lo que no hice desde el cuidado… ya es un acto de cuidado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
