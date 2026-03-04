"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { PresentVsEssentialSelfExerciseContent } from "@/data/paths/pathTypes";
import { useUser } from "@/contexts/UserContext";

interface PresentVsEssentialSelfExerciseProps {
  content: PresentVsEssentialSelfExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function PresentVsEssentialSelfExercise({
  content,
  pathId,
  onComplete,
}: PresentVsEssentialSelfExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [presentSelfDesc, setPresentSelfDesc] = useState("");
  const [essentialSelfDesc, setEssentialSelfDesc] = useState("");
  const [smallAction, setSmallAction] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const storageKey = `exercise-progress-${pathId}-presentVsEssential`;

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem(storageKey);
      if (!savedState) return;
      const data = JSON.parse(savedState);
      setStep(data.step || 0);
      setPresentSelfDesc(data.presentSelfDesc || "");
      setEssentialSelfDesc(data.essentialSelfDesc || "");
      setSmallAction(data.smallAction || "");
      setIsSaved(data.isSaved || false);
    } catch (error) {
      console.error("Error loading exercise state:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stateToSave = { step, presentSelfDesc, essentialSelfDesc, smallAction, isSaved };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving exercise state:", error);
    }
  }, [step, presentSelfDesc, essentialSelfDesc, smallAction, isSaved, storageKey, isClient]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const resetExercise = () => {
    setStep(0);
    setPresentSelfDesc("");
    setEssentialSelfDesc("");
    setSmallAction("");
    setIsSaved(false);
    localStorage.removeItem(storageKey);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    if (!smallAction.trim()) {
      toast({
        title: "Accion no definida",
        description: "Por favor, escribe tu pequena accion para guardar.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Como es mi yo actual? | Respuesta: ${presentSelfDesc || "No descrito."}

Pregunta: Como es mi yo esencial? | Respuesta: ${essentialSelfDesc || "No descrito."}

Pregunta: Que gesto o accion pequena voy a hacer para acercarme a mi yo esencial? | Respuesta: ${smallAction}
    `;

    addNotebookEntry({
      title: "Visualizacion: Yo Presente vs. Yo Esencial",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Ejercicio guardado", description: "Tu visualizacion ha sido guardada." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  if (!isClient) return null;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p>
              No se trata de juzgarte ni de exigirte cambios inmediatos. Se trata de mirarte con amabilidad, como quien
              observa una pelicula, para redescubrir quien eres y hacia donde quieres ir.
            </p>
            <ul className="list-disc list-inside text-left mx-auto max-w-md">
              <li>Tu yo actual: como estas viviendo hoy.</li>
              <li>Tu yo esencial: como seria tu vida si actuases desde tus valores.</li>
            </ul>
            <p>Cuando quieras, pulsa Empezar y deja que tu imaginacion te guie.</p>
            <Button onClick={nextStep}>
              Empezar visualizacion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Tu yo actual</h4>
            <p>
              Antes de avanzar, piensa que este paso es como mirar una fotografia de ti hoy. No para criticarte, sino
              para comprenderte mejor.
            </p>
            <p>Preguntate:</p>
            <ul className="list-disc list-inside pl-4 text-sm">
              <li>Como me hablo en mi dia a dia?</li>
              <li>Como transcurren mis jornadas?</li>
              <li>Que emociones predominan?</li>
              <li>Como me relaciono con los demas?</li>
              <li>Que habitos mantengo, aunque no me hagan bien?</li>
            </ul>
            <Label htmlFor="present-self">Escribe aqui tu descripcion de tu yo actual...</Label>
            <Textarea id="present-self" value={presentSelfDesc} onChange={(e) => setPresentSelfDesc(e.target.value)} />
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p>
                Ejemplo guia: "Mi yo actual corre a todos lados, revisa el movil constantemente, y muchas veces dice
                que si, aunque quiere decir que no. Siento tension en el pecho y, a veces, tristeza."
              </p>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep} disabled={!presentSelfDesc.trim()}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Tu yo esencial</h4>
            <p>
              Ahora imagina como seria tu vida si vivieras conectada o conectado a lo que de verdad importa para ti.
              Visualiza tu yo esencial, esa version tuya que ya existe dentro, esperando mas espacio.
            </p>
            <p>Preguntate:</p>
            <ul className="list-disc list-inside pl-4 text-sm">
              <li>Como se mueve esta version de mi?</li>
              <li>Como cuida sus espacios y se habla?</li>
              <li>Que decisiones toma?</li>
              <li>Que limites pone?</li>
              <li>Que transmite a los demas?</li>
            </ul>
            <Label htmlFor="essential-self">Escribe aqui tu descripcion de tu yo esencial...</Label>
            <Textarea
              id="essential-self"
              value={essentialSelfDesc}
              onChange={(e) => setEssentialSelfDesc(e.target.value)}
            />
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p>
                Ejemplo guia: "Mi yo esencial se mueve con calma, respira profundamente, dice lo que necesita con
                serenidad y cuida sus tiempos. Me inspira paz y claridad."
              </p>
            </div>
            <p className="text-sm italic pt-2">
              La neurociencia muestra que visualizar de forma repetida comportamientos positivos activa las mismas areas
              cerebrales que al ejecutarlos (corteza prefrontal y sistema limbico). Asi entrenas tu mente para acercarte
              a esa version de ti.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep} disabled={!essentialSelfDesc.trim()}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Integracion y eleccion</h4>
            <p>
              Ahora que tienes delante a tu yo actual y a tu yo esencial, observa la diferencia entre ambos. Esta
              comparacion no es para sentir distancia, sino para elegir un puente que los conecte.
            </p>
            <p>Preguntate:</p>
            <ul className="list-disc list-inside pl-4 text-sm">
              <li>Que diferencia mas significativa noto entre mis dos versiones?</li>
              <li>Que gesto pequeno de mi yo esencial puedo traer a mi vida esta semana?</li>
            </ul>

            <div className="space-y-2">
              <Label htmlFor="small-action">Describe tu gesto o accion pequena...</Label>
              <Textarea id="small-action" value={smallAction} onChange={(e) => setSmallAction(e.target.value)} />
              <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p>
                  Ejemplo guia: "Quiero probar a poner el movil en silencio media hora cada noche y usar ese tiempo para
                  leer o simplemente descansar en calma."
                </p>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button type="submit" disabled={!smallAction.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Guardar en el cuaderno terapeutico
              </Button>
            </div>
          </form>
        );

      case 4:
        return (
          <div className="p-6 space-y-5 animate-in fade-in-0 duration-500">
            <div className="rounded-xl border bg-gradient-to-b from-emerald-50/80 to-background dark:from-emerald-950/20 p-5 text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-bold text-xl">Visualizacion guardada</h4>
              <p className="text-sm text-muted-foreground">
                No se trata de transformarte de golpe, sino de acercarte poco a poco a tu esencia. Cada gesto que
                incorpores es un paso hacia tu autenticidad.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4 space-y-3">
              <p className="text-sm font-medium">Tu microaccion elegida</p>
              <p className="text-sm text-foreground italic">
                {smallAction.trim() || "No se registro una microaccion."}
              </p>
            </div>

            <div className="text-sm space-y-2">
              <p className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                Felicitate por haberte regalado este momento de conexion.
              </p>
              <p className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                Tus respuestas quedaron guardadas en tu cuaderno terapeutico.
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={resetExercise} variant="outline" className="w-auto">
                Hacer otra reflexion
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
        <CardDescription>
          A veces vivimos en "piloto automatico" y sentimos que no somos del todo nosotros mismos. Este ejercicio te
          ayudara a observarte desde fuera, sin juicio, para distinguir entre tu yo presente (como vives ahora mismo) y
          tu yo esencial (como te gustaria vivir si actuaras desde tus valores mas profundos). Al hacerlo, entrenas tu
          capacidad de autoconciencia y te orientas hacia decisiones mas alineadas contigo.
        </CardDescription>
        <p className="text-sm pt-1">
          Te recomiendo repetir este ejercicio una vez al mes, o cuando sientas que necesitas reconectar con tu
          direccion vital.
        </p>
        {content.audioUrl && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={content.audioUrl} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
