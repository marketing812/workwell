
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { AnsiedadTieneSentidoExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowRight, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface AnsiedadTieneSentidoExerciseProps {
  content: AnsiedadTieneSentidoExerciseContent;
  pathId: string;
}

export function AnsiedadTieneSentidoExercise({ content, pathId }: AnsiedadTieneSentidoExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [situation, setSituation] = useState('');
    const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});
    const [otherSymptom, setOtherSymptom] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [initialThreat, setInitialThreat] = useState('');
    const [finalAction, setFinalAction] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const symptomOptions = [
        { id: 'symptom-palpitations', label: 'Palpitaciones o taquicardia' },
        { id: 'symptom-sweating', label: 'Sudoración excesiva' },
        { id: 'symptom-breathing', label: 'Respiración rápida o sensación de falta de aire' },
        { id: 'symptom-dizziness', label: 'Mareo, inestabilidad o sensación de desmayo' },
        { id: 'symptom-tension', label: 'Tensión muscular o rigidez' },
        { id: 'symptom-stomach', label: 'Nudo en el estómago o molestias digestivas' },
        { id: 'symptom-chills', label: 'Escalofríos o sensación de calor repentino' },
        { id: 'symptom-tingling', label: 'Hormigueos o entumecimiento en manos/pies' },
        { id: 'symptom-dry-mouth', label: 'Sequedad de boca' },
        { id: 'symptom-chest-pressure', label: 'Sensación de opresión en el pecho' },
        { id: 'symptom-trembling', label: 'Temblores o sacudidas visibles' },
        { id: 'symptom-urinate', label: 'Ganas frecuentes de orinar' },
        { id: 'symptom-headache', label: 'Dolor de cabeza o presión en la frente' },
        { id: 'symptom-concentration', label: 'Dificultad para concentrarte o “mente en blanco”' },
    ];

    const handleSave = () => {
        if (!situation || !initialThreat) {
            toast({
                title: "Campos incompletos",
                description: "Por favor, completa al menos la situación y el pensamiento de amenaza.",
                variant: "destructive"
            });
            return;
        }

        const selectedSymptoms = symptomOptions.filter(s => symptoms[s.id]).map(s => s.label);
        if (symptoms['symptom-other'] && otherSymptom) selectedSymptoms.push(otherSymptom);

        const notebookContent = `
**Ejercicio: ${content.title}**

**Situación (hechos):**
${situation}

**Pensamiento amenazante inicial:**
${initialThreat}

**Síntomas físicos y mentales:**
${selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'No especificados.'}

**Interpretación de los síntomas (miedo a la ansiedad):**
${thoughts || 'No especificado.'}

**Efecto final (qué hiciste o sentiste):**
${finalAction || 'No especificado.'}
        `;
        
        addNotebookEntry({
            title: `Círculo de la Ansiedad: ${situation.substring(0, 25)}...`,
            content: notebookContent,
            pathId: pathId,
            userId: user?.id,
        });

        toast({
            title: "Registro Guardado",
            description: "Tu círculo de la ansiedad se ha guardado en el cuaderno terapéutico."
        });
        setIsSaved(true);
        setStep(4);
    };

    const resetExercise = () => {
        setStep(0);
        setSituation('');
        setSymptoms({});
        setOtherSymptom('');
        setThoughts('');
        setInitialThreat('');
        setFinalAction('');
        setIsSaved(false);
    };
    
    const renderStep = () => {
        switch(step) {
            case 0: // Pantalla 1
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Paso 1: Sitúa el momento</h4>
                        <p className="text-sm text-muted-foreground">Piensa en la última vez que sentiste ansiedad. No hace falta que sea algo dramático: puede ser un momento sencillo (ej. ir en el metro, hablar en una reunión, acostarte a dormir).</p>
                        <div className="space-y-2">
                          <Label htmlFor="situation">Describe brevemente la situación (solo hechos, sin interpretaciones):</Label>
                          <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder='Ejemplo: “Estaba en el metro y empezó a llenarse de gente.”' />
                        </div>
                        <p className="text-xs text-muted-foreground italic">En realidad, lo primero que suele aparecer tras la situación es un pensamiento rápido de amenaza (‘esto es peligroso’), incluso aunque no lo recuerdes claramente. No te preocupes si ahora no lo tienes claro: lo retomaremos más adelante.</p>
                        <Button onClick={() => setStep(1)} className="w-full mt-2" disabled={!situation.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            case 1: // Pantalla 2
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Paso 2: Señales del cuerpo y de la mente</h4>
                        <p className="text-sm text-muted-foreground">La ansiedad habla en dos idiomas: tu cuerpo y tus pensamientos. Vamos a escucharlos.</p>
                        <div className="space-y-2">
                            <Label>Lista de síntomas físicos (selección múltiple con “otro”):</Label>
                            {symptomOptions.map(opt => <div key={opt.id} className="flex items-center space-x-2"><Checkbox id={opt.id} onCheckedChange={c => setSymptoms(p => ({...p, [opt.id]: !!c}))} checked={symptoms[opt.id] || false} /><Label htmlFor={opt.id} className="font-normal">{opt.label}</Label></div>)}
                            <div className="flex items-center space-x-2"><Checkbox id="symptom-other" onCheckedChange={c => setSymptoms(p => ({...p, 'symptom-other': !!c}))} checked={symptoms['symptom-other'] || false} /><Label htmlFor="symptom-other" className="font-normal">Otro (especificar):</Label></div>
                            {symptoms['symptom-other'] && <Textarea value={otherSymptom} onChange={e => setOtherSymptom(e.target.value)} />}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="thoughts">Escribe los pensamientos que aparecieron en ese momento.</Label>
                          <Textarea id="thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} placeholder='Ejemplo: “Pensaba: ‘me voy a desmayar’, ‘no voy a aguantar aquí’.”'/>
                        </div>
                        <p className="text-xs text-muted-foreground italic">A veces, junto con los síntomas, aparece miedo a tu propia ansiedad (‘me voy a volver loco/a’, ‘voy a perder el control’, ‘me va a dar algo’). Si te pasó, anótalo: es clave para desarmar el círculo.</p>
                        <div className="flex justify-between w-full mt-2">
                            <Button onClick={() => setStep(0)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                            <Button onClick={() => setStep(2)}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                );
            case 2: // Pantalla 3
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Paso 3: El pensamiento inicial de amenaza</h4>
                        <p className="text-sm text-muted-foreground">Ahora volvamos un momento atrás: antes de que notaras el cuerpo alterado, ¿hubo alguna interpretación o pensamiento que activó la alarma?</p>
                        <div className="space-y-2">
                            <Label htmlFor="initial-threat">Identifica ese pensamiento inicial de amenaza:</Label>
                            <Textarea id="initial-threat" value={initialThreat} onChange={e => setInitialThreat(e.target.value)} placeholder='Ejemplo: “Si el metro se llena, me voy a quedar atrapado/a y no podré salir.” o “Si el metro se llena y aparece la ansiedad, no podré salir”.' />
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline">Mini psicoeducación</AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground">
                              Muchas veces este pensamiento pasa tan rápido que no lo registras. 
                              Aunque ahora lo recuerdes después de los síntomas, en realidad suele ser el detonante. 
                              Cuanto más practiques, más fácil será detectarlo en el momento.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <div className="flex justify-between w-full mt-2">
                            <Button onClick={() => setStep(1)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                            <Button onClick={() => setStep(3)} disabled={!initialThreat.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                );
            case 3: // Pantalla 4
                const selectedSymptoms = symptomOptions.filter(s => symptoms[s.id]).map(s => s.label);
                if (symptoms['symptom-other'] && otherSymptom) selectedSymptoms.push(otherSymptom);
                return (
                    <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-lg">Paso 4: Reconstruye el círculo de la ansiedad</h4>
                        <div className="space-y-3 p-4 border rounded-md bg-background/50">
                            <p><strong>Situación (hechos):</strong> {situation}</p>
                            <p><strong>Pensamiento amenazante inicial:</strong> {initialThreat}</p>
                            <p><strong>Síntomas físicos y mentales:</strong> {selectedSymptoms.join(', ')}</p>
                            <p><strong>Interpretación de los síntomas (miedo a la ansiedad):</strong> {thoughts}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="final-action">Efecto final: ¿qué hiciste o qué sentiste después?</Label>
                            <Textarea id="final-action" value={finalAction} onChange={e => setFinalAction(e.target.value)} />
                        </div>
                         <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline">Mini psicoeducación</AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground">
                              Muchas veces este pensamiento pasa tan rápido que no lo registras. 
                              Aunque ahora lo recuerdes después de los síntomas, en realidad suele ser el detonante. 
                              Cuanto más practiques, más fácil será detectarlo en el momento.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <p className="text-xs text-muted-foreground italic border-l-2 pl-2">Recordatorio: Este es el círculo típico de la ansiedad: Situación → Pensamiento amenazante inicial → Síntomas físicos y mentales → Miedo a los síntomas (‘me va a dar algo’) → Más ansiedad.</p>
                        <div className="flex justify-between w-full mt-2">
                           <Button onClick={() => setStep(2)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                           <Button onClick={handleSave} disabled={isSaved}>
                             <Save className="mr-2 h-4 w-4" />
                             {isSaved ? 'Guardado' : 'Guardar y Ver Cierre'}
                           </Button>
                        </div>
                    </div>
                );
            case 4: // Pantalla 5
                return (
                    <div className="p-4 text-center space-y-4">
                        <h4 className="font-semibold text-lg">Cierre del ejercicio</h4>
                        <p>Muy bien, acabas de trazar el mapa de tu ansiedad. Esto te ayuda a ver que no aparece “porque sí”: hay una secuencia clara. Cuanto más practiques este registro, más fácil será detectar el momento clave donde puedes intervenir para frenar el círculo.</p>
                        <div className="text-sm p-4 border rounded-md bg-background/50">
                           <p className="font-semibold">Tu Círculo de Ansiedad:</p>
                           <p>Situación → Pensamiento inicial → Síntomas → Interpretación de los síntomas → Más ansiedad</p>
                        </div>
                        <p className="italic mt-2">“Tu ansiedad tiene un sentido. Al reconocer el círculo, recuperas poco a poco el control.”</p>
                        <div className="flex justify-between w-full mt-2">
                           <Button onClick={() => setStep(3)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                           <Button onClick={resetExercise} variant="outline" className="w-auto">Hacer otro registro</Button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && (
                    <CardDescription className="pt-2">
                        {content.objective}
                        <div className="mt-4">
                            <audio controls controlsList="nodownload" className="w-full">
                                <source src="https://workwellfut.com/audios/ruta13/tecnicas/Ruta13semana1tecnica1.mp3" type="audio/mp3" />
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
