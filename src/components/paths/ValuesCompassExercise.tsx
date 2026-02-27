"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Edit3, Save } from "lucide-react";
import { addNotebookEntry } from "@/data/therapeuticNotebookStore";
import type { ValuesCompassExerciseContent } from "@/data/paths/pathTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/UserContext";

const lifeAreas = [
  { id: "familia", label: "Familia y crianza" },
  { id: "pareja", label: "Pareja / Relaciones intimas" },
  { id: "amistades", label: "Amistades y vinculos" },
  { id: "salud", label: "Salud y bienestar fisico" },
  { id: "cuidado_emocional", label: "Cuidado emocional y mental" },
  { id: "desarrollo_personal", label: "Desarrollo personal o espiritual" },
  { id: "aprendizaje", label: "Aprendizaje y conocimiento" },
  { id: "trabajo", label: "Trabajo y vocacion" },
  { id: "ocio", label: "Tiempo libre y disfrute" },
  { id: "contribucion", label: "Contribucion y servicio a los demas" },
  { id: "creatividad", label: "Creatividad y expresion personal" },
  { id: "autenticidad", label: "Autenticidad / Vivir con coherencia" },
];

const valuesList = [
  "Autenticidad",
  "Honestidad",
  "Respeto",
  "Cuidado propio",
  "Amor",
  "Familia",
  "Amistad",
  "Pareja / Amor romantico",
  "Justicia",
  "Responsabilidad",
  "Libertad",
  "Creatividad",
  "Proposito vital",
  "Aprendizaje",
  "Empatia",
  "Perseverancia",
  "Integridad",
  "Compasion",
  "Equilibrio",
  "Gratitud",
  "Generosidad",
  "Lealtad",
  "Coraje",
  "Cooperacion",
  "Transparencia",
  "Sostenibilidad",
  "Conexion",
  "Autonomia",
  "Paz interior",
  "Solidaridad",
  "Humildad",
  "Tolerancia",
];

interface ValuesCompassExerciseProps {
  content: ValuesCompassExerciseContent;
  pathId: string;
  onComplete: () => void;
}

type ReflectionByArea = Record<
  string,
  {
    importance: string;
    howToLive: string;
    value: string;
    customValue: string;
  }
>;

export default function ValuesCompassExercise({ content, pathId, onComplete }: ValuesCompassExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
  const [reflections, setReflections] = useState<ReflectionByArea>({});

  const activeAreas = useMemo(() => lifeAreas.filter((area) => selectedAreas[area.id]), [selectedAreas]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const handleAreaChange = (id: string, checked: boolean) => {
    setSelectedAreas((prev) => ({ ...prev, [id]: checked }));
  };

  const handleReflectionChange = (
    id: string,
    field: "importance" | "howToLive" | "value" | "customValue",
    value: string
  ) => {
    setReflections((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { importance: "", howToLive: "", value: "", customValue: "" }),
        [field]: value,
      },
    }));
  };

  const getAreaValue = (areaId: string) => {
    const reflection = reflections[areaId];
    if (!reflection) return "";
    if (reflection.value === "Otro") return reflection.customValue || "Otro";
    return reflection.value || "";
  };

  const handleSave = () => {
    const filledAreas = activeAreas.filter((area) => reflections[area.id]);
    if (filledAreas.length === 0) {
      toast({
        title: "Ejercicio incompleto",
        description: "Completa al menos un area para guardar.",
        variant: "destructive",
      });
      return;
    }

    let notebookContent = `**${content.title}**\n\n`;
    filledAreas.forEach((area) => {
      const reflection = reflections[area.id];
      if (!reflection) return;
      notebookContent += `**Area: ${area.label}**\n`;
      notebookContent += `Pregunta: Por que esta area es importante para ti? | Respuesta: ${reflection.importance || "No respondido."}\n`;
      notebookContent += `Pregunta: Como te gustaria vivirla de forma mas plena o coherente? | Respuesta: ${reflection.howToLive || "No respondido."}\n`;
      notebookContent += `Pregunta: Que valor personal representa esta area? | Respuesta: ${getAreaValue(area.id) || "No respondido."}\n\n`;
    });

    addNotebookEntry({
      title: "Mi Brujula de Valores",
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({
      title: "Brujula guardada",
      description: "Tu brujula de valores ha sido guardada en el cuaderno.",
    });
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 text-center space-y-4">
            <p className="italic text-sm text-muted-foreground">
              &quot;Cuando vives desde tus valores, no todo es facil... pero todo tiene mas sentido.&quot;
            </p>
            <p>
              Muchas veces actuamos en piloto automatico. Reaccionamos, cumplimos, nos adaptamos... pero sin
              preguntarnos:
            </p>
            <p className="font-semibold">Esto que hago representa quien quiero ser?</p>
            <p>
              En este ejercicio vamos a ayudarte a detectar cuales son los valores que realmente te importan, para que
              esa pregunta tenga una respuesta clara.
            </p>
            <Button onClick={nextStep}>Empezar mi brujula</Button>
          </div>
        );

      case 1:
        return (
          <div className="p-4 space-y-3">
            <Label className="font-semibold">
              Selecciona de esta lista las areas que sientes importantes en tu vida actual.
            </Label>
            <p className="text-sm text-muted-foreground">
              No se trata de ser perfecto o perfecta en todas, sino de notar con cuales conectas mas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lifeAreas.map((area) => (
                <div key={area.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={area.id}
                    checked={!!selectedAreas[area.id]}
                    onCheckedChange={(checked) => handleAreaChange(area.id, !!checked)}
                  />
                  <Label htmlFor={area.id} className="font-normal">
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm">Puedes elegir varias.</p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                onClick={() => {
                  if (activeAreas.length === 0) {
                    toast({
                      title: "Seleccion requerida",
                      description: "Elige al menos un area para continuar.",
                      variant: "destructive",
                    });
                    return;
                  }
                  nextStep();
                }}
                className="w-auto"
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
            <p className="text-sm text-muted-foreground">
              Por cada area que marcaste, responde a estas preguntas brevemente.
            </p>
            <div className="p-3 border rounded-md bg-background/50 text-sm space-y-1">
              <p>
                <strong>Ejemplo: Area - Amistades</strong>
              </p>
              <p>Por que es importante? Me hace sentir acompanada y sostenida.</p>
              <p>Como te gustaria vivirla? Siendo mas presente y cultivando amistades reales.</p>
              <p>Valor asociado: Conexion y autenticidad.</p>
            </div>

            {activeAreas.map((area) => (
              <div key={area.id} className="p-3 border rounded-md">
                <h4 className="font-semibold">{area.label}</h4>
                <div className="space-y-2 mt-2">
                  <Label htmlFor={`importance-${area.id}`}>Por que esta area es importante para ti?</Label>
                  <Textarea
                    id={`importance-${area.id}`}
                    value={reflections[area.id]?.importance || ""}
                    onChange={(e) => handleReflectionChange(area.id, "importance", e.target.value)}
                  />

                  <Label htmlFor={`how-${area.id}`}>Como te gustaria vivirla de forma mas plena o coherente?</Label>
                  <Textarea
                    id={`how-${area.id}`}
                    value={reflections[area.id]?.howToLive || ""}
                    onChange={(e) => handleReflectionChange(area.id, "howToLive", e.target.value)}
                  />

                  <Label htmlFor={`value-${area.id}`}>
                    Que valor personal representa esa area? (ej: cuidado, libertad, amor, justicia, presencia,
                    creatividad)
                  </Label>
                  <Select
                    value={reflections[area.id]?.value || ""}
                    onValueChange={(value) => handleReflectionChange(area.id, "value", value)}
                  >
                    <SelectTrigger id={`value-${area.id}`}>
                      <SelectValue placeholder="Selecciona un valor" />
                    </SelectTrigger>
                    <SelectContent>
                      {valuesList.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {reflections[area.id]?.value === "Otro" && (
                    <Textarea
                      value={reflections[area.id]?.customValue || ""}
                      onChange={(e) => handleReflectionChange(area.id, "customValue", e.target.value)}
                      placeholder="Escribe otro valor personal..."
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={nextStep} className="w-auto">
                Ver mi brujula
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 space-y-4">
            <h3 className="font-bold text-lg text-center">Tu brujula personal</h3>
            <p className="text-sm text-foreground">
              Te mostramos ahora un resumen visual con tus areas prioritarias y los valores que representan. Esta
              brujula te ayuda a tomar decisiones con mas coherencia y a reconectar contigo cuando te sientas perdida
              o dispersa.
            </p>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area de vida</TableHead>
                    <TableHead>Valor asociado</TableHead>
                    <TableHead>Como quieres vivirla</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.label}</TableCell>
                      <TableCell>{getAreaValue(area.id) || "N/A"}</TableCell>
                      <TableCell>{reflections[area.id]?.howToLive || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="italic text-sm text-foreground text-center">
              Mira esta brujula cada vez que tengas que tomar una decision dificil o cuando sientas que estas en
              piloto automatico. Volver a tus valores es como volver a casa.
            </p>

            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button onClick={handleSave} className="w-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar brujula
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Brujula guardada</h4>
            <p className="text-foreground">
              Tu brujula de valores ha sido guardada en el cuaderno. Puedes volver a consultarla cuando quieras.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                onClick={() => {
                  setStep(0);
                  setSelectedAreas({});
                  setReflections({});
                }}
                variant="outline"
              >
                Empezar de nuevo
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
