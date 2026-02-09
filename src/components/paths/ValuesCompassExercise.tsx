
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ValuesCompassExerciseContent } from '@/data/paths/pathTypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from '@/contexts/UserContext';

const lifeAreas = [
    { id: 'familia', label: 'Familia y crianza' },
    { id: 'pareja', label: 'Pareja / Relaciones íntimas' },
    { id: 'amistades', label: 'Amistades y vínculos' },
    { id: 'salud', label: 'Salud y bienestar físico' },
    { id: 'cuidado_emocional', label: 'Cuidado emocional y mental' },
    { id: 'desarrollo_personal', label: 'Desarrollo personal o espiritual' },
    { id: 'aprendizaje', label: 'Aprendizaje y conocimiento' },
    { id: 'trabajo', label: 'Vida laboral y vocación' },
    { id: 'ocio', label: 'Ocio y tiempo libre' },
    { id: 'contribucion', label: 'Contribución y servicio a los demás' },
    { id: 'creatividad', label: 'Creatividad y expresión personal' },
    { id: 'autenticidad', label: 'Autenticidad / Vivir con coherencia' },
];

interface ValuesCompassExerciseProps {
  content: ValuesCompassExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function ValuesCompassExercise({ content, pathId, onComplete }: ValuesCompassExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
    const [reflections, setReflections] = useState<Record<string, { importance: string; howToLive: string; value: string }>>({});
    
    const handleAreaChange = (id: string, checked: boolean) => {
      setSelectedAreas(prev => ({ ...prev, [id]: checked }));
    };

    const handleReflectionChange = (id: string, field: string, value: string) => {
      setReflections(prev => ({
          ...prev,
          [id]: {
              ...(prev[id] || { importance: '', howToLive: '', value: '' }),
              [field]: value
          }
      }));
    };
    
    const activeAreas = useMemo(() => lifeAreas.filter(area => selectedAreas[area.id]), [selectedAreas]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);

    const handleSave = () => {
        let notebookContent = `**Ejercicio: ${content.title}**\n\n**Mi Brújula de Valores:**\n\n`;
        activeAreas.forEach(area => {
            const reflection = reflections[area.id] || { importance: '', howToLive: '', value: '' };
            notebookContent += `**Área: ${area.label}**\n`;
            notebookContent += `- ¿Por qué es importante?: ${reflection.importance || 'No respondido.'}\n`;
            notebookContent += `- ¿Cómo me gustaría vivirla?: ${reflection.howToLive || 'No respondido.'}\n`;
            notebookContent += `- Valor asociado: ${reflection.value || 'No respondido.'}\n\n`;
        });
        addNotebookEntry({ title: 'Mi Brújula de Valores', content: notebookContent, pathId: pathId, userId: user?.id });
        toast({ title: 'Brújula Guardada', description: 'Tu brújula de valores ha sido guardada en el cuaderno.' });
        onComplete();
        setStep(prev => prev + 1);
    };

    const renderStep = () => {
      switch (step) {
        case 0:
          return (
            <div className="p-4 text-center space-y-4">
              <p>Muchas veces actuamos en piloto automático. Este ejercicio te ayuda a detectar cuáles son los valores que realmente te importan, para que esa pregunta tenga una respuesta clara.</p>
              <Button onClick={nextStep}>Empezar mi brújula</Button>
            </div>
          );
        case 1:
          return (
            <div className="p-4 space-y-2">
              <Label className="font-semibold">Selecciona las áreas que sientes importantes en tu vida actual:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lifeAreas.map(area => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox id={area.id} checked={!!selectedAreas[area.id]} onCheckedChange={c => handleAreaChange(area.id, !!c)} />
                    <Label htmlFor={area.id} className="font-normal">{area.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={nextStep} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="p-4 space-y-4">
              {activeAreas.map(area => (
                <div key={area.id} className="p-3 border rounded-md">
                  <h4 className="font-semibold">{area.label}</h4>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor={`importance-${area.id}`}>¿Por qué esta área es importante para ti?</Label>
                    <Textarea id={`importance-${area.id}`} value={reflections[area.id]?.importance || ''} onChange={(e) => handleReflectionChange(area.id, 'importance', e.target.value)} />
                    <Label htmlFor={`how-${area.id}`}>¿Cómo te gustaría vivirla de forma más plena?</Label>
                    <Textarea id={`how-${area.id}`} value={reflections[area.id]?.howToLive || ''} onChange={(e) => handleReflectionChange(area.id, 'howToLive', e.target.value)} />
                     <Label htmlFor={`value-${area.id}`}>¿Qué valor personal representa esta área?</Label>
                    <Textarea id={`value-${area.id}`} value={reflections[area.id]?.value || ''} onChange={(e) => handleReflectionChange(area.id, 'value', e.target.value)} />
                  </div>
                </div>
              ))}
               <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={nextStep} className="w-auto">Ver mi Brújula <ArrowRight className="ml-2 h-4 w-4"/></Button>
              </div>
            </div>
          );
      case 3:
          return (
              <div className="p-4 space-y-4">
                <h3 className="font-bold text-lg text-center">Tu Brújula de Valores</h3>
                <p className="text-sm text-foreground">Te mostramos ahora un resumen visual con tus áreas prioritarias y los valores que representan. Esta brújula te ayuda a tomar decisiones con más coherencia y a reconectar contigo cuando te sientas perdida o dispersa.</p>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Área de Vida</TableHead>
                        <TableHead>Valor Asociado</TableHead>
                        <TableHead>Cómo quieres vivirla</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeAreas.map(area => (
                        <TableRow key={area.id}>
                          <TableCell className="font-medium">{area.label}</TableCell>
                          <TableCell>{reflections[area.id]?.value || 'N/A'}</TableCell>
                          <TableCell>{reflections[area.id]?.howToLive || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="italic text-sm text-foreground text-center">Mira esta brújula cada vez que tengas que tomar una decisión difícil. Volver a tus valores es como volver a casa.</p>
                <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={handleSave} className="w-auto">
                      <Save className="mr-2 h-4 w-4" /> Guardar Brújula
                  </Button>
                </div>
              </div>
          );
        case 4:
          return (
            <div className="p-4 text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h4 className="font-bold text-lg">Brújula Guardada</h4>
              <p className="text-foreground">Tu brújula de valores ha sido guardada en el cuaderno. Puedes volver a consultarla cuando quieras.</p>
              <div className="flex justify-between w-full mt-4">
                  <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                  <Button onClick={() => {
                      setStep(0);
                      setSelectedAreas({});
                      setReflections({});
                  }} variant="outline">Empezar de nuevo</Button>
              </div>
            </div>
          );
        default: return null;
      }
    };
    
    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
