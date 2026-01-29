
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { MyPactExerciseContent } from '@/data/paths/pathTypes';

interface MyPactExerciseProps {
  content: MyPactExerciseContent;
  pathId: string;
}

export function MyPactExercise({ content, pathId }: MyPactExerciseProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [commitment, setCommitment] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [reminder, setReminder] = useState('');
  const [anchorPhrase, setAnchorPhrase] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetExercise = () => {
    setStep(0);
    setCommitment('');
    setReminderType('');
    setReminder('');
    setAnchorPhrase('');
    setIsSaved(false);
  };


  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!commitment.trim() || !reminder.trim() || !anchorPhrase.trim()) {
      toast({ title: 'Pacto incompleto', description: 'Por favor, completa todas las secciones del pacto.', variant: 'destructive' });
      return;
    }
    const notebookContent = `
**Ejercicio: ${content.title}**

*Me comprometo a cuidar:*
${commitment}

*Mi recordatorio tangible será:*
${reminder}

*Mi frase de acompañamiento emocional es:*
"${anchorPhrase}"
    `;
    addNotebookEntry({ title: 'Mi Pacto Conmigo', content: notebookContent, pathId: pathId });
    toast({ title: 'Pacto Guardado', description: 'Tu pacto contigo se ha guardado en el cuaderno.' });
    setIsSaved(true);
    nextStep(); // Move to confirmation screen
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Pantalla 1: Introducción
        return (
          <div className="p-4 space-y-4 text-center">
            <p className="text-muted-foreground">
              Esta ruta no termina aquí. Pero ahora es momento de cerrar esta etapa con un gesto significativo: un pacto contigo. No desde la exigencia, sino desde el cuidado. No para hacerlo todo perfecto, sino para recordarte lo que te fortalece cuando más lo necesitas.
            </p>
            <Button onClick={nextStep}>Empezar mi pacto <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        );
      case 1: // Pantalla 2: Paso 1 - Compromiso
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 1: ¿Qué me comprometo a cuidar?</h4>
            <p className="text-sm text-muted-foreground">Piensa en una o dos prácticas o actitudes que quieras mantener vivas. Esas que sabes que te hacen bien, aunque a veces las olvides.</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
              <p><strong>Ejemplos:</strong></p>
              <ul className="list-disc list-inside">
                <li>“Me comprometo a escuchar mis señales internas antes de decir que sí a todo.”</li>
                <li>“Me comprometo a respirar tres veces antes de reaccionar en automático.”</li>
                <li>“Me comprometo a seguir hablándome con respeto.”</li>
              </ul>
            </div>
            <Label htmlFor="commitment-pact">Escribe aquí lo que te comprometes a cuidar</Label>
            <Textarea id="commitment-pact" value={commitment} onChange={e => setCommitment(e.target.value)} />
             <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!commitment.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 2: // Pantalla 3: Paso 2 - Recordatorio
        return (
          <div className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 2: ¿Cómo me lo recordaré?</h4>
            <p className="text-sm text-muted-foreground">Tu compromiso necesita una señal que lo mantenga vivo. Elige un recordatorio concreto que te ayude a volver a ti.</p>
            <div className="p-2 border-l-2 border-accent bg-accent/10 text-sm">
                <p>💡 No se trata de una frase emocional profunda (eso vendrá en el siguiente paso), sino de algo que puedas ver, hacer o tocar para reconectar con tu ancla interna.</p>
            </div>
            <Label>¿Qué puedes usar como recordatorio?</Label>
            <RadioGroup value={reminderType} onValueChange={setReminderType}>
              <div className="flex items-center space-x-2"><RadioGroupItem value="rutina" id="rem-routine" /><Label className="font-normal" htmlFor="rem-routine">Una rutina diaria</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="objeto" id="rem-object" /><Label className="font-normal" htmlFor="rem-object">Un objeto con significado</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nota" id="rem-note" /><Label className="font-normal" htmlFor="rem-note">Una nota o imagen visible</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="gesto" id="rem-gesture" /><Label className="font-normal" htmlFor="rem-gesture">Un gesto físico</Label></div>
            </RadioGroup>
            <Textarea value={reminder} onChange={e => setReminder(e.target.value)} placeholder={`Describe tu recordatorio. Ej: "Cada mañana, al lavarme la cara, me repetiré mi frase..."`}/>
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button onClick={nextStep} disabled={!reminder.trim()}>Siguiente <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        );
      case 3: // Pantalla 4: Paso 3 - Frase de acompañamiento
        return (
          <form onSubmit={handleSave} className="p-4 space-y-4 animate-in fade-in-0 duration-500">
            <h4 className="font-semibold text-lg">Paso 3: Una frase que me acompañe</h4>
            <p className="text-sm text-muted-foreground">Ahora recoge lo vivido y tradúcelo en palabras que te sostengan. Esta frase no tiene que ser perfecta, solo auténtica.</p>
             <div className="p-2 border-l-2 border-accent bg-accent/10 italic text-sm">
                <p><strong>Ejemplos reales:</strong></p>
                <ul className="list-disc list-inside">
                    <li>“No tengo que tener todo resuelto para seguir caminando.”</li>
                    <li>“He caído, pero también he aprendido a sostenerme.”</li>
                    <li>“Pase lo que pase, ahora sé cómo volver a mí.”</li>
                </ul>
            </div>
            <Label htmlFor="anchor-phrase">Mi frase de acompañamiento emocional es:</Label>
            <Textarea id="anchor-phrase" value={anchorPhrase} onChange={e => setAnchorPhrase(e.target.value)} />
            <div className="flex justify-between w-full mt-4">
                <Button onClick={prevStep} variant="outline" type="button"><ArrowLeft className="mr-2 h-4 w-4"/>Atrás</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4"/> Guardar mi pacto</Button>
            </div>
          </form>
        );
      case 4: // Pantalla 5: Cierre
        return (
          <div className="p-6 text-center space-y-4 animate-in fade-in-0 duration-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-lg">Pacto Guardado</h4>
            <p className="text-muted-foreground">
              Este pacto no es una obligación. Es una forma de cuidarte con conciencia, de recordarte lo que vales, y de tener un faro cuando lleguen días grises. Llévalo contigo. Porque esto no se acaba… solo empieza de otra manera.
            </p>
            <Button onClick={resetExercise} variant="outline" className="w-full">Crear otro pacto</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && <CardDescription className="pt-2">{content.objective}
        <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full">
                <source src="https://workwellfut.com/audios/ruta8/tecnicas/Ruta8semana4tecnica2.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
        </div>
        </CardDescription>}
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

    

    