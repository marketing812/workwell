"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SmallDecisionsLogExerciseContent } from '@/data/paths/pathTypes';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface DecisionLog {
    decision: string;
    choiceType: 'querer' | 'deber' | 'mixto' | '';
    reason: string;
    aftermath: string;
    otherAftermath: string;
    nextTime: string;
}

const aftermathOptions = [
    { value: 'Satisfacción', label: 'Satisfacción' },
    { value: 'Alivio', label: 'Alivio' },
    { value: 'Frustración', label: 'Frustración' },
    { value: 'Culpa', label: 'Culpa' },
    { value: 'Orgullo', label: 'Orgullo' },
    { value: 'Desconexión', label: 'Desconexión' },
];

interface SmallDecisionsLogExerciseProps {
  content: SmallDecisionsLogExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export function SmallDecisionsLogExercise({ content, pathId, onComplete }: SmallDecisionsLogExerciseProps) {
    const { toast } = useToast();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState<DecisionLog[]>(() =>
        Array.from({ length: 2 }, () => ({ decision: '', choiceType: '', reason: '', aftermath: '', otherAftermath: '', nextTime: '' }))
    );

    const handleLogChange = (index: number, field: keyof DecisionLog, value: string) => {
        const newLogs = [...logs];
        (newLogs[index] as any)[field] = value;
        if (field === 'aftermath' && value !== 'Otro') {
          newLogs[index].otherAftermath = '';
        }
        setLogs(newLogs);
    };
    
    const resetExercise = () => {
        setStep(0);
        setLogs(Array.from({ length: 2 }, () => ({ decision: '', choiceType: '', reason: '', aftermath: '', otherAftermath: '', nextTime: '' })));
    };

    const handleSave = () => {
        const filledLogs = logs.filter(log => log.decision.trim() !== '');
        if (filledLogs.length === 0) {
            toast({ title: "Sin decisiones", description: "Anota al menos una decisión para guardar el registro.", variant: 'destructive'});
            return;
        }

        let notebookContent = `**Ejercicio: ${content.title}**\n\n`;
        filledLogs.forEach((log, index) => {
            const finalAftermath = log.aftermath === 'Otro' ? log.otherAftermath : log.aftermath;
            notebookContent += `**Decisión ${index + 1}:** ${log.decision}\n`;
            notebookContent += `- Elegí desde: ${log.choiceType || 'No especificado'}\n`;
            notebookContent += `- Razón: ${log.reason || 'No especificado'}\n`;
            notebookContent += `- Cómo me sentí: ${finalAftermath || 'No especificado'}\n`;
            notebookContent += `- Próxima vez: ${log.nextTime || 'No especificado'}\n\n`;
        });
        addNotebookEntry({ title: 'Registro de Decisiones Pequeñas', content: notebookContent, pathId: pathId, userId: user?.id });
        toast({ title: 'Registro Guardado' });
        onComplete();
        setStep(2);
    };
    
    const renderStep = () => {
        switch(step) {
            case 0:
                return (
                    <div className="p-4 text-center space-y-4">
                        <p>Cada día tomas cientos de decisiones. Algunas pequeñas, otras grandes… pero muchas de ellas definen si estás siendo fiel a ti o no. En este ejercicio vas a entrenar tu mirada interna. No para juzgarte, sino para entender desde dónde eliges.</p>
                        <Button onClick={() => setStep(1)}>Comenzar mi registro <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4 space-y-6 animate-in fade-in-0 duration-500">
                        <h4 className="font-semibold text-lg">Registra 2 decisiones de hoy</h4>
                        {logs.map((log, index) => (
                             <div key={index} className="p-3 border rounded-md space-y-3 bg-background">
                                <Label htmlFor={`decision-${index}`}>Decisión {index + 1}:</Label>
                                <Textarea id={`decision-${index}`} value={log.decision} onChange={e => handleLogChange(index, 'decision', e.target.value)} />
                                
                                <Label>¿Actuaste desde el “querer” o el “deber”?</Label>
                                <RadioGroup value={log.choiceType} onValueChange={v => handleLogChange(index, 'choiceType', v as any)} className="space-y-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="querer" id={`choice-${index}-q`}/><Label htmlFor={`choice-${index}-q`} className="font-normal">Querer (autenticidad, deseo, conexión)</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="deber" id={`choice-${index}-d`}/><Label htmlFor={`choice-${index}-d`} className="font-normal">Deber (exigencia, miedo, costumbre)</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="mixto" id={`choice-${index}-m`}/><Label htmlFor={`choice-${index}-m`} className="font-normal">Mixto (una mezcla – cuéntalo brevemente)</Label></div>
                                </RadioGroup>
                                
                                <Label htmlFor={`reason-${index}`}>¿Qué te llevó a elegir así?</Label>
                                <Textarea id={`reason-${index}`} value={log.reason} onChange={e => handleLogChange(index, 'reason', e.target.value)} placeholder={'Ejemplo: \n"Decisión: Ir a cenar con mi familia. \nLa tomé más desde el deber, porque estaba cansada pero sentía que tenía que estar presente. Me costó disfrutarlo."'} />

                                <Label>¿Cómo te sentiste después?</Label>
                                <RadioGroup value={log.aftermath} onValueChange={v => handleLogChange(index, 'aftermath', v as any)} className="space-y-2">
                                    {aftermathOptions.map(opt => (
                                        <div key={opt.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={opt.value} id={`aftermath-${index}-${opt.value}`} />
                                            <Label htmlFor={`aftermath-${index}-${opt.value}`} className="font-normal">{opt.label}</Label>
                                        </div>
                                    ))}
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Otro" id={`aftermath-${index}-otro`} />
                                        <Label htmlFor={`aftermath-${index}-otro`} className="font-normal">Otro (escribe tu emoción)</Label>
                                    </div>
                                </RadioGroup>
                                {log.aftermath === 'Otro' && (
                                    <Textarea value={log.otherAftermath} onChange={e => handleLogChange(index, 'otherAftermath', e.target.value)} className="ml-6 mt-2" placeholder="Escribe aquí cómo te sentiste..." />
                                )}
                                
                                <Label htmlFor={`nextTime-${index}`}>¿Qué harías distinto la próxima vez?</Label>
                                <Textarea id={`nextTime-${index}`} value={log.nextTime} onChange={e => handleLogChange(index, 'nextTime', e.target.value)} placeholder="Ejemplo: Después me sentí frustrada porque necesitaba descansar. La próxima vez me gustaría proponer un encuentro más breve o en otro momento." />
                            </div>
                        ))}
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={() => setStep(0)} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Atrás</Button>
                            <Button onClick={handleSave} className="w-auto">
                                <Save className="mr-2 h-4 w-4"/> Guardar Registro
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                 return (
                    <div className="p-4 text-center space-y-4">
                        <CheckCircle className="h-10 w-10 text-primary mx-auto"/>
                        <h4 className="font-semibold text-lg">Registro Guardado</h4>
                        <p className="text-sm text-muted-foreground">Este registro no es para ser perfecto. Es para ser más consciente. A veces elegimos desde el deber. Otras, desde el querer. Lo importante es que tú puedas distinguirlo… y poco a poco recuperar la brújula.</p>
                        <Button onClick={resetExercise} variant="outline">Hacer otro registro</Button>
                    </div>
                );
            default: return null;
        }
    };
    
    return (
        <Card className="bg-muted/30 my-6 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
                {content.objective && 
                    <CardDescription className="pt-2">
                        {content.objective}
                        {content.audioUrl && (
                            <div className="mt-4">
                                <audio controls controlsList="nodownload" className="w-full">
                                    <source src={content.audioUrl} type="audio/mp3" />
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                        )}
                    </CardDescription>
                }
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
        </Card>
    );
}