
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/translations';
import { Edit3, Save, CheckCircle, NotebookText, Compass } from 'lucide-react';
import { emotions } from '@/components/dashboard/EmotionalEntryForm';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { StressMapExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { StressCompass } from './StressCompass';

interface StressMapExerciseProps {
  content: StressMapExerciseContent;
  onComplete: () => void;
  pathId: string;
}

export default function StressMapExercise({ content, onComplete, pathId }: StressMapExerciseProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();

  const [situation, setSituation] = useState('');
  const [thoughts, setThoughts] = useState('');
  
  const [selectedEmotion1, setSelectedEmotion1] = useState('');
  const [emotionIntensity1, setEmotionIntensity1] = useState(50);
  const [selectedEmotion2, setSelectedEmotion2] = useState('');
  const [emotionIntensity2, setEmotionIntensity2] = useState(0);
  const [selectedEmotion3, setSelectedEmotion3] = useState('');
  const [emotionIntensity3, setEmotionIntensity3] = useState(0);

  const [physicalReactions, setPhysicalReactions] = useState('');
  const [responseAction, setResponseAction] = useState('');
  const [reflections, setReflections] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showCompass, setShowCompass] = useState(false);
  const [triggerSource, setTriggerSource] = useState<'externo' | 'interno' | 'ambos' | ''>('');


  const audioUrl = "https://workwellfut.com/audios/r1_desc/Tecnica-1-mapa-del-estres-personal.mp3";


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!situation.trim() || !thoughts.trim() || !selectedEmotion1 || !physicalReactions.trim() || !responseAction.trim()) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los campos del ejercicio para guardar tu registro.",
        variant: "destructive",
      });
      return;
    }
    
    let emotionsText = `${selectedEmotion1} (${emotionIntensity1}%)`;
    if (selectedEmotion2 && emotionIntensity2 > 0) {
      emotionsText += `, ${selectedEmotion2} (${emotionIntensity2}%)`;
    }
    if (selectedEmotion3 && emotionIntensity3 > 0) {
      emotionsText += `, ${selectedEmotion3} (${emotionIntensity3}%)`;
    }

    addNotebookEntry({
        title: 'Mapa del Estrés Personal',
        content: `Situación: ${situation}\nPensamientos: ${thoughts}\nEmociones: ${emotionsText}\nReacciones Físicas: ${physicalReactions}\nRespuesta: ${responseAction}\nReflexiones: ${reflections}`,
        pathId: pathId,
        userId: user?.id
    });
    
    toast({
      title: "Registro Guardado",
      description: "Tu 'Mapa del Estrés' ha sido guardado exitosamente.",
    });
    
    setIsSaved(true);
    onComplete();
  };
  

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription>{content.objective}</CardDescription>}
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
          <p className="text-foreground/80 italic">Recuerda un momento reciente de estrés. Responde al cuestionario guiado. Al finalizar, recibirás un resumen visual tipo "brújula del estrés", que te mostrará si tus estresores habituales son externos, internos o mixtos.</p>
          
          <div>
            <Label htmlFor="situation" className="font-semibold">1. Situación (Qué ocurrió)</Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe brevemente el momento que te generó estrés. Ej: Mi jefa me pidió un informe urgente..."
              disabled={isSaved}
            />
          </div>

          <div>
            <Label htmlFor="thoughts" className="font-semibold">2. Pensamientos (Qué pensaste)</Label>
            <Textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="¿Qué pasó por tu mente? Ej: 'No voy a poder con todo', 'Seguro piensa que soy incapaz'."
              disabled={isSaved}
            />
          </div>

          <div className="space-y-4">
            <Label className="font-semibold">3. Emociones (Cómo te sentiste)</Label>
            
            {/* Emotion 1 */}
            <div className="space-y-2 border-l-2 pl-4">
              <Label htmlFor="emotion1" className="text-sm font-medium">Emoción Principal</Label>
              <Select value={selectedEmotion1} onValueChange={setSelectedEmotion1} disabled={isSaved}>
                <SelectTrigger id="emotion1">
                  <SelectValue placeholder="Selecciona la emoción principal" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((emo) => (
                    <SelectItem key={emo.value} value={emo.value}>
                      {t[emo.labelKey as keyof typeof t] || emo.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEmotion1 && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="intensity1">Intensidad: {emotionIntensity1}%</Label>
                  <Slider
                    id="intensity1"
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[emotionIntensity1]}
                    onValueChange={(value) => setEmotionIntensity1(value[0])}
                    disabled={isSaved}
                  />
                </div>
              )}
            </div>

            {/* Emotion 2 */}
            <div className="space-y-2 border-l-2 pl-4">
              <Label htmlFor="emotion2" className="text-sm font-medium">Emoción Secundaria (opcional)</Label>
              <Select value={selectedEmotion2} onValueChange={setSelectedEmotion2} disabled={isSaved}>
                <SelectTrigger id="emotion2">
                  <SelectValue placeholder="Selecciona otra emoción" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((emo) => (
                    <SelectItem key={emo.value} value={emo.value}>
                      {t[emo.labelKey as keyof typeof t] || emo.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEmotion2 && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="intensity2">Intensidad: {emotionIntensity2}%</Label>
                  <Slider
                    id="intensity2"
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[emotionIntensity2]}
                    onValueChange={(value) => setEmotionIntensity2(value[0])}
                    disabled={isSaved}
                  />
                </div>
              )}
            </div>

            {/* Emotion 3 */}
            <div className="space-y-2 border-l-2 pl-4">
              <Label htmlFor="emotion3" className="text-sm font-medium">Tercera Emoción (opcional)</Label>
              <Select value={selectedEmotion3} onValueChange={setSelectedEmotion3} disabled={isSaved}>
                <SelectTrigger id="emotion3">
                  <SelectValue placeholder="Selecciona otra emoción" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((emo) => (
                    <SelectItem key={emo.value} value={emo.value}>
                      {t[emo.labelKey as keyof typeof t] || emo.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEmotion3 && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="intensity3">Intensidad: {emotionIntensity3}%</Label>
                  <Slider
                    id="intensity3"
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[emotionIntensity3]}
                    onValueChange={(value) => setEmotionIntensity3(value[0])}
                    disabled={isSaved}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="physicalReactions" className="font-semibold">4. Reacciones físicas (Qué sintió tu cuerpo)</Label>
            <Textarea
              id="physicalReactions"
              value={physicalReactions}
              onChange={(e) => setPhysicalReactions(e.target.value)}
              placeholder="¿Notaste tensión, molestias o cambios? Ej: Dolor de estómago, respiración acelerada..."
              disabled={isSaved}
            />
          </div>

          <div>
            <Label htmlFor="responseAction" className="font-semibold">5. Respuesta/acción (Qué hiciste)</Label>
            <Textarea
              id="responseAction"
              value={responseAction}
              onChange={(e) => setResponseAction(e.target.value)}
              placeholder="¿Cómo reaccionaste? Ej: 'Me quedé paralizada y luego trabajé sin parar hasta muy tarde'."
              disabled={isSaved}
            />
          </div>
          
          <div>
            <Label htmlFor="reflections" className="font-semibold">6. Mis Reflexiones</Label>
            <Textarea
              id="reflections"
              value={reflections}
              onChange={(e) => setReflections(e.target.value)}
              placeholder="¿Qué patrón reconoces? Por ejemplo: &quot;Siempre que me hacen un comentario crítico, pienso que no valgo, siento ansiedad y me sobreexijo&quot;.   Este ejercicio te ayuda a tomar distancia, ver tus reacciones con claridad, y empezar a transformar automatismos en elecciones conscientes. Tus emociones tienen sentido, y también pueden regularse. "
              disabled={isSaved}
            />
          </div>

          {!isSaved ? (
             <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar Registro
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Tu registro ha sido guardado.</p>
                </div>
                <Dialog open={showCompass} onOpenChange={setShowCompass}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-green-800 dark:text-green-200 mt-2">
                        <Compass className="mr-2 h-4 w-4" /> Ver mi Brújula de Estrés
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Brújula de Estrés</DialogTitle>
                      <DialogDescription>
                        Esta brújula visual muestra si la principal fuente de tu estrés fue interna, externa o una combinación de ambas.
                      </DialogDescription>
                    </DialogHeader>
                    <StressCompass sourceType={triggerSource} />
                  </DialogContent>
                </Dialog>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
