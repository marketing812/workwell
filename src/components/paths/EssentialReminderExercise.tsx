

"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { EssentialReminderExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';

interface EssentialReminderExerciseProps {
  content: EssentialReminderExerciseContent;
  pathId: string;
  onComplete: () => void;
}

// New detailed value options
const valueOptions = [
    { id: 'care', label: 'Cuidado personal', description: 'Priorizar tu bienestar físico, emocional y mental sin culpa.' },
    { id: 'auth', label: 'Autenticidad', description: 'Ser tú misma o tú mismo, sin máscaras ni autoengaños.' },
    { id: 'freedom', label: 'Libertad', description: 'Elegir desde lo que te mueve por dentro, no desde la obligación o la presión.' },
    { id: 'connect', label: 'Conexión', description: 'Sentirte en sintonía con otras personas desde el respeto y la empatía.' },
    { id: 'calm', label: 'Calma', description: 'Vivir con más serenidad, sin dejarte arrastrar por la prisa o la ansiedad.' },
    { id: 'respect', label: 'Respeto', description: 'Tratarte a ti y a los demás con dignidad y cuidado, incluso en el conflicto.' },
    { id: 'coherence', label: 'Coherencia interna', description: 'Alinear lo que haces con lo que piensas y sientes, sin dividirte por dentro.' },
    { id: 'bravery', label: 'Valentía', description: 'Dar pasos aunque sientas miedo, si eso te acerca a lo que de verdad importa.' },
    { id: 'compassion', label: 'Compasión', description: 'Tratarte con amabilidad, sobre todo cuando te equivocas o estás en dolor.' },
    { id: 'responsibility', label: 'Responsabilidad', description: 'Hacerte cargo de tus elecciones, con honestidad y sin culpas innecesarias.' },
    { id: 'gratitude', label: 'Gratitud', description: 'Reconocer lo que sí hay, lo que funciona, lo que te ha sostenido.' },
    { id: 'presence', label: 'Presencia', description: 'Estar en el aquí y ahora, sin quedarte atrapada/o en el pasado o el futuro.' },
    { id: 'creativity', label: 'Creatividad', description: 'Expresarte con libertad, explorar nuevas ideas y soluciones.' },
    { id: 'confidence', label: 'Confianza', description: 'Creer en tus recursos internos y en la posibilidad de que las cosas pueden ir bien.' },
    { id: 'simplicity', label: 'Simplicidad', description: 'Dejar de cargar con lo innecesario para enfocarte en lo que sí cuenta.' },
    { id: 'self-love', label: 'Amor propio', description: 'Reconocer tu valor sin tener que demostrar nada.' },
    { id: 'justice', label: 'Justicia', description: 'Buscar el equilibrio y la equidad en tu vida y en tus relaciones.' },
    { id: 'integrity', label: 'Integridad', description: 'Ser fiel a tus principios, aunque eso implique tomar decisiones difíciles.' },
    { id: 'collaboration', label: 'Colaboración', description: 'Construir juntas o juntos, sumar, confiar en el apoyo mutuo.' },
    { id: 'tenderness', label: 'Ternura', description: 'Aportar dulzura, sensibilidad y cuidado en cómo te tratas y cómo te relacionas.' },
];

const reminderTypes = ['Frase corta escrita', 'Imagen', 'Dibujo o símbolo', 'Objeto personal'];
const reminderPlacements = ['Espejo', 'Escritorio', 'Agenda', 'Fondo de pantalla', 'Otro']; // Added "Otro"

export default function EssentialReminderExercise({ content, pathId, onComplete }: EssentialReminderExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
  const [otherValue, setOtherValue] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [reminderContent, setReminderContent] = useState('');
  const [placement, setPlacement] = useState('');
  const [otherPlacement, setOtherPlacement] = useState(''); // For the "Otro" placement option
  const [isSaved, setIsSaved] = useState(false);
  
  const handleValueChange = (id: string, checked: boolean) => {
    setSelectedValues(prev => ({...prev, [id]: checked}));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const finalValues = valueOptions.filter(v => selectedValues[v.id]).map(v => v.label);
    if(selectedValues['otro'] && otherValue) finalValues.push(otherValue);

    const finalPlacement = placement === 'Otro' ? otherPlacement : placement;

    if (finalValues.length === 0 || !reminderType || !reminderContent || !finalPlacement) {
        toast({ title: 'Campos incompletos', description: 'Por favor, completa todos los pasos para guardar.', variant: 'destructive' });
        return;
    }
    
    const notebookContent = `
**Ejercicio: ${content.title}**

**Valor(es) guía:** ${finalValues.join(', ')}
**Tipo de recordatorio:** ${reminderType}
**Contenido:** ${reminderContent}
**Ubicación:** ${finalPlacement}
    `;
    addNotebookEntry({ title: `Mi Recordatorio Esencial`, content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: "Recordatorio Guardado", description: "Tu recordatorio esencial ha sido guardado." });
    setIsSaved(true);
    onComplete();
    nextStep();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <p>A veces, una imagen o una frase puede sostenernos más que mil pensamientos. Hoy vas a crear tu recordatorio esencial.</p>
            <p>Para ello, empezarás eligiendo un valor que quieras tener presente en tu día a día: ese que te conecta con lo que de verdad te importa. Después, decidirás qué forma tendrá tu recordatorio: puede ser una frase, una imagen, un dibujo o un objeto con significado para ti. Lo diseñarás con libertad y creatividad. No tiene que ser perfecto: solo tiene que resonar contigo. Por último, colócalo en un lugar visible —tu espejo, tu escritorio, tu agenda o donde lo veas cada día— como un ancla silenciosa que te devuelva a tu propósito.</p>
            <Button onClick={nextStep}>Empezar <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Step 1: Valor Guía
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: ¿Qué valor o propósito quieres anclar ahora?</h4>
            <div className="space-y-1">
                <Accordion type="multiple" className="w-full">
                    {valueOptions.map(opt => (
                        <AccordionItem value={opt.id} key={opt.id} className="border-b">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <Checkbox id={opt.id} checked={!!selectedValues[opt.id]} onCheckedChange={(checked) => handleValueChange(opt.id, !!checked)} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                                <AccordionTrigger className="p-2 hover:no-underline [&>svg]:size-5"><Info className="h-4 w-4"/></AccordionTrigger>
                            </div>
                            <AccordionContent className="text-sm pl-9 pr-4 pb-3">{opt.description}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="otro" checked={!!selectedValues['otro']} onCheckedChange={(checked) => handleValueChange('otro', !!checked)} />
                    <Label htmlFor="otro" className="font-normal">Otro</Label>
                </div>
                {selectedValues['otro'] && <Input value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Escribe tu valor personalizado..." className="mt-2 ml-6" />}
            </div>
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={Object.values(selectedValues).every(v => !v)}>Siguiente</Button>
            </div>
          </div>
        );
      case 2: // Step 2: Diseña
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Diseña tu recordatorio</h4>
            <div className="space-y-2">
                <Label>¿Qué forma tendrá tu recordatorio?</Label>
                <RadioGroup value={reminderType} onValueChange={setReminderType}>
                    {reminderTypes.map(t => <div key={t} className="flex items-center space-x-2"><RadioGroupItem value={t} id={t}/><Label htmlFor={t} className="font-normal">{t}</Label></div>)}
                </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="reminder-content">Tu recordatorio (frase, descripción de imagen...)</Label>
                <Textarea id="reminder-content" value={reminderContent} onChange={e => setReminderContent(e.target.value)}/>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!reminderType || !reminderContent.trim()}>Siguiente</Button>
            </div>
          </div>
        );
      case 3: // Step 3: Ubica
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Ubica tu recordatorio</h4>
            <div className="space-y-2">
                <Label>¿Dónde vas a ponerlo para que sea un ancla visible en tu día a día?</Label>
                <RadioGroup value={placement} onValueChange={setPlacement}>
                    {reminderPlacements.map(p => (
                        <div key={p} className="flex items-center space-x-2">
                            <RadioGroupItem value={p} id={p}/>
                            <Label htmlFor={p} className="font-normal">{p}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {placement === 'Otro' && <Input value={otherPlacement} onChange={e => setOtherPlacement(e.target.value)} placeholder="Escribe otra ubicación..." className="mt-2 ml-6"/>}
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Guardar mi Recordatorio</Button>
            </div>
          </form>
        );
       case 4: // Confirmation
        return (
             <div className="p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="font-bold text-lg">Recordatorio Guardado</h4>
                <p className="italic">"Cada vez que veas tu recordatorio, respira hondo y vuelve a ti. A tu valor. A tu dirección."</p>
                <div className="flex justify-between w-full mt-4">
                    <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                    <Button onClick={() => setStep(0)} variant="outline">Crear otro recordatorio</Button>
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
            {content.objective && 
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
            }
        </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
