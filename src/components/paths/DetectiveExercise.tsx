
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { DetectiveExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface DetectiveExerciseProps {
  content: DetectiveExerciseContent;
  onComplete: () => void;
  pathId: string;
}

const cognitiveDistortions = [
    { value: 'catastrophism', label: 'Catastrofismo', description: 'Ver las situaciones como si el peor desenlace fuera inevitable o insoportable. Ejemplo: “Si fallo esta presentación, será un desastre total y arruinaré mi carrera.”' },
    { value: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)', description: 'Ver las cosas en extremos (todo-nada, siempre-nunca, bien-mal, ...) sin matices. Todo es perfecto o un fracaso. Ejemplo: “Si no hago todo bien, entonces soy una inútil.”' },
    { value: 'overgeneralization', label: 'Sobregeneralización', description: 'Sacar conclusiones generales a partir de un solo hecho negativo. Ejemplo: “Me equivoqué en esto, siempre lo hago mal.”' },
    { value: 'personalization', label: 'Personalización', description: 'Creer que todo lo que ocurre está relacionado contigo, incluso sin evidencia. Ejemplo: “Seguro que están serios porque yo hice algo mal.”' },
    { value: 'mind_reading', label: 'Inferencia arbitraria / Saltar a conclusiones', description: 'Sacar conclusiones negativas sin pruebas claras. Hay dos tipos: la Adivinación del Pensamiento de los demás y la Adivinación del Futuro. Ejemplo: “No me contestó el mensaje, seguro que está molesto conmigo”, “No me lo voy a pasar bien en la cena, asi que no voy a ir”.' },
    { value: 'selective_abstraction', label: 'Abstracción selectiva', description: 'Fijarse solo en lo negativo, ignorando el resto de los acontecimientos y hechos de la experiencia. Ejemplo: “Todo salió mal porque me equivoqué en una palabra”, aunque el resto de la reunión fue bien.' },
    { value: 'emotional_reasoning', label: 'Razonamiento emocional', description: 'Creer que algo es cierto solo porque lo sientes intensamente. Ejemplo: “Me siento insegura, así que debo ser incompetente.”' },
    { value: 'should_statements', label: '“Deberías” rígidos', description: 'Imponerse reglas a uno mismo o a los demás, absolutas y exigentes que generan culpa o presión. Ejemplo: “Debería estar siempre tranquila”, “No debería fallar nunca.”' },
    { value: 'magnification_minimization', label: 'Minimizar lo positivo y Maximizar lo negativo', description: 'Rechazar o minimizar cualquier logro o aspecto positivo y maximizar cualquier error o aspecto negativo. Ejemplo: “Sí, me felicitaron… pero seguro fue por compromiso”, “Mi pareja me señala un error...soy lo peor, es imperdonable”.' },
    { value: 'perfectionism', label: 'Perfeccionismo', description: 'Necesidad de cumplir estándares imposiblemente altos, sin permitir errores. Ejemplo: “Si no lo hago todo perfecto, no vale la pena.”' },
    { value: 'approval_dependency', label: 'Valía personal dependiente de la aprobación', description: 'Sentir que tu valor depende de lo que piensan los demás. Ejemplo: “Si no me valoran en el trabajo, entonces no valgo nada.”' },
    { value: 'negative_comparison', label: 'Comparación negativa', description: 'Compararse con otros en lo que uno cree que falla, sin ver el conjunto. Ejemplo: “Ella tiene más éxito que yo (porque tiene un salario más alto), entonces soy un fracaso.”' },
    { value: 'responsibility_exaggeration', label: 'Exageración de la responsabilidad', description: 'Asumir que todo depende de ti, incluso cuando no está en tus manos. Ejemplo: “Si el grupo falla, será por mi culpa.”' },
    { value: 'time_distortion', label: 'Distorsión del tiempo', description: 'Pensar que lo que sientes o vives ahora durará para siempre. Ejemplo: “Nunca voy a salir de esto.”' },
    { value: 'negative_attentional_tunnel', label: 'Túnel atencional negativo', description: 'Enfocarse solo en los peligros o en lo que falta, y no ver lo que sí está bien. Ejemplo: “Hoy ha sido horrible porque tuve una discusión”, ignorando que el resto del día fue tranquilo.' }
];

export default function DetectiveExercise({ content, onComplete, pathId }: DetectiveExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [emotion, setEmotion] = useState('');
  const [is100PercentTrue, setIs100PercentTrue] = useState('');
  const [isAnticipating, setIsAnticipating] = useState('');
  const [adviceToFriend, setAdviceToFriend] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [reflection, setReflection] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);
  const audioUrl = `${EXTERNAL_SERVICES_BASE_URL}/audios/r1_desc/Sesion-3-tecnica-1-detective-de-pensamientos.mp3`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!situation || !automaticThought || !distortion || !emotion || !is100PercentTrue || !isAnticipating || !adviceToFriend || !alternativeThought) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los pasos del ejercicio.",
        variant: "destructive",
      });
      return;
    }
    
    const notebookContent = `
**Ejercicio: ${content.title}**

**1. Situación: ¿Qué ocurrió?**
${situation}

**2. Pensamiento automático: ¿Qué pasó por tu mente?**
"${automaticThought}"

**3. Distorsión cognitiva: ¿Reconoces algún filtro mental?**
${distortion}

**4. Emoción asociada: ¿Qué emoción principal sentiste?**
${emotion}

**5. Preguntas de verificación:**
- **¿Es 100% cierto este pensamiento?:** ${is100PercentTrue}
- **¿Estoy exagerando o anticipando el peor escenario?:** ${isAnticipating}
- **¿Qué le diría a alguien que quiero si pensara esto?:** ${adviceToFriend}

**6. Pensamiento alternativo: ¿Cómo puedes reformularlo?**
"${alternativeThought}"
`;

    addNotebookEntry({
        title: 'Registro: Detective de Pensamientos',
        content: notebookContent,
        pathId: pathId,
        userId: user?.id,
    });
    
    toast({
      title: "Ejercicio Guardado",
      description: "Tu registro del 'Detective de Pensamientos' ha sido guardado exitosamente.",
    });
    setIsSaved(true);
    onComplete();
  };

  const handleSaveReflection = (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({ title: "Reflexión vacía", description: "Escribe tu reflexión para guardarla.", variant: "destructive" });
      return;
    }
    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: `**¿Qué aprendí al observar mis pensamientos desde fuera? ¿Qué distorsiones repito más? ¿Qué noto cuando me hablo con más comprensión?**\n\n${reflection}`,
      pathId: pathId,
      userId: user?.id,
    });
    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión se ha guardado en el Cuaderno Terapéutico.",
    });
    setIsReflectionSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
        {content.duration && <p className="text-sm text-muted-foreground pt-1">Duración estimada: {content.duration}</p>}
        {audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="situation" className="font-semibold">1. Situación: ¿Qué ocurrió?</Label>
            <Textarea id="situation" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Ej: Tenía que presentar un informe y mi hijo se puso enfermo." disabled={isSaved} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="automaticThought" className="font-semibold">2. Pensamiento automático: ¿Qué pasó por tu mente?</Label>
            <Textarea id="automaticThought" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} placeholder="Ej: No voy a poder con todo." disabled={isSaved} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distortion" className="font-semibold">3. Distorsión cognitiva: ¿Reconoces algún filtro mental?</Label>
            <Select value={distortion} onValueChange={setDistortion} disabled={isSaved}>
              <SelectTrigger id="distortion"><SelectValue placeholder="Elige la distorsión principal" /></SelectTrigger>
              <SelectContent>
                {cognitiveDistortions.map(d => (
                  <SelectItem key={d.value} value={d.label}>
                    <div className="flex flex-col text-left py-1">
                      <span className="font-semibold">{d.label}</span>
                      <span className="text-xs text-muted-foreground whitespace-normal">{d.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotion" className="font-semibold">4. Emoción asociada: ¿Qué emoción principal sentiste?</Label>
             <Select value={emotion} onValueChange={setEmotion} disabled={isSaved}>
                <SelectTrigger id="emotion"><SelectValue placeholder="Selecciona la emoción principal" /></SelectTrigger>
                <SelectContent>
                    {emotions.map(e => <SelectItem key={e.value} value={e.value}>{t[e.labelKey as keyof typeof t]}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-md border p-4 bg-background">
            <h4 className="font-semibold text-center">5. Preguntas de verificación</h4>
            <div className="space-y-2">
                <Label htmlFor="is100PercentTrue">¿Es 100% cierto este pensamiento?</Label>
                <Textarea id="is100PercentTrue" value={is100PercentTrue} onChange={e => setIs100PercentTrue(e.target.value)} disabled={isSaved} rows={2} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="isAnticipating">¿Estoy exagerando o anticipando el peor escenario?</Label>
                <Textarea id="isAnticipating" value={isAnticipating} onChange={e => setIsAnticipating(e.target.value)} disabled={isSaved} rows={2} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="adviceToFriend">¿Qué le diría a alguien que quiero si pensara esto?</Label>
                <Textarea id="adviceToFriend" value={adviceToFriend} onChange={e => setAdviceToFriend(e.target.value)} disabled={isSaved} rows={2} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alternativeThought" className="font-semibold">6. Pensamiento alternativo: ¿Cómo puedes reformularlo?</Label>
            <Textarea id="alternativeThought" value={alternativeThought} onChange={e => setAlternativeThought(e.target.value)} placeholder="Escribe una versión más realista, flexible y amable." disabled={isSaved} />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Ejercicio
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu ejercicio ha sido guardado.</p>
            </div>
          )}
        </form>

        {isSaved && (
          <form onSubmit={handleSaveReflection} className="mt-8 pt-6 border-t">
            <h4 className="font-semibold text-md text-primary mb-4 flex items-center">
              <NotebookText className="mr-2 h-5 w-5" />
              Reflexión Final (Para el Cuaderno Terapéutico)
            </h4>
            <div className="space-y-2">
               <Label htmlFor="reflection-notebook" className="font-normal text-sm">¿Qué aprendí al observar mis pensamientos desde fuera? ¿Qué distorsiones repito más? ¿Qué noto cuando me hablo con más comprensión?</Label>
               <Textarea
                id="reflection-notebook"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Escribe tu reflexión aquí..."
                rows={4}
                disabled={isReflectionSaved}
               />
            </div>
             {!isReflectionSaved ? (
              <Button type="submit" className="w-full mt-4">
                  <Save className="mr-2 h-4 w-4" /> Guardar Reflexión en mi Cuaderno
              </Button>
            ) : (
              <div className="mt-4 flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
