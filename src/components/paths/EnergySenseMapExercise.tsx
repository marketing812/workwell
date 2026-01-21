"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EnergySenseMapExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

interface Activity {
  name: string;
  energy: 'low' | 'medium' | 'high' | '';
  value: 'low' | 'medium' | 'high' | '';
}

export function EnergySenseMapExercise({ content, pathId }: { content: EnergySenseMapExerciseContent; pathId: string }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(() => 
    Array.from({ length: 6 }, () => ({ name: '', energy: '', value: '' }))
  );
  const [reflection, setReflection] = useState({ moreOf: '', lessOf: '' });
  const [commitment, setCommitment] = useState('');

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    const newActivities = [...activities];
    (newActivities[index] as any)[field] = value;
    setActivities(newActivities);
  };
  
  const handleSave = () => {
    let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
    activities.filter(a => a.name.trim()).forEach(a => {
      notebookContent += `**Actividad:** ${a.name} (Energía: ${a.energy}, Valor: ${a.value})\n`;
    });
    notebookContent += `\n**Reflexión:**\n- Hacer más: ${reflection.moreOf}\n- Hacer menos/diferente: ${reflection.lessOf}\n\n**Compromiso:** ${commitment}\n`;

    addNotebookEntry({ title: 'Mi Mapa de Energía y Sentido', content: notebookContent, pathId });
    toast({ title: 'Mapa Guardado', description: 'Tu mapa de energía ha sido guardado.' });
    setStep(prev => prev + 1);
  };

  const categorizedActivities = useMemo(() => {
    const pot = activities.filter(a => a.name && a.value === 'high' && a.energy === 'low');
    const drain = activities.filter(a => a.name && a.value === 'low' && a.energy === 'high');
    const neutral = activities.filter(a => a.name && !pot.includes(a) && !drain.includes(a));
    return { pot, drain, neutral };
  }, [activities]);

  const renderStep = () => {
    switch (step) {
      case 0: return <div className="p-4 text-center"><p className="mb-4">Cada día invertimos nuestra energía en múltiples cosas. Algunas nos conectan, otras solo nos drenan. Este ejercicio te ayuda a distinguir entre lo que te ocupa y lo que te nutre.</p><Button onClick={() => setStep(1)}>Empezar mi mapa</Button></div>;
      case 1: return <div className="p-4 space-y-4"><Label>Haz una lista de 6-8 actividades de tu última semana.</Label>{activities.map((act, i) => <Textarea key={i} value={act.name} onChange={e => handleActivityChange(i, 'name', e.target.value)} placeholder={`Actividad ${i + 1}`} />)}<Button onClick={() => setStep(2)} className="w-full">Siguiente</Button></div>;
      case 2: return <div className="p-4 space-y-4">{activities.filter(a => a.name).map((act, i) => <div key={i} className="p-2 border rounded"><p className="font-semibold">{act.name}</p><Label>¿Cuánta energía te consume?</Label><RadioGroup value={act.energy} onValueChange={v => handleActivityChange(i, 'energy', v)} className="flex gap-4"><div className="flex items-center gap-1"><RadioGroupItem value="low" id={`e-${i}-l`}/><Label htmlFor={`e-${i}-l`}>Poco</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="medium" id={`e-${i}-m`}/><Label htmlFor={`e-${i}-m`}>Moderado</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="high" id={`e-${i}-h`}/><Label htmlFor={`e-${i}-h`}>Mucho</Label></div></RadioGroup><Label>¿Se alinea con tus valores?</Label><RadioGroup value={act.value} onValueChange={v => handleActivityChange(i, 'value', v)} className="flex gap-4"><div className="flex items-center gap-1"><RadioGroupItem value="low" id={`v-${i}-l`}/><Label htmlFor={`v-${i}-l`}>Nada</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="medium" id={`v-${i}-m`}/><Label htmlFor={`v-${i}-m`}>Algo</Label></div><div className="flex items-center gap-1"><RadioGroupItem value="high" id={`v-${i}-h`}/><Label htmlFor={`v-${i}-h`}>Mucho</Label></div></RadioGroup></div>)}<Button onClick={() => setStep(3)} className="w-full">Ver cuadrante</Button></div>;
      case 3: return (
        <div className="p-4 space-y-6">
            <h3 className="font-bold text-center text-lg">Tu Cuadrante de Energía y Sentido</h3>

            <div className="text-sm text-muted-foreground p-4 border rounded-md bg-background/50 space-y-2">
                <p>Te mostramos ahora un gráfico tipo cuadrante con tus actividades clasificadas según:</p>
                <ul className="list-none space-y-1">
                    <li><span className="text-green-500">🟢</span> <strong className="text-green-700 dark:text-green-400">Potenciadoras (Alta conexión con valores y baja carga):</strong> Actividades que te hacen bien, te llenan, y no te agotan.</li>
                    <li><span className="text-red-500">🔴</span> <strong className="text-red-700 dark:text-red-400">Drenantes (Baja conexión con valores y alta carga):</strong> Actividades que te consumen mucho, pero que no conectan con lo que valoras.</li>
                    <li><span className="text-amber-500">🟡</span> <strong className="text-amber-700 dark:text-amber-400">Neutras / Reajustables (Carga y conexión medias):</strong> Actividades que podrían revalorizarse o reorganizarse para que aporten más.</li>
                </ul>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                <AccordionTrigger>Ver ejemplos de cada categoría</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div>
                        <h4 className="font-semibold text-green-600">Ejemplos de Potenciadoras</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                            <li>Caminar por el bosque los fines de semana</li>
                            <li>Leer sobre crecimiento personal</li>
                            <li>Cocinar para mi familia con calma</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-600">Ejemplos de Drenantes</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                            <li>Reuniones laborales sin sentido claro</li>
                            <li>Revisión constante de redes sociales</li>
                            <li>Decir que sí a planes que no quiero</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-600">Ejemplos de Neutras o Reajustables</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                            <li>Tareas domésticas → repartidas con la pareja</li>
                            <li>Estudiar temas laborales → enfocándome en los que me interesan</li>
                            <li>Gestión de correos → limitar a 2 franjas al día</li>
                        </ul>
                    </div>
                </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Separator />
            
            <div className="space-y-4">
                <h4 className="font-semibold text-base text-center">Tus Actividades Clasificadas</h4>
                
                <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                    <h5 className="font-bold text-green-700 dark:text-green-300">Potenciadoras</h5>
                    <ul className="list-disc pl-5 text-sm mt-1 text-muted-foreground">
                    {categorizedActivities.pot.length > 0 ? categorizedActivities.pot.map(a => <li key={a.name}>{a.name}</li>) : <li>Ninguna actividad en esta categoría.</li>}
                    </ul>
                </div>
                
                <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                    <h5 className="font-bold text-red-700 dark:text-red-300">Drenantes</h5>
                    <ul className="list-disc pl-5 text-sm mt-1 text-muted-foreground">
                    {categorizedActivities.drain.length > 0 ? categorizedActivities.drain.map(a => <li key={a.name}>{a.name}</li>) : <li>Ninguna actividad en esta categoría.</li>}
                    </ul>
                </div>

                <div className="p-3 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                    <h5 className="font-bold text-amber-700 dark:text-amber-300">Neutras/Reajustables</h5>
                    <ul className="list-disc pl-5 text-sm mt-1 text-muted-foreground">
                    {categorizedActivities.neutral.length > 0 ? categorizedActivities.neutral.map(a => <li key={a.name}>{a.name}</li>) : <li>Ninguna actividad en esta categoría.</li>}
                    </ul>
                </div>
            </div>
            
            <Button onClick={() => setStep(4)} className="w-full mt-6">Reflexionar</Button>
        </div>
      );
      case 4: return <div className="p-4 space-y-4"><Label>¿Qué actividad te gustaría hacer más?</Label><Textarea value={reflection.moreOf} onChange={e => setReflection(p => ({...p, moreOf: e.target.value}))}/><Label>¿Qué actividad podrías reducir o reajustar?</Label><Textarea value={reflection.lessOf} onChange={e => setReflection(p => ({...p, lessOf: e.target.value}))}/><Label>Hoy me comprometo a...</Label><Textarea value={commitment} onChange={e => setCommitment(e.target.value)} /><Button onClick={handleSave} className="w-full">Guardar</Button></div>;
      case 5: return <div className="p-4 text-center space-y-4"><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><p>Mapa guardado. Vuelve a él para recordar dónde enfocar tu energía.</p></div>
      default: return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta7/tecnicas/Ruta7semana1tecnica2.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
