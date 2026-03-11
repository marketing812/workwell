"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmotionalInvolvementTrafficLightExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Textarea } from '../ui/textarea';

interface EmotionalInvolvementTrafficLightExerciseProps {
  content: EmotionalInvolvementTrafficLightExerciseContent;
  pathId: string;
  onComplete: () => void;
}

interface Relation {
  name: string;
  color: 'Verde' | 'Ãmbar' | 'Rojo' | '';
  reason: string;
}

const EMPTY_RELATION: Relation = { name: '', color: '', reason: '' };
const getInitialRelations = () => Array.from({ length: 5 }, () => ({ ...EMPTY_RELATION }));

export default function EmotionalInvolvementTrafficLightExercise({
  content,
  pathId,
  onComplete,
}: EmotionalInvolvementTrafficLightExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState<Relation[]>(getInitialRelations());
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [actionPlans, setActionPlans] = useState({ green: '', amber: '', red: '' });

  const handleRelationChange = <K extends keyof Relation>(index: number, field: K, value: Relation[K]) => {
    setRelations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleReflectionChange = (field: keyof typeof reflection, value: string) => {
    setReflection((prev) => ({ ...prev, [field]: value }));
  };

  const handleActionPlanChange = (color: keyof typeof actionPlans, value: string) => {
    setActionPlans((prev) => ({ ...prev, [color]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : 0));

  const resetExercise = () => {
    setStep(0);
    setRelations(getInitialRelations());
    setReflection({ q1: '', q2: '', q3: '', q4: '' });
    setActionPlans({ green: '', amber: '', red: '' });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const filledRelations = relations.filter((r) => r.name.trim() !== '' && r.color.trim() !== '');

    if (filledRelations.length === 0) {
      toast({ title: 'Ejercicio incompleto', description: 'Completa al menos una relaciÃ³n con su color.', variant: 'destructive' });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;

    filledRelations.forEach((r, index) => {
      notebookContent += `**RelaciÃ³n ${index + 1}:**\n`;
      notebookContent += `Pregunta: Nombre | Respuesta: ${r.name}\n`;
      notebookContent += `Pregunta: Color | Respuesta: ${r.color}\n`;
      notebookContent += `Pregunta: Â¿Por quÃ© has elegido ese color? | Respuesta: ${r.reason || 'No especificado.'}\n\n`;
    });

    notebookContent += `**ReflexiÃ³n guiada:**\n`;
    notebookContent += `Pregunta: Â¿Te ha sorprendido el color que le diste a alguna relaciÃ³n? | Respuesta: ${reflection.q1 || 'No respondido.'}\n`;
    notebookContent += `Pregunta: Â¿Notas patrones? Â¿Relaciones que antes eran verdes y ahora son Ã¡mbar? | Respuesta: ${reflection.q2 || 'No respondido.'}\n`;
    notebookContent += `Pregunta: Â¿QuÃ© relaciÃ³n sientes que necesitas revisar, proteger o alejarte un poco? | Respuesta: ${reflection.q3 || 'No respondido.'}\n`;
    notebookContent += `Pregunta: Â¿QuÃ© vÃ­nculo te gustarÃ­a cuidar mÃ¡s conscientemente? | Respuesta: ${reflection.q4 || 'No respondido.'}\n\n`;

    notebookContent += `**Acciones por color:**\n`;
    if (actionPlans.green) notebookContent += `Pregunta: RelaciÃ³n verde - Nutritiva | Respuesta: ${actionPlans.green}\n`;
    if (actionPlans.amber) notebookContent += `Pregunta: RelaciÃ³n Ã¡mbar - Exigente | Respuesta: ${actionPlans.amber}\n`;
    if (actionPlans.red) notebookContent += `Pregunta: RelaciÃ³n roja - Drenante | Respuesta: ${actionPlans.red}\n`;

    addNotebookEntry({
      title: 'SemÃ¡foro de ImplicaciÃ³n Emocional',
      content: notebookContent,
      pathId,
      userId: user?.id,
    });

    toast({ title: 'Ejercicio guardado', description: 'Tu reflexiÃ³n se ha guardado en el Cuaderno TerapÃ©utico.' });
    onComplete();
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              A veces damos lo mismo a todas las personas sin notar cÃ³mo nos afecta. Este ejercicio te invita a observar cÃ³mo te sientes en tus
              relaciones cotidianas para que puedas decidir cÃ³mo implicarte.
            </p>
            <Button onClick={nextStep}>
              Empezar mi semÃ¡foro <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Mapa de relaciones</h4>
            <p className="text-sm text-muted-foreground">Haz una lista de 5 personas con las que tengas contacto frecuente (personal o laboral).</p>
            {relations.map((rel, index) => (
              <Input
                key={index}
                value={rel.name}
                onChange={(e) => handleRelationChange(index, 'name', e.target.value)}
                placeholder={`Persona ${index + 1}...`}
              />
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={nextStep}>
                Siguiente: Clasificar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Elige un color para cada relaciÃ³n</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, elige un color segÃºn lo que su relaciÃ³n genera en ti:</p>
            <ul className="list-disc list-inside text-sm pl-4">
              <li>
                <strong className="text-green-600">Verde:</strong> Me siento libre, escuchado/a, tranquilo/a. Esta relaciÃ³n me nutre.
              </li>
              <li>
                <strong className="text-amber-600">Ãmbar:</strong> Me cuesta poner lÃ­mites. Me agoto un poco, pero me cuesta expresarlo.
              </li>
              <li>
                <strong className="text-red-600">Rojo:</strong> Me siento drenado/a, desestabilizado/a o ansioso/a con frecuencia.
              </li>
            </ul>
            {relations
              .map((rel, index) => ({ rel, index }))
              .filter(({ rel }) => rel.name)
              .map(({ rel, index }) => (
                <div key={index} className="space-y-3 border-t pt-3">
                  <Label className="font-semibold">{rel.name}</Label>
                  <RadioGroup value={rel.color} onValueChange={(v) => handleRelationChange(index, 'color', v as Relation['color'])}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Verde" id={`c-${index}-g`} />
                      <Label htmlFor={`c-${index}-g`} className="font-normal">
                        Verde
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ãmbar" id={`c-${index}-a`} />
                      <Label htmlFor={`c-${index}-a`} className="font-normal">
                        Ãmbar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rojo" id={`c-${index}-r`} />
                      <Label htmlFor={`c-${index}-r`} className="font-normal">
                        Rojo
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-1">
                    <Label htmlFor={`reason-${index}`} className="text-sm font-normal text-muted-foreground pt-2">
                      Â¿Por quÃ© has elegido ese color? Â¿QuÃ© sientes o piensas con esa persona?
                    </Label>
                    <Textarea
                      id={`reason-${index}`}
                      value={rel.reason}
                      onChange={(e) => handleRelationChange(index, 'reason', e.target.value)}
                      placeholder='Ejemplo: "Rojo, porque siempre me exige mÃ¡s de lo que puedo dar."'
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={nextStep}>
                Siguiente: ReflexiÃ³n <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: ReflexiÃ³n guiada</h4>
            <div className="space-y-2">
              <Label>Â¿Te ha sorprendido el color que le diste a alguna relaciÃ³n?</Label>
              <Textarea value={reflection.q1} onChange={(e) => handleReflectionChange('q1', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Â¿Notas patrones? Â¿Relaciones que antes eran verdes y ahora son Ã¡mbar?</Label>
              <Textarea value={reflection.q2} onChange={(e) => handleReflectionChange('q2', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Â¿QuÃ© relaciÃ³n sientes que necesitas revisar, proteger o alejarte un poco?</Label>
              <Textarea value={reflection.q3} onChange={(e) => handleReflectionChange('q3', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Â¿QuÃ© vÃ­nculo te gustarÃ­a cuidar mÃ¡s conscientemente?</Label>
              <Textarea value={reflection.q4} onChange={(e) => handleReflectionChange('q4', e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                AtrÃ¡s
              </Button>
              <Button onClick={nextStep}>
                Siguiente: Plan de AcciÃ³n <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Acciones por color</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold text-green-600">RelaciÃ³n verde - Nutritiva</Label>
                <p className="text-sm text-muted-foreground">Haz algo para fortalecerla: agradece, comparte, pasa tiempo de calidad.</p>
                <Textarea value={actionPlans.green} onChange={(e) => handleActionPlanChange('green', e.target.value)} placeholder='"Voy a..."' />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-amber-600">RelaciÃ³n Ã¡mbar - Exigente</Label>
                <p className="text-sm text-muted-foreground">Practica un pequeÃ±o lÃ­mite o exprÃ©sate con mÃ¡s claridad.</p>
                <Textarea value={actionPlans.amber} onChange={(e) => handleActionPlanChange('amber', e.target.value)} placeholder='"Esta vez voy a intentar..."' />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-red-600">RelaciÃ³n roja - Drenante</Label>
                <p className="text-sm text-muted-foreground">Marca distancia emocional o elige el silencio protector.</p>
                <Textarea value={actionPlans.red} onChange={(e) => handleActionPlanChange('red', e.target.value)} placeholder='"Para protegerme, voy a..."' />
              </div>
            </div>
            <p className="text-base text-muted-foreground italic text-center">
              No tienes que cortar ningÃºn vÃ­nculo de golpe. Solo dar un paso hacia delante que te devuelva a ti.
            </p>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline">AtrÃ¡s</Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Guargar en el cuaderno
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Ejercicio guardado</h4>
            <p className="text-muted-foreground">Tu reflexiÃ³n ha sido guardada en el Cuaderno TerapÃ©utico. Puedes revisarla cuando quieras.</p>
            
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
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.audioUrl && (
          <div className="mt-2">
            <audio controls controlsList="nodownload" className="w-full h-10">
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

