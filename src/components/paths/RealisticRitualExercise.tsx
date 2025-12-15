
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import type { RealisticRitualExerciseContent } from '@/data/paths/pathTypes';
import { useFirestore, useUser } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


interface RealisticRitualExerciseProps {
  content: RealisticRitualExerciseContent;
  pathId: string;
}

export function RealisticRitualExercise({ content, pathId }: RealisticRitualExerciseProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const [habit, setHabit] = useState('');
  const [minVersion, setMinVersion] = useState('');
  const [link, setLink] = useState('');
  const [reminder, setReminder] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!habit || !minVersion || !link || !reminder) {
      toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos.', variant: 'destructive' });
      return;
    }
     if (!user?.id || !db) {
      toast({ title: 'Error', description: 'No se pudo guardar, usuario o DB no disponible.', variant: 'destructive'});
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Hábito que quiero mantener:*
${habit}

*Mi versión mínima viable:*
${minVersion}

*Lo vincularé a:*
${link}

*Para recordarlo o facilitarlo, voy a:*
${reminder}
    `;
    
    try {
        const notebookRef = collection(db, "users", user.id, "notebook_entries");
        await addDoc(notebookRef, {
            title: 'Mi Ritual Realista',
            content: notebookContent,
            pathId,
            ruta: 'Superar la Procrastinación y Crear Hábitos',
            timestamp: serverTimestamp(),
        });
        toast({ title: 'Ritual Guardado', description: 'Tu ritual ha sido guardado.' });
        setSaved(true);
    } catch (error) {
        console.error("Error saving realistic ritual to Firestore:", error);
        toast({ title: 'Error', description: 'No se pudo guardar el ritual.', variant: 'destructive'});
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {content.title}
        </CardTitle>
        {content.objective && (
            <CardDescription className="pt-2">{content.objective}</CardDescription>
        )}
        {content.audioUrl && (
            <div className="mt-4">
                <audio controls controlsList="nodownload" className="w-full">
                    <source src={content.audioUrl} type="audio/mp3" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-ritual">¿Qué hábito quiero mantener?</Label>
            <Textarea id="habit-ritual" value={habit} onChange={e => setHabit(e.target.value)} disabled={saved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-version">¿Cuál es su versión mínima viable?</Label>
            <Textarea
              id="min-version"
              value={minVersion}
              onChange={e => setMinVersion(e.target.value)}
              disabled={saved}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">¿Cuándo o con qué lo vincularás?</Label>
            <Textarea id="link" value={link} onChange={e => setLink(e.target.value)} disabled={saved} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder">¿Qué puedo hacer para recordarlo o facilitarlo?</Label>
            <Textarea
              id="reminder"
              value={reminder}
              onChange={e => setReminder(e.target.value)}
              disabled={saved}
            />
          </div>
          {!saved ? (
            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar mi ritual</Button>
          ) : (
             <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">¡Ritual guardado!</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
