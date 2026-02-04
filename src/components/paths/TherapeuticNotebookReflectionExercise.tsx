
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

function TherapeuticNotebookReflectionExercise({
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
    
    // Use the raw HTML from prompts directly to ensure correct formatting
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
    <div className="my-6">
        <div className="flex items-center gap-4 mt-6 mb-3">
            <h3 className="text-xl font-bold text-primary flex items-center gap-4">
                <NotebookText className="h-6 w-6" />
                <span>{content.title}</span>
            </h3>
            {content.audioUrl && (
                <audio
                src={content.audioUrl}
                controls
                controlsList="nodownload"
                className="h-8 max-w-[200px] sm:max-w-xs"
                />
            )}
        </div>
        
        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div className="space-y-2">
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.prompts.join('') }} />
            <Label htmlFor={`reflection-${pathId}`} className="sr-only">
              Tu reflexión
            </Label>
            <Textarea
              id={`reflection-${pathId}`}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Escribe aquí tu reflexión personal..."
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
    </div>
  );
}

export default TherapeuticNotebookReflectionExercise;
