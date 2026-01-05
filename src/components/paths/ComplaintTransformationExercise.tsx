
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ComplaintTransformationExerciseContent } from '@/data/paths/pathTypes';

interface ComplaintTransformationExerciseProps {
  content: ComplaintTransformationExerciseContent;
  pathId: string;
}

export function ComplaintTransformationExercise({ content, pathId }: ComplaintTransformationExerciseProps) {
  const { toast } = useToast();
  const [complaint, setComplaint] = useState('');
  const [controllable, setControllable] = useState('');
  const [action, setAction] = useState('');
  const [registration, setRegistration] = useState('');
  const [finalReview, setFinalReview] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!complaint.trim() || !action.trim()) {
      toast({ title: 'Campos incompletos', description: 'Por favor, completa tu queja y la acción a tomar.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Me quejo de:*
${complaint}

*Lo que sí depende de mí es:*
${controllable}

*Lo que sí puedo hacer es:*
${action}

*Registro del plan:*
${registration}

*Revisión final:*
${finalReview}
    `;
    addNotebookEntry({ title: 'Transformación de Queja a Acción', content: notebookContent, pathId });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación de queja a acción ha sido guardada.' });
    setIsSaved(true);
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
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint">Elige tu queja</Label>
            <p className="text-sm text-muted-foreground">Piensa en algo que te haya molestado en las últimas 24–48 horas. Escríbelo tal cual lo dirías.</p>
            <Textarea id="complaint" value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Escribe aquí tu queja" disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="controllable">Detecta lo que está bajo tu control</Label>
            <p className="text-sm text-muted-foreground">Pregúntate: “¿Qué parte de esta situación depende de mí?"</p>
            <Textarea id="controllable" value={controllable} onChange={e => setControllable(e.target.value)} placeholder="Describe la parte que sí depende de ti" disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action">Redefine en modo acción</Label>
            <p className="text-sm text-muted-foreground">Cambia la queja por un paso concreto que puedas dar. Ejemplo: Queja-&gt;Nunca me valoran en el trabajo., Acción-&gt; Voy a pedir feedback a mi jefe esta semana para saber qué estoy haciendo bien y qué puedo mejorar.</p>
            <Textarea id="action" value={action} onChange={e => setAction(e.target.value)} placeholder="Escribe tu acción concreta" disabled={isSaved} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="registration">Registra tu plan</Label>
            <p className="text-sm text-muted-foreground">En la tabla “Me quejo de… / Lo que sí puedo hacer es…”, anota de nuevo tu queja y la acción que has definido.</p>
            <Textarea id="registration" value={registration} onChange={e => setRegistration(e.target.value)} placeholder="Escribe tu queja y la acción" disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="final-review">Revisión final</Label>
            <p className="text-sm text-muted-foreground">Lee tus acciones y elige la primera que pondrás en práctica hoy mismo.</p>
            <Textarea id="final-review" value={finalReview} onChange={e => setFinalReview(e.target.value)} placeholder="Escribe la acción que harás hoy" disabled={isSaved} />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Transformación</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
