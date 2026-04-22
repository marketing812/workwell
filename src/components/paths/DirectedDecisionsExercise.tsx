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
  { id: "care", label: "Cuidado personal", description: "Elegir lo que te hace bien física y emocionalmente." },
  { id: "auth", label: "Autenticidad", description: "Ser fiel a lo que sientes, aunque no siempre sea lo más cómodo." },
  { id: "calm", label: "Calma", description: "Priorizar espacios de serenidad frente a la prisa o la hiperexigencia." },
  { id: "connect", label: "Conexión", description: "Cuidar vínculos significativos y estar presente en ellos." },
  { id: "respect", label: "Respeto", description: "Tratarte (y tratar a los demás) con dignidad y límites sanos." },
  { id: "balance", label: "Equilibrio", description: "Sostener armonia entre dar y recibir, hacer y descansar." },
  { id: "presence", label: "Presencia", description: 'Estar aquí y ahora, no vivir solo en el "tengo que".' },
  { id: "coherence", label: "Coherencia interna", description: "Alinear lo que haces con lo que piensas y sientes." },
  { id: "autonomy", label: "Autonomía", description: "Tomar decisiones propias, no solo por presión externa." },
  { id: "compassion", label: "Compasión", description: "Tratarte con amabilidad cuando no puedes con todo." },
  { id: "creativity", label: "Creatividad", description: "Dar espacio a lo que te inspira, nutre o emociona." },
  { id: "growth", label: "Crecimiento personal", description: "Elegir lo que te ayuda a evolucionar." },
  { id: "security", label: "Seguridad emocional", description: "Alejarte de lo que daña tu estabilidad interior." },
  { id: "vitality", label: "Vitalidad", description: "Recuperar energía haciendo cosas con sentido." },
  { id: "freedom", label: "Libertad interna", description: "Soltar el deber constante para elegir con más consciencia." },
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
        title: "Acción no definida",
        description: "Define tu acción para mañana.",
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
**Decisión ${i + 1}**
Pregunta: Decisión del día | Respuesta: ${decision.decision || "No especificado."}
Pregunta: Ajuste posible para alinearla a mi valor | Respuesta: ${decision.adjustment || "Ninguno."}
`;
    });

    notebookContent += `
---
Pregunta: Qué pequeña acción puedes tomar mañana que honre ese valor? | Respuesta: ${tomorrowAction}
`;

    addNotebookEntry({
      title: "Decisiones con Dirección",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Decisión guardada", description: "Tu acción de mañana se ha guardado." });
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
              A veces vivimos decidiendo en automático. Hoy vas a practicar algo distinto: tomar decisiones pequeñas que
              te acerquen a lo que sí tiene sentido para ti.
            </p>
            <div className="text-sm p-3 border rounded-md bg-background/50 text-left">
              <p className="font-semibold">Ejemplo guía:</p>
              <p>
                <strong>Valor:</strong> Cuidado personal
              </p>
              <p>
                <strong>Decisión:</strong> Comer en 10 minutos delante del ordenador.
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
                Atrás
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
              Revisa tu día y anota al menos 3 decisiones que hayas tomado hoy (o tomarás) y responde: esta decisión
              ¿está alineada con el valor que elegí? Si no lo está, ¿cómo podría reajustarla o replantearla?
            </p>
            {decisions.map((decision, index) => (
              <div key={index} className="space-y-2 p-3 border rounded-md">
                <Label htmlFor={`decision${index}`}>Decisión {index + 1}</Label>
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
              Añadir decisión {decisions.length + 1}
            </Button>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
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
            <h4 className="font-semibold text-lg">Paso 3: Elige una acción para mañana</h4>
            <div className="space-y-2">
              <Label htmlFor="tomorrow-action">¿Qué pequeña acción puedes tomar mañana que honre ese valor?</Label>
              <Textarea id="tomorrow-action" value={tomorrowAction} onChange={(e) => setTomorrowAction(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              {!isSaved ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar mis decisiones con dirección
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
            <h4 className="font-bold text-lg">Acción guardada</h4>
            <blockquote className="italic">
              "Cada vez que eliges desde un valor, fortaleces tu dirección interna."
            </blockquote>
            <p className="text-sm pt-2">
              Tu plan de acción se ha guardado en tu Cuaderno Terapéutico. Puedes revisarlo cuando quieras para recordar
              tu compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={prevStep} variant="outline">
                Atrás
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
                  <source src={content.audioUrl} type="audio/mpeg" />
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



