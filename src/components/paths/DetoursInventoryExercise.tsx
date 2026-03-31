"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { DetoursInventoryExerciseContent } from "@/data/paths/pathTypes";
import { useUser } from "@/contexts/UserContext";

interface DetoursInventoryExerciseProps {
  content: DetoursInventoryExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const frequentDetours = [
  { id: "detour-yes", label: 'Decir "sí" por compromiso, aunque quería decir "no".' },
  { id: "detour-social", label: "Revisar redes sociales como escape." },
  { id: "detour-eating", label: "Comer sin hambre por ansiedad o aburrimiento." },
  { id: "detour-postpone", label: "Posponer decisiones importantes por miedo." },
  {
    id: "detour-thoughts",
    label: 'Pensamientos como: "No soy suficiente", "Tengo que hacerlo perfecto", "Si fallo, me rechazarán".',
  },
  { id: "detour-toxic-env", label: "Rodearme de personas o ambientes que no me hacen bien." },
];

const valueOptions = [
  { id: "val-auth", label: "Autenticidad (ser yo mismo/a)" },
  { id: "val-care", label: "Salud y autocuidado" },
  { id: "val-connect", label: "Conexión con los demás" },
  { id: "val-calm", label: "Calma y equilibrio" },
  { id: "val-respect", label: "Respeto hacia mí mismo/a" },
  { id: "val-growth", label: "Crecimiento personal" },
  { id: "val-responsibility", label: "Responsabilidad" },
  { id: "val-freedom", label: "Libertad" },
  { id: "val-security", label: "Seguridad" },
];

const emotionOptions = [
  { id: "emo-guilt", label: "Culpa" },
  { id: "emo-frustration", label: "Frustración" },
  { id: "emo-sadness", label: "Tristeza" },
  { id: "emo-relief", label: "Alivio momentáneo" },
  { id: "emo-anxiety", label: "Ansiedad" },
  { id: "emo-shame", label: "Vergüenza" },
  { id: "emo-disconnect", label: "Desconexión" },
  { id: "emo-resentment", label: "Resentimiento" },
  { id: "emo-emptiness", label: "Indiferencia / vacío" },
];

const partOptions = [
  { id: "part-insecure", label: "Mi parte insegura" },
  { id: "part-fearful", label: "Mi parte que teme al rechazo" },
  { id: "part-pleaser", label: "Mi parte que busca aprobación" },
  { id: "part-controlling", label: "Mi parte que quiere sentirse en control" },
  { id: "part-avoider", label: "Mi parte que evita el dolor o el conflicto" },
  { id: "part-needy", label: "Mi parte que necesita afecto o reconocimiento" },
  { id: "part-lonely", label: "Mi parte que se siente sola" },
  { id: "part-failure-fear", label: "Mi parte que teme fracasar" },
];

interface Reflection {
  values: Record<string, boolean>;
  emotions: Record<string, boolean>;
  parts: Record<string, boolean>;
  otherValue: string;
  otherEmotion: string;
  otherPart: string;
}

const emptyReflection = (): Reflection => ({
  values: {},
  emotions: {},
  parts: {},
  otherValue: "",
  otherEmotion: "",
  otherPart: "",
});

export default function DetoursInventoryExercise({ content, pathId, onComplete }: DetoursInventoryExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [detours, setDetours] = useState<Record<string, boolean>>({});
  const [otherDetour, setOtherDetour] = useState("");
  const [reflections, setReflections] = useState<Record<string, Reflection>>({});
  const [commitment, setCommitment] = useState("");
  const [reconnectionGestures, setReconnectionGestures] = useState("");
  const [detourSaved, setDetourSaved] = useState(false);

  const selectedDetours = useMemo(() => {
    const common = frequentDetours.filter((detour) => detours[detour.id]);
    if (detours["detour-other"] && otherDetour.trim()) {
      common.push({ id: "detour-other", label: otherDetour.trim() });
    }
    return common;
  }, [detours, otherDetour]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const handleDetourToggle = (id: string, checked: boolean) => {
    if (checked && !detours[id] && selectedDetours.length >= 3) {
      toast({
        title: "Máximo 3 desvíos",
        description: "Elige hasta 3 desvíos para trabajar hoy.",
        variant: "destructive",
      });
      return;
    }
    setDetours((prev) => ({ ...prev, [id]: checked }));
    setDetourSaved(false);
  };

  const handleReflectionCheckboxChange = (
    detourId: string,
    field: "values" | "emotions" | "parts",
    subfield: string,
    checked: boolean
  ) => {
    setReflections((prev) => ({
      ...prev,
      [detourId]: {
        ...(prev[detourId] || emptyReflection()),
        [field]: {
          ...((prev[detourId] || emptyReflection())[field] || {}),
          [subfield]: checked,
        },
      },
    }));
    setDetourSaved(false);
  };

  const handleOtherReflectionTextChange = (
    detourId: string,
    field: "otherValue" | "otherEmotion" | "otherPart",
    value: string
  ) => {
    setReflections((prev) => ({
      ...prev,
      [detourId]: {
        ...(prev[detourId] || emptyReflection()),
        [field]: value,
      },
    }));
    setDetourSaved(false);
  };

  const handleSaveDetourStep = () => {
    const hasContent = selectedDetours.some((detour) => {
      const reflection = reflections[detour.id];
      if (!reflection) return false;

      const valuePicked =
        Object.values(reflection.values || {}).some(Boolean) || reflection.otherValue.trim().length > 0;
      const emotionPicked =
        Object.values(reflection.emotions || {}).some(Boolean) || reflection.otherEmotion.trim().length > 0;
      const partPicked =
        Object.values(reflection.parts || {}).some(Boolean) || reflection.otherPart.trim().length > 0;
      return valuePicked || emotionPicked || partPicked;
    });

    if (!hasContent) {
      toast({
        title: "Paso incompleto",
        description: "Completa al menos un desvío antes de guardarlo.",
        variant: "destructive",
      });
      return;
    }

    setDetourSaved(true);
    toast({ title: "Desvío guardado", description: "Tu análisis de desvío se guardó para continuar." });
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    if (!commitment.trim() || !reconnectionGestures.trim()) {
      toast({
        title: "Ejercicio incompleto",
        description: "Completa el compromiso y los gestos de reconexión.",
        variant: "destructive",
      });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;

    selectedDetours.forEach((detour) => {
      const reflection = reflections[detour.id];
      if (!reflection) return;

      const selectedValues = valueOptions.filter((value) => reflection.values?.[value.id]).map((value) => value.label);
      if (reflection.values?.["val-other"] && reflection.otherValue.trim()) {
        selectedValues.push(reflection.otherValue.trim());
      }

      const selectedEmotions = emotionOptions
        .filter((emotion) => reflection.emotions?.[emotion.id])
        .map((emotion) => emotion.label);
      if (reflection.emotions?.["emo-other"] && reflection.otherEmotion.trim()) {
        selectedEmotions.push(reflection.otherEmotion.trim());
      }

      const selectedParts = partOptions.filter((part) => reflection.parts?.[part.id]).map((part) => part.label);
      if (reflection.parts?.["part-other"] && reflection.otherPart.trim()) {
        selectedParts.push(reflection.otherPart.trim());
      }

      notebookContent += `**Desvio: "${detour.label}"**\n`;
      notebookContent += `Pregunta: ¿Qué valor personal estás dejando de lado? | Respuesta: [${selectedValues.length > 0 ? selectedValues.join(", ") : "No especificados."}]\n`;
      notebookContent += `Pregunta: ¿Qué sientes después de actuar así? | Respuesta: [${selectedEmotions.length > 0 ? selectedEmotions.join(", ") : "No especificadas."}]\n`;
      notebookContent += `Pregunta: ¿Qué parte de ti busca protección o alivio en ese desvío? | Respuesta: [${selectedParts.length > 0 ? selectedParts.join(", ") : "No especificada."}]\n\n`;
    });

    notebookContent += `---\n**Mi compromiso de cambio y reconexión**\n\n`;
    notebookContent += `Pregunta: Escribe tu gesto de cambio en formato Si... entonces... | Respuesta: ${commitment}\n`;
    notebookContent += `Pregunta: Escribe tu gesto de reconexión | Respuesta: ${reconnectionGestures}\n`;

    addNotebookEntry({
      title: "Inventario de Desvíos",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: "Ejercicio guardado", description: "Tu inventario de desvíos ha sido guardado." });
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p>
              A veces no es que no sepas lo que quieres... sino que hay interferencias que te desvían del camino. Hoy
              vamos a ponerles nombre para empezar a recuperar dirección.
            </p>
            <Button onClick={nextStep}>
              Empezar mi inventario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Antes de mirar tus propios desvíos, observa un ejemplo realista. No es para copiarlo, sino para
              inspirarte en cómo se identifica un desvío, el valor que toca y la reflexión que ayuda a reconectar.
            </p>
            <div className="p-4 border rounded-md bg-background/50 text-left text-sm">
              <p>
                <strong>Desvío:</strong> Postergar el autocuidado por miedo a parecer egoísta.
              </p>
              <p>
                <strong>Valor afectado:</strong> Autorrespeto y bienestar.
              </p>
              <p>
                <strong>Reflexión:</strong> Cada vez que dejo de cuidarme para que los demás no me juzguen, me alejo
                de mi autenticidad.
              </p>
            </div>
            <p className="text-sm italic text-muted-foreground">Piensa: ¿qué cosas en tu vida se parecen a esto?</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep}>
                Ir a mis desvíos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 1: Tus desvíos más frecuentes</h4>
            <p className="text-sm text-muted-foreground">
              Ahora haremos inventario. El objetivo no es juzgarte, sino poner nombre a lo que te aparta de tus
              valores en el día a día.
            </p>
            <p className="text-sm text-muted-foreground">
              Marca o escribe los desvíos que reconoces en tu vida actual. Elige máximo 3 para trabajar hoy.
            </p>
            <div className="space-y-2">
              {frequentDetours.map((detour) => (
                <div key={detour.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={detour.id}
                    checked={!!detours[detour.id]}
                    onCheckedChange={(checked) => handleDetourToggle(detour.id, !!checked)}
                  />
                  <Label htmlFor={detour.id} className="font-normal">
                    {detour.label}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="detour-other"
                  checked={!!detours["detour-other"]}
                  onCheckedChange={(checked) => handleDetourToggle("detour-other", !!checked)}
                />
                <Label htmlFor="detour-other" className="font-normal">
                  Otro:
                </Label>
              </div>
              {detours["detour-other"] && (
                <Textarea
                  value={otherDetour}
                  onChange={(event) => setOtherDetour(event.target.value)}
                  placeholder="Escribe otro desvío..."
                />
              )}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => {
                  if (selectedDetours.length === 0) {
                    toast({
                      title: "Selección requerida",
                      description: "Marca al menos un desvío para continuar.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setDetourSaved(false);
                  nextStep();
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 2: Cómo afectan a tu bienestar?</h4>
            <p className="text-sm text-muted-foreground">
              Vamos a profundizar en un desvío importante. Aquí descubrirás qué valor personal dejas de lado y qué
              parte de ti busca protección o alivio en ese desvío. Puedes repetir este paso con más desvíos.
            </p>

            {selectedDetours.map((detour, idx) => (
              <Accordion key={detour.id} type="single" collapsible className="w-full border rounded-md p-2 bg-background/50">
                <AccordionItem value={detour.id}>
                  <AccordionTrigger className="font-semibold text-primary">
                    Mi desvío {idx + 1}: {detour.label}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>1. Qué valor personal estás dejando de lado cuando esto ocurre?</Label>
                      {valueOptions.map((value) => (
                        <div key={value.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${detour.id}-${value.id}`}
                            checked={!!reflections[detour.id]?.values?.[value.id]}
                            onCheckedChange={(checked) =>
                              handleReflectionCheckboxChange(detour.id, "values", value.id, !!checked)
                            }
                          />
                          <Label htmlFor={`${detour.id}-${value.id}`} className="font-normal">
                            {value.label}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${detour.id}-val-other`}
                          checked={!!reflections[detour.id]?.values?.["val-other"]}
                          onCheckedChange={(checked) =>
                            handleReflectionCheckboxChange(detour.id, "values", "val-other", !!checked)
                          }
                        />
                        <Label htmlFor={`${detour.id}-val-other`} className="font-normal">
                          Otro
                        </Label>
                      </div>
                      {reflections[detour.id]?.values?.["val-other"] && (
                        <Textarea
                          value={reflections[detour.id]?.otherValue || ""}
                          onChange={(event) =>
                            handleOtherReflectionTextChange(detour.id, "otherValue", event.target.value)
                          }
                          placeholder="Escribe otro valor..."
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>2. Qué sientes después de actuar así?</Label>
                      {emotionOptions.map((emotion) => (
                        <div key={emotion.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${detour.id}-${emotion.id}`}
                            checked={!!reflections[detour.id]?.emotions?.[emotion.id]}
                            onCheckedChange={(checked) =>
                              handleReflectionCheckboxChange(detour.id, "emotions", emotion.id, !!checked)
                            }
                          />
                          <Label htmlFor={`${detour.id}-${emotion.id}`} className="font-normal">
                            {emotion.label}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${detour.id}-emo-other`}
                          checked={!!reflections[detour.id]?.emotions?.["emo-other"]}
                          onCheckedChange={(checked) =>
                            handleReflectionCheckboxChange(detour.id, "emotions", "emo-other", !!checked)
                          }
                        />
                        <Label htmlFor={`${detour.id}-emo-other`} className="font-normal">
                          Otro
                        </Label>
                      </div>
                      {reflections[detour.id]?.emotions?.["emo-other"] && (
                        <Textarea
                          value={reflections[detour.id]?.otherEmotion || ""}
                          onChange={(event) =>
                            handleOtherReflectionTextChange(detour.id, "otherEmotion", event.target.value)
                          }
                          placeholder="Escribe otra emoción..."
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>3. Qué parte de ti busca protección o alivio en ese desvío?</Label>
                      {partOptions.map((part) => (
                        <div key={part.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${detour.id}-${part.id}`}
                            checked={!!reflections[detour.id]?.parts?.[part.id]}
                            onCheckedChange={(checked) =>
                              handleReflectionCheckboxChange(detour.id, "parts", part.id, !!checked)
                            }
                          />
                          <Label htmlFor={`${detour.id}-${part.id}`} className="font-normal">
                            {part.label}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${detour.id}-part-other`}
                          checked={!!reflections[detour.id]?.parts?.["part-other"]}
                          onCheckedChange={(checked) =>
                            handleReflectionCheckboxChange(detour.id, "parts", "part-other", !!checked)
                          }
                        />
                        <Label htmlFor={`${detour.id}-part-other`} className="font-normal">
                          Otro
                        </Label>
                      </div>
                      {reflections[detour.id]?.parts?.["part-other"] && (
                        <Textarea
                          value={reflections[detour.id]?.otherPart || ""}
                          onChange={(event) =>
                            handleOtherReflectionTextChange(detour.id, "otherPart", event.target.value)
                          }
                          placeholder="Describe otra parte de ti..."
                        />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}

            <p className="text-sm text-muted-foreground italic">
              Entender la función de un desvío te ayuda a transformarlo, no a castigarte.
            </p>
            <div className="flex flex-wrap gap-2 justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button type="button" variant="outline" onClick={handleSaveDetourStep}>
                Guardar mi desvío
              </Button>
              <Button onClick={nextStep} disabled={!detourSaved}>
                Ir al compromiso de cambio
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 3: Primer compromiso de cambio</h4>
            <p className="text-sm text-muted-foreground">
              Ahora toca pasar a la acción. Un pequeño gesto concreto puede ayudarte a reducir el desvío y volver a lo
              importante.
            </p>
            <p className="text-sm text-muted-foreground">
              Elige un gesto sencillo (1-3 minutos) formulado en positivo. Usa la estructura "si-entonces" para
              hacerlo más fácil.
            </p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p>Ejemplo: Si me pongo a revisar redes por soledad, entonces enviaré un mensaje sincero a alguien cercano.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commitment-si">Escribe aquí tu gesto de cambio en formato: Si... entonces...</Label>
              <Textarea
                id="commitment-si"
                value={commitment}
                onChange={(event) => setCommitment(event.target.value)}
                placeholder="Si... entonces..."
              />
            </div>
            <p className="text-sm text-muted-foreground italic">
              Mejor un paso pequeño y seguro que uno grande que nunca darás.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!commitment.trim()}>
                Guardar compromiso
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Paso 4: Guarda tus gestos valiosos</h4>
            <p className="text-sm text-muted-foreground">
              A veces, cuando más lo necesitamos, se nos olvidan esas pequeñas cosas que nos devuelven la calma y la
              conexión con lo que importa.
            </p>
            <p className="text-sm text-muted-foreground">
              Aquí puedes crear tu kit personal de reconexión: una lista de gestos sencillos que siempre te ayudan a
              volver a ti cuando sientes que te desvías.
            </p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm space-y-1">
              <p>Ejemplo guía:</p>
              <p>Poner mi cancion favorita y moverme un rato.</p>
              <p>Escribir tres cosas por las que me siento agradecido/a.</p>
              <p>Salir a caminar sin móvil durante 10 minutos.</p>
              <p>Respirar profundo tres veces y repetirme: "Estoy aquí, estoy a salvo".</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reconnection-gestures">Escribe aquí tu gesto de reconexión:</Label>
              <Textarea
                id="reconnection-gestures"
                value={reconnectionGestures}
                onChange={(event) => setReconnectionGestures(event.target.value)}
                placeholder="Escribe tu gesto de reconexión..."
              />
            </div>
            <p className="text-sm text-muted-foreground italic">
              No hace falta que sean grandes cambios. Lo importante es que sean gestos simples y realistas, que de
              verdad puedas aplicar en tu día a día.
            </p>
            <p className="text-sm text-muted-foreground font-semibold text-center">
              Cada gesto guardado será un recordatorio de tu fuerza y de tu camino.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar en Mis gestos de reconexión
              </Button>
            </div>
          </form>
        );

      case 6:
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Inventario guardado</h4>
            <p className="text-muted-foreground">
              Tu inventario de desvíos ha sido guardado. Puedes consultarlo en tu Cuaderno Terapéutico cuando lo
              necesites.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
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



