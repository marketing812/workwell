"use client";

import { useMemo, useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CoherenceCompassExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';
import { Textarea } from '../ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

const keyAreas = [
  { id: 'relaciones_personales', label: 'Relaciones personales (familia, pareja, amistades)' },
  { id: 'relaciones_laborales_estudios', label: 'Relaciones laborales o estudios' },
  { id: 'tiempo_libre', label: 'Tiempo libre y actividades que te nutren' },
  { id: 'salud_fisica_mental', label: 'Salud física y mental (descanso, alimentación, emociones)' },
  { id: 'dinero', label: 'Manejo del dinero y decisiones económicas' },
  { id: 'entorno', label: 'Cuidado del entorno (hogar, espacio, medioambiente)' },
  { id: 'espiritualidad', label: 'Espiritualidad o vida interior (creencias, valores, conexión personal)' },
  { id: 'uso_tiempo', label: 'Uso del tiempo y prioridades diarias' },
  { id: 'comunicacion', label: 'Comunicación con los demás' },
  { id: 'compromiso_social', label: 'Compromiso social o ético (si aplica)' },
];

const createInitialRatings = (): Record<string, number> => {
  const initialRatings: Record<string, number> = {};
  keyAreas.forEach((area) => {
    initialRatings[area.id] = 3;
  });
  return initialRatings;
};

interface CoherenceCompassExerciseProps {
  content: CoherenceCompassExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CoherenceCompassExercise({ content, pathId, onComplete }: CoherenceCompassExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [areaRatings, setAreaRatings] = useState<Record<string, number>>(() => createInitialRatings());
  const [topAlignedAreas, setTopAlignedAreas] = useState<string[]>([]);
  const [highCoherenceReflection, setHighCoherenceReflection] = useState('');
  const [highCoherenceEmotions, setHighCoherenceEmotions] = useState('');
  const [disconnectionArea, setDisconnectionArea] = useState('');
  const [disconnectionReflection, setDisconnectionReflection] = useState('');
  const [smallGesture, setSmallGesture] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const chartData = useMemo(
    () =>
      keyAreas.map((area) => ({
        area: area.label.length > 24 ? `${area.label.slice(0, 24)}...` : area.label,
        score: areaRatings[area.id] ?? 1,
        fullMark: 5,
      })),
    [areaRatings]
  );

  const chartConfig = {
    score: {
      label: 'Coherencia',
      color: 'hsl(var(--primary))',
    },
  };

  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));
  const nextStep = () => setStep((prev) => prev + 1);

  const getAreaLabel = (areaId: string): string => {
    return keyAreas.find((area) => area.id === areaId)?.label || areaId;
  };

  const handleRatingChange = (areaId: string, value: number[]) => {
    setAreaRatings((prev) => ({ ...prev, [areaId]: value[0] }));
  };

  const handleTopAlignedToggle = (areaId: string, checked: boolean) => {
    if (checked) {
      if (topAlignedAreas.includes(areaId)) return;
      if (topAlignedAreas.length >= 2) {
        toast({
          title: 'Selecciona solo dos áreas',
          description: 'Este paso pide exactamente dos zonas de mayor alineación.',
          variant: 'destructive',
        });
        return;
      }
      setTopAlignedAreas((prev) => [...prev, areaId]);
      return;
    }
    setTopAlignedAreas((prev) => prev.filter((id) => id !== areaId));
  };

  const resetExercise = () => {
    setStep(0);
    setAreaRatings(createInitialRatings());
    setTopAlignedAreas([]);
    setHighCoherenceReflection('');
    setHighCoherenceEmotions('');
    setDisconnectionArea('');
    setDisconnectionReflection('');
    setSmallGesture('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (
      topAlignedAreas.length !== 2 ||
      !highCoherenceReflection.trim() ||
      !highCoherenceEmotions.trim() ||
      !disconnectionArea ||
      !disconnectionReflection.trim()
    ) {
      toast({
        title: 'Ejercicio incompleto',
        description: 'Completa los pasos de alineación y desconexión antes de guardar.',
        variant: 'destructive',
      });
      return;
    }

    const ratingsSummary = keyAreas
      .map((area) => `- ${area.label}: ${areaRatings[area.id]}/5`)
      .join('\n');

    const notebookContent = [
      `**${content.title}**`,
      '**Paso 1: Explora tus áreas clave**',
      ratingsSummary,
      '**Paso 2: Zonas de mayor alineación**',
      `Áreas seleccionadas: ${topAlignedAreas.map((id) => getAreaLabel(id)).join(' | ')}`,
      `Pregunta: ¿Qué estás haciendo bien en ellas que te hace sentirte en paz o en equilibrio? | Respuesta: ${highCoherenceReflection}`,
      `Pregunta: ¿Qué emociones te despierta vivir en coherencia en esas áreas? | Respuesta: ${highCoherenceEmotions}`,
      '**Paso 3: Zona de desconexión**',
      `Área identificada: ${getAreaLabel(disconnectionArea)}`,
      `Pregunta: ¿Qué crees que te impide ser más coherente en esa parte de tu vida? | Respuesta: ${disconnectionReflection}`,
      '**Cierre y reflexión**',
      `Pregunta (opcional): ¿Qué pequeño gesto podrías dar esta semana para ser un poco más coherente en el área que te duele? | Respuesta: ${smallGesture || 'No respondido.'}`,
    ].join('\n\n');

    addNotebookEntry({
      title: 'Mi Brújula de Coherencia',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: 'Brújula guardada' });
    onComplete();
    setIsSaved(true);
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <p className="text-sm text-muted-foreground">
              A veces sentimos que estamos viviendo según nuestros valores... y otras veces, como si lleváramos el piloto automático. Este ejercicio te ayudará a ver con más claridad dónde estás alineada/o contigo misma/o... y dónde quizás no tanto. No es un juicio: es una brújula que empieza a afinarse.
            </p>
            <Button onClick={nextStep}>
              Empezar mi brújula <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Explora tus áreas clave</h4>
            <p className="text-sm text-muted-foreground">
              Vamos a hacer un recorrido por distintas áreas de tu vida. En cada una, piensa si lo que piensas, sientes y haces está en sintonía... o si notas contradicción o tensión.
            </p>
            <p className="text-sm text-muted-foreground">
              Marca del 1 (muy baja coherencia) al 5 (muy alta coherencia).
            </p>
            {keyAreas.map((area) => (
              <div key={area.id} className="p-3 border rounded-md">
                <Label htmlFor={`coherence-${area.id}`} className="font-semibold">
                  {area.label}: {areaRatings[area.id]}
                </Label>
                <Slider
                  id={`coherence-${area.id}`}
                  value={[areaRatings[area.id]]}
                  onValueChange={(value) => handleRatingChange(area.id, value)}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-2"
                  disabled={isSaved}
                />
              </div>
            ))}
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Selecciona tus dos zonas de mayor alineación</h4>
            <p className="text-sm text-muted-foreground">
              Ahora observa: ¿en qué dos áreas sientes más coherencia contigo misma/o? Elige esas dos y responde:
            </p>
            <blockquote className="p-3 border-l-2 border-accent bg-accent/10 italic text-sm">
              Ejemplo de inspiración: “En mi relación con mi hermana he aprendido a decir lo que pienso sin miedo. Eso me da calma y orgullo.”
            </blockquote>
            <p className="text-sm text-muted-foreground">
              Seleccionadas: {topAlignedAreas.length}/2
            </p>
            <div className="grid grid-cols-1 gap-2">
              {keyAreas.map((area) => (
                <div key={area.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`aligned-${area.id}`}
                    checked={topAlignedAreas.includes(area.id)}
                    onCheckedChange={(checked) => handleTopAlignedToggle(area.id, !!checked)}
                    disabled={isSaved}
                  />
                  <Label htmlFor={`aligned-${area.id}`} className="font-normal text-sm">
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="high-coherence-doing-well">
                ¿Qué estás haciendo bien en ellas que te hace sentirte en paz o en equilibrio?
              </Label>
              <Textarea
                id="high-coherence-doing-well"
                value={highCoherenceReflection}
                onChange={(e) => setHighCoherenceReflection(e.target.value)}
                disabled={isSaved}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="high-coherence-emotions">
                ¿Qué emociones te despierta vivir en coherencia en esas áreas?
              </Label>
              <Textarea
                id="high-coherence-emotions"
                value={highCoherenceEmotions}
                onChange={(e) => setHighCoherenceEmotions(e.target.value)}
                disabled={isSaved}
              />
            </div>
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={topAlignedAreas.length !== 2}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Detecta una zona de desconexión</h4>
            <p className="text-sm text-muted-foreground">
              Ahora identifica una de las áreas donde sientes más contradicción o conflicto interno.
            </p>
            <p className="text-sm text-muted-foreground">
              ¿Qué crees que te impide ser más coherente en esa parte de tu vida? Puedes explorar si hay miedo, necesidad de agradar, cansancio, confusión...
            </p>
            <blockquote className="p-3 border-l-2 border-accent bg-accent/10 italic text-sm">
              Ejemplo: “En el trabajo, valoro la honestidad, pero suelo callarme para no incomodar. Me frustra y me desconecta de mí.”
            </blockquote>
            <div className="space-y-2">
              <Label htmlFor="disconnection-area">Área de mayor desconexión</Label>
              <Select value={disconnectionArea} onValueChange={setDisconnectionArea} disabled={isSaved}>
                <SelectTrigger id="disconnection-area">
                  <SelectValue placeholder="Selecciona un área..." />
                </SelectTrigger>
                <SelectContent>
                  {keyAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="disconnection-reason">
                ¿Qué crees que te impide ser más coherente en esa parte de tu vida?
              </Label>
              <Textarea
                id="disconnection-reason"
                value={disconnectionReflection}
                onChange={(e) => setDisconnectionReflection(e.target.value)}
                disabled={isSaved}
              />
            </div>
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!disconnectionArea || !disconnectionReflection.trim()}>
                Ver gráfico <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Tu Mapa de Coherencia</h4>
            <p className="text-sm text-muted-foreground">
              Este gráfico muestra la coherencia que has valorado en cada área (1 a 5).
            </p>
            <ChartContainer config={chartConfig} className="w-full aspect-square h-[360px]">
              <RadarChart data={chartData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
                <PolarGrid />
                <Radar
                  dataKey="score"
                  fill="var(--color-score)"
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={nextStep}>
                Ir al cierre <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Cierre y reflexión</h4>
            <p className="text-sm text-muted-foreground">
              Esta brújula no tiene por qué darte todas las respuestas ahora. Solo busca que empieces a mirarte con más claridad y menos juicio. El primer paso hacia la coherencia es atreverte a ver.
            </p>
            <div className="space-y-2">
              <Label htmlFor="small-gesture">
                Pregunta interactiva opcional: ¿Qué pequeño gesto podrías dar esta semana para ser un poco más coherente en el área que te duele?
              </Label>
              <Textarea
                id="small-gesture"
                value={smallGesture}
                onChange={(e) => setSmallGesture(e.target.value)}
                disabled={isSaved}
              />
            </div>
            <div className="flex justify-between w-full">
              <Button onClick={prevStep} variant="outline" type="button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              {!isSaved ? (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
                </Button>
              ) : (
                <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Guardado.</p>
                </div>
              )}
            </div>
          </form>
        );
      case 6:
        return (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Guardado</h4>
            <p className="text-muted-foreground">
              Tu brújula de coherencia ha sido guardada. Puedes volver a ella cuando lo necesites.
            </p>
            
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
        <CardDescription className="pt-2 space-y-2">
          <p>
            Objetivo terapéutico: ¿Te has sentido alguna vez dividido/a por dentro? Como si una parte de ti pensara una cosa, pero actuara de otra forma... Esta técnica te ayudará a hacer una pausa y observarte con más claridad y menos juicio. Vas a descubrir en qué partes de tu vida estás alineado o alineada contigo, y en cuáles sientes que hay una desconexión. Es un primer paso para recuperar tu centro. Y desde ahí, empezar a elegir diferente.
          </p>
          <p>
            Te recomiendo hacerlo al inicio de la semana y volver a revisarlo al final. Te servirá como espejo.
          </p>
        </CardDescription>
        {content.audioUrl && (
          <div className="mt-2">
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
