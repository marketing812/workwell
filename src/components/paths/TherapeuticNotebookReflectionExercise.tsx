
"use client";

import { useEffect, useState, type FormEvent } from 'react';
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
import { SafeAudioPlayer } from '@/components/media/SafeAudioPlayer';

const cognitiveSignals = [
  { id: 'cog-concentration', label: 'Me cuesta concentrarme' },
  { id: 'cog-loop', label: 'Tengo pensamientos en bucle' },
  { id: 'cog-overwhelmed', label: 'Siento que no llego a todo, por más que haga' },
  { id: 'cog-perfectionism', label: 'Me pongo muy autoexigente o perfeccionista' },
  { id: 'cog-decisions', label: 'Me cuesta tomar decisiones' },
];

const behavioralSignals = [
    { id: 'beh-avoidance', label: 'Evito tareas, conversaciones o compromisos' },
    { id: 'beh-procrastination', label: 'Empiezo a procrastinar más de lo habitual' },
    { id: 'beh-disconnect', label: 'Me desconecto de lo que me importa' },
    { id: 'beh-irritability', label: 'Estoy más irritable o impaciente' },
    { id: 'beh-pleasing', label: 'Me vuelvo muy complaciente con los demás' },
];

const emotionalSignals = [
    { id: 'emo-irritability', label: 'Me siento más irritable, ansioso/a o frustrado/a' },
    { id: 'emo-apathy', label: 'Me noto más apático/a o desconectado/a' },
    { id: 'emo-guilt', label: 'Me invade la culpa si no estoy siendo “productivo/a”' },
    { id: 'emo-crying', label: 'Lloro con facilidad o me cuesta expresar lo que siento' },
    { id: 'emo-overwhelmed', label: 'Siento que todo me supera o me siento desbordado/a' },
];

const physicalSignals = [
    { id: 'phy-sleep', label: 'Duermo mal o me cuesta conciliar el sueño' },
    { id: 'phy-tired', label: 'Me levanto ya cansado/a o sin energía' },
    { id: 'phy-pain', label: 'Tengo dolores musculares o tensión' },
    { id: 'phy-appetite', label: 'Se me corta el apetito o como por ansiedad' },
    { id: 'phy-breath', label: 'Me cuesta respirar profundo o noto el pecho cerrado' },
];

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
  const [guidedResponses, setGuidedResponses] = useState<Record<string, string>>({});
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [overloadSignals, setOverloadSignals] = useState<Record<string, boolean>>({});
  const [otherSignals, setOtherSignals] = useState({
    cognitive: '',
    behavioral: '',
    emotional: '',
    physical: '',
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const normalizePromptsHtml = (html: string) => html.replace(/<\/?(b|strong)>/gi, '');
  const hasGuidedFields = Boolean(content.guidedFields && content.guidedFields.length > 0);
  const isGuidedStepMode = Boolean(hasGuidedFields && content.guidedStepMode);

  useEffect(() => {
    if (!content.guidedFields || content.guidedFields.length === 0) {
      setGuidedResponses({});
      return;
    }

    const initialState = content.guidedFields.reduce<Record<string, string>>((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {});
    setGuidedResponses(initialState);
    setGuidedStepIndex(0);
  }, [content.guidedFields]);

  const handleOverloadSignalChange = (id: string, checked: boolean) => {
    setOverloadSignals(prev => ({...prev, [id]: checked}));
  };
  
  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleGuidedFieldChange = (id: string, value: string) => {
    setGuidedResponses(prev => ({ ...prev, [id]: value }));
  };

  const currentGuidedField = hasGuidedFields ? content.guidedFields?.[guidedStepIndex] : undefined;
  const totalGuidedSteps = content.guidedFields?.length ?? 0;
  const isLastGuidedStep = guidedStepIndex === totalGuidedSteps - 1;

  const handleNextGuidedStep = () => {
    if (!currentGuidedField) return;
    const currentValue = (guidedResponses[currentGuidedField.id] || '').trim();
    if (currentGuidedField.required && !currentValue) {
      toast({
        title: "Respuesta pendiente",
        description: "Completa este campo antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    setGuidedStepIndex(prev => Math.min(prev + 1, totalGuidedSteps - 1));
  };


  const handleSaveReflection = async (e: FormEvent) => {
    e.preventDefault();
    if (hasGuidedFields) {
      const missingRequiredField = content.guidedFields?.find(
        field => field.required && !(guidedResponses[field.id] || '').trim()
      );
      if (missingRequiredField) {
        toast({
          title: "Reflexión Incompleta",
          description: "Por favor, completa todos los campos obligatorios antes de guardar.",
          variant: "destructive",
        });
        return;
      }
    } else if (!reflection.trim() && !content.showOverloadSignals) { // Only require reflection if no signals
      toast({
        title: "Reflexión Incompleta",
        description: "Por favor, escribe tu reflexión antes de guardar.",
        variant: "destructive",
      });
      return;
    }
    
    const promptsHtml = normalizePromptsHtml(content.prompts.join(''));
    
    let fullContent = `
**${content.title}**

<div class="prose dark:prose-invert max-w-none">
    ${promptsHtml}
</div>

${hasGuidedFields
  ? `**Mi reflexión guiada:**\n${(content.guidedFields ?? [])
      .map(field => `\n**${field.label}**\n${(guidedResponses[field.id] || '').trim()}`)
      .join('\n')}`
  : `**Mi reflexión:**\n${reflection}`}
    `;

    if (content.showOverloadSignals) {
        let signalsContent = "";
        let hasSignals = false;
        
        const addSignalSection = (title: string, options: {id:string, label:string}[], categoryKey: string, otherSignal: string) => {
            const selected = options.filter(opt => overloadSignals[opt.id]).map(opt => opt.label);
            if (overloadSignals[`${categoryKey}-other`] && otherSignal) {
                selected.push(`Otras: ${otherSignal}`);
            }
            if (selected.length > 0) {
                hasSignals = true;
                signalsContent += `\n*${title}:*\n${selected.map(s => `  - ${s}`).join('\n')}`;
            }
        };
        
        addSignalSection('Cognitivas / mentales', cognitiveSignals, 'cog', otherSignals.cognitive);
        addSignalSection('Conductuales', behavioralSignals, 'beh', otherSignals.behavioral);
        addSignalSection('Emocionales', emotionalSignals, 'emo', otherSignals.emotional);
        addSignalSection('Físicas / Fisiológicas', physicalSignals, 'phy', otherSignals.physical);
        
        const generalOtherSignals = notes['signals-custom-free-text'];
        if(generalOtherSignals) {
            hasSignals = true;
            signalsContent += `\n\n*Otras señales propias reconocidas:*\n${generalOtherSignals}`;
        }
        
        if(hasSignals) {
            fullContent += `\n\n--- \n**Señales Comunes de Sobrecarga Reconocidas:**${signalsContent}`;
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
    <div className="space-y-4 pt-4 border-t mt-4">
        <Label className="font-semibold">Señales comunes de sobrecarga: (Selecciona todas las que reconozcas en ti. También puedes añadir otras en el campo libre.)</Label>
        
        {/* Cognitive Signals */}
        <div className='pl-2'>
            <Label className="font-medium">Cognitivas / mentales</Label>
            <div className="pl-4 space-y-2 mt-1">
                {cognitiveSignals.map(signal => (
                    <div key={signal.id} className="flex items-center space-x-2">
                        <Checkbox id={signal.id} checked={overloadSignals[signal.id] || false} onCheckedChange={(checked) => handleOverloadSignalChange(signal.id, checked as boolean)} disabled={isSaved} />
                        <Label htmlFor={signal.id} className="font-normal">{signal.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="cog-other" checked={overloadSignals['cog-other'] || false} onCheckedChange={(checked) => handleOverloadSignalChange('cog-other', checked as boolean)} disabled={isSaved} />
                    <Label htmlFor="cog-other" className="font-normal">Otras:</Label>
                </div>
                {overloadSignals['cog-other'] && (
                    <Textarea value={otherSignals.cognitive} onChange={e => setOtherSignals(p => ({...p, cognitive: e.target.value}))} placeholder="Describe tus otras señales cognitivas..." className="ml-6" disabled={isSaved} />
                )}
            </div>
        </div>

        {/* Behavioral Signals */}
        <div className='pl-2'>
            <Label className="font-medium">Señales conductuales</Label>
            <div className="pl-4 space-y-2 mt-1">
                {behavioralSignals.map(signal => (
                    <div key={signal.id} className="flex items-center space-x-2">
                        <Checkbox id={signal.id} checked={overloadSignals[signal.id] || false} onCheckedChange={(checked) => handleOverloadSignalChange(signal.id, checked as boolean)} disabled={isSaved} />
                        <Label htmlFor={signal.id} className="font-normal">{signal.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="beh-other" checked={overloadSignals['beh-other'] || false} onCheckedChange={(checked) => handleOverloadSignalChange('beh-other', checked as boolean)} disabled={isSaved} />
                    <Label htmlFor="beh-other" className="font-normal">Otras:</Label>
                </div>
                {overloadSignals['beh-other'] && (
                    <Textarea value={otherSignals.behavioral} onChange={e => setOtherSignals(p => ({...p, behavioral: e.target.value}))} placeholder="Describe tus otras señales conductuales..." className="ml-6" disabled={isSaved} />
                )}
            </div>
        </div>

        {/* Emotional Signals */}
        <div className='pl-2'>
            <Label className="font-medium">Señales emocionales</Label>
            <div className="pl-4 space-y-2 mt-1">
                {emotionalSignals.map(signal => (
                    <div key={signal.id} className="flex items-center space-x-2">
                        <Checkbox id={signal.id} checked={overloadSignals[signal.id] || false} onCheckedChange={(checked) => handleOverloadSignalChange(signal.id, checked as boolean)} disabled={isSaved} />
                        <Label htmlFor={signal.id} className="font-normal">{signal.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="emo-other" checked={overloadSignals['emo-other'] || false} onCheckedChange={(checked) => handleOverloadSignalChange('emo-other', checked as boolean)} disabled={isSaved} />
                    <Label htmlFor="emo-other" className="font-normal">Otras:</Label>
                </div>
                {overloadSignals['emo-other'] && (
                    <Textarea value={otherSignals.emotional} onChange={e => setOtherSignals(p => ({...p, emotional: e.target.value}))} placeholder="Describe tus otras señales emocionales..." className="ml-6" disabled={isSaved} />
                )}
            </div>
        </div>

        {/* Physical Signals */}
        <div className='pl-2'>
            <Label className="font-medium">Señales físicas / Fisiológicas</Label>
            <div className="pl-4 space-y-2 mt-1">
                {physicalSignals.map(signal => (
                    <div key={signal.id} className="flex items-center space-x-2">
                        <Checkbox id={signal.id} checked={overloadSignals[signal.id] || false} onCheckedChange={(checked) => handleOverloadSignalChange(signal.id, checked as boolean)} disabled={isSaved} />
                        <Label htmlFor={signal.id} className="font-normal">{signal.label}</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <Checkbox id="phy-other" checked={overloadSignals['phy-other'] || false} onCheckedChange={(checked) => handleOverloadSignalChange('phy-other', checked as boolean)} disabled={isSaved} />
                    <Label htmlFor="phy-other" className="font-normal">Otras:</Label>
                </div>
                {overloadSignals['phy-other'] && (
                    <Textarea value={otherSignals.physical} onChange={e => setOtherSignals(p => ({...p, physical: e.target.value}))} placeholder="Describe tus otras señales físicas..." className="ml-6" disabled={isSaved} />
                )}
            </div>
        </div>

        {/* General free text field at the end */}
         <div className="space-y-2 pt-4">
            <Label htmlFor="signals-custom-free-text" className="font-semibold">¿Qué señales propias reconoces en ti cuando estás empezando a sobrecargarte?</Label>
            <Textarea 
                id="signals-custom-free-text" 
                value={notes['signals-custom-free-text'] || ''}
                onChange={e => handleNoteChange('signals-custom-free-text', e.target.value)}
                placeholder="Ejemplos: “Empiezo a dormir mal”, “Me desconecto emocionalmente”, “Evito tareas o conversaciones”." 
                disabled={isSaved}
            />
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
            <SafeAudioPlayer src={content.audioUrl} />
          </div>
        )}
        <div
          className="pt-2 text-base leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:pl-4"
          dangerouslySetInnerHTML={{ __html: normalizePromptsHtml(content.prompts.join('')) }}
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveReflection} className="space-y-4">
          {hasGuidedFields ? (
            <div className="space-y-4">
              {isGuidedStepMode && currentGuidedField ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Pregunta {guidedStepIndex + 1} de {totalGuidedSteps}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor={`guided-${pathId}-${currentGuidedField.id}`} className="font-semibold">
                      {currentGuidedField.label}
                    </Label>
                    <Textarea
                      id={`guided-${pathId}-${currentGuidedField.id}`}
                      value={guidedResponses[currentGuidedField.id] || ''}
                      onChange={e => handleGuidedFieldChange(currentGuidedField.id, e.target.value)}
                      placeholder={currentGuidedField.placeholder}
                      rows={currentGuidedField.rows ?? 5}
                      disabled={isSaved}
                    />
                  </div>
                </div>
              ) : (
                content.guidedFields?.map(field => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={`guided-${pathId}-${field.id}`} className="font-semibold">
                      {field.label}
                    </Label>
                    <Textarea
                      id={`guided-${pathId}-${field.id}`}
                      value={guidedResponses[field.id] || ''}
                      onChange={e => handleGuidedFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows ?? 4}
                      disabled={isSaved}
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
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
          )}

          {content.showOverloadSignals && <OverloadSignalsSection />}

          {!isSaved ? (
            isGuidedStepMode && hasGuidedFields ? (
              <div className="flex items-center justify-between w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto"
                  onClick={() => setGuidedStepIndex(prev => Math.max(prev - 1, 0))}
                  disabled={guidedStepIndex === 0}
                >
                  Atrás
                </Button>
                {!isLastGuidedStep ? (
                  <Button type="button" className="w-auto ml-auto" onClick={handleNextGuidedStep}>
                    Siguiente
                  </Button>
                ) : (
                  <Button type="submit" className="w-auto ml-auto">
                    <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
                  </Button>
                )}
              </div>
            ) : (
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar en el cuaderno terapéutico
              </Button>
            )
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
                <CheckCircle className="mr-2 h-5 w-5" />
                <p className="font-medium">Tu reflexión ha sido guardada.</p>
              </div>
              {content.savedSummaryText && (
                <div className="rounded-md border bg-background/60 p-4">
                  <p className="text-sm whitespace-pre-line">{content.savedSummaryText}</p>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
