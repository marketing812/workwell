"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { MentalNoiseTrafficLightExerciseContent } from "@/data/paths/pathTypes";
import { useUser } from "@/contexts/UserContext";

interface MentalNoiseTrafficLightExerciseProps {
  content: MentalNoiseTrafficLightExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const redOptions = [
  "Antes de dormir",
  "Tras una discusion",
  "Al empezar la semana",
  "Durante atascos de trabajo",
];

const amberOptions = [
  "Antes de una reunion",
  "Durante la jornada laboral",
  "En conversaciones dificiles",
  "Al final del dia con tareas pendientes",
];

const greenOptions = [
  "Al caminar",
  "Al desayunar en calma",
  "Despues de hacer ejercicio",
  "En actividades creativas",
];

const gestureOptions = [
  "Respirar hondo 3 veces",
  "Hacer una mini-pausa fisica",
  "Enviar un mensaje a alguien cercano",
  "Escribir en mi cuaderno una gratitud",
];

const Dot = ({ colorClass }: { colorClass: string }) => (
  <span className={`inline-block h-3 w-3 rounded-full ${colorClass}`} aria-hidden="true" />
);

export default function MentalNoiseTrafficLightExercise({
  content,
  pathId,
  onComplete,
}: MentalNoiseTrafficLightExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [redChoice, setRedChoice] = useState("");
  const [redOther, setRedOther] = useState("");
  const [redDescription, setRedDescription] = useState("");

  const [amberChoice, setAmberChoice] = useState("");
  const [amberOther, setAmberOther] = useState("");
  const [amberDescription, setAmberDescription] = useState("");

  const [greenChoice, setGreenChoice] = useState("");
  const [greenOther, setGreenOther] = useState("");
  const [greenDescription, setGreenDescription] = useState("");

  const [gestureChoice, setGestureChoice] = useState("");
  const [gestureOther, setGestureOther] = useState("");
  const [gestureDescription, setGestureDescription] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const resolveChoice = (choice: string, otherValue: string) => {
    if (choice === "Otro") return otherValue.trim() || "No especificado.";
    return choice || "No especificado.";
  };

  const resetExercise = () => {
    setStep(0);
    setIsSaved(false);
    setRedChoice("");
    setRedOther("");
    setRedDescription("");
    setAmberChoice("");
    setAmberOther("");
    setAmberDescription("");
    setGreenChoice("");
    setGreenOther("");
    setGreenDescription("");
    setGestureChoice("");
    setGestureOther("");
    setGestureDescription("");
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    const resolvedGesture = resolveChoice(gestureChoice, gestureOther);
    if (!gestureDescription.trim() && resolvedGesture === "No especificado.") {
      toast({
        title: "Micropractica incompleta",
        description: "Completa al menos un gesto de proteccion antes de guardar.",
        variant: "destructive",
      });
      return;
    }

    const notebookContent = `
**Ejercicio: ${content.title}**

**Zona roja - Saturacion**
Pregunta: Cuando sientes mas saturacion mental o emocional? | Respuesta: ${resolveChoice(redChoice, redOther)}
Pregunta: Describe tu momento rojo aqui | Respuesta: ${redDescription || "No especificado."}

**Zona amarilla - Tension creciente**
Pregunta: Cuando notas que la tension va subiendo? | Respuesta: ${resolveChoice(amberChoice, amberOther)}
Pregunta: Describe tu momento amarillo aqui | Respuesta: ${amberDescription || "No especificado."}

**Zona verde - Claridad y presencia**
Pregunta: En que momentos sientes mas calma y conexion contigo? | Respuesta: ${resolveChoice(greenChoice, greenOther)}
Pregunta: Describe tu momento verde aqui | Respuesta: ${greenDescription || "No especificado."}

**Tu gesto de proteccion**
Pregunta: Elige un gesto pequeno para proteger o ampliar los momentos verdes | Respuesta: ${resolvedGesture}
Pregunta: Mi gesto verde sera... | Respuesta: ${gestureDescription || "No especificado."}
    `;

    addNotebookEntry({
      title: "Mi Semaforo del Ruido Mental",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Semaforo guardado", description: "Tu semaforo se guardo en el cuaderno." });
    setIsSaved(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>
              Tu mente a veces es como una calle llena de trafico: hay momentos de atasco, momentos de tension
              creciente y tambien momentos de calma. Este ejercicio te ayudara a reconocerlos y a entrenar tu
              capacidad de detenerte cuando mas lo necesites.
            </p>
            <Button onClick={nextStep}>
              Empezar practica
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2 text-red-600">
              <Dot colorClass="bg-red-500" />
              Zona roja: Saturacion
            </h4>
            <p className="text-sm text-muted-foreground">
              Cuando sientes mas saturacion mental o emocional? Ejemplos: justo antes de acostarte, despues de una
              discusion, los lunes por la manana.
            </p>

            <RadioGroup value={redChoice} onValueChange={setRedChoice}>
              {redOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`red-${option}`} />
                  <Label htmlFor={`red-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Otro" id="red-other-option" />
                <Label htmlFor="red-other-option" className="font-normal">
                  Otro
                </Label>
              </div>
            </RadioGroup>
            {redChoice === "Otro" && (
              <Textarea
                value={redOther}
                onChange={(e) => setRedOther(e.target.value)}
                placeholder="Escribe tu opcion roja..."
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="red-description">Describe tu momento rojo aqui...</Label>
              <Textarea
                id="red-description"
                value={redDescription}
                onChange={(e) => setRedDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2 text-amber-600">
              <Dot colorClass="bg-amber-500" />
              Zona amarilla: Tension creciente
            </h4>
            <p className="text-sm text-muted-foreground">
              Cuando notas que la tension va subiendo, como si estuvieras a punto de desbordarte? Ejemplos: a mitad de
              jornada laboral, antes de una reunion importante.
            </p>

            <RadioGroup value={amberChoice} onValueChange={setAmberChoice}>
              {amberOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`amber-${option}`} />
                  <Label htmlFor={`amber-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Otro" id="amber-other-option" />
                <Label htmlFor="amber-other-option" className="font-normal">
                  Otro
                </Label>
              </div>
            </RadioGroup>
            {amberChoice === "Otro" && (
              <Textarea
                value={amberOther}
                onChange={(e) => setAmberOther(e.target.value)}
                placeholder="Escribe tu opcion amarilla..."
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="amber-description">Describe tu momento amarillo aqui...</Label>
              <Textarea
                id="amber-description"
                value={amberDescription}
                onChange={(e) => setAmberDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600">
              <Dot colorClass="bg-green-500" />
              Zona verde: Claridad y presencia
            </h4>
            <p className="text-sm text-muted-foreground">
              En que momentos sientes mas calma y conexion contigo? Ejemplos: al caminar, al desayunar en silencio,
              despues de hacer algo creativo.
            </p>

            <RadioGroup value={greenChoice} onValueChange={setGreenChoice}>
              {greenOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`green-${option}`} />
                  <Label htmlFor={`green-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Otro" id="green-other-option" />
                <Label htmlFor="green-other-option" className="font-normal">
                  Otro
                </Label>
              </div>
            </RadioGroup>
            {greenChoice === "Otro" && (
              <Textarea
                value={greenOther}
                onChange={(e) => setGreenOther(e.target.value)}
                placeholder="Escribe tu opcion verde..."
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="green-description">Describe tu momento verde aqui...</Label>
              <Textarea
                id="green-description"
                value={greenDescription}
                onChange={(e) => setGreenDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Tu gesto de proteccion</h4>
            <p className="text-sm text-muted-foreground">
              Elige un gesto pequeno para proteger o ampliar los momentos verdes. Ejemplos: pausar 3 respiraciones
              profundas, salir a caminar 5 minutos, escribir una frase de gratitud.
            </p>

            <RadioGroup value={gestureChoice} onValueChange={setGestureChoice}>
              {gestureOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`gesture-${option}`} />
                  <Label htmlFor={`gesture-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Otro" id="gesture-other-option" />
                <Label htmlFor="gesture-other-option" className="font-normal">
                  Otro
                </Label>
              </div>
            </RadioGroup>
            {gestureChoice === "Otro" && (
              <Textarea
                value={gestureOther}
                onChange={(e) => setGestureOther(e.target.value)}
                placeholder="Escribe tu gesto..."
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="gesture-description">Mi gesto verde sera...</Label>
              <Textarea
                id="gesture-description"
                value={gestureDescription}
                onChange={(e) => setGestureDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 text-center">
            <CheckCircle className="h-10 w-10 text-primary mx-auto" />
            <h4 className="font-semibold text-lg">Tu semaforo personal</h4>
            <p className="text-sm text-muted-foreground">
              Ya tienes tu semaforo personal: rojo para detectar saturacion, amarillo para anticipar tension y verde
              para reconocer tus momentos de calma. Cada vez que lo consultes, recuerda que no necesitas eliminar el
              ruido mental, sino aprender a escucharlo como senal para volver a ti.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button type="submit" disabled={isSaved}>
                <Save className="mr-2 h-4 w-4" />
                {isSaved ? "Semaforo guardado" : "Guardar mi semaforo en el cuaderno"}
              </Button>
            </div>
            {isSaved && (
              <Button type="button" variant="outline" onClick={resetExercise}>
                Hacer otro registro
              </Button>
            )}
          </form>
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
        {content.objective && (
          <CardDescription className="pt-2">
            {content.objective}
            <p className="mt-2">
              Muchas veces el ruido mental (preocupaciones, pensamientos repetitivos, tension emocional) aparece sin que
              nos demos cuenta. Esta micropractica te ayudara a identificar en que momentos del dia se activa mas ese
              ruido y a usar esas senales como recordatorio para frenar, respirar y reconectar contigo.
            </p>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
