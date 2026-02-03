
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EmotionalInvolvementTrafficLightExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useUser } from '@/contexts/UserContext';

interface EmotionalInvolvementTrafficLightExerciseProps {
  content: EmotionalInvolvementTrafficLightExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function EmotionalInvolvementTrafficLightExercise({ content, pathId, onComplete }: EmotionalInvolvementTrafficLightExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [relations, setRelations] = useState(Array(5).fill({ name: '', color: '', reason: '' }));
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [actionPlans, setActionPlans] = useState({ green: '', amber: '', red: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleRelationChange = (index: number, field: string, value: string) => {
    const newRelations = [...relations];
    newRelations[index] = { ...newRelations[index], [field]: value };
    setRelations(newRelations);
  };
  
  const handleReflectionChange = (field: string, value: string) => {
    setReflection(prev => ({ ...prev, [field]: value }));
  };

  const handleActionPlanChange = (color: 'green' | 'amber' | 'red', value: string) => {
    setActionPlans(prev => ({...prev, [color]: value}));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    const filledRelations = relations.filter(r => r.name.trim() !== '' && r.color.trim() !== '');
    if (filledRelations.length === 0) {
      toast({ title: "Ejercicio Incompleto", description: "Completa al menos una relación con su color.", variant: 'destructive' });
      return;
    }

    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;

    notebookContent += "**Mapa de relaciones y su color:**\n";
    filledRelations.forEach(r => {
      notebookContent += `- ${r.name}: ${r.color}`;
      if (r.reason) {
        notebookContent += ` (Razón: ${r.reason})\n`;
      } else {
        notebookContent += `\n`;
      }
    });
    notebookContent += `\n**Reflexión guiada:**\n`;
    notebookContent += `- ¿Te ha sorprendido el color?: ${reflection.q1 || 'No respondido.'}\n`;
    notebookContent += `- ¿Notas patrones?: ${reflection.q2 || 'No respondido.'}\n`;
    notebookContent += `- ¿Qué relación sientes que necesitas revisar?: ${reflection.q3 || 'No respondido.'}\n`;
    notebookContent += `- ¿Qué vínculo te gustaría cuidar más?: ${reflection.q4 || 'No respondido.'}\n\n`;

    notebookContent += `**Acciones por color:**\n`;
    if (actionPlans.green) notebookContent += `🟢 Verde - Nutritiva: ${actionPlans.green}\n`;
    if (actionPlans.amber) notebookContent += `🟠 Ámbar - Exigente: ${actionPlans.amber}\n`;
    if (actionPlans.red) notebookContent += `🔴 Roja - Drenante: ${actionPlans.red}\n`;

    addNotebookEntry({ title: `Semáforo de Implicación Emocional`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico." });
    setIsSaved(true);
    onComplete();
    nextStep(); // Go to confirmation
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">A veces damos lo mismo a todas las personas sin notar cómo nos afecta. Este ejercicio te invita a observar cómo te sientes en tus relaciones cotidianas para que puedas decidir cómo implicarte.</p>
            <Button onClick={nextStep}>Empezar mi semáforo <ArrowRight className="ml-2 h-4 w-4" /></Button>
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
                onChange={e => handleRelationChange(index, 'name', e.target.value)}
                placeholder={`Persona ${index + 1}...`}
              />
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Clasificar <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Elige un color para cada relación</h4>
            <p className="text-sm text-muted-foreground">Para cada persona, elige un color según lo que su relación genera en ti:</p>
            <ul className="list-disc list-inside text-sm pl-4">
                <li><strong className="text-green-600">Verde:</strong> Me siento libre, escuchado/a, tranquilo/a. Esta relación me nutre.</li>
                <li><strong className="text-amber-600">Ámbar:</strong> Me cuesta poner límites. Me agoto un poco, pero me cuesta expresarlo.</li>
                <li><strong className="text-red-600">Rojo:</strong> Me siento drenado/a, desestabilizado/a o ansioso/a con frecuencia.</li>
            </ul>
            {relations.filter(r => r.name).map((rel, index) => (
              <div key={index} className="space-y-3 border-t pt-3">
                <Label className="font-semibold">{rel.name}</Label>
                <RadioGroup value={rel.color} onValueChange={v => handleRelationChange(index, 'color', v)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Verde" id={`c-${index}-g`} /><Label htmlFor={`c-${index}-g`} className="font-normal">Verde</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Ámbar" id={`c-${index}-a`} /><Label htmlFor={`c-${index}-a`} className="font-normal">Ámbar</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Rojo" id={`c-${index}-r`} /><Label htmlFor={`c-${index}-r`} className="font-normal">Rojo</Label></div>
                </RadioGroup>
                <div className="space-y-1">
                    <Label htmlFor={`reason-${index}`} className="text-sm font-normal text-muted-foreground pt-2">¿Por qué has elegido ese color? ¿Qué sientes o piensas con esa persona?</Label>
                    <Textarea 
                        id={`reason-${index}`}
                        value={rel.reason} 
                        onChange={(e) => handleRelationChange(index, 'reason', e.target.value)} 
                        placeholder="Ejemplo: “Rojo, porque siempre me exige más de lo que puedo dar.”"
                        rows={2}
                    />
                </div>
              </div>
            ))}
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Reflexión <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Reflexión guiada</h4>
            <div className="space-y-2"><Label>¿Te ha sorprendido el color que le diste a alguna relación?</Label><Textarea value={reflection.q1} onChange={e => handleReflectionChange('q1', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Notas patrones? ¿Relaciones que antes eran verdes y ahora son ámbar?</Label><Textarea value={reflection.q2} onChange={e => handleReflectionChange('q2', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Qué relación sientes que necesitas revisar, proteger o alejarte un poco?</Label><Textarea value={reflection.q3} onChange={e => handleReflectionChange('q3', e.target.value)} /></div>
            <div className="space-y-2"><Label>¿Qué vínculo te gustaría cuidar más conscientemente?</Label><Textarea value={reflection.q4} onChange={e => handleReflectionChange('q4', e.target.value)} /></div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Siguiente: Plan de Acción <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
       case 4:
        return (
            <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                <h4 className="font-semibold text-lg">Paso 4: Acciones por color</h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="font-semibold text-green-600">🟢 Relación verde – Nutritiva</Label>
                        <p className="text-sm text-muted-foreground">Haz algo para fortalecerla: agradece, comparte, pasa tiempo de calidad.</p>
                        <Textarea value={actionPlans.green} onChange={e => handleActionPlanChange('green', e.target.value)} placeholder="✍️ “Voy a…”" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-amber-600">🟠 Relación ámbar – Exigente</Label>
                        <p className="text-sm text-muted-foreground">Practica un pequeño límite o exprésate con más claridad.</p>
                        <Textarea value={actionPlans.amber} onChange={e => handleActionPlanChange('amber', e.target.value)} placeholder="✍️ “Esta vez voy a intentar…”" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-red-600">🔴 Relación roja – Drenante</Label>
                        <p className="text-sm text-muted-foreground">Marca distancia emocional o elige el silencio protector.</p>
                        <Textarea value={actionPlans.red} onChange={e => handleActionPlanChange('red', e.target.value)} placeholder="✍️ “Para protegerme, voy a…”" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground italic text-center">No tienes que cortar ningún vínculo de golpe. Solo dar un paso hacia delante que te devuelva a ti.</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline">Atrás</Button>
                    <Button onClick={nextStep}>Siguiente</Button>
                </div>
            </div>
        );
       case 5:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Cierre: tus relaciones también te construyen</h4>
            <p className="text-sm">Este ejercicio no es para clasificar a nadie. Es para que puedas mirar tus relaciones con más claridad y menos culpa. Lo que sientes importa. Y lo que decides hacer con ello es un acto profundo de respeto hacia ti.</p>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="micro-practice">
                    <AccordionTrigger>Micropráctica diaria opcional</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <p className="font-semibold">“Activa tu escudo antes de entrar”</p>
                            <p className="text-sm"><strong>¿Para qué sirve?</strong> Para ayudarte a no perderte en el malestar del otro. Es tu momento para recordar que también tú importas en cada interacción. Esta práctica breve te ancla antes de cuidar.</p>
                            <p className="text-sm"><strong>Cuándo hacerla:</strong> Antes de: Una conversación difícil. Un encuentro que sabes que te remueve. Contestar un mensaje que te genera tensión. Acompañar emocionalmente a alguien.</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline">Atrás</Button>
                <Button onClick={handleSave} disabled={isSaved}>
                    <Save className="mr-2 h-4 w-4"/> {isSaved ? 'Guardado' : 'Guardar en mi cuaderno'}
                </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">¡Ejercicio Guardado!</h4>
            <p className="text-muted-foreground">Tu reflexión ha sido guardada en el Cuaderno Terapéutico. Puedes revisarla cuando quieras.</p>
            <Button onClick={() => {
                setStep(0);
                setIsSaved(false);
                setRelations(Array(5).fill({ name: '', color: '', reason: '' }));
                setReflection({ q1: '', q2: '', q3: '', q4: '' });
                setActionPlans({ green: '', amber: '', red: '' });
            }} variant="outline">Empezar de nuevo</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
