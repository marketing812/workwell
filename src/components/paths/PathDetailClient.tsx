

"use client";

import React, { type ReactNode, useState, useEffect, useCallback, type FormEvent } from 'react';

import { Path, PathModule, ModuleContent } from '@/data/pathsData';
import { useTranslations } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  BookOpen,
  Edit3,
  Clock,
  AlertTriangle,
  Check,
  Save,
  NotebookText,
  ArrowRight,
  X as XIcon,
  Minus as MinusIcon,
  CheckIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getCompletedModules, saveCompletedModules } from '@/lib/progressStore';
import { useActivePath } from '@/contexts/ActivePathContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '../ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addNotebookEntry } from '@/data/therapeuticNotebookStore';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ExerciseContent, SelfAcceptanceAudioExerciseContent } from '@/data/paths/pathTypes';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// RUTA 1
import { StressMapExercise } from '@/components/paths/StressMapExercise';
import { TriggerExercise } from '@/components/paths/TriggerExercise';
import { DetectiveExercise } from '@/components/paths/DetectiveExercise';
import { DemandsExercise } from '@/components/paths/DemandsExercise';
import { WellbeingPlanExercise } from '@/components/paths/WellbeingPlanExercise';
// RUTA 2
import { UncertaintyMapExercise } from '@/components/paths/UncertaintyMapExercise';
import { ControlTrafficLightExercise } from '@/components/paths/ControlTrafficLightExercise';
import { AlternativeStoriesExercise } from '@/components/paths/AlternativeStoriesExercise';
import { MantraExercise } from '@/components/paths/MantraExercise';
import { RitualDeEntregaConscienteExercise } from './RitualDeEntregaConscienteExercise';
import { ExposureToIntoleranceExercise } from '@/components/paths/ExposureToIntoleranceExercise';
// RUTA 3
import { DelSabotajeALaAccionExercise } from '@/components/paths/DelSabotajeALaAccionExercise';
import { TwoMinuteRuleExercise } from '@/components/paths/TwoMinuteRuleExercise';
import { MicroPlanExercise } from '@/components/paths/MicroPlanExercise';
import { FutureSelfVisualizationExercise } from '@/components/paths/FutureSelfVisualizationExercise';
import { RealisticRitualExercise } from '@/components/paths/RealisticRitualExercise';
import { GentleTrackingExercise } from '@/components/paths/GentleTrackingExercise';
import { BlockageMapExercise } from '@/components/paths/BlockageMapExercise';
import { CompassionateReflectionExercise } from '@/components/paths/CompassionateReflectionExercise';
// RUTA 4
import { MapOfUnsaidThingsExercise } from '@/components/paths/MapOfUnsaidThingsExercise';
import { DiscomfortCompassExercise } from '@/components/paths/DiscomfortCompassExercise';
import { AssertivePhraseExercise } from '@/components/paths/AssertivePhraseExercise';
import { NoGuiltTechniquesExercise } from '@/components/paths/NoGuiltTechniquesExercise';
import { PostBoundaryEmotionsExercise } from '@/components/paths/PostBoundaryEmotionsExercise';
import { CompassionateFirmnessExercise } from '@/components/paths/CompassionateFirmnessExercise';
import { SelfCareContractExercise } from '@/components/paths/SelfCareContractExercise';
// RUTA 5
import { AuthenticityThermometerExercise } from './AuthenticityThermometerExercise';
import { EmpatheticDialogueExercise } from '@/components/paths/EmpatheticDialogueExercise';
import { EmpathicMirrorExercise } from '@/components/paths/EmpathicMirrorExercise';
import { ValidationIn3StepsExercise } from '@/components/paths/ValidationIn3StepsExercise';
import { EmpathicShieldVisualizationExercise } from '@/components/paths/EmpathicShieldVisualizationExercise';
import { EmotionalInvolvementTrafficLightExercise } from '@/components/paths/EmotionalInvolvementTrafficLightExercise';
import { SignificantRelationshipsInventoryExercise } from './SignificantRelationshipsInventoryExercise';
import { RelationalCommitmentExercise } from './RelationalCommitmentExercise';
// RUTA 6
import { DetectiveDeEmocionesExercise } from '@/components/paths/DetectiveDeEmocionesExercise';
import { UnaPalabraCadaDiaExercise } from '@/components/paths/UnaPalabraCadaDiaExercise';
import { MapaEmocionNecesidadCuidadoExercise } from '@/components/paths/MapaEmocionNecesidadCuidadoExercise';
import { CartaDesdeLaEmocionExercise } from '@/components/paths/CartaDesdeLaEmocionExercise';
import { MapaEmocionalRepetidoExercise } from '@/components/paths/MapaEmocionalRepetidoExercise';
import { SemaforoEmocionalExercise } from '@/components/paths/SemaforoEmocionalExercise';
import { MeditacionGuiadaSinJuicioExercise } from '@/components/paths/MeditacionGuiadaSinJuicioExercise';
import { DiarioMeDiCuentaExercise } from '@/components/paths/DiarioMeDiCuentaExercise';
// RUTA 7
import { ValuesCompassExercise } from '@/components/paths/ValuesCompassExercise';
import { EnergySenseMapExercise } from '@/components/paths/EnergySenseMapExercise';
import { DetoursInventoryExercise } from '@/components/paths/DetoursInventoryExercise';
import { PresentVsEssentialSelfExercise } from '@/components/paths/PresentVsEssentialSelfExercise';
import { MentalNoiseTrafficLightExercise } from '@/components/paths/MentalNoiseTrafficLightExercise';
import { DirectedDecisionsExercise } from '@/components/paths/DirectedDecisionsExercise';
import { SenseChecklistExercise } from '@/components/paths/SenseChecklistExercise';
import { UnfulfilledNeedsExercise } from '@/components/paths/UnfulfilledNeedsExercise';
import { BraveRoadmapExercise } from '@/components/paths/BraveRoadmapExercise';
import { EssentialReminderExercise } from '@/components/paths/EssentialReminderExercise';
import { ThoughtsThatBlockPurposeExercise } from '@/components/paths/ThoughtsThatBlockPurposeExercise';
// RUTA 8
import { ResilienceTimelineExercise } from '@/components/paths/ResilienceTimelineExercise';
import { PersonalDefinitionExercise } from '@/components/paths/PersonalDefinitionExercise';
import { AnchorInStormExercise } from '@/components/paths/AnchorInStormExercise';
import { IntensityScaleExercise } from '@/components/paths/IntensityScaleExercise';
import { BraveDecisionsWheelExercise } from '@/components/paths/BraveDecisionsWheelExercise';
import { PlanABExercise } from '@/components/paths/PlanABExercise';
import { ChangeTimelineExercise } from '@/components/paths/ChangeTimelineExercise';
import { MyPactExercise } from '@/components/paths/MyPactExercise';
// RUTA 9
import { CoherenceCompassExercise } from '@/components/paths/CoherenceCompassExercise';
import { SmallDecisionsLogExercise } from '@/components/paths/SmallDecisionsLogExercise';
import { InternalTensionsMapExercise } from '@/components/paths/InternalTensionsMapExercise';
import { EthicalMirrorExercise } from '@/components/paths/EthicalMirrorExercise';
import { IntegrityDecisionsExercise } from '@/components/paths/IntegrityDecisionsExercise';
import { NonNegotiablesExercise } from '@/components/paths/NonNegotiablesExercise';
import { EnvironmentEvaluationExercise } from '@/components/paths/EnvironmentEvaluationExercise';
import { PersonalManifestoExercise } from '@/components/paths/PersonalManifestoExercise';
// RUTA 10
import { ComplaintTransformationExercise } from '@/components/paths/ComplaintTransformationExercise';
import { GuiltRadarExercise } from '@/components/paths/GuiltRadarExercise';
import { AcceptanceWritingExercise } from '@/components/paths/AcceptanceWritingExercise';
import { SelfAcceptanceAudioExercise } from '@/components/paths/SelfAcceptanceAudioExercise';
import { CompassionateResponsibilityContractExercise } from '@/components/paths/CompassionateResponsibilityContractExercise';
import { CriticismToGuideExercise } from '@/components/paths/CriticismToGuideExercise';
import { InfluenceWheelExercise } from '@/components/paths/InfluenceWheelExercise';
import { PersonalCommitmentDeclarationExercise } from '@/components/paths/PersonalCommitmentDeclarationExercise';
// RUTA 11
import { SupportMapExercise } from '@/components/paths/SupportMapExercise';
import { BlockingThoughtsExercise } from '@/components/paths/BlockingThoughtsExercise';
import { NutritiveDrainingSupportMapExercise } from '@/components/paths/NutritiveDrainingSupportMapExercise';
import { NourishingConversationExercise } from '@/components/paths/NourishingConversationExercise';
import { ClearRequestMapExercise } from '@/components/paths/ClearRequestMapExercise';
import { SupportBankExercise } from '@/components/paths/SupportBankExercise';
import { MutualCareCommitmentExercise } from '@/components/paths/MutualCareCommitmentExercise';
import { SymbolicSupportCircleExercise } from '@/components/paths/SymbolicSupportCircleExercise';
// RUTA 12
import { EmotionalGratificationMapExercise } from '@/components/paths/EmotionalGratificationMapExercise';
import { DailyEnergyCheckExercise } from '@/components/paths/DailyEnergyCheckExercise';
import { DailyWellbeingPlanExercise } from '@/components/paths/DailyWellbeingPlanExercise';
import { MorningRitualExercise } from '@/components/paths/MorningRitualExercise';
import { MotivationIn3LayersExercise } from '@/components/paths/MotivationIn3LayersExercise';
import { VisualizeDayExercise } from '@/components/paths/VisualizeDayExercise';
import { IlluminatingMemoriesAlbumExercise } from '@/components/paths/IlluminatingMemoriesAlbumExercise';
import { PositiveEmotionalFirstAidKitExercise } from '@/components/paths/PositiveEmotionalFirstAidKitExercise';
// RUTA 13 (NUEVA)
import { AnsiedadTieneSentidoExercise } from '@/components/paths/AnsiedadTieneSentidoExercise';
import { VisualizacionGuiadaCuerpoAnsiedadExercise } from '@/components/paths/VisualizacionGuiadaCuerpoAnsiedadExercise';
import { StopExercise } from './StopExercise';
import { QuestionYourIfsExercise } from './QuestionYourIfsExercise';
import { ExposureLadderExercise } from './ExposureLadderExercise';
import { CalmVisualizationExercise } from './CalmVisualizationExercise';
import { ImaginedCrisisRehearsalExercise } from './ImaginedCrisisRehearsalExercise';
import { AnxietyReframingExercise } from './AnxietyReframingExercise';

// =================== ERROR BOUNDARIES ===================

class ModuleErrorBoundary extends React.Component<{
  pathId: string;
  module: PathModule;
  children: ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error(
      '[ModuleErrorBoundary] Error al renderizar módulo',
      {
        pathId: this.props.pathId,
        moduleId: this.props.module.id,
        moduleTitle: this.props.module.title,
      },
      error,
      info
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-2 border border-destructive bg-destructive/10 rounded-md">
            <p className="text-destructive font-semibold">Error al cargar este módulo.</p>
            <p className="text-sm text-destructive/80">Se ha producido un error al mostrar el contenido del módulo "{this.props.module.title}". Por favor, revisa la consola para más detalles.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

class ContentItemErrorBoundary extends React.Component<{
  pathId: string;
  module: PathModule;
  index: number;
  contentItem: ModuleContent;
  children: ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error(
      '[ContentItemErrorBoundary] Error al renderizar contentItem',
      {
        pathId: this.props.pathId,
        moduleId: this.props.module.id,
        moduleTitle: this.props.module.title,
        contentIndex: this.props.index,
        contentType: this.props.contentItem.type,
        contentTitle: (this.props.contentItem as any).title,
      },
      error,
      info
    );
  }

  render() {
    if (this.state.hasError) {
       return <div className="p-4 my-2 border border-destructive bg-destructive/10 rounded-md">
        <p className="text-destructive font-semibold">Error al cargar este contenido.</p>
        <p className="text-sm text-destructive/80">El elemento de contenido tipo "{(this.props.contentItem as any).type}" no se pudo mostrar. Revisa la consola.</p>
      </div>;
    }
    return this.props.children;
  }
}

// =================== COMPONENTES DE EJERCICIOS ===================

function TherapeuticNotebookReflectionExercise({
  content,
  pathId,
  pathTitle,
  onComplete,
}: {
  content: ModuleContent;
  pathId: string;
  pathTitle: string;
  onComplete: () => void;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (content.type !== 'therapeuticNotebookReflection') {
    return null;
  }

  const handleSaveReflection = async (e: FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) {
      toast({
        title: 'Reflexión Incompleta',
        description: 'Por favor, escribe tu reflexión antes de guardar.',
        variant: 'destructive',
      });
      return;
    }
    
    // Convert prompts array into a formatted HTML string
    const promptsHtml = content.prompts.map(p => {
        if (p.startsWith('¿') && p.endsWith('?')) {
            return `<p><strong>${p}</strong></p>`;
        }
        if (p.startsWith('•') || p.startsWith('-') || p.startsWith('*')) {
            return `<li>${p.substring(1).trim()}</li>`;
        }
        return `<p>${p}</p>`;
    }).join('');
    
    const fullContent = `
**${content.title}**

<div class="prose prose-sm dark:prose-invert max-w-none">
    ${promptsHtml.includes('<li>') ? `<ul>${promptsHtml}</ul>` : promptsHtml}
</div>

**Mi reflexión:**
${reflection}
    `;

    addNotebookEntry({
      title: `Reflexión: ${content.title}`,
      content: fullContent,
      pathId: pathId,
      ruta: pathTitle
    });
    
    toast({
      title: 'Reflexión Guardada',
      description: 'Tu reflexión ha sido guardada en el Cuaderno Terapéutico.',
    });
    setIsSaved(true);
    onComplete();
  };
  
  return (
    <Card className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-primary flex items-center gap-4">
          <NotebookText className="h-6 w-6" />
          <span>{content.title}</span>
          {content.audioUrl && (
            <audio
              src={content.audioUrl}
              controls
              controlsList="nodownload"
              className="h-8 max-w-[200px] sm:max-w-xs"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}



// Renderizador principal de contenido
function ContentItemRenderer({
  contentItem,
  index,
  path,
  module,
  onExerciseComplete,
}: {
  contentItem: ModuleContent;
  index: number;
  path: Path;
  module: PathModule;
  onExerciseComplete: () => void;
}) {
  if (!contentItem) {
    console.error(`ContentItemRenderer: contentItem at index ${index} is undefined.`);
    return <div className="p-4 my-2 border border-destructive bg-destructive/10 rounded-md">
        <p className="text-destructive font-semibold">Error: No se pudo cargar este contenido.</p>
        <p className="text-sm text-destructive/80">El elemento de contenido está dañado o no se encontró.</p>
    </div>;
  }
  
  const handleComplete = () => {
    onExerciseComplete();
  };

  switch (contentItem.type) {
    case 'title':
      return (
        <div className="flex items-center gap-4 mt-6 mb-3">
          <h3 className="text-xl font-bold text-primary">{contentItem.text}</h3>
          {contentItem.audioUrl && (
            <audio
              src={contentItem.audioUrl}
              controls
              controlsList="nodownload"
              className="h-8 max-w-[200px] sm:max-w-xs"
            />
          )}
        </div>
      );
    case 'paragraphWithAudio':
      return (
        <div key={index} className="space-y-4 mb-4">
          {contentItem.audioUrl && (
            <audio src={contentItem.audioUrl} controls controlsList="nodownload" className="w-full h-10" />
          )}
          <p
            className="text-base leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: contentItem.text.replace(/\\n/g, '<br />') }}
          />
        </div>
      );
    case 'paragraph':
      return (
        <p
          key={index}
          className="text-base leading-relaxed whitespace-pre-line mb-4"
          dangerouslySetInnerHTML={{ __html: contentItem.text.replace(/\\n/g, '<br />') }}
        />
      );
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4">
          {contentItem.items.map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{
                __html: item.replace(
                  /☐/g,
                  '<span class="inline-block w-4 h-4 border border-foreground/50 rounded-sm mr-2"></span>'
                ),
              }}
            />
          ))}
        </ul>
      );
    case 'collapsible':
      return (
        <Accordion key={index} type="single" collapsible className="w-full mb-4">
          <AccordionItem value={`item-${index}`} className="border rounded-lg shadow-sm bg-background">
            <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline text-left">
              <div className="flex items-center justify-between w-full gap-3">
                <span>{contentItem.title}</span>
                {contentItem.audioUrl && (
                  <audio
                    src={contentItem.audioUrl}
                    controls
                    controlsList="nodownload"
                    className="h-8 max-w-[200px] sm:max-w-xs"
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4">
                {contentItem.content.map((item, i) => (
                  <ContentItemRenderer
                    key={`${index}-child-${i}`}
                    contentItem={item}
                    index={i}
                    path={path}
                    module={module}
                    onExerciseComplete={onExerciseComplete}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'exercise': // Fallback for old/generic exercises
      return null;
    case 'quote':
      return (
        <blockquote
          key={index}
          className={cn(
            "mt-6 italic",
            (contentItem as any).align === 'center' 
              ? "text-center border-none p-4" 
              : "border-l-2 pl-6 text-accent-foreground/80"
          )}
          dangerouslySetInnerHTML={{ __html: contentItem.text }}
        />
      );
    case 'stressMapExercise':
      return <StressMapExercise key={index} content={contentItem} onComplete={handleComplete} />;
    case 'triggerExercise':
      return <TriggerExercise key={index} content={contentItem} onComplete={handleComplete} />;
    case 'detectiveExercise':
      return <DetectiveExercise key={index} content={contentItem} onComplete={handleComplete} />;
    case 'demandsExercise':
      return <DemandsExercise key={index} content={contentItem} onComplete={handleComplete} />;
    case 'wellbeingPlanExercise':
      return <WellbeingPlanExercise key={index} content={contentItem} onComplete={handleComplete} />;
    case 'uncertaintyMapExercise':
      return <UncertaintyMapExercise key={index} content={contentItem as any} />;
    case 'controlTrafficLightExercise':
      return <ControlTrafficLightExercise key={index} content={contentItem as any} />;
    case 'alternativeStoriesExercise':
      return <AlternativeStoriesExercise key={index} content={contentItem as any} />;
    case 'mantraExercise':
      return <MantraExercise key={index} content={contentItem as any} />;
    case 'ritualDeEntregaConscienteExercise':
        return <RitualDeEntregaConscienteExercise key={index} content={contentItem} pathId={path.id} />;
    case 'exposureToIntoleranceExercise':
      return <ExposureToIntoleranceExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'delSabotajeALaAccionExercise':
      return <DelSabotajeALaAccionExercise key={index} content={contentItem as any} />;
    case 'therapeuticNotebookReflection':
      return <TherapeuticNotebookReflectionExercise key={index} content={contentItem} pathId={path.id} pathTitle={path.title} onComplete={handleComplete} />;
    case 'twoMinuteRuleExercise':
      return <TwoMinuteRuleExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'futureSelfVisualizationExercise':
      return <FutureSelfVisualizationExercise key={index} content={contentItem} pathId={path.id} audioUrl={(contentItem as any).audioUrl} />;
    case 'realisticRitualExercise':
      return <RealisticRitualExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'gentleTrackingExercise':
      return <GentleTrackingExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'blockageMapExercise':
      return <BlockageMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'compassionateReflectionExercise':
      return <CompassionateReflectionExercise key={index} content={contentItem} pathId={path.id} />;
    case 'mapOfUnsaidThingsExercise':
      return (
        <MapOfUnsaidThingsExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'discomfortCompassExercise':
      return (
        <DiscomfortCompassExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'assertivePhraseExercise':
      return (
        <AssertivePhraseExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'noGuiltTechniquesExercise':
      return (
        <NoGuiltTechniquesExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'postBoundaryEmotionsExercise':
      return (
        <PostBoundaryEmotionsExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'compassionateFirmnessExercise':
      return (
        <CompassionateFirmnessExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'selfCareContractExercise':
      return (
        <SelfCareContractExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    // RUTA 5
    case 'authenticityThermometerExercise':
      return (
        <AuthenticityThermometerExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'empatheticDialogueExercise':
      return (
        <EmpatheticDialogueExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'empathicMirrorExercise':
      return (
        <EmpathicMirrorExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'validationIn3StepsExercise':
      return (
        <ValidationIn3StepsExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'empathicShieldVisualizationExercise': {
      const exerciseContent = contentItem as any ;
      return (
        <EmpathicShieldVisualizationExercise
          key={index}
          content={exerciseContent}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    }
    case 'emotionalInvolvementTrafficLightExercise':
      return (
        <EmotionalInvolvementTrafficLightExercise
          key={index}
          content={contentItem as any}
          pathId={path.id}
        />
      );
    case 'significantRelationshipsInventoryExercise':
      return (
        <SignificantRelationshipsInventoryExercise
          key={index}
          content={contentItem as any }
          pathId={path.id}
        />
      );
    case 'relationalCommitmentExercise':
      return (
        <RelationalCommitmentExercise
          key={index}
          content={contentItem as any }
          pathId={path.id}
        />
      );
    // RUTA 6
    case 'detectiveDeEmocionesExercise':
        return <DetectiveDeEmocionesExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'unaPalabraCadaDiaExercise':
        return <UnaPalabraCadaDiaExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'mapaEmocionNecesidadCuidadoExercise':
        return <MapaEmocionNecesidadCuidadoExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'cartaDesdeLaEmocionExercise':
        return <CartaDesdeLaEmocionExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'mapaEmocionalRepetidoExercise':
        return <MapaEmocionalRepetidoExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'semaforoEmocionalExercise':
        return <SemaforoEmocionalExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'meditacionGuiadaSinJuicioExercise':
        return <MeditacionGuiadaSinJuicioExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'diarioMeDiCuentaExercise':
        return <DiarioMeDiCuentaExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 7
    case 'valuesCompassExercise':
        return <ValuesCompassExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'energySenseMapExercise':
        return <EnergySenseMapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'detoursInventoryExercise':
        return <DetoursInventoryExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'presentVsEssentialSelfExercise':
        return <PresentVsEssentialSelfExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'mentalNoiseTrafficLightExercise':
        return <MentalNoiseTrafficLightExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'directedDecisionsExercise':
        return <DirectedDecisionsExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'senseChecklistExercise':
        return <SenseChecklistExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'unfulfilledNeedsExercise':
        return <UnfulfilledNeedsExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'braveRoadmapExercise':
        return <BraveRoadmapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'essentialReminderExercise':
        return <EssentialReminderExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'thoughtsThatBlockPurposeExercise':
        return <ThoughtsThatBlockPurposeExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 8
    case 'resilienceTimelineExercise':
        return <ResilienceTimelineExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'personalDefinitionExercise':
        return <PersonalDefinitionExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'anchorInStormExercise':
        return <AnchorInStormExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'intensityScaleExercise':
        return <IntensityScaleExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'braveDecisionsWheelExercise':
        return <BraveDecisionsWheelExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'planABExercise':
        return <PlanABExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'changeTimelineExercise':
        return <ChangeTimelineExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'myPactExercise':
        return <MyPactExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 9
    case 'coherenceCompassExercise':
      return <CoherenceCompassExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'smallDecisionsLogExercise':
      return <SmallDecisionsLogExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'internalTensionsMapExercise':
      return <InternalTensionsMapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'ethicalMirrorExercise':
      return <EthicalMirrorExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'integrityDecisionsExercise':
      return <IntegrityDecisionsExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'nonNegotiablesExercise':
      return <NonNegotiablesExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'environmentEvaluationExercise':
      return <EnvironmentEvaluationExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'personalManifestoExercise':
      return <PersonalManifestoExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 10
    case 'complaintTransformationExercise':
      return <ComplaintTransformationExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'guiltRadarExercise':
      return <GuiltRadarExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'acceptanceWritingExercise':
      return <AcceptanceWritingExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'selfAcceptanceAudioExercise': {
        const exerciseContent = contentItem as SelfAcceptanceAudioExerciseContent;
        return <SelfAcceptanceAudioExercise key={index} content={exerciseContent} pathId={path.id} audioUrl={exerciseContent.audioUrl} />;
    }
    case 'compassionateResponsibilityContractExercise':
      return <CompassionateResponsibilityContractExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'criticismToGuideExercise':
      return <CriticismToGuideExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'influenceWheelExercise':
      return <InfluenceWheelExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'personalCommitmentDeclarationExercise':
      return <PersonalCommitmentDeclarationExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 11
    case 'supportMapExercise':
        return <SupportMapExercise key={index} content={contentItem as any} pathId={path.id} pathTitle={path.title} moduleTitle={module.title} />;
    case 'blockingThoughtsExercise':
      return <BlockingThoughtsExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'nutritiveDrainingSupportMapExercise':
      return <NutritiveDrainingSupportMapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'nourishingConversationExercise':
      return <NourishingConversationExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'clearRequestMapExercise':
        return <ClearRequestMapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'supportBankExercise':
        return <SupportBankExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'mutualCareCommitmentExercise':
        return <MutualCareCommitmentExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'symbolicSupportCircleExercise':
        return <SymbolicSupportCircleExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 12
    case 'emotionalGratificationMapExercise':
        return <EmotionalGratificationMapExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'dailyEnergyCheckExercise':
        return <DailyEnergyCheckExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'dailyWellbeingPlanExercise':
        return <DailyWellbeingPlanExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'morningRitualExercise':
        return <MorningRitualExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'motivationIn3LayersExercise':
        return <MotivationIn3LayersExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'visualizeDayExercise':
        return <VisualizeDayExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'illuminatingMemoriesAlbumExercise':
        return <IlluminatingMemoriesAlbumExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'positiveEmotionalFirstAidKitExercise':
        return <PositiveEmotionalFirstAidKitExercise key={index} content={contentItem as any} pathId={path.id} />;
    // RUTA 13 (NUEVA)
    case 'ansiedadTieneSentidoExercise':
        return <AnsiedadTieneSentidoExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'visualizacionGuiadaCuerpoAnsiedadExercise':
        return <VisualizacionGuiadaCuerpoAnsiedadExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'stopExercise':
        return <StopExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'questionYourIfsExercise':
      return <QuestionYourIfsExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'exposureLadderExercise':
        return <ExposureLadderExercise key={index} content={contentItem as any} pathId={path.id} />;
    case 'calmVisualizationExercise': {
        const calmVisContent = contentItem as any;
        return <CalmVisualizationExercise key={index} content={calmVisContent} pathId={path.id} />;
    }
    case 'imaginedCrisisRehearsalExercise': {
      const crisisRehearsalContent = contentItem as any ;
      return <ImaginedCrisisRehearsalExercise key={index} content={crisisRehearsalContent} pathId={path.id} />;
    }
    case 'anxietyReframingExercise':
        return <AnxietyReframingExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;

    // ...
    default:
      return null;
  }
}

export function PathDetailClient({ path }: { path: Path }) {
  const t = useTranslations();
  const { toast } = useToast();
  const { loadPath, updateModuleCompletion: contextUpdateModuleCompletion } = useActivePath();

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [showPathCongratsDialog, setShowPathCongratsDialog] = useState(false);
  const [uncompleteModuleId, setUncompleteModuleId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
    if (path) {
      const initialCompleted = getCompletedModules(path.id);
      setCompletedModules(initialCompleted);
      loadPath(path.id, path.title, path.modules.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, loadPath]);

  const completeModule = useCallback((moduleId: string, moduleTitle: string) => {
    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(moduleId);
    
    setCompletedModules(newCompletedModules);
    saveCompletedModules(path.id, newCompletedModules);
    contextUpdateModuleCompletion(path.id, moduleId, true);
    
    toast({
      title: t.moduleCompletedTitle,
      description: t.moduleCompletedMessage.replace('{moduleTitle}', moduleTitle),
      duration: 3000,
    });

    const allModulesCompleted = path.modules.every(m => newCompletedModules.has(m.id));
    if (allModulesCompleted) {
      setShowPathCongratsDialog(true);
    }
  }, [completedModules, path.id, path.modules, contextUpdateModuleCompletion, t, toast]);


  const handleToggleComplete = (moduleId: string, moduleTitle: string) => {
    if (completedModules.has(moduleId)) {
      setUncompleteModuleId(moduleId); // Open confirmation dialog to uncomplete
    } else {
      completeModule(moduleId, moduleTitle); // Directly complete it
    }
  };

  const uncompleteModule = (moduleId: string) => {
    const newCompletedModules = new Set(completedModules);
    newCompletedModules.delete(moduleId);

    setCompletedModules(newCompletedModules);
    saveCompletedModules(path.id, newCompletedModules);
    contextUpdateModuleCompletion(path.id, moduleId, false);
    setUncompleteModuleId(null); // Close the dialog
  };

  const getModuleIcon = (type: PathModule['type']) => {
    switch (type) {
      case 'introduction':
        return <BookOpen className="h-6 w-6 text-primary" />;
      case 'skill_practice':
        return <Edit3 className="h-6 w-6 text-primary" />;
      case 'summary':
        return <CheckCircle className="h-6 w-6 text-primary" />;
      default:
        return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  if (!path || !isClient) {
    return (
      <div className="container mx-auto py-8 text-center text-xl flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p>Cargando ruta...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-12 shadow-xl overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={`https://workwellfut.com/imgapp/800x300/${encodeURIComponent(
              path.title.replace(':', '')
            )}_800x300.jpg`}
            alt={path.title}
            fill
            className="object-cover"
            data-ai-hint={path.dataAiHint || path.title}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
              {path.title}
            </h1>
          </div>
        </div>
        <CardContent className="p-8">
          <p className="text-lg text-muted-foreground mt-2 text-center">{path.description}</p>
          {path.audioUrl && (
            <div className="mt-4 flex justify-center">
              <audio
                src={path.audioUrl}
                controls
                controlsList="nodownload"
                className="w-full max-w-md h-10"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {path.modules.map(module => (
          <ModuleErrorBoundary key={module.id} pathId={path.id} module={module}>
            <Card
              className={`shadow-lg transition-all duration-300 hover:shadow-xl ${
                completedModules.has(module.id)
                  ? 'border-green-500/50 bg-green-50/30 dark:bg-green-900/10'
                  : 'border-transparent'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    {getModuleIcon(module.type)}
                    <div>
                      <CardTitle className="text-xl text-accent">{module.title}</CardTitle>
                      {module.estimatedTime && (
                        <CardDescription className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" /> {module.estimatedTime}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  {completedModules.has(module.id) && (
                    <Badge
                      variant="secondary"
                      className="border-green-600 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Completado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
              {module.content.map((contentItem, i) => (
                <ContentItemErrorBoundary
                  key={i}
                  pathId={path.id}
                  module={module}
                  index={i}
                  contentItem={contentItem}
                >
                  <ContentItemRenderer
                    contentItem={contentItem}
                    index={i}
                    path={path}
                    module={module}
                    onExerciseComplete={() => completeModule(module.id, module.title)}
                  />
                </ContentItemErrorBoundary>
              ))}

              </CardContent>
              <CardFooter>
                 <Button
                  onClick={() => handleToggleComplete(module.id, module.title)}
                  variant={completedModules.has(module.id) ? 'default' : 'secondary'}
                  className={completedModules.has(module.id) ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {completedModules.has(module.id) ? "Completado" : "Marcar como completado"}
                </Button>
              </CardFooter>
            </Card>
          </ModuleErrorBoundary>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/paths">{t.allPaths}</Link>
        </Button>
      </div>

       <AlertDialog open={!!uncompleteModuleId} onOpenChange={(open) => !open && setUncompleteModuleId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Desmarcar Módulo?</AlertDialogTitle>
                <AlertDialogDescription>
                    Este módulo ya está marcado como completado. ¿Estás seguro de que quieres desmarcarlo?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUncompleteModuleId(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => uncompleteModuleId && uncompleteModule(uncompleteModuleId)}>
                    Sí, desmarcar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>

      <AlertDialog open={showPathCongratsDialog} onOpenChange={setShowPathCongratsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary">
              {t.pathCompletedTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t.pathCompletedMessage.replace('{pathTitle}', path.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPathCongratsDialog(false)}>
              {t.continueLearning}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    