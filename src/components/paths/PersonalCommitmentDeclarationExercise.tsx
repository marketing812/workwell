"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { PersonalCommitmentDeclarationExerciseContent } from '@/data/paths/pathTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/UserContext';

interface PersonalCommitmentDeclarationExerciseProps {
  content: PersonalCommitmentDeclarationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const valuesList = [
    'Autenticidad', 'Honestidad', 'Respeto', 'Cuidado propio', 'Amor', 'Familia', 'Amistad',
    'Justicia', 'Responsabilidad', 'Libertad', 'Creatividad', 'Propósito vital', 'Aprendizaje',
    'Empatía', 'Perseverancia', 'Integridad', 'Compasión', 'Equilibrio', 'Gratitud',
    'Generosidad', 'Lealtad', 'Coraje', 'Cooperación', 'Transparencia', 'Sostenibilidad',
    'Conexión', 'Autonomía', 'Paz interior', 'Solidaridad', 'Humildad', 'Tolerancia'
];

export function PersonalCommitmentDeclarationExercise({ content, pathId, onComplete }: PersonalCommitmentDeclarationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
  const [otherValue, setOtherValue] = useState('');
  const [commitments, setCommitments] = useState({ elijo: '', meComprometo: '', decido: '' });
  const [reminder, setReminder] = useState({ type: '', custom: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Valores inspiradores:*
${Object.keys(selectedValues).filter(k => selectedValues[k] && k !== 'other').join(', ')}${selectedValues['other'] && otherValue ? `, ${otherValue}`: ''}

*Declaración de compromiso:*
- Elijo: ${commitments.elijo}
- Me comprometo a: ${commitments.meComprometo}
- Decido: ${commitments.decido}

*Recordatorio:*
${reminder.type === 'Otro' ? reminder.custom : reminder.type}
    `;
    addNotebookEntry({ title: 'Mi Declaración de Compromiso Personal', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Declaración Guardada', description: 'Tu declaración de compromiso ha sido guardada.' });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">
                {content.objective}
                <div className="mt-4">
                    <audio controls controlsList="nodownload" className="w-full">
                        <source src="https://workwellfut.com/audios/ruta10/tecnicas/Ruta10semana4tecnica2.mp3" type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 1: Inspírate en tus valores</h4>
            <p className="text-sm text-muted-foreground">Piensa en momentos donde actuaste alineado/a contigo mismo/a y te sentiste orgulloso/a. ¿Qué valores estaban presentes?   Selecciona los que mejor te representen. (Puedes elegir más de uno)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {valuesList.map(v => (
                <div key={v} className="flex items-center space-x-2">
                  <Checkbox id={`val-${v}`} checked={!!selectedValues[v]} onCheckedChange={c => setSelectedValues(p => ({ ...p, [v]: !!c }))} disabled={isSaved} />
                  <Label htmlFor={`val-${v}`} className="font-normal text-xs">{v}</Label>
                </div>
              ))}
               <div className="flex items-center space-x-2">
                  <Checkbox id="val-other" checked={!!selectedValues['other']} onCheckedChange={c => setSelectedValues(p => ({ ...p, ['other']: !!c }))} disabled={isSaved} />
                  <Label htmlFor="val-other" className="font-normal text-xs">Otros</Label>
                </div>
            </div>
             {selectedValues['other'] && (
                <Textarea value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder="Especifica otros valores" className="mt-2" disabled={isSaved} />
            )}
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 2: Redacta tus frases</h4>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{__html: 'Escribe tres frases que empiecen por: “Elijo…”, “Me comprometo a…” , “Decido…” <p>Ejemplos: <br>Elijo hacerme cargo de lo que siento, sin culparme por sentirlo.<br>Me comprometo a no intentar con todo, sino con lo que elijo priorizar. <br>Decido respetar mis límites y actuar desde mi energía disponible. </p>'}} />
            <Textarea value={commitments.elijo} onChange={e => setCommitments(p => ({ ...p, elijo: e.target.value }))} placeholder="Elijo..." disabled={isSaved} />
            <Textarea value={commitments.meComprometo} onChange={e => setCommitments(p => ({ ...p, meComprometo: e.target.value }))} placeholder="Me comprometo a..." disabled={isSaved} />
            <Textarea value={commitments.decido} onChange={e => setCommitments(p => ({ ...p, decido: e.target.value }))} placeholder="Decido..." disabled={isSaved} />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Paso 3: Plan de recordatorio</h4>
            <Select onValueChange={v => setReminder(p => ({ ...p, type: v }))} disabled={isSaved}>
              <SelectTrigger><SelectValue placeholder="Elige un recordatorio..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Nota en el móvil">Nota en el móvil</SelectItem>
                <SelectItem value="Post-it en tu escritorio">Post-it en tu escritorio</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {reminder.type === 'Otro' && <Textarea value={reminder.custom} onChange={e => setReminder(p => ({ ...p, custom: e.target.value }))} placeholder="Describe tu recordatorio personalizado" disabled={isSaved} />}
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Declaración</Button>
          ) : (
            <>
              <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Guardado.</p>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4" dangerouslySetInnerHTML={{ __html: "Tu declaración puede evolucionar contigo. Lo importante es que te recuerde cada día que <b>tu responsabilidad es una elección consciente, no una carga impuesta.</b>" }} />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
