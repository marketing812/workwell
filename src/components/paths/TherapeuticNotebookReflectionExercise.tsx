
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
import { Checkbox } from '@/components/ui/checkbox';

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

  const [overloadSignals, setOverloadSignals] = useState<Record<string, boolean>>({});
  const [otherOverloadSignal, setOtherOverloadSignal] = useState('');

  const cognitiveSignals = [
    { id: 'cog-concentration', label: 'Me cuesta concentrarme' },
    { id: 'cog-loop', label: 'Tengo pensamientos en bucle' },
    { id: 'cog-overwhelmed', label: 'Siento que no llego a todo, por más que haga' },
    { id: 'cog-perfectionism', label: 'Me pongo muy autoexigente o perfeccionista' },
    { id: 'cog-decisions', label: 'Me cuesta tomar decisiones' },
  ];

  const handleOverloadSignalChange = (id: string, checked: boolean) => {
    setOverloadSignals(prev => ({...prev, [id]: checked}));
  };

  const handleSaveReflection = async (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim() && !content.showOverloadSignals) { // Solo requerir reflexión si no hay señales de sobrecarga
      toast({
        title: "Reflexión Incompleta",
        description: "Por favor, escribe tu reflexión antes de guardar.",
        variant: "destructive",
      });
      return;
    }
    
    const promptsHtml = content.prompts.join('');
    
    let fullContent = `
**${content.title}**

<div class="prose dark:prose-invert max-w-none">
    ${promptsHtml}
</div>

**Mi reflexión:**
${reflection}
    `;

    if (content.showOverloadSignals) {
        const selectedCognitiveSignals = cognitiveSignals
            .filter(signal => overloadSignals[signal.id])
            .map(signal => signal.label);
        
        if (overloadSignals['cog-other'] && otherOverloadSignal) {
            selectedCognitiveSignals.push(`Señales propias: ${otherOverloadSignal}`);
        }
        if (selectedCognitiveSignals.length > 0) {
            fullContent += `

**Señales comunes de sobrecarga (Cognitivas / mentales):**
${selectedCognitiveSignals.map(s => `- ${s}`).join('\n')}
            `;
        }
    }

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

  const OverloadSignalsSection = () => (
    <div className="space-y-2 pt-4 border-t mt-4">
        <Label className="font-semibold">Señales comunes de sobrecarga: (Selecciona todas las que reconozcas en ti. También puedes añadir otras en el campo libre.)</Label>
        <div className='pl-2'>
            <Label className="font-medium">Cognitivas / mentales</Label>
            <div className="pl-4 space-y-2 mt-1">
            {cognitiveSignals.map(signal => (
                <div key={signal.id} className="flex items-center space-x-2">
                <Checkbox
                    id={signal.id}
                    checked={overloadSignals[signal.id] || false}
                    onCheckedChange={(checked) => handleOverloadSignalChange(signal.id, checked as boolean)}
                    disabled={isSaved}
                />
                <Label htmlFor={signal.id} className="font-normal">{signal.label}</Label>
                </div>
            ))}
            <div className="flex items-center space-x-2">
                <Checkbox
                id="cog-other"
                checked={overloadSignals['cog-other'] || false}
                onCheckedChange={(checked) => handleOverloadSignalChange('cog-other', checked as boolean)}
                disabled={isSaved}
                />
                <Label htmlFor="cog-other" className="font-normal">Señales propias</Label>
            </div>
            {overloadSignals['cog-other'] && (
                <Textarea 
                value={otherOverloadSignal}
                onChange={e => setOtherOverloadSignal(e.target.value)}
                placeholder="Describe tus propias señales cognitivas..."
                className="ml-6"
                disabled={isSaved}
                />
            )}
            </div>
        </div>
    </div>
  );
  
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
           <div className="prose dark:prose-invert max-w-none pt-2 text-base" dangerouslySetInnerHTML={{ __html: content.prompts.join('') }} />
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

          {content.showOverloadSignals && <OverloadSignalsSection />}

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
