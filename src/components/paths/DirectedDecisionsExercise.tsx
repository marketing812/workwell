"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { DirectedDecisionsExerciseContent } from "@/data/paths/pathTypes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/contexts/UserContext";

interface DirectedDecisionsExerciseProps {
  content: DirectedDecisionsExerciseContent;
  pathId: string;
  onComplete: () => void;
}

interface DecisionItem {
  decision: string;
  adjustment: string;
}

const valueOptions = [
  { id: "care", label: "Cuidado personal", description: "Elegir lo que te hace bien fisica y emocionalmente." },
  { id: "auth", label: "Autenticidad", description: "Ser fiel a lo que sientes, aunque no siempre sea lo mas comodo." },
  { id: "calm", label: "Calma", description: "Priorizar espacios de serenidad frente a la prisa o la hiperexigencia." },
  { id: "connect", label: "Conexion", description: "Cuidar vinculos significativos y estar presente en ellos." },
  { id: "respect", label: "Respeto", description: "Tratarte (y tratar a los demas) con dignidad y limites sanos." },
  { id: "balance", label: "Equilibrio", description: "Sostener armonia entre dar y recibir, hacer y descansar." },
  { id: "presence", label: "Presencia", description: 'Estar aqui y ahora, no vivir solo en el "tengo que".' },
  { id: "coherence", label: "Coherencia interna", description: "Alinear lo que haces con lo que piensas y sientes." },
  { id: "autonomy", label: "Autonomia", description: "Tomar decisiones propias, no solo por presion externa." },
  { id: "compassion", label: "Compasion", description: "Tratarte con amabilidad cuando no puedes con todo." },
  { id: "creativity", label: "Creatividad", description: "Dar espacio a lo que te inspira, nutre o emociona." },
  { id: "growth", label: "Crecimiento personal", description: "Elegir lo que te ayuda a evolucionar." },
  { id: "security", label: "Seguridad emocional", description: "Alejarte de lo que dana tu estabilidad interior." },
  { id: "vitality", label: "Vitalidad", description: "Recuperar energia haciendo cosas con sentido." },
  { id: "freedom", label: "Libertad interna", description: "Soltar el deber constante para elegir con mas consciencia." },
];

const createInitialDecisions = (): DecisionItem[] =>
  Array.from({ length: 3 }, () => ({ decision: "", adjustment: "" }));

export default function DirectedDecisionsExercise({
  content,
  pathId,
  onComplete,
}: DirectedDecisionsExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [otherSelectedValue, setOtherSelectedValue] = useState("");
  const [decisions, setDecisions] = useState<DecisionItem[]>(createInitialDecisions);
  const [tomorrowAction, setTomorrowAction] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleDecisionChange = (index: number, field: keyof DecisionItem, value: string) => {
    setDecisions((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const addDecision = () => {
    setDecisions((prev) => [...prev, { decision: "", adjustment: "" }]);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const resetExercise = () => {
    setStep(0);
    setSelectedValue("");
    setOtherSelectedValue("");
    setDecisions(createInitialDecisions());
    setTomorrowAction("");
    setIsSaved(false);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    if (!tomorrowAction.trim()) {
      toast({
        title: "Accion no definida",
        description: "Define tu accion para manana.",
        variant: "destructive",
      });
      return;
    }

    const finalSelectedValue =
      selectedValue === "Otro" ? otherSelectedValue.trim() || "No especificado." : selectedValue || "No especificado.";

    let notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: Valor elegido a fortalecer | Respuesta: ${finalSelectedValue}
`;

    decisions.forEach((decision, i) => {
      if (!decision.decision.trim() && !decision.adjustment.trim()) return;
      notebookContent += `
---
**Decision ${i + 1}**
Pregunta: Decision del dia | Respuesta: ${decision.decision || "No especificado."}
Pregunta: Ajuste posible para alinearla a mi valor | Respuesta: ${decision.adjustment || "Ninguno."}
`;
    });

    notebookContent += `
---
Pregunta: Que pequena accion puedes tomar manana que honre ese valor? | Respuesta: ${tomorrowAction}
`;

    addNotebookEntry({
      title: "Decisiones con Direccion",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Decision guardada", description: "Tu accion de manana se ha guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p>
              A veces vivimos decidiendo en automatico. Hoy vas a practicar algo distinto: tomar decisiones pequenas que
              te acerquen a lo que si tiene sentido para ti.
            </p>
            <div className="text-sm p-3 border rounded-md bg-background/50 text-left">
              <p className="font-semibold">Ejemplo guia:</p>
              <p>
                <strong>Valor:</strong> Cuidado personal
              </p>
              <p>
                <strong>Decision:</strong> Comer en 10 minutos delante del ordenador.
              </p>
              <p>
                <strong>Ajuste posible:</strong> Comer sin pantalla, aunque solo sean 15 minutos.
              </p>
            </div>
            <Button onClick={nextStep}>
              Empezar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Elige un valor central</h4>
            <p className="text-sm">Elige un valor que quieras fortalecer esta semana:</p>
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              {valueOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-accent/50">
                  <RadioGroupItem value={option.label} id={option.id} className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={option.id} className="font-semibold cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm">{option.description}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-accent/50">
                <RadioGroupItem value="Otro" id="value-other" className="mt-1" />
                <div className="grid gap-1.5 leading-none w-full">
                  <Label htmlFor="value-other" className="font-semibold cursor-pointer">
                    Otro:
                  </Label>
                  {selectedValue === "Otro" && (
                    <Textarea
                      value={otherSelectedValue}
                      onChange={(e) => setOtherSelectedValue(e.target.value)}
                      placeholder="Escribe tu valor central..."
                      className="mt-1"
                    />
                  )}
                </div>
              </div>
            </RadioGroup>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                onClick={nextStep}
                disabled={!selectedValue || (selectedValue === "Otro" && !otherSelectedValue.trim())}
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
            <h4 className="font-semibold text-lg">Paso 2: Microdecisiones cotidianas</h4>
            <p className="text-sm">
              Revisa tu dia y anota al menos 3 decisiones que hayas tomado hoy (o tomaras) y responde: esta decision
              esta alineada con el valor que elegi? Si no lo esta, como podria reajustarla o replantearla?
            </p>
            {decisions.map((decision, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-md">
                <Label htmlFor={`decision${index}`}>Decision {index + 1}</Label>
                <Textarea
                  id={`decision${index}`}
                  value={decision.decision}
                  onChange={(e) => handleDecisionChange(index, "decision", e.target.value)}
                />
                <Label htmlFor={`adjustment${index}`}>Ajuste posible</Label>
                <Textarea
                  id={`adjustment${index}`}
                  value={decision.adjustment}
                  onChange={(e) => handleDecisionChange(index, "adjustment", e.target.value)}
                />
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addDecision}>
              Anadir decision {decisions.length + 1}
            </Button>

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
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Elige una accion para mañana</h4>
            <div className="space-y-2">
              <Label htmlFor="tomorrow-action">Que pequena accion puedes tomar manana que honre ese valor?</Label>
              <Textarea id="tomorrow-action" value={tomorrowAction} onChange={(e) => setTomorrowAction(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              {!isSaved ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar mis decisiones con direccion
                </Button>
              ) : (
                <div className="flex items-center p-3 text-green-800 dark:text-green-200">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Guardado.</p>
                </div>
              )}
            </div>
          </form>
        );

      case 4:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Accion guardada</h4>
            <blockquote className="italic">
              "Cada vez que eliges desde un valor, fortaleces tu direccion interna."
            </blockquote>
            <p className="text-sm pt-2">
              Tu plan de accion se ha guardado en tu Cuaderno Terapeutico. Puedes revisarlo cuando quieras para recordar
              tu compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={prevStep} variant="outline">
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
