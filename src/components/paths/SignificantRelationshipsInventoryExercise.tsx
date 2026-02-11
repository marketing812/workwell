"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, CheckCircle, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { SignificantRelationshipsInventoryExerciseContent } from '@/data/paths/pathTypes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/contexts/UserContext';


interface SignificantRelationshipsInventoryExerciseProps {
  content: SignificantRelationshipsInventoryExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function SignificantRelationshipsInventoryExercise({ content, pathId, onComplete }: SignificantRelationshipsInventoryExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);

  const [sustainPerson, setSustainPerson] = useState('');
  const [sustainAction, setSustainAction] = useState('');
  const [inspirePerson, setInspirePerson] = useState('');
  const [inspireAspect, setInspireAspect] = useState('');
  const [respectPerson, setRespectPerson] = useState('');
  const [respectAction, setRespectAction] = useState('');
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');
  const [reflection3, setReflection3] = useState('');
  const [microAction, setMicroAction] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const next = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : 0);
  const resetExercise = () => {
    setStep(0);
    setSustainPerson('');
    setSustainAction('');
    setInspirePerson('');
    setInspireAspect('');
    setRespectPerson('');
    setRespectAction('');
    setReflection1('');
    setReflection2('');
    setReflection3('');
    setMicroAction('');
    setIsCompleted(false);
  };
  
  const handleSave = () => {
    if (step === 4 && !microAction.trim()) {
        toast({ title: "Acción requerida", description: "Por favor, define tu microacción semanal.", variant: "destructive" });
        return;
    }
    
    const notebookContent = `
**${content.title}**

**Persona que me sostiene:** ${sustainPerson || 'No especificado.'}
*¿Cómo me sostiene?:* ${sustainAction || 'No especificado.'}

**Persona que me inspira:** ${inspirePerson || 'No especificado.'}
*¿Qué aspecto me inspira?:* ${inspireAspect || 'No especificado.'}

**Persona que respeta mi ritmo:** ${respectPerson || 'No especificado.'}
*¿Cómo respeta mi ritmo?:* ${respectAction || 'No especificado.'}

---
**Reflexión Guiada:**
- *¿Relación que necesito revisar?:* ${reflection1 || 'No respondido.'}
- *¿Qué tipo de apoyo echo en falta?:* ${reflection2 || 'No respondido.'}
- *¿Con quién me gustaría construir un vínculo así?:* ${reflection3 || 'No respondido.'}

---
**Mi Microacción Semanal:**
${microAction}
    `;
    
    addNotebookEntry({
        title: 'Inventario de Relaciones Significativas',
        content: notebookContent,
        pathId: pathId,
        userId: user?.id,
    });

    toast({ title: "Ejercicio Finalizado y Guardado", description: "Tu inventario de relaciones se ha guardado en el cuaderno." });
    setIsCompleted(true);
    onComplete();
  };
  
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="p-4 space-y-4 text-center">
            <Button onClick={next}>Comenzar inventario <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: ¿Quién te sostiene?</h4>
            <p className="text-sm text-muted-foreground">Piensa en personas que están ahí cuando las necesitas. No necesariamente te solucionan la vida, pero te escuchan, te contienen o te tranquilizan sin exigencias.</p>
            <div className="space-y-2">
              <Label htmlFor="sustain-person">Nombre o relación:</Label>
              <Textarea id="sustain-person" value={sustainPerson} onChange={e => setSustainPerson(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sustain-action">¿Qué hace o dice que te hace sentir acompañado/a?</Label>
              <Textarea id="sustain-action" value={sustainAction} onChange={e => setSustainAction(e.target.value)} placeholder="Ej: Me llama cuando sabe que estoy mal. Me escucha sin juzgar." />
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
            <h4 className="font-semibold text-lg text-primary">Paso 2: ¿Quién te inspira?</h4>
            <p className="text-sm text-muted-foreground">Ahora piensa en alguien que te haga querer ser tu mejor versión. Una persona que te motive, te dé ejemplo, te contagie ganas de superarte o represente valores que admiras.</p>
            <div className="space-y-2">
              <Label htmlFor="inspire-person">Nombre o relación:</Label>
              <Textarea id="inspire-person" value={inspirePerson} onChange={e => setInspirePerson(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspire-aspect">¿Qué aspectos de esa persona te inspiran? ¿Cómo influye en ti?</Label>
              <Textarea id="inspire-aspect" value={inspireAspect} onChange={e => setInspireAspect(e.target.value)} placeholder="Ej: Su forma de ver la vida. Cómo enfrenta las dificultades." />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: ¿Quién respeta tu ritmo?</h4>
            <p className="text-sm text-muted-foreground">Hay personas que no te empujan ni te exigen. Que aceptan tus tiempos, que no te juzgan aunque estés pasando por un momento difícil. Que están, sin presionar.</p>
            <div className="space-y-2">
              <Label htmlFor="respect-person">Nombre o relación:</Label>
              <Textarea id="respect-person" value={respectPerson} onChange={e => setRespectPerson(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="respect-action">¿Cómo notas que esa persona respeta tus procesos?</Label>
              <Textarea id="respect-action" value={respectAction} onChange={e => setRespectAction(e.target.value)} placeholder="Ej: No me obliga a hablar si no quiero. Me da espacio cuando lo necesito." />
            </div>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={next}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Reflexión guiada</h4>
            <p className="text-sm text-muted-foreground">Ahora que has nombrado a estas personas, párate un momento a mirar tu mapa.</p>
            <div className="space-y-2">
              <Label htmlFor="reflection1">¿Hay alguna relación que creías cercana pero no te permite crecer libremente?</Label>
              <Textarea id="reflection1" value={reflection1} onChange={e => setReflection1(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection2">¿Qué tipo de apoyo echo en falta?</Label>
              <Textarea id="reflection2" value={reflection2} onChange={e => setReflection2(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection3">¿Con quién me gustaría construir un vínculo así?</Label>
              <Textarea id="reflection3" value={reflection3} onChange={e => setReflection3(e.target.value)} />
            </div>
            <div className="space-y-2 mt-4">
                 <Label htmlFor="micro-action">Mi microacción semanal</Label>
                 <p className="text-xs text-muted-foreground">Elige una acción pequeña para cuidar uno de estos vínculos nutritivos.</p>
                <Textarea id="micro-action" value={microAction} onChange={e => setMicroAction(e.target.value)} placeholder="Ej: Mandarle un mensaje a [persona] agradeciéndole su apoyo."/>
            </div>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={handleSave} className="w-auto"><Save className="mr-2 h-4 w-4"/>Guardar y Finalizar</Button>
            </div>
          </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && 
          <CardDescription className="pt-2">
            
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
        {!isCompleted ? renderStep() : (
            <div className="p-6 text-center space-y-4">
                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                 <h4 className="font-bold text-lg">¡Ejercicio finalizado y guardado!</h4>
                 <p className="text-muted-foreground">Recuerda… Las relaciones que realmente nutren no son muchas. Pero cuando existen… sostienen, inspiran y respetan. Y eso no se encuentra por casualidad: se cultiva con presencia y cuidado.</p>
                 <Button onClick={resetExercise} variant="outline" className="w-full">Practicar de nuevo</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
