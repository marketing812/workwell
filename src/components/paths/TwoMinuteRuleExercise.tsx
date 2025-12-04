
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import type { TwoMinuteRuleExerciseContent } from '@/data/paths/pathTypes';

interface TwoMinuteRuleExerciseProps {
  content: TwoMinuteRuleExerciseContent;
  pathId: string;
}

export function TwoMinuteRuleExercise({ content, pathId }: TwoMinuteRuleExerciseProps) {
  const { toast } = useToast();
  const [task, setTask] = useState('');
  const [twoMinVersion, setTwoMinVersion] = useState('');
  const [when, setWhen] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!task || !twoMinVersion || !when) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, rellena todos los campos.',
        variant: 'destructive',
      });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Tarea que pospongo:*
${task}

*Mi versión de 2 minutos es:*
${twoMinVersion}

*Me comprometo a hacerlo:*
${when}
    `;
    addNotebookEntry({ title: 'Mi Compromiso de 2 Minutos', content: notebookContent, pathId });
    toast({ title: 'Compromiso Guardado', description: 'Tu plan de 2 minutos ha sido guardado.' });
    setSaved(true);
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">¿Qué tarea estás posponiendo?</Label>
            <Textarea id="task" value={task} onChange={e => setTask(e.target.value)} disabled={saved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twoMin">¿Cuál sería su versión de 2 minutos?</Label>
            <Textarea
              id="twoMin"
              value={twoMinVersion}
              onChange={e => setTwoMinVersion(e.target.value)}
              disabled={saved}
            />
          </div>
          <div className="space-y-2">
            <Label>¿Cuándo lo harás?</Label>
            <RadioGroup value={when} onValueChange={setWhen} disabled={saved}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Ahora" id="now" />
                <Label htmlFor="now" className="font-normal">
                  Ahora
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="En los próximos 10 minutos" id="in10" />
                <Label htmlFor="in10" className="font-normal">
                  En los próximos 10 minutos
                </Label>
              </div>
            </RadioGroup>
          </div>
          {!saved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar mi compromiso
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">¡Compromiso guardado!</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
