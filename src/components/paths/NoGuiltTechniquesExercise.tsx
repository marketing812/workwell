
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import type { NoGuiltTechniquesExerciseContent } from '@/data/paths/pathTypes';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface NoGuiltTechniquesExerciseProps {
  content: NoGuiltTechniquesExerciseContent;
  pathId: string;
}

const techniques = {
  discoRayado: {
    title: "Técnica: Disco rayado",
    when: "Cuando te presionan o insisten para que cambies de opinión o cedas.",
    goal: "Te ayuda a mantener tu decisión con calma, sin entrar en discusiones, reforzando tu firmeza interna.",
    howToBuild: "Reconoce lo que el otro dice con serenidad. Ej.: “Lo entiendo”, “Te escucho”, “Sé que no te gusta…” \nRepite tu límite sin justificarte ni cambiarlo. Ej.: “…pero mi decisión sigue siendo la misma.” \nLa clave es mantener el mensaje sin alterarte, como un disco rayado: claro, repetido (aunque puedes cambiar alguna palabra) y tranquilo.",
    example: "Lo entiendo, pero mi decisión sigue siendo la misma: esta vez no voy a poder.\nSé que lo necesitas, pero no puedo encargarme de eso esta semana.\nLo entiendo, pero no voy a asistir a la reunión.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4sem2discoraydo.mp3`
  },
  bancoNiebla: {
    title: "Técnica: Banco de niebla",
    when: "Cuando no quieres discutir, pero tampoco ceder ni justificarte. Ideal en situaciones donde percibes que debatir solo generará más tensión.",
    goal: "Te ayuda a mantener tu posición sin enfrentarte ni engancharte en argumentos. Es como una niebla emocional: no choca, pero tampoco se rinde. Refuerza tu derecho a sostener tu límite sin necesidad de entrar en detalle.",
    howToBuild: "Valida de forma neutral o superficial. Ej.: “Es posible que tengas razón…”, “Entiendo tu punto…” \nSostén tu límite con tranquilidad. Ej.: “…y aun así, prefiero hacerlo de otra forma.” \nEs una forma sutil y elegante de no ceder ante la presión, sin necesidad de justificarte ni abrir debate.",
    example: "Entiendo que te moleste, pero esta vez necesito que respetes mi decisión.\nPuede parecer exagerado, pero no me siento cómodo/a con ese tipo de bromas.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4sem2bancodeniebla.mp3`
  },
  aplazamientoAsertivo: {
    title: "Técnica: Aplazamiento asertivo",
    when: "Cuando sientes presión o confusión y necesitas tiempo para responder con claridad.",
    goal: "Evita respuestas impulsivas y te permite actuar desde la calma. Refuerza tu derecho a pensar antes de decidir.",
    howToBuild: "Agradece o reconoce la propuesta. Ej.: “Gracias por contar conmigo.” \nIndica que necesitas tiempo para responder. Ej.: “Prefiero pensarlo con calma y darte una respuesta después.” \nLa clave está en parar el impulso de complacer y darte un espacio para pensar.",
    example: "Gracias por contar conmigo. Prefiero pensarlo con calma y darte una respuesta más tarde.\nDéjame revisar mis tiempos y en un rato te confirmo.\nNecesito consultarlo antes de darte una respuesta definitiva.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4sem2acuerdoparcial.mp3`
  },
  acuerdoParcial: {
    title: "Técnica: Acuerdo parcial o asertivo",
    when: "Cuando la otra persona tiene parte de razón y tú quieres reconocerlo honestamente, pero sin renunciar a tu necesidad o decisión.",
    goal: "Favorece un entendimiento real, mostrando que escuchas y validas al otro, sin dejarte de lado a ti. Refuerza tu capacidad de empatía y firmeza al mismo tiempo.",
    howToBuild: "Reconoce con sinceridad lo que el otro dice. Ej.: “Tienes razón en parte…”, “Es cierto que esto es importante…” \nA continuación, reafirma tu límite o necesidad. Ej.: “…pero también necesito cuidar mis tiempos.” \nEsta técnica es un puente: valida al otro y a ti, al mismo tiempo.",
    example: "Tienes razón en que esto es urgente, pero también necesito cuidar mis tiempos.\nSí, podría haber avisado antes, pero aun así no me siento bien con lo que ocurrió.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4sem2acuerdoparcial.mp3`
  },
  sandwich: {
    title: "Técnica: Técnica del sándwich",
    when: "Cuando quieres suavizar una negativa o límite, sin dejar de expresar lo que necesitas.",
    goal: "Te permite proteger el vínculo y decir que no con amabilidad. Refuerza tu empatía sin renunciar a ti.",
    howToBuild: "Empieza con algo positivo o con una validación. Ej.: “Gracias por contar conmigo…”, “Valoro tu opinión…” \nExpón tu límite o negativa con claridad. Ej.: “…pero esta vez no voy a poder.” \nCierra con un mensaje amable. Ej.: “Espero que lo resolváis genial.” \nEs como un mensaje envuelto entre cuidado y respeto.",
    example: "Me encanta que me tengas en cuenta, pero este fin de semana necesito descansar. Seguro que lo resolvéis genial.\nValoro mucho tu opinión, pero esta vez prefiero seguir mi intuición. Gracias por entenderlo.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4semana2tecsandwich.mp3`
  },
  redireccion: {
    title: "Técnica: Redirección con foco",
    when: "Cuando quieres poner un límite sin romper el vínculo, ofreciendo una alternativa viable.",
    goal: "Te permite cuidar tus recursos sin cerrarte por completo. Refuerza tu equilibrio entre dar y cuidarte.",
    howToBuild: "Empieza expresando tu límite de forma clara. Ej.: “No puedo quedarme más tiempo hoy.” \nDespués, ofrece una alternativa posible o más saludable. Ej.: “…pero mañana puedo ayudarte a repasar el informe.” \nLa clave es mantener tu decisión sin cortar el vínculo. Estás diciendo “no” y al mismo tiempo mostrando que te importa.",
    example: "No puedo quedarme más tiempo hoy, pero mañana puedo ayudarte a repasar el informe.\nNo estoy preparado/a para abordar ese tema, pero sí podemos hablar de cómo organizamos el proyecto.",
    audioUrl: `${EXTERNAL_SERVICES_BASE_URL}/audios/ruta4/tecnicas/herramientas/R4semana2tecredirecciondefoco.mp3`
  }
};

export default function NoGuiltTechniquesExercise({ content, pathId }: NoGuiltTechniquesExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [personalizedPhrases, setPersonalizedPhrases] = useState<Record<keyof typeof techniques, string>>({
      discoRayado: '', bancoNiebla: '', aplazamientoAsertivo: '', acuerdoParcial: '', sandwich: '', redireccion: ''
  });

  const handlePhraseChange = (techniqueKey: keyof typeof techniques, value: string) => {
    setPersonalizedPhrases(prev => ({...prev, [techniqueKey]: value}));
  };

  const handleSave = (techniqueKey: keyof typeof techniques) => {
    const phrase = personalizedPhrases[techniqueKey];
    if (!phrase.trim()) {
        toast({ title: "Frase Vacía", description: "Escribe tu versión personalizada para guardarla.", variant: "destructive" });
        return;
    }

    const notebookContent = `
**Ejercicio: ${techniques[techniqueKey].title}**

*Mi frase personalizada:*
"${phrase}"
    `;
    addNotebookEntry({ title: `Técnica asertiva: ${techniques[techniqueKey].title}`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Frase Guardada", description: "Tu frase se ha guardado en el Cuaderno Terapéutico."});
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent">Caja de herramientas extra: frases para decir "no" sin culpa</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Usa estas técnicas como inspiración. Adáptalas, hazlas tuyas y practica decirlas en voz alta para que te salgan con naturalidad.</p>
        <Accordion type="multiple" className="w-full space-y-3">
          {Object.entries(techniques).map(([key, tech]) => (
            <AccordionItem value={key} key={key} className="border rounded-lg shadow-sm bg-background">
                <AccordionTrigger className="p-4 font-semibold hover:no-underline text-left text-primary">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>{tech.title}</span>
                      {(tech as any).audioUrl && (
                        <audio
                          src={(tech as any).audioUrl}
                          controls
                          controlsList="nodownload"
                          className="h-8 max-w-[200px] sm:max-w-xs"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 border-t pt-4">
                    <div className="space-y-3 text-sm">
                        <p><strong className="text-foreground">¿Cuándo usarla?</strong> {tech.when}</p>
                        <p><strong className="text-foreground">¿Qué logra?</strong> {tech.goal}</p>
                        <div className="space-y-1">
                          <p><strong className="text-foreground">¿Cómo construirla?</strong></p>
                          <p className="whitespace-pre-line">{tech.howToBuild}</p>
                        </div>
                        <div className="p-2 border-l-2 border-accent bg-accent/10 italic">
                            <p><strong>Frase base de ejemplo:</strong></p>
                            <p className="whitespace-pre-line">{tech.example}</p>
                        </div>
                        <div className="space-y-2 pt-2">
                             <Label htmlFor={`phrase-${key}`} className="font-semibold">Tu versión personalizada:</Label>
                             <Textarea 
                                id={`phrase-${key}`}
                                value={personalizedPhrases[key as keyof typeof techniques]}
                                onChange={(e) => handlePhraseChange(key as keyof typeof techniques, e.target.value)}
                                placeholder="Escribe aquí cómo lo dirías tú..."
                             />
                             <Button onClick={() => handleSave(key as keyof typeof techniques)} size="sm" className="w-full">
                                <Save className="mr-2 h-4 w-4"/> Guardar en mi Cuaderno
                             </Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
