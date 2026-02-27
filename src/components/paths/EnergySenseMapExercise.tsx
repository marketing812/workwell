"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { EnergySenseMapExerciseContent } from "@/data/paths/pathTypes";
import { useUser } from "@/contexts/UserContext";

interface Activity {
  name: string;
  energy: "low" | "medium" | "high" | "";
  value: "low" | "medium" | "high" | "";
}

interface EnergySenseMapExerciseProps {
  content: EnergySenseMapExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const INITIAL_ACTIVITIES: Activity[] = Array.from({ length: 8 }, () => ({
  name: "",
  energy: "",
  value: "",
}));

const energyLabel: Record<"low" | "medium" | "high", string> = {
  low: "Poco",
  medium: "Moderado",
  high: "Mucho",
};

const valueLabel: Record<"low" | "medium" | "high", string> = {
  low: "Nada",
  medium: "Algo",
  high: "Mucho",
};

function ColorDot({ colorClass }: { colorClass: string }) {
  return <span className={`inline-block h-3 w-3 rounded-full ${colorClass}`} aria-hidden="true" />;
}

export default function EnergySenseMapExercise({ content, pathId, onComplete }: EnergySenseMapExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [reflection, setReflection] = useState({ moreOf: "", lessOf: "" });
  const [commitment, setCommitment] = useState("");

  const filledActivities = useMemo(
    () =>
      activities
        .map((activity, index) => ({ activity, index }))
        .filter(({ activity }) => activity.name.trim().length > 0),
    [activities]
  );

  const categorizedActivities = useMemo(() => {
    const potentiators = filledActivities.filter(
      ({ activity }) => activity.value === "high" && activity.energy === "low"
    );
    const draining = filledActivities.filter(
      ({ activity }) => activity.value === "low" && activity.energy === "high"
    );
    const neutral = filledActivities.filter(
      ({ activity }) =>
        !(activity.value === "high" && activity.energy === "low") &&
        !(activity.value === "low" && activity.energy === "high")
    );
    return { potentiators, draining, neutral };
  }, [filledActivities]);

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    setActivities((prev) =>
      prev.map((activity, idx) => (idx === index ? { ...activity, [field]: value } : activity))
    );
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const resetExercise = () => {
    setStep(0);
    setActivities(INITIAL_ACTIVITIES);
    setReflection({ moreOf: "", lessOf: "" });
    setCommitment("");
  };

  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    filledActivities.forEach(({ activity }, idx) => {
      const energy = activity.energy ? energyLabel[activity.energy] : "No especificado.";
      const value = activity.value ? valueLabel[activity.value] : "No especificado.";
      notebookContent += `**Actividad ${idx + 1}:** ${activity.name}\n`;
      notebookContent += `Pregunta: Cuanta energia te consume? | Respuesta: ${energy}\n`;
      notebookContent += `Pregunta: Que tanto se alinea con tus valores personales? | Respuesta: ${value}\n\n`;
    });
    notebookContent += `---\n**Reflexion y microaccion**\n\n`;
    notebookContent += `Pregunta: Que actividad te gustaria hacer mas, porque te conecta con lo importante? | Respuesta: ${reflection.moreOf || "No respondido."}\n`;
    notebookContent += `Pregunta: Que actividad podrias reducir o hacer de otra manera para cuidar tu energia? | Respuesta: ${reflection.lessOf || "No respondido."}\n`;
    notebookContent += `Pregunta: Hoy me comprometo a... | Respuesta: ${commitment || "No respondido."}\n`;

    addNotebookEntry({
      title: "Mi Mapa de Energia vs Sentido",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({
      title: "Mapa guardado",
      description: "Tu mapa de energia y sentido se guardo en el cuaderno terapeutico.",
    });
    onComplete();
    nextStep();
  };

  const canContinueFromList = filledActivities.length >= 6;
  const canContinueFromEvaluation =
    filledActivities.length > 0 &&
    filledActivities.every(({ activity }) => activity.energy !== "" && activity.value !== "");

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p className="italic text-sm text-muted-foreground">
              &quot;No todo lo que te agota es importante, y no todo lo importante te agota.&quot;
            </p>
            <p>
              Cada dia invertimos nuestra energia en multiples cosas. Algunas nos conectan con lo que somos. Otras...
              solo nos drenan.
            </p>
            <p>Este ejercicio te ayuda a distinguir entre lo que te ocupa y lo que te nutre.</p>
            <Button onClick={nextStep}>Empezar mi mapa</Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Mapa semanal</h4>
            <p className="text-sm text-muted-foreground">
              Haz una lista de 6 a 8 actividades que realizaste esta ultima semana.
            </p>
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`activity-${index}`}>Actividad {index + 1}</Label>
                  <Textarea
                    id={`activity-${index}`}
                    value={activity.name}
                    onChange={(e) => handleActivityChange(index, "name", e.target.value)}
                    placeholder={`Escribe la actividad ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Debes completar al menos 6 actividades para continuar.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                onClick={() => {
                  if (!canContinueFromList) {
                    toast({
                      title: "Faltan actividades",
                      description: "Completa al menos 6 actividades para continuar.",
                      variant: "destructive",
                    });
                    return;
                  }
                  nextStep();
                }}
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Evalua cada actividad</h4>
            <p className="text-sm text-muted-foreground">
              Para cada actividad, responde cuanta energia consume y que tanto se alinea con tus valores.
            </p>
            <div className="space-y-4">
              {filledActivities.map(({ activity, index }) => (
                <div key={index} className="p-3 border rounded-md bg-background">
                  <p className="font-semibold mb-2">{activity.name}</p>

                  <Label className="mb-2 block">Cuanta energia te consume?</Label>
                  <RadioGroup
                    value={activity.energy}
                    onValueChange={(value) => handleActivityChange(index, "energy", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="low" id={`energy-${index}-low`} />
                      <Label htmlFor={`energy-${index}-low`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-green-500" />
                        <span>Poco</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="medium" id={`energy-${index}-medium`} />
                      <Label htmlFor={`energy-${index}-medium`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-amber-500" />
                        <span>Moderado</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="high" id={`energy-${index}-high`} />
                      <Label htmlFor={`energy-${index}-high`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-red-500" />
                        <span>Mucho</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <Label className="mt-4 mb-2 block">Que tanto se alinea con tus valores personales?</Label>
                  <RadioGroup
                    value={activity.value}
                    onValueChange={(value) => handleActivityChange(index, "value", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="low" id={`value-${index}-low`} />
                      <Label htmlFor={`value-${index}-low`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-zinc-300 dark:bg-zinc-500" />
                        <span>Nada</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="medium" id={`value-${index}-medium`} />
                      <Label htmlFor={`value-${index}-medium`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-amber-500" />
                        <span>Algo</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="high" id={`value-${index}-high`} />
                      <Label htmlFor={`value-${index}-high`} className="flex items-center gap-2">
                        <ColorDot colorClass="bg-green-500" />
                        <span>Mucho</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                onClick={() => {
                  if (!canContinueFromEvaluation) {
                    toast({
                      title: "Evaluacion incompleta",
                      description: "Responde las dos preguntas de cada actividad para continuar.",
                      variant: "destructive",
                    });
                    return;
                  }
                  nextStep();
                }}
              >
                Ver cuadrante
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 space-y-5">
            <h3 className="font-bold text-lg text-center">Tu cuadrante de energia y sentido</h3>
            <p className="text-sm text-foreground">
              Tus actividades estan clasificadas segun su carga de energia y su conexion con valores:
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <ColorDot colorClass="bg-green-500" />
                <span>Alta conexion con valores y baja carga: Potenciadoras</span>
              </p>
              <p className="flex items-center gap-2">
                <ColorDot colorClass="bg-red-500" />
                <span>Alta carga y baja conexion: Drenantes</span>
              </p>
              <p className="flex items-center gap-2">
                <ColorDot colorClass="bg-amber-500" />
                <span>Conexion y carga medias: Neutras / Reajustables</span>
              </p>
            </div>

            <div className="p-3 border rounded-md bg-background/50 space-y-3">
              <h4 className="font-semibold">Ejemplo de referencia</h4>
              <div>
                <p className="text-sm font-medium">Potenciadoras (Alta conexion - Baja carga)</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Caminar por el bosque los fines de semana</li>
                  <li>Leer sobre crecimiento personal</li>
                  <li>Cocinar para mi familia con calma</li>
                  <li>Jugar con mis hijos</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Drenantes (Baja conexion - Alta carga)</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Reuniones laborales sin sentido claro</li>
                  <li>Revision constante de redes sociales</li>
                  <li>Decir que si a planes que no quiero</li>
                  <li>Mantener conversaciones por compromiso</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Neutras o Reajustables (Carga y conexion medias)</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Tareas domesticas - repartidas con la pareja</li>
                  <li>Estudiar temas laborales - enfocandome en los que me interesan</li>
                  <li>Rutina de ejercicio - cambiarla por algo que disfrute mas</li>
                  <li>Gestion de correos - limitar a 2 franjas al dia</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold">Potenciadoras</h4>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {categorizedActivities.potentiators.length > 0 ? (
                    categorizedActivities.potentiators.map(({ activity, index }) => (
                      <li key={`pot-${index}`}>{activity.name}</li>
                    ))
                  ) : (
                    <li>No hay actividades en esta categoria por ahora.</li>
                  )}
                </ul>
              </div>

              <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                <h4 className="font-semibold">Drenantes</h4>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {categorizedActivities.draining.length > 0 ? (
                    categorizedActivities.draining.map(({ activity, index }) => (
                      <li key={`drain-${index}`}>{activity.name}</li>
                    ))
                  ) : (
                    <li>No hay actividades en esta categoria por ahora.</li>
                  )}
                </ul>
              </div>

              <div className="p-3 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-semibold">Neutras / Reajustables</h4>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {categorizedActivities.neutral.length > 0 ? (
                    categorizedActivities.neutral.map(({ activity, index }) => (
                      <li key={`neutral-${index}`}>{activity.name}</li>
                    ))
                  ) : (
                    <li>No hay actividades en esta categoria por ahora.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep}>
                Reflexion y microaccion
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Reflexion y microaccion</h4>
            <div className="space-y-2">
              <Label>Que actividad te gustaria hacer mas, porque te conecta con lo importante?</Label>
              <Textarea
                value={reflection.moreOf}
                onChange={(e) => setReflection((prev) => ({ ...prev, moreOf: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Que actividad podrias reducir o hacer de otra manera para cuidar tu energia?</Label>
              <Textarea
                value={reflection.lessOf}
                onChange={(e) => setReflection((prev) => ({ ...prev, lessOf: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hoy me comprometo a...</Label>
              <Textarea value={commitment} onChange={(e) => setCommitment(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={handleSave} disabled={!commitment.trim()}>
                Guardar
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Mapa guardado</h4>
            <p className="text-foreground">
              Tu mapa de energia y sentido ha sido guardado. Te recomiendo repetirlo una vez por semana durante un
              mes.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={resetExercise} variant="outline">
                Hacer otro registro
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
        {content.objective && (
          <CardDescription>
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
