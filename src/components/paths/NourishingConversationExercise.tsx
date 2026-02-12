"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { NourishingConversationExerciseContent } from '@/data/paths/pathTypes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUser } from '@/contexts/UserContext';

interface NourishingConversationExerciseProps {
  content: NourishingConversationExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function NourishingConversationExercise({ content, pathId, onComplete }: NourishingConversationExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [person, setPerson] = useState('');
  const [context, setContext] = useState('');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [reflection, setReflection] = useState({ after: '', discovered: '', strengthen: '' });
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!person || !topic || !question || !reflection.after) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa la información principal del ejercicio para guardarlo.",
        variant: "destructive"
      });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

**Persona:** ${person}
**Contexto:** ${context}
**Tema compartido:** ${topic}
**Pregunta abierta:** ${question}

**Reflexión post-conversación:**
- Después de hablar me sentí: ${reflection.after}
- Descubrí: ${reflection.discovered}
- Para fortalecer el vínculo: ${reflection.strengthen}
    `;
    addNotebookEntry({ title: 'Registro de Conversación Nutritiva', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Registro Guardado' });
    setIsSaved(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1 – Introducción
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">A veces creemos que las relaciones nutritivas “se dan solas”, pero la verdad es que se construyen con pequeñas decisiones diarias. Esta técnica te invita a preparar y vivir una conversación desde la escucha, la empatía y la autenticidad.</p>
            <Button onClick={nextStep}>Empezar ejercicio <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 2 – Paso 1: Escoge la persona y el contexto
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 1: Escoge la persona y el contexto</h4>
            <p className="text-sm text-muted-foreground">Elige a una persona con la que quieras fortalecer el vínculo y un momento concreto para hablar.</p>
            <div className="space-y-2">
              <Label htmlFor="person">Persona:</Label>
              <Input id="person" value={person} onChange={e => setPerson(e.target.value)} placeholder="Ej: Mi amigo/a, mi hermano/a..." disabled={isSaved} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Contexto:</Label>
              <Select onValueChange={setContext} value={context} disabled={isSaved}>
                <SelectTrigger id="context"><SelectValue placeholder="Elige un contexto..."/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paseo">Paseo</SelectItem>
                  <SelectItem value="Café">Café</SelectItem>
                  <SelectItem value="Llamada">Llamada</SelectItem>
                  <SelectItem value="Comida">Comida</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!person}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Pantalla 3 – Paso 2: Prepara la conversación
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 2: Prepara la conversación</h4>
            <p className="text-sm text-muted-foreground">Antes de hablar, anota un tema que quieras compartir y una pregunta abierta que invite a la otra persona a expresarse.</p>
            <div className="space-y-2">
              <Label htmlFor="topic">Tema que quiero compartir:</Label>
              <Textarea id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej: “Estoy aprendiendo a pedir ayuda y quería contarte cómo me está yendo.”" disabled={isSaved} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Pregunta abierta para el otro/a:</Label>
              <Textarea id="question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ej: “¿Tú cómo te sientes cuando necesitas pedir ayuda?”" disabled={isSaved} />
            </div>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep} disabled={!topic || !question}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4 – Paso 3: Durante la conversación
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 3: Durante la conversación</h4>
            <p className="text-sm text-muted-foreground">En tu próxima conversación con esa persona, practica estos tres hábitos:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                <li><strong>Escucha sin interrumpir.</strong> Dale espacio para que termine sus ideas.</li>
                <li><strong>Valida sus emociones.</strong> Usa frases como “Entiendo que te sientas así”.</li>
                <li><strong>Comparte tu experiencia</strong> sin convertir la conversación en un monólogo.</li>
            </ul>
             <div className="flex justify-between w-full mt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
              <Button onClick={nextStep}>Ir a la reflexión final <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 4: // Pantalla 5 – Paso 4: Reflexión post-conversación
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg text-primary">Paso 4: Reflexión post-conversación</h4>
            <div className="space-y-2">
              <Label htmlFor="reflection-after">¿Cómo me sentí durante y después de hablar?</Label>
              <Textarea id="reflection-after" value={reflection.after} onChange={e => setReflection(p => ({...p, after: e.target.value}))} disabled={isSaved} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection-discovered">¿Qué descubrí sobre esta persona?</Label>
              <Textarea id="reflection-discovered" value={reflection.discovered} onChange={e => setReflection(p => ({...p, discovered: e.target.value}))} disabled={isSaved} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection-strengthen">¿Cómo puedo seguir fortaleciendo este vínculo?</Label>
              <Textarea id="reflection-strengthen" value={reflection.strengthen} onChange={e => setReflection(p => ({...p, strengthen: e.target.value}))} disabled={isSaved} />
            </div>
            {!isSaved ? (
              <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Registro</Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-3 mt-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
            )}
          </form>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2"/>{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      