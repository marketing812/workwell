
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, CheckCircle } from 'lucide-react';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import type { CompassionateResponsibilityContractExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';

interface CompassionateResponsibilityContractExerciseProps {
  content: CompassionateResponsibilityContractExerciseContent;
  pathId: string;
  onComplete: () => void;
}

export default function CompassionateResponsibilityContractExercise({ content, pathId, onComplete }: CompassionateResponsibilityContractExerciseProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [initialCommitment, setInitialCommitment] = useState('');
  const [howToTalk, setHowToTalk] = useState('');
  const [howToRespond, setHowToRespond] = useState('');
  const [signature, setSignature] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const notebookContent = `
**Ejercicio: ${content.title}**

*Mi compromiso inicial:*
${initialCommitment}

*Cómo quiero hablarme cuando me equivoque:*
${howToTalk}

*Cómo quiero responder ante mis decisiones:*
${howToRespond}

*Firma del contrato:*
${signature}
    `;
    addNotebookEntry({ title: 'Mi Contrato de Autorresponsabilidad Compasiva', content: notebookContent, pathId: pathId, userId: user?.id });
    toast({ title: 'Contrato Guardado', description: 'Tu contrato ha sido guardado.' });
    setIsSaved(true);
    onComplete();
  };

  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center"><Edit3 className="mr-2" />{content.title}</CardTitle>
        {content.objective && (
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
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initial-commitment" className="font-semibold text-lg">El contrato comienza con tus propias palabras</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Quiero que empieces escribiendo una frase que marque la intención general de tu contrato. Piensa en algo que resuma cómo quieres tratarte a partir de ahora.  <br>Ejemplo: Me comprometo a hablarme con respeto, aunque me equivoque, y a buscar siempre un aprendizaje en cada decisión." }} />
            <Textarea id="initial-commitment" value={initialCommitment} onChange={e => setInitialCommitment(e.target.value)} disabled={isSaved} placeholder="Escribe aquí tu frase de compromiso inicial…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="how-to-talk" className="font-semibold text-lg">Cómo quiero hablarme cuando me equivoque</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Piensa en situaciones donde has cometido un error o no has cumplido lo que esperabas. ¿Qué tipo de palabras quieres usar contigo mismo/a en esos momentos? <br>Ejemplo: <br><ul><li>Antes: Soy un desastre, siempre lo estropeo. </li><li>Ahora: “Me equivoqué, pero puedo repararlo o aprender para la próxima vez.</li></ul>" }} />
            <Textarea id="how-to-talk" value={howToTalk} onChange={e => setHowToTalk(e.target.value)} disabled={isSaved} placeholder="Describe aquí cómo quieres hablarte cuando cometas un error…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="how-to-respond" className="font-semibold text-lg">Cómo quiero responder ante mis decisiones</Label>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: "Tanto si las cosas salen bien como si no, tu forma de responderte puede marcar la diferencia. Define qué actitudes y acciones quieres mantener después de tomar una decisión, evitando quedarte atrapado/a en la duda o el arrepentimiento. <br> Ejemplo: <br>Revisaré si la decisión estaba alineada con mis valores y aprenderé lo que pueda, en lugar de castigarme. " }} />
            <Textarea id="how-to-respond" value={howToRespond} onChange={e => setHowToRespond(e.target.value)} disabled={isSaved} placeholder="Escribe aquí cómo quieres responder ante tus decisiones…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature" className="font-semibold text-lg">Firma y compromiso</Label>
            <div className="text-sm text-muted-foreground space-y-2" dangerouslySetInnerHTML={{ __html: "Cuando termines, lee tu contrato completo en voz alta. Si te suena demasiado duro, ajústalo. Si te suena realista y motivador, fírmalo (puedes escribir tu nombre o solo tus iniciales).<br><b>Mi contrato:</b><br>" }} />
            <div className="p-4 border rounded-md bg-background/50 space-y-3 text-sm">
                <p><strong>Mi compromiso inicial:</strong></p>
                <Textarea value={initialCommitment} onChange={e => setInitialCommitment(e.target.value)} disabled={isSaved} placeholder="Tu compromiso..."/>

                <p className="mt-4"><strong>Quiero hablarme así:</strong></p>
                <Textarea value={howToTalk} onChange={e => setHowToTalk(e.target.value)} disabled={isSaved} placeholder="Cómo te hablarás..."/>
                
                <p className="mt-4"><strong>Quiero responderme ante mis decisiones así:</strong></p>
                <Textarea value={howToRespond} onChange={e => setHowToRespond(e.target.value)} disabled={isSaved} placeholder="Cómo responderás..."/>
            </div>
            <Textarea id="signature" value={signature} onChange={e => setSignature(e.target.value)} placeholder="Firma aquí con tu nombre o iniciales para sellar tu compromiso..." disabled={isSaved} className="mt-2" />
          </div>
          {!isSaved ? (
            <>
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Guardar Contrato</Button>
              <p className="text-xs text-muted-foreground text-center mt-2">Recuerda: este contrato no es un castigo ni una lista de exigencias, sino una guía.</p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Guardado.</p>
              </div>
              <p className="text-sm text-center mt-2">
                Recuerda: este contrato no es un castigo ni una lista de exigencias, sino una guía viva para acompañarte en tus errores y aprendizajes. Puedes volver a él siempre que necesites reorientarte.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

    