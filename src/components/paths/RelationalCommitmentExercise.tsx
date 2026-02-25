
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { RelationalCommitmentExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface RelationalCommitmentExerciseProps {
  content: RelationalCommitmentExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function RelationalCommitmentExercise({ content, pathId, onComplete }: RelationalCommitmentExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [values, setValues] = useState('');
  const [misalignedRelation, setMisalignedRelation] = useState('');
  const [commitmentPerson, setCommitmentPerson] = useState('');
  const [vulnerableBehavior, setVulnerableBehavior] = useState('');
  const [partToStrengthen, setPartToStrengthen] = useState('');
  const [blockingThoughts, setBlockingThoughts] = useState('');
  const [commitmentStatement, setCommitmentStatement] = useState('');
  const [weeklyMicroAction, setWeeklyMicroAction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setValues('');
    setMisalignedRelation('');
    setCommitmentPerson('');
    setVulnerableBehavior('');
    setPartToStrengthen('');
    setBlockingThoughts('');
    setCommitmentStatement('');
    setWeeklyMicroAction('');
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!weeklyMicroAction.trim()) {
        toast({ title: "Acción requerida", description: "Por favor, define tu microacción semanal.", variant: "destructive" });
        return;
    }
    
    const notebookContent = `
**Ejercicio: ${content.title}**

Pregunta: ¿Qué valores son importantes para ti en una relación saludable? | Respuesta: ${values || 'No especificado.'}
Pregunta: ¿Hay alguna relación actual que no esté alineada con estos valores? ¿Qué señales lo indican? | Respuesta: ${misalignedRelation || 'No especificado.'}
Pregunta: ¿Con quién te gustaría comprometerte a construir un vínculo más honesto y equilibrado? | Respuesta: ${commitmentPerson || 'No especificado.'}

Pregunta: ¿Cómo sueles actuar en relaciones cuando te sientes inseguro/a o vulnerable? | Respuesta: ${vulnerableBehavior || 'No especificado.'}
Pregunta: ¿Qué parte de ti te gustaría fortalecer para estar más presente emocionalmente? | Respuesta: ${partToStrengthen || 'No especificado.'}
Pregunta: ¿Qué pensamientos te frenan cuando quieres poner un límite o ser tú misma/o? | Respuesta: ${blockingThoughts || 'No especificado.'}

---
**MI COMPROMISO RELACIONAL PERSONAL:**
Pregunta: Declaración de compromiso | Respuesta: *${commitmentStatement}*

**Mi microacción para esta semana:**
Pregunta: ¿Qué pequeño gesto vas a hacer esta semana para cuidar ese vínculo? | Respuesta: ${weeklyMicroAction || 'No especificada.'}
`;
    addNotebookEntry({ title: `Mi Compromiso Relacional`, content: notebookContent, pathId, userId: user?.id });
    toast({ title: "Ejercicio Guardado", description: "Tu compromiso relacional se ha guardado en el cuaderno." });
    setIsSaved(true);
    onComplete();
  };
  
  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className="p-4 space-y-4 text-center">
            <Button onClick={next}>Crear mi compromiso <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: Elijo con quién construir</h4>
            <div className="space-y-2">
              <Label htmlFor="values">¿Qué valores son importantes para ti en una relación saludable?</Label>
              <Textarea id="values" value={values} onChange={e => setValues(e.target.value)} placeholder="Ej: respeto, apoyo, libertad, ternura..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="misaligned">¿Hay alguna relación actual que no esté alineada con estos valores? ¿Qué señales lo indican?</Label>
              <Textarea id="misaligned" value={misalignedRelation} onChange={e => setMisalignedRelation(e.target.value)} placeholder="Ejemplo: Me siento silenciada/o, me cuesta confiar, no me siento libre de expresar mis emociones…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commitment-person">¿Con quién te gustaría comprometerte a construir un vínculo más honesto y equilibrado?</Label>
              <p className="text-sm text-muted-foreground">Puede ser alguien con quien ya te relacionas o alguien con quien deseas cultivar algo nuevo.</p>
              <Textarea id="commitment-person" value={commitmentPerson} onChange={e => setCommitmentPerson(e.target.value)} />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: Cómo quiero estar presente</h4>
            <div className="space-y-2">
              <Label htmlFor="vulnerable-behavior">¿Cómo sueles actuar en relaciones cuando te sientes inseguro/a o vulnerable?</Label>
              <Textarea id="vulnerable-behavior" value={vulnerableBehavior} onChange={e => setVulnerableBehavior(e.target.value)} placeholder="Ej: Me cierro, actúo desde el miedo..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strengthen-part">¿Qué parte de ti te gustaría fortalecer para estar más presente emocionalmente?</Label>
              <Textarea id="strengthen-part" value={partToStrengthen} onChange={e => setPartToStrengthen(e.target.value)} placeholder="Ej: Confiar en que lo que siento importa..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blocking-thoughts">¿Qué pensamientos te frenan cuando quieres poner un límite o ser tú misma/o?</Label>
              <Textarea id="blocking-thoughts" value={blockingThoughts} onChange={e => setBlockingThoughts(e.target.value)} placeholder="Ej: 'Si soy honesta, se enfadará'..." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next} className="w-auto">Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Declaración de compromiso personal</h4>
             <p className="text-sm text-muted-foreground">Escribe una frase potente y verdadera que refleje cómo eliges vincularte contigo y con las personas que te rodean. Será tu ancla.</p>
            <div className="space-y-2">
              <Label htmlFor="commitment-statement">Mi compromiso relacional personal:</Label>
              <Textarea id="commitment-statement" value={commitmentStatement} onChange={e => setCommitmentStatement(e.target.value)} placeholder="Ej: Me comprometo a construir vínculos basados en el respeto y la honestidad. Me permito expresar mis necesidades con claridad, incluso cuando me da miedo hacerlo." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={next} disabled={!commitmentStatement.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 4: Microacción semanal</h4>
            <p className="text-sm text-muted-foreground">Elige una acción pequeña y concreta que te acerque a tu compromiso.</p>
            <div className="space-y-2">
              <Label htmlFor="micro-action">¿Qué pequeño gesto vas a hacer esta semana para cuidar ese vínculo?</Label>
              <Textarea id="micro-action" value={weeklyMicroAction} onChange={e => setWeeklyMicroAction(e.target.value)} placeholder="Ej: Poner un límite sin justificarme, agradecer su presencia..." />
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Compromiso</Button>
            </div>
          </form>
        );
      default:
        return (
           <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">Ejercicio finalizado y guardado!</h4>
                 <p className="text-muted-foreground">Recuerda… Las relaciones que realmente nutren no son muchas. Pero cuando existen… sostienen, inspiran y respetan. Y eso no se encuentra por casualidad: se cultiva con presencia y cuidado.</p>
                 <Button onClick={resetExercise} variant="outline">Practicar de nuevo</Button>
           </div>
        );
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
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
      <CardContent>
        {!isSaved ? renderStep() : (
            <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">Ejercicio finalizado y guardado!</h4>
                 <p className="text-muted-foreground">Recuerda… Las relaciones que realmente nutren no son muchas. Pero cuando existen… sostienen, inspiran y respetan. Y eso no se encuentra por casualidad: se cultiva con presencia y cuidado.</p>
                 <Button onClick={resetExercise} variant="outline" className="w-full">Practicar de nuevo</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
