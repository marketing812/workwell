"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { InternalTensionsMapExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface InternalTensionsMapExerciseProps {
  content: InternalTensionsMapExerciseContent;
  pathId: string;
  onComplete: () => void;
}

const emotionOptions = [
    { id: 'ansiedad', label: 'Ansiedad' },
    { id: 'culpa', label: 'Culpa' },
    { id: 'alivio', label: 'Alivio' },
    { id: 'tristeza', label: 'Tristeza' },
    { id: 'enojo', label: 'Enojo' },
    { id: 'verguenza', label: 'Vergüenza' },
    { id: 'miedo', label: 'Miedo' },
    { id: 'frustracion', label: 'Frustración' },
];

export function InternalTensionsMapExercise({ content, pathId, onComplete }: InternalTensionsMapExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [situation, setSituation] = useState('');
    const [thought, setThought] = useState('');
    const [emotions, setEmotions] = useState<Record<string, boolean>>({});
    const [otherEmotion, setOtherEmotion] = useState('');
    const [action, setAction] = useState('');
    const [alignment, setAlignment] = useState<'alineado/a' | 'parcialmente' | 'desalineado/a' | ''>('');
    const [needed, setNeeded] = useState('');

    const handleSave = () => {
        const selectedEmotionLabels = emotionOptions
            .filter(opt => emotions[opt.id])
            .map(opt => opt.label);
        
        if (emotions['otra'] && otherEmotion) {
            selectedEmotionLabels.push(otherEmotion);
        }

        const finalEmotions = selectedEmotionLabels.join(', ');

        const notebookContent = `
**Ejercicio: ${content.title}**

**Situación:** ${situation}
**Pensamiento:** ${thought}
**Emoción:** ${finalEmotions || 'No especificada'}
**Acción:** ${action}
**Alineación:** ${alignment}
**¿Qué habría necesitado?:** ${needed}
        `;
        addNotebookEntry({ title: 'Mapa de Tensiones Internas', content: notebookContent, pathId, userId: user?.id });
        toast({ title: 'Mapa Guardado' });
        onComplete();
    };

    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader><CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>{content.objective && <CardDescription className="pt-2">{content.objective}
                {content.audioUrl && (
                    <div className="mt-4">
                        <audio controls controlsList="nodownload" className="w-full">
                            <source src={content.audioUrl} type="audio/mp3" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )}
            </CardDescription>}</CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>¿Qué ocurrió?</Label><Textarea value={situation} onChange={e => setSituation(e.target.value)} /></div>
                <div className="space-y-2"><Label>¿Qué te dijiste?</Label><Textarea value={thought} onChange={e => setThought(e.target.value)} /></div>
                <div className="space-y-2">
                    <Label>Identifica la emoción dominante (puedes marcar varias)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {emotionOptions.map(e => (
                            <div key={e.id} className="flex items-center gap-2">
                                <Checkbox id={`emo-${e.id}`} checked={emotions[e.id] || false} onCheckedChange={c => setEmotions(p => ({...p, [e.id]: !!c}))} />
                                <Label htmlFor={`emo-${e.id}`} className="font-normal">{e.label}</Label>
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center gap-2 pt-2">
                        <Checkbox id="emo-otra" checked={emotions['otra'] || false} onCheckedChange={c => setEmotions(p => ({...p, otra: !!c}))} />
                        <Label htmlFor="emo-otra" className="font-normal">Otra:</Label>
                    </div>
                    {emotions['otra'] && (
                        <Textarea value={otherEmotion} onChange={e => setOtherEmotion(e.target.value)} placeholder="Describe la otra emoción..." className="ml-6 mt-2" />
                    )}
                </div>
                <div className="space-y-2"><Label>¿Qué hiciste finalmente?</Label><Textarea value={action} onChange={e => setAction(e.target.value)} /></div>
                <div className="space-y-2"><Label>Evalúa la alineación</Label>
                    <RadioGroup value={alignment} onValueChange={v => setAlignment(v as any)}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="alineado/a" id="align-1" /><Label htmlFor="align-1">100% alineado/a</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="parcialmente" id="align-2" /><Label htmlFor="align-2">Parcialmente alineado/a</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="desalineado/a" id="align-3" /><Label htmlFor="align-3">Desalineado/a</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2"><Label>¿Qué hubiera necesitado para actuar de forma más coherente?</Label><Textarea value={needed} onChange={e => setNeeded(e.target.value)} /></div>
                <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Guardar en mi cuaderno</Button>
            </CardContent>
        </Card>
    );
}