"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Save, CheckCircle } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { UnfulfilledNeedsExerciseContent } from "@/data/paths/pathTypes";
import { useUser } from "@/contexts/UserContext";

interface UnfulfilledNeedsExerciseProps {
  content: UnfulfilledNeedsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function UnfulfilledNeedsExercise({
  content,
  pathId,
  onComplete,
}: UnfulfilledNeedsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [unfulfilledAction, setUnfulfilledAction] = useState("");
  const [associatedValue, setAssociatedValue] = useState("");
  const [reason, setReason] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    if (!unfulfilledAction || !associatedValue || !reason || !tomorrowPlan) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Identifica una pequena accion que hoy no hiciste y que sabes que te habria hecho bien | Respuesta: ${unfulfilledAction}

Pregunta: Que valor estaba asociado a eso que postergaste? | Respuesta: ${associatedValue}

Pregunta: Que te impidio hacerlo? (miedo, prisa, presion, distraccion) | Respuesta: ${reason}

Pregunta: Que puedes hacer manana para proteger mejor ese valor? | Respuesta: ${tomorrowPlan}
    `;

    addNotebookEntry({
      title: "Micropractica: Necesidades No Atendidas",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Reflexion guardada", description: "Tu reflexion ha sido guardada en el cuaderno." });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        <CardDescription>
          {content.objective}
          <p className="text-xs">Duracion: 3-5 minutos diarios. Realizar al final del dia o antes de dormir.</p>
        </CardDescription>

        <div className="space-y-2 p-2 border bg-background rounded-md text-sm">
          <p className="font-semibold">Ejemplo guia</p>
          <p>
            <strong>Accion que me habria hecho bien:</strong> No sali a caminar, aunque sabia que me despejaba.
          </p>
          <p>
            <strong>Valor asociado:</strong> bienestar y conexion con la naturaleza.
          </p>
          <p>
            <strong>Razon:</strong> me atrapo la urgencia de contestar correos.
          </p>
          <p>
            <strong>Plan para manana:</strong> reservar 20 minutos sin movil justo despues de comer.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unfulfilled-action">
              Identifica una pequena accion que hoy no hiciste y que sabes que te habria hecho bien:
            </Label>
            <Textarea
              id="unfulfilled-action"
              value={unfulfilledAction}
              onChange={(e) => setUnfulfilledAction(e.target.value)}
              disabled={isSaved}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assoc-value">Que valor estaba asociado a eso que postergaste?</Label>
            <Textarea
              id="assoc-value"
              value={associatedValue}
              onChange={(e) => setAssociatedValue(e.target.value)}
              disabled={isSaved}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Que te impidio hacerlo? (miedo, prisa, presion, distraccion)</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tomorrow-plan">Que puedes hacer manana para proteger mejor ese valor?</Label>
            <Textarea
              id="tomorrow-plan"
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              disabled={isSaved}
            />
          </div>

          {!isSaved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar reflexion
            </Button>
          ) : (
            <div className="p-4 text-center space-y-2">
              <CheckCircle className="h-10 w-10 text-primary mx-auto" />
              <p className="font-semibold">Reflexion guardada</p>
              <p className="italic">"Reconocer lo que no hice desde el cuidado... ya es un acto de cuidado."</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
