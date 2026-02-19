"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, CheckCircle, NotebookText } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { TherapeuticNotebookReflection } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TherapeuticNotebookReflectionExercise({
  content,
  pathId,
  pathTitle,
  onComplete,
}: {
  content: TherapeuticNotebookReflection;
  pathId: string;
  pathTitle: string;
  onComplete: () => void;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveReflection = async (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({
        title: "Reflexión Incompleta",
        description: "Por favor, escribe tu reflexión antes de guardar.",
        variant: "destructive",
      });
      return;
    }
    
    const promptsHtml = content.prompts.join('');
    
    const fullContent = `
**${content.title}**

<div class="prose dark:prose-invert max-w-none">
    ${promptsHtml}
</div>

**Mi reflexión:**
${reflection}
    `;

    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: fullContent,
      pathId: pathId,
      ruta: pathTitle,
      userId: user?.id,
    });
    
    toast({
      title: "Reflexión Guardada",
      description: "Tu reflexión ha sido guardada en el Cuaderno Terapéutico.",
    });
    setIsSaved(true);
    onComplete();
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center gap-4">
          <NotebookText className="h-6 w-6" />
          <span>{content.title}</span>
        </CardTitle>
        {content.audioUrl && (
          <div className="mt-4">
            <audio
              src={content.audioUrl}
              controls
              controlsList="nodownload"
              className="w-full"
            />
          </div>
        )}
         <CardDescription asChild>
           <div className="prose prose-sm dark:prose-invert max-w-none pt-2" dangerouslySetInnerHTML={{ __html: content.prompts.join('') }} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`reflection-${pathId}`} className="font-semibold">
              Escribe aquí tu reflexión personal:
            </Label>
            <Textarea
              id={`reflection-${pathId}`}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Lo que he descubierto esta semana es..."
              rows={5}
              disabled={isSaved}
            />
          </div>
          {!isSaved ? (
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar Reflexión en mi Cuaderno
            </Button>
          ) : (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p className="font-medium">Tu reflexión ha sido guardada.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
