
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { ModuleContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FutureSelfVisualizationExerciseProps {
  content: ModuleContent;
  pathId: string;
  audioUrl?: string;
}

export function FutureSelfVisualizationExercise({ content, pathId, audioUrl }: FutureSelfVisualizationExerciseProps) {
    const { toast } = useToast();
    const [step, setStep] = useState(0);

    const [habit, setHabit] = useState('');
    const [futureSelf, setFutureSelf] = useState('');
    const [emotions, setEmotions] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [benefits, setBenefits] = useState('');
    const [journeySteps, setJourneySteps] = useState(''); // Renamed from 'steps' to avoid conflict
    const [saved, setSaved] = useState(false);

    if (content.type !== 'futureSelfVisualizationExercise') return null;

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        const notebookContent = `
**Ejercicio: ${content.title}**

*Hábito visualizado:* ${habit}
*Cómo era mi yo futuro:* ${futureSelf}
*Emociones que sentí:* ${emotions}
*Pensamientos que aparecieron:* ${thoughts}
*Beneficios en mi vida:* ${benefits}
*Pasos que me ayudaron:* ${journeySteps}
        `;
        
        addNotebookEntry({
            title: 'Mi Visualización del Yo Futuro',
            content: notebookContent,
            pathId,
            ruta: 'Superar la Procrastinación y Crear Hábitos',
        });
        toast({ title: 'Visualización Guardada', description: 'Tu ejercicio se ha guardado en el cuaderno.' });
        setSaved(true);
        setStep(7); // Move to confirmation screen
    };

    const renderStep = () => {
        switch(step) {
            case 0: // Introducción
                return (
                    <div className="p-4 space-y-4">
                        <p className="text-sm text-muted-foreground">Busca un lugar tranquilo y cómodo. Apoya bien los pies en el suelo, relaja el cuerpo y deja que tu respiración te acompañe.</p>
                        <p className="text-sm text-muted-foreground">Hoy vas a iniciar un breve viaje mental hacia una versión futura de ti: una versión que ya ha atravesado el bloqueo que hoy te cuesta, y ha creado el hábito que ahora deseas construir.</p>
                        <p className="text-sm text-muted-foreground">No necesitas saber exactamente cómo lo ha hecho. Solo tienes que observar, sentir y conectar.</p>
                        <p className="text-sm text-muted-foreground">Este ejercicio no es magia ni adivinación. Es una herramienta poderosa que utiliza tu imaginación como puente hacia el cambio. 
Cuando visualizas con detalle una versión posible de ti, activas en tu cerebro las mismas redes que se encienden cuando realmente actúas. Eso refuerza tu motivación, tu claridad y tu confianza.</p>
                        <p className="text-sm text-muted-foreground">Puedes hacer esta visualización de dos formas:</p>
                        
                        <div className="flex flex-col gap-2">
                           <Button onClick={() => {
                               const audio = document.getElementById('main-audio') as HTMLAudioElement;
                               if (audio) audio.play();
                           }}>
                                Escuchar audio guiado
                           </Button>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    Leer visualización completa
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                                     <h4 className="font-semibold">Inicio – Respiración y conexión corporal</h4>
                                     <audio controls controlsList="nodownload" className="w-full h-10 mt-2">
                                        <source src="https://workwellfut.com/audios/ruta3/tecnicas/R3sem3ejercicio2inicio.mp3" type="audio/mp3" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                    <p>Cierra los ojos suavemente si te sientes cómoda o cómodo con ello. 
Tómate unos segundos para estar presente aquí y ahora. 
Siente el contacto de tu cuerpo con la superficie que te sostiene… 
Observa tu respiración… sin cambiarla, solo sintiéndola entrar y salir… 
Imagina que, con cada exhalación, liberas tensión… 
Y con cada inhalación, te conectas contigo misma, contigo mismo.</p>
                                    <p>Ahora, prepárate para un pequeño viaje hacia una versión futura de ti. 
Una versión que ha atravesado el bloqueo que hoy te pesa… 
Y que ha construido poco a poco ese hábito que tú también deseas crear.</p>
                                    
                                    <h4 className="font-semibold pt-2">Parte 1 – Visualización del entorno futuro</h4>
                                    <audio controls controlsList="nodownload" className="w-full h-10 mt-2">
                                        <source src="https://workwellfut.com/audios/ruta3/tecnicas/R3sem3ejercicio2parte1visuLizentornofuturo.mp3" type="audio/mp3" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                    <p>Imagina que ha pasado el tiempo necesario. 
No importa si han sido semanas o meses… 
Lo importante es que ahora estás ahí: 
En un momento de tu vida en el que ese hábito ya forma parte de tu rutina.</p>
                                    <p>Tu energía es distinta… tu mirada transmite algo nuevo… 
Tu cuerpo también se siente diferente. Quizá más ligero, más estable, más conectado.</p>
                                    <p>¿Dónde estás en esta escena? 
¿Es por la mañana o por la tarde? 
¿Qué haces justo después de completar ese hábito que tanto te costaba antes?</p>
                                    <p>Obsérvate con detalle… 
Fíjate en tu postura, tu ropa, tu rostro… 
Nota si hay algo en tu expresión que te transmite calma, determinación, satisfacción…</p>
                                    
                                    <h4 className="font-semibold pt-2">Parte 2 – Integración emocional y somática</h4>
                                    <audio controls controlsList="nodownload" className="w-full h-10 mt-2">
                                        <source src="https://workwellfut.com/audios/ruta3/tecnicas/R3sem3ejerccio2parte2integracionemocional.mp3" type="audio/mp3" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                    <p>Ahora trata de sentir lo que esa versión de ti siente: 
¿Qué emociones están presentes? 
¿Orgullo? ¿Tranquilidad? ¿Autoconfianza?</p>
                                    <p>Déjalas entrar en tu cuerpo como si fueran un sol suave que te envuelve desde dentro.</p>
                                    <p>Este tú que ahora observas no es perfecto… 
Ha tenido días difíciles, momentos de duda, incluso tropiezos. 
Pero ha seguido adelante. 
Y eso ha hecho toda la diferencia.</p>
                                    <p>Respira con esa sensación. 
Imagina que cada célula de tu cuerpo registra este momento como una semilla. 
Una semilla de posibilidad.</p>

                                    <h4 className="font-semibold pt-2">Parte 3 – Diálogo con tu yo futuro</h4>
                                    <audio controls controlsList="nodownload" className="w-full h-10 mt-2">
                                        <source src="https://workwellfut.com/audios/ruta3/tecnicas/R3seman3ejerci2parte3dialogoyofuturoycierre.mp3" type="audio/mp3" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                    <p>Ahora, si lo deseas, puedes acercarte a esa versión futura de ti. 
Pídele un consejo. Una frase. 
¿Qué te diría si pudiera hablarte hoy, desde ese lugar donde ya ha cruzado el bloqueo?</p>
                                    <p>Tal vez te diga algo como:</p>
                                    <ul className="list-disc list-inside pl-4">
                                        <li>“Empieza pequeño, pero empieza.”</li>
                                        <li>“Confía en el proceso.”</li>
                                        <li>“Tú puedes cuidarte aunque tengas miedo.”</li>
                                        <li>“Yo estoy aquí… esperando a que te acerques.”</li>
                                    </ul>
                                    <p>Quédate un momento con ese mensaje.</p>
                                    
                                    <h4 className="font-semibold pt-2">Cierre – Anclaje y regreso</h4>
                                    <p>Ahora, poco a poco, deja que la imagen se vaya difuminando. 
Pero guarda dentro de ti lo más importante: 
La emoción que has sentido. 
La dirección que te ha mostrado. 
La certeza de que ese camino está a tu alcance, paso a paso.</p>
                                    <p>Haz una última respiración profunda. 
Siente nuevamente el apoyo del suelo, el contacto con tu cuerpo. 
Y cuando estés preparada o preparado… 
Puedes abrir los ojos, o volver a la app para registrar lo que has vivido.</p>
                                </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <Button onClick={() => setStep(1)} className="w-full">Comenzar ejercicio de escritura</Button>
                    </div>
                );
            case 1: // Pantalla 2 – Define tu hábito
                 return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Define tu hábito deseado</h4>
                        <Label htmlFor="habit">Escribe aquí el hábito que deseas construir.</Label>
                        <Textarea id="habit" value={habit} onChange={e => setHabit(e.target.value)} placeholder="Ej: Revisar mi agenda cada mañana" />
                        <div className="flex justify-between mt-2"><Button variant="outline" onClick={() => setStep(0)}>Atrás</Button><Button onClick={() => setStep(2)} disabled={!habit}>Siguiente</Button></div>
                    </div>
                );
            case 2: // Pantalla 3 – Viaje al futuro
                return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Fase 1: Viaje al futuro</h4>
                        <p className="text-sm text-muted-foreground">Imagina que ha pasado el tiempo suficiente para que el hábito que deseas ya forme parte de tu vida.</p>
                        <Label htmlFor="futureSelf">¿Dónde estás? ¿Es por la mañana, por la tarde? ¿Qué estás haciendo justo después de completar ese hábito? ¿Cómo te ves? ¿Cómo es tu cuerpo, tu ropa, tu expresión facial? ¿Qué transmite tu mirada?</Label>
                        <Textarea id="futureSelf" value={futureSelf} onChange={e => setFutureSelf(e.target.value)} />
                        <div className="flex justify-between mt-2"><Button variant="outline" onClick={() => setStep(1)}>Atrás</Button><Button onClick={() => setStep(3)} disabled={!futureSelf}>Siguiente</Button></div>
                    </div>
                );
            case 3: // Pantalla 4 – Emociones y pensamientos
                 return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Fase 2: Emociones y pensamientos del yo futuro</h4>
                        <p className="text-sm text-muted-foreground">Observa las emociones que te habitan en esa escena:</p>
                        <Label htmlFor="emotions">¿Sientes orgullo? ¿Confianza? ¿Tranquilidad? ¿Qué pensamientos aparecen en tu mente? ¿Hay frases que te dices o que resuenan dentro de ti?</Label>
                        <Textarea id="emotions" value={emotions} onChange={e => setEmotions(e.target.value)} />
                        <p className="text-sm text-muted-foreground">Déjalas entrar como una luz suave que te abraza por dentro.</p>
                        <div className="flex justify-between mt-2"><Button variant="outline" onClick={() => setStep(2)}>Atrás</Button><Button onClick={() => setStep(4)} disabled={!emotions}>Siguiente</Button></div>
                    </div>
                );
            case 4: // Pantalla 5 – Cambios
                return (
                     <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Fase 3: Cambios que observas en tu vida</h4>
                        <Label htmlFor="benefits">¿Cómo ha mejorado tu bienestar físico o emocional? ¿En qué ha cambiado tu autoestima o tu energía diaria? ¿Y tus relaciones? ¿Qué dificultades lograste superar?</Label>
                        <p className="text-sm text-muted-foreground">Observa con atención los frutos del camino recorrido.</p>
                        <Textarea id="benefits" value={benefits} onChange={e => setBenefits(e.target.value)} />
                        <div className="flex justify-between mt-2"><Button variant="outline" onClick={() => setStep(3)}>Atrás</Button><Button onClick={() => setStep(5)} disabled={!benefits}>Siguiente</Button></div>
                    </div>
                );
            case 5: // Pantalla 6 – Mirar atrás
                return (
                    <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold">Fase 4: Mirar atrás desde el futuro</h4>
                        <Label htmlFor="journeySteps">Desde esa versión futura de ti, ¿qué fue lo primero que hiciste para empezar? ¿Qué estrategias usaste en momentos de duda? ¿Qué actitud mental te ayudó a no rendirte?</Label>
                        <Textarea id="journeySteps" value={journeySteps} onChange={e => setJourneySteps(e.target.value)} />
                        <div className="flex justify-between mt-2"><Button variant="outline" onClick={() => setStep(4)}>Atrás</Button><Button onClick={() => setStep(6)} disabled={!journeySteps}>Ir al plan de acción</Button></div>
                    </div>
                );
            case 6: // Pantalla 7 - Plan de acción
                return (
                    <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Plan de acción desde la visualización</h4>
                        <div className="space-y-2"><Label htmlFor="habit-final">¿Qué hábito visualizaste?</Label><Textarea id="habit-final" value={habit} onChange={e => setHabit(e.target.value)} disabled={saved} /></div>
                        <div className="space-y-2"><Label htmlFor="future-self-final">¿Cómo era tu yo futuro?</Label><Textarea id="future-self-final" value={futureSelf} onChange={e => setFutureSelf(e.target.value)} disabled={saved} /></div>
                        <div className="space-y-2"><Label htmlFor="emotions-final">¿Qué emociones sentiste?</Label><Textarea id="emotions-final" value={emotions} onChange={e => setEmotions(e.target.value)} disabled={saved} /></div>
                        <div className="space-y-2"><Label htmlFor="thoughts-final">¿Qué pensamientos nuevos aparecieron?</Label><Textarea id="thoughts-final" value={thoughts} onChange={e => setThoughts(e.target.value)} disabled={saved} /></div>
                        <div className="space-y-2"><Label htmlFor="benefits-final">¿Qué beneficios viste en tu vida?</Label><Textarea id="benefits-final" value={benefits} onChange={e => setBenefits(e.target.value)} disabled={saved} /></div>
                        <div className="space-y-2"><Label htmlFor="steps-final">¿Qué pasos te ayudaron a llegar hasta ahí?</Label><Textarea id="steps-final" value={journeySteps} onChange={e => setJourneySteps(e.target.value)} disabled={saved} /></div>
                        {!saved ? (
                            <div className="flex justify-between w-full mt-4">
                                <Button variant="outline" onClick={() => setStep(5)} type="button">Atrás</Button>
                                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar mi visualización</Button>
                            </div>
                        ) : null}
                    </form>
                );
             case 7: // Pantalla 8 - Cierre
                return (
                    <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="font-bold text-lg">Visualización Guardada</h4>
                        <blockquote className="italic border-l-4 border-primary pl-4 text-left">“Visualizar mi cambio me ayuda a construirlo. Cada pequeño paso que doy me acerca a esa versión de mí que ya está en camino.”</blockquote>
                        <Button onClick={() => setStep(0)} variant="outline">Hacer otra visualización</Button>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
                {audioUrl && (
                    <div className="mt-4">
                        <audio id="main-audio" controls controlsList="nodownload" className="w-full">
                            <source src={audioUrl} type="audio/mp3" />
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
