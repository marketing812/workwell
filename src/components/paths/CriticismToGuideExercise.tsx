"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CriticismToGuideExerciseContent } from '@/data/paths/pathTypes';
import { Checkbox } from '../ui/checkbox';
import { useUser } from '@/contexts/UserContext';

interface CriticismToGuideExerciseProps {
  content: CriticismToGuideExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const distortionOptions = [
    { value: 'catastrophism', label: 'Catastrofismo' },
    { value: 'dichotomous', label: 'Pensamiento dicotómico (todo o nada)' },
    { value: 'mind_reading', label: 'Adivinación del pensamiento o futuro' },
    { value: 'personalization', label: 'Personalización' },
];

export function CriticismToGuideExercise({ content, pathId, onComplete }: CriticismToGuideExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [criticalPhrase, setCriticalPhrase] = useState('');
  const [hiddenObjective, setHiddenObjective] = useState('');
  const [distortion, setDistortion] = useState('');
  const [reformulation, setReformulation] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [checklist, setChecklist] = useState({ helps: false, respects: false, energizes: false });

  const handleChecklistChange = (key: keyof typeof checklist, checked: boolean) => {
    setChecklist(prev => ({...prev, [key]: checked}));
  };

  const objectiveOptions = [
    'Mejorar un resultado.', 'Evitar un error.', 'Ganar aprobación o reconocimiento.', 'Cumplir con mis valores o principios.',
    'Evitar que me rechacen o critiquen.', 'Protegerme de una decepción.', 'Sentirme seguro/a antes de actuar.', 'Demostrar que soy capaz.',
    'Mantener el control de la situación.', 'Prevenir que vuelva a ocurrir algo desagradable.', 'Evitar perder una oportunidad.',
    'Mantener una buena imagen de mí ante los demás.', 'Evitar hacer daño a alguien.', 'Cumplir con lo que creo que “debería” hacer.'
  ];

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!criticalPhrase || !hiddenObjective || !reformulation) {
        toast({ title: 'Campos incompletos', variant: 'destructive' });
        return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi frase crítica:*
"${criticalPhrase}"

*El objetivo oculto era:*
${hiddenObjective}

*Mi frase reformulada como guía:*
"${reformulation}"
    `;
    addNotebookEntry({ title: 'Transformación de Crítica a Guía', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Ejercicio Guardado', description: 'Tu transformación ha sido guardada.' });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana3tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="critical-phrase" className="font-semibold">Detecta tu frase crítica</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Piensa en una frase que te hayas dicho recientemente y que te haya hecho sentir mal. Escríbela tal y como la piensas, sin suavizarla.  <br>Ejemplos de frases críticas: <ul><li>Nunca hago nada bien.</li><li>Tendría que haberlo hecho perfecto.</li><li>Soy un desastre.</li></ul>" }} />
            <Textarea id="critical-phrase" value={criticalPhrase} onChange={e => setCriticalPhrase(e.target.value)} disabled={isSaved} placeholder="Escribe aquí tu frase crítica…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hidden-objective" className="font-semibold">Identifica el objetivo oculto </Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Detrás de la crítica suele haber un deseo de mejorar, evitar un error o protegerte de algo. Identificarlo es clave para poder reformular la frase. <br>Ejemplo: <ul><li>Frase crítica: Nunca hago nada bien.</li><li>Objetivo oculto: Quiero mejorar en lo que hago.</li></ul>" }} />
            <Select onValueChange={setHiddenObjective} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Selecciona cuál crees que es el objetivo oculto de tu frase crítica…" /></SelectTrigger>
              <SelectContent>
                {objectiveOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                <SelectItem value="otro">Otro...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="distortion-select">Identifica la distorsión</Label>
            <Select onValueChange={setDistortion} value={distortion} disabled={isSaved}>
                <SelectTrigger><SelectValue placeholder="Elige una distorsión..."/></SelectTrigger>
                <SelectContent>
                    {distortionOptions.map(opt => <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reformulation-blocking" className="font-semibold">Reformula en guía</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Ahora transforma tu frase crítica en una frase que mantenga la intención de mejora, pero sin atacarte.<br>Ejemplos: <ul><li>Antes: Nunca hago nada bien. → Después: A veces me equivoco, pero puedo mejorar paso a paso.</li><li>Antes: Tendría que haberlo hecho perfecto. → Después: La próxima vez puedo prepararme mejor y pedir ayuda si la necesito.</li></ul>" }} />
            <Textarea id="reformulation-blocking" value={reformulation} onChange={e => setReformulation(e.target.value)} disabled={isSaved} placeholder="Escribe aquí tu frase reformulada…" />
          </div>
           <div className="space-y-2">
              <Label className="font-semibold">Revisión y anclaje</Label>
              <p className="text-sm text-muted-foreground">Lee tu frase reformulada y reflexiona:</p>
              <div className="flex items-center space-x-2">
                  <Checkbox id="check-helps" checked={checklist.helps} onCheckedChange={(checked) => handleChecklistChange('helps', !!checked)} disabled={isSaved} />
                  <Label htmlFor="check-helps" className="font-normal">Me ayuda a mejorar.</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="check-respects" checked={checklist.respects} onCheckedChange={(checked) => handleChecklistChange('respects', !!checked)} disabled={isSaved} />
                  <Label htmlFor="check-respects" className="font-normal">Me habla con respeto.</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="check-energizes" checked={checklist.energizes} onCheckedChange={(checked) => handleChecklistChange('energizes', !!checked)} disabled={isSaved} />
                  <Label htmlFor="check-energizes" className="font-normal">Me deja con energía para actuar.</Label>
              </div>
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Frase Guía</Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Guardado.</p>
            </div>
          )}
          <p className="text-xs text-center text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: "Convertir tu crítica en guía es un acto de liderazgo interno: eliges ser una voz que <b>impulsa</b>, no que <b>derriba</b>. Cuanto más practiques, más natural será tratarte con firmeza y respeto al mismo tiempo." }} />
        </form>
      </CardContent>
    </Card>
  );
}
