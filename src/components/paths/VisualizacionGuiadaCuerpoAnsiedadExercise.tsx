
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { VisualizacionGuiadaCuerpoAnsiedadExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface VisualizacionGuiadaCuerpoAnsiedadExerciseProps {
  content: VisualizacionGuiadaCuerpoAnsiedadExerciseContent;
  pathId: string;
}

export function VisualizacionGuiadaCuerpoAnsiedadExercise({ content, pathId }: VisualizacionGuiadaCuerpoAnsiedadExerciseProps) {
    const [step, setStep] = useState(0);
    const [breathing, setBreathing] = useState('');
    const [heart, setHeart] = useState('');
    const [stomach, setStomach] = useState('');
    const [head, setHead] = useState('');
    const [acceptancePhrase, setAcceptancePhrase] = useState('');
    const [wavePhrase, setWavePhrase] = useState('');

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const resetExercise = () => setStep(0);

    const renderStep = () => {
        switch (step) {
            case 0: // Intro
                return (
                    <div className="p-4 space-y-4 text-center animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Explorar el cuerpo sin miedo</h4>
                        <p className="text-sm text-muted-foreground">La ansiedad es como una alarma interna: salta aunque no haya fuego real. Y lo que más nos asusta no es la alarma en sí, sino las sensaciones que trae consigo. Muchas veces, el problema no está en los síntomas, sino en cómo los interpretamos:</p>
                        <ul className="list-none text-sm space-y-1">
                            <li>“¿Y si este dolor en el pecho significa que tengo un problema en el corazón?” ❤️</li>
                            <li>“¿Y si me mareo y me desmayo delante de todos?” 🌀</li>
                            <li>“¿Y si me estoy volviendo loco/a y pierdo el control?” 🤯</li>
                        </ul>
                        <p className="text-sm text-muted-foreground">Hoy vamos a hacer un recorrido por tu cuerpo para mirar esas sensaciones con calma, sin añadirles interpretaciones de peligro. La meta no es eliminar nada, sino comprobar que las sensaciones, aunque intensas y molestas, no son peligrosas.</p>
                        <Button onClick={nextStep} className="w-full mt-2">Comenzar visualización <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                );
            
            case 1: // Step 1: Breathing
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 1: Escanea tu respiración</h4>
                        <p className="text-sm text-muted-foreground">Cierra los ojos (si te resulta cómodo) y presta atención a tu respiración. No intentes cambiarla, solo obsérvala: ¿es rápida, superficial, entrecortada?</p>
                        <RadioGroup value={breathing} onValueChange={setBreathing}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Normal" id="b-normal" /><Label htmlFor="b-normal">Normal 🌿</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Rápida" id="b-rapida" /><Label htmlFor="b-rapida">Rápida 😮‍💨</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Superficial" id="b-superficial" /><Label htmlFor="b-superficial">Superficial 🌬️</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Con presión en el pecho" id="b-presion" /><Label htmlFor="b-presion">Con presión en el pecho 🫁</Label></div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground italic border-l-2 pl-2">Recordatorio: “Respirar así no significa que te falte el aire de verdad. Es tu sistema de alarma funcionando.”</p>
                        <div className="flex justify-between mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} disabled={!breathing}>Siguiente</Button></div>
                    </div>
                );
            
            case 2: // Step 2: Heart
                return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 2: Escucha tu corazón</h4>
                        <p className="text-sm text-muted-foreground">Ahora lleva la atención a tu pecho. ¿Cómo late tu corazón?</p>
                        <RadioGroup value={heart} onValueChange={setHeart}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Normal" id="h-normal" /><Label htmlFor="h-normal">Normal ❤️</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Muy rápido (taquicardia)" id="h-rapido" /><Label htmlFor="h-rapido">Muy rápido (taquicardia) 💓</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Fuerte" id="h-fuerte" /><Label htmlFor="h-fuerte">Fuerte, como si se notara en todo el cuerpo 💥</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Irregular" id="h-irregular" /><Label htmlFor="h-irregular">Irregular o con saltos ⏱️</Label></div>
                        </RadioGroup>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline">Mini psicoeducación</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground">El corazón se acelera para prepararte para correr o luchar. Aunque lo sientas intenso, no significa que vaya a fallar: es una reacción normal del cuerpo bajo ansiedad.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex justify-between mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} disabled={!heart}>Siguiente</Button></div>
                    </div>
                );

            case 3: // Step 3: Stomach & Head
                return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 3: Explora el estómago y la cabeza</h4>
                         <div className="space-y-2">
                             <Label>En el estómago, noto principalmente:</Label>
                             <RadioGroup value={stomach} onValueChange={setStomach}>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Nudo o vacío" id="s-nudo" /><Label htmlFor="s-nudo">Nudo o vacío 🤢</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Retortijones o molestias" id="s-retortijones" /><Label htmlFor="s-retortijones">Retortijones o molestias 💫</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Ganas urgentes de ir al baño" id="s-bano" /><Label htmlFor="s-bano">Ganas urgentes de ir al baño 🚽</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>En la cabeza, siento:</Label>
                            <RadioGroup value={head} onValueChange={setHead}>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Mareo o inestabilidad" id="head-mareo" /><Label htmlFor="head-mareo">Mareo o inestabilidad 🌀</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Dolor o presión" id="head-dolor" /><Label htmlFor="head-dolor">Dolor o presión en la frente/ sienes 🤯</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="Desconexión" id="head-desconexion" /><Label htmlFor="head-desconexion">Sensación de desconexión (“irrealidad”) 🌫️</Label></div>
                            </RadioGroup>
                        </div>
                        <p className="text-xs text-muted-foreground italic border-l-2 pl-2">Recordatorio: Estos síntomas, aunque incómodos, no son peligrosos: forman parte de la activación del sistema nervioso.</p>
                        <div className="flex justify-between mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} disabled={!stomach || !head}>Siguiente</Button></div>
                    </div>
                );
            
            case 4: // Step 4: Naming
                return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 4: Nómbralo sin luchar</h4>
                        <p className="text-sm text-muted-foreground">Ahora que has explorado tu respiración, tu corazón, tu estómago y tu cabeza, haz algo importante: nombra lo que sientes sin intentar cambiarlo.</p>
                        <Label htmlFor="acceptancePhrase">Ahora mismo siento que…</Label>
                        <Textarea id="acceptancePhrase" value={acceptancePhrase} onChange={e => setAcceptancePhrase(e.target.value)} placeholder="Ejemplo: “Mi corazón late fuerte, tengo un nudo en el estómago y la respiración acelerada. Sé que es ansiedad y no algo peligroso.”" />
                        <div className="flex justify-between mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} disabled={!acceptancePhrase.trim()}>Siguiente</Button></div>
                    </div>
                );

            case 5: // Step 5: Wave
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Paso 5: Imagina la ola</h4>
                        <p className="text-sm text-muted-foreground">Cierra los ojos un momento y visualiza tus sensaciones como una ola del mar. Sube con fuerza (síntomas intensos), llega a la cresta (momento de máximo malestar) y después, inevitablemente, baja y regresa al mar.</p>
                        <Label htmlFor="wavePhrase">Escribe una frase que te ayude a recordarlo en el futuro</Label>
                        <Textarea id="wavePhrase" value={wavePhrase} onChange={e => setWavePhrase(e.target.value)} placeholder="Ejemplo: “Mi ansiedad es una ola: viene y se va.”"/>
                         <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline">Mini psicoeducación</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground">Las investigaciones muestran que una emoción intensa dura entre 60 y 90 segundos si no la alimentas con pensamientos catastróficos.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex justify-between mt-4"><Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button><Button onClick={nextStep} disabled={!wavePhrase.trim()}>Ver Cierre</Button></div>
                    </div>
                );

            case 6: // Closing
                return (
                     <div className="p-4 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto"/>
                        <h4 className="font-semibold text-lg">Cierre del ejercicio</h4>
                        <p className="text-muted-foreground">Muy bien. Hoy has practicado observar tu ansiedad en el cuerpo sin huir de ella. Cuanto más te entrenes, más descubrirás que las sensaciones, aunque molestas, no te dañan.</p>
                        <div className="text-sm p-4 border rounded-md bg-background/50 flex justify-around items-center flex-wrap gap-2">
                           <span>Respiración 👃</span><ArrowRight className="h-4 w-4"/>
                           <span>Corazón ❤️</span><ArrowRight className="h-4 w-4"/>
                           <span>Estómago y cabeza 🤢🤯</span><ArrowRight className="h-4 w-4"/>
                           <span>Nombrar 📝</span><ArrowRight className="h-4 w-4"/>
                           <span>Ola 🌊</span>
                        </div>
                        <p className="italic text-primary pt-2">“Tu cuerpo grita con la ansiedad, pero tú puedes aprender a escucharlo sin miedo. Cada vez que lo haces, la ola pierde fuerza.”</p>
                        <Button onClick={resetExercise} variant="outline" className="w-full">Hacer otro registro</Button>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center">
                    <Edit3 className="mr-2" />{content.title}
                </CardTitle>
                {content.objective && 
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
                }
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}
