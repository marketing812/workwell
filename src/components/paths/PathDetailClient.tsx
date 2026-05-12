
"use client";

import React, { type ReactNode, useState, useEffect, useCallback, useMemo, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import type { Path, PathModule, ModuleContent } from '@/data/paths/pathTypes';
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
  ArrowLeft,
  ArrowRight,
  X as XIcon,
  Minus as MinusIcon,
  CheckIcon,
  Loader2,
  Lock,
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
import { pathsData } from '@/data/pathsData';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
import { getModuleUnlockMap, getPathUnlockInfo } from '@/lib/pathAccess';
import { SafeAudioPlayer } from '@/components/media/SafeAudioPlayer';
import { normalizeResourceContentHtml } from '@/lib/resourceLinks';
import { syncRouteProgressCompletion } from '@/lib/routeProgressSync';

const LoaderComponent = () => <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

const EXERCISE_TYPES_WITH_INTERNAL_DURATION = new Set<string>([
  'activateShieldExercise',
  'complaintTransformationExercise',
  'demandsExercise',
  'detectiveExercise',
  'empathicMirrorExercise',
  'guiltRadarExercise',
  'illuminatingMemoriesAlbumExercise',
  'integrityDecisionsExercise',
  'internalTensionsMapExercise',
  'semaforoEmocionalExercise',
  'stressMapExercise',
  'triggerExercise',
  'vitaminMomentExercise',
]);

function getSharedDuration(contentItem: ModuleContent): string | null {
  if (!contentItem.type.endsWith('Exercise')) {
    return null;
  }
  if (EXERCISE_TYPES_WITH_INTERNAL_DURATION.has(contentItem.type)) {
    return null;
  }
  const duration = (contentItem as Partial<ExerciseContent>).duration;
  if (typeof duration !== 'string') {
    return null;
  }
  const normalized = duration.trim();
  return normalized.length > 0 ? normalized : null;
}

function getModuleWeekNumber(module: PathModule): number | null {
  const idMatch = module.id.match(/(?:sem(?:ana)?|week)[_-]?(\d+)/i);
  if (idMatch) {
    const parsed = Number.parseInt(idMatch[1], 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const titleMatch = module.title.match(/semana\s+(\d+)/i);
  if (titleMatch) {
    const parsed = Number.parseInt(titleMatch[1], 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function isRouteClosureModule(module: PathModule): boolean {
  return /(?:^|[_-])cierre$/i.test(module.id) || /cierre de la ruta|reflexi[oó]n final de la ruta|resumen final de la ruta/i.test(module.title);
}

function resolveModuleWeekNumber(path: Path, moduleIndex: number): number {
  const directWeekNumber = getModuleWeekNumber(path.modules[moduleIndex]);
  if (directWeekNumber && directWeekNumber >= 1 && directWeekNumber <= 5) {
    return directWeekNumber;
  }

  if (isRouteClosureModule(path.modules[moduleIndex])) {
    return 5;
  }

  for (let i = moduleIndex - 1; i >= 0; i--) {
    const previousWeekNumber = getModuleWeekNumber(path.modules[i]);
    if (previousWeekNumber && previousWeekNumber >= 1 && previousWeekNumber <= 4) {
      return previousWeekNumber;
    }
  }

  for (let i = moduleIndex + 1; i < path.modules.length; i++) {
    const nextWeekNumber = getModuleWeekNumber(path.modules[i]);
    if (nextWeekNumber && nextWeekNumber >= 1 && nextWeekNumber <= 4) {
      return nextWeekNumber;
    }
  }

  return 1;
}

function getRouteNumber(pathId: string): number | null {
  const index = pathsData.findIndex((path) => path.id === pathId);
  if (index === -1) {
    return null;
  }

  return index + 1;
}

// RUTA 1
const StressMapExercise = dynamic(() => import('@/components/paths/StressMapExercise'), { loading: LoaderComponent, ssr: false });
const TriggerExercise = dynamic(() => import('@/components/paths/TriggerExercise'), { loading: LoaderComponent, ssr: false });
const DetectiveExercise = dynamic(() => import('@/components/paths/DetectiveExercise'), { loading: LoaderComponent, ssr: false });
const DemandsExercise = dynamic(() => import('@/components/paths/DemandsExercise'), { loading: LoaderComponent, ssr: false });
const WellbeingPlanExercise = dynamic(() => import('@/components/paths/WellbeingPlanExercise'), { loading: LoaderComponent, ssr: false });
const TherapeuticNotebookReflectionExercise = dynamic(() => import('@/components/paths/TherapeuticNotebookReflectionExercise'), { loading: LoaderComponent, ssr: false });
const ImaginedCrisisRehearsalExercise = dynamic(() => import('@/components/paths/ImaginedCrisisRehearsalExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 2
const UncertaintyMapExercise = dynamic(() => import('@/components/paths/UncertaintyMapExercise'), { loading: LoaderComponent, ssr: false });
const ControlTrafficLightExercise = dynamic(() => import('@/components/paths/ControlTrafficLightExercise'), { loading: LoaderComponent, ssr: false });
const AlternativeStoriesExercise = dynamic(() => import('@/components/paths/AlternativeStoriesExercise'), { loading: LoaderComponent, ssr: false });
const MantraExercise = dynamic(() => import('@/components/paths/MantraExercise'), { loading: LoaderComponent, ssr: false });
const RitualDeEntregaConscienteExercise = dynamic(() => import('@/components/paths/RitualDeEntregaConscienteExercise'), { loading: LoaderComponent, ssr: false });
const ExposureToIntoleranceExercise = dynamic(() => import('@/components/paths/ExposureToIntoleranceExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 3
const DelSabotajeALaAccionExercise = dynamic(() => import('@/components/paths/DelSabotajeALaAccionExercise'), { loading: LoaderComponent, ssr: false });
const TwoMinuteRuleExercise = dynamic(() => import('@/components/paths/TwoMinuteRuleExercise'), { loading: LoaderComponent, ssr: false });
const MicroPlanExercise = dynamic(() => import('@/components/paths/MicroPlanExercise'), { loading: LoaderComponent, ssr: false });
const FutureSelfVisualizationExercise = dynamic(() => import('@/components/paths/FutureSelfVisualizationExercise'), { loading: LoaderComponent, ssr: false });
const RealisticRitualExercise = dynamic(() => import('@/components/paths/RealisticRitualExercise'), { loading: LoaderComponent, ssr: false });
const GentleTrackingExercise = dynamic(() => import('@/components/paths/GentleTrackingExercise'), { loading: LoaderComponent, ssr: false });
const BlockageMapExercise = dynamic(() => import('@/components/paths/BlockageMapExercise'), { loading: LoaderComponent, ssr: false });
const CompassionateReflectionExercise = dynamic(() => import('@/components/paths/CompassionateReflectionExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 4
const MapOfUnsaidThingsExercise = dynamic(() => import('@/components/paths/MapOfUnsaidThingsExercise'), { loading: LoaderComponent, ssr: false });
const DiscomfortCompassExercise = dynamic(() => import('@/components/paths/DiscomfortCompassExercise'), { loading: LoaderComponent, ssr: false });
const AssertivePhraseExercise = dynamic(() => import('@/components/paths/AssertivePhraseExercise'), { loading: LoaderComponent, ssr: false });
const NoGuiltTechniquesExercise = dynamic(() => import('@/components/paths/NoGuiltTechniquesExercise'), { loading: LoaderComponent, ssr: false });
const SecureBoundaryPhraseExercise = dynamic(() => import('@/components/paths/SecureBoundaryPhraseExercise'), { loading: LoaderComponent, ssr: false });
const PostBoundaryEmotionsExercise = dynamic(() => import('@/components/paths/PostBoundaryEmotionsExercise'), { loading: LoaderComponent, ssr: false });
const FirmAndCalmSelfVisualizationExercise = dynamic(() => import('@/components/paths/FirmAndCalmSelfVisualizationExercise'), { loading: LoaderComponent, ssr: false });
const CompassionateFirmnessExercise = dynamic(() => import('@/components/paths/CompassionateFirmnessExercise'), { loading: LoaderComponent, ssr: false });
const SelfCareContractExercise = dynamic(() => import('@/components/paths/SelfCareContractExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 5
const AuthenticityThermometerExercise = dynamic(() => import('@/components/paths/AuthenticityThermometerExercise'), { loading: LoaderComponent, ssr: false });
const EmpatheticDialogueExercise = dynamic(() => import('@/components/paths/EmpatheticDialogueExercise'), { loading: LoaderComponent, ssr: false });
const EmpathicMirrorExercise = dynamic(() => import('@/components/paths/EmpathicMirrorExercise'), { loading: LoaderComponent, ssr: false });
const ValidationIn3StepsExercise = dynamic(() => import('@/components/paths/ValidationIn3StepsExercise'), { loading: LoaderComponent, ssr: false });
const EmpathicShieldVisualizationExercise = dynamic(() => import('@/components/paths/EmpathicShieldVisualizationExercise'), { loading: LoaderComponent, ssr: false });
const ActivateShieldExercise = dynamic(() => import('@/components/paths/ActivateShieldExercise'), { loading: LoaderComponent, ssr: false });
const EmotionalInvolvementTrafficLightExercise = dynamic(() => import('@/components/paths/EmotionalInvolvementTrafficLightExercise'), { loading: LoaderComponent, ssr: false });
const SignificantRelationshipsInventoryExercise = dynamic(() => import('@/components/paths/SignificantRelationshipsInventoryExercise'), { loading: LoaderComponent, ssr: false });
const RelationalCommitmentExercise = dynamic(() => import('@/components/paths/RelationalCommitmentExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 6
const DetectiveDeEmocionesExercise = dynamic(() => import('@/components/paths/DetectiveDeEmocionesExercise'), { loading: LoaderComponent, ssr: false });
const UnaPalabraCadaDiaExercise = dynamic(() => import('@/components/paths/UnaPalabraCadaDiaExercise'), { loading: LoaderComponent, ssr: false });
const MapaEmocionNecesidadCuidadoExercise = dynamic(() => import('@/components/paths/MapaEmocionNecesidadCuidadoExercise'), { loading: LoaderComponent, ssr: false });
const CartaDesdeLaEmocionExercise = dynamic(() => import('@/components/paths/CartaDesdeLaEmocionExercise'), { loading: LoaderComponent, ssr: false });
const MapaEmocionalRepetidoExercise = dynamic(() => import('@/components/paths/MapaEmocionalRepetidoExercise'), { loading: LoaderComponent, ssr: false });
const SemaforoEmocionalExercise = dynamic(() => import('@/components/paths/SemaforoEmocionalExercise'), { loading: LoaderComponent, ssr: false });
const MeditacionGuiadaSinJuicioExercise = dynamic(() => import('@/components/paths/MeditacionGuiadaSinJuicioExercise'), { loading: LoaderComponent, ssr: false });
const DiarioMeDiCuentaExercise = dynamic(() => import('@/components/paths/DiarioMeDiCuentaExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 7
const ValuesCompassExercise = dynamic(() => import('@/components/paths/ValuesCompassExercise'), { loading: LoaderComponent, ssr: false });
const EnergySenseMapExercise = dynamic(() => import('@/components/paths/EnergySenseMapExercise'), { loading: LoaderComponent, ssr: false });
const DetoursInventoryExercise = dynamic(() => import('@/components/paths/DetoursInventoryExercise'), { loading: LoaderComponent, ssr: false });
const PresentVsEssentialSelfExercise = dynamic(() => import('@/components/paths/PresentVsEssentialSelfExercise'), { loading: LoaderComponent, ssr: false });
const MentalNoiseTrafficLightExercise = dynamic(() => import('@/components/paths/MentalNoiseTrafficLightExercise'), { loading: LoaderComponent, ssr: false });
const DirectedDecisionsExercise = dynamic(() => import('@/components/paths/DirectedDecisionsExercise'), { loading: LoaderComponent, ssr: false });
const SenseChecklistExercise = dynamic(() => import('@/components/paths/SenseChecklistExercise'), { loading: LoaderComponent, ssr: false });
const UnfulfilledNeedsExercise = dynamic(() => import('@/components/paths/UnfulfilledNeedsExercise'), { loading: LoaderComponent, ssr: false });
const BraveRoadmapExercise = dynamic(() => import('@/components/paths/BraveRoadmapExercise'), { loading: LoaderComponent, ssr: false });
const EssentialReminderExercise = dynamic(() => import('@/components/paths/EssentialReminderExercise'), { loading: LoaderComponent, ssr: false });
const ThoughtsThatBlockPurposeExercise = dynamic(() => import('@/components/paths/ThoughtsThatBlockPurposeExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 8
const ResilienceTimelineExercise = dynamic(() => import('@/components/paths/ResilienceTimelineExercise'), { loading: LoaderComponent, ssr: false });
const PersonalDefinitionExercise = dynamic(() => import('@/components/paths/PersonalDefinitionExercise'), { loading: LoaderComponent, ssr: false });
const AnchorInStormExercise = dynamic(() => import('@/components/paths/AnchorInStormExercise'), { loading: LoaderComponent, ssr: false });
const IntensityScaleExercise = dynamic(() => import('@/components/paths/IntensityScaleExercise'), { loading: LoaderComponent, ssr: false });
const BraveDecisionsWheelExercise = dynamic(() => import('@/components/paths/BraveDecisionsWheelExercise'), { loading: LoaderComponent, ssr: false });
const PlanABExercise = dynamic(() => import('@/components/paths/PlanABExercise'), { loading: LoaderComponent, ssr: false });
const ChangeTimelineExercise = dynamic(() => import('@/components/paths/ChangeTimelineExercise'), { loading: LoaderComponent, ssr: false });
const MyPactExercise = dynamic(() => import('@/components/paths/MyPactExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 9
const CoherenceCompassExercise = dynamic(() => import('@/components/paths/CoherenceCompassExercise'), { loading: LoaderComponent, ssr: false });
const SmallDecisionsLogExercise = dynamic(() => import('@/components/paths/SmallDecisionsLogExercise'), { loading: LoaderComponent, ssr: false });
const InternalTensionsMapExercise = dynamic(() => import('@/components/paths/InternalTensionsMapExercise'), { loading: LoaderComponent, ssr: false });
const EthicalMirrorExercise = dynamic(() => import('@/components/paths/EthicalMirrorExercise'), { loading: LoaderComponent, ssr: false });
const IntegrityDecisionsExercise = dynamic(() => import('@/components/paths/IntegrityDecisionsExercise'), { loading: LoaderComponent, ssr: false });
const NonNegotiablesExercise = dynamic(() => import('@/components/paths/NonNegotiablesExercise'), { loading: LoaderComponent, ssr: false });
const EnvironmentEvaluationExercise = dynamic(() => import('@/components/paths/EnvironmentEvaluationExercise'), { loading: LoaderComponent, ssr: false });
const PersonalManifestoExercise = dynamic(() => import('@/components/paths/PersonalManifestoExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 10
const ComplaintTransformationExercise = dynamic(() => import('@/components/paths/ComplaintTransformationExercise'), { loading: LoaderComponent, ssr: false });
const GuiltRadarExercise = dynamic(() => import('@/components/paths/GuiltRadarExercise'), { loading: LoaderComponent, ssr: false });
const AcceptanceWritingExercise = dynamic(() => import('@/components/paths/AcceptanceWritingExercise'), { loading: LoaderComponent, ssr: false });
const SelfAcceptanceAudioExercise = dynamic(() => import('@/components/paths/SelfAcceptanceAudioExercise'), { loading: LoaderComponent, ssr: false });
const CompassionateResponsibilityContractExercise = dynamic(() => import('@/components/paths/CompassionateResponsibilityContractExercise'), { loading: LoaderComponent, ssr: false });
const CriticismToGuideExercise = dynamic(() => import('@/components/paths/CriticismToGuideExercise'), { loading: LoaderComponent, ssr: false });
const InfluenceWheelExercise = dynamic(() => import('@/components/paths/InfluenceWheelExercise'), { loading: LoaderComponent, ssr: false });
const PersonalCommitmentDeclarationExercise = dynamic(() => import('@/components/paths/PersonalCommitmentDeclarationExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 11
const SupportMapExercise = dynamic(() => import('@/components/paths/SupportMapExercise'), { loading: LoaderComponent, ssr: false });
const BlockingThoughtsExercise = dynamic(() => import('@/components/paths/BlockingThoughtsExercise'), { loading: LoaderComponent, ssr: false });
const NutritiveDrainingSupportMapExercise = dynamic(() => import('@/components/paths/NutritiveDrainingSupportMapExercise'), { loading: LoaderComponent, ssr: false });
const NourishingConversationExercise = dynamic(() => import('@/components/paths/NourishingConversationExercise'), { loading: LoaderComponent, ssr: false });
const ClearRequestMapExercise = dynamic(() => import('@/components/paths/ClearRequestMapExercise'), { loading: LoaderComponent, ssr: false });
const SupportBankExercise = dynamic(() => import('@/components/paths/SupportBankExercise'), { loading: LoaderComponent, ssr: false });
const MutualCareCommitmentExercise = dynamic(() => import('@/components/paths/MutualCareCommitmentExercise'), { loading: LoaderComponent, ssr: false });
const SymbolicSupportCircleExercise = dynamic(() => import('@/components/paths/SymbolicSupportCircleExercise'), { loading: LoaderComponent, ssr: false });
const VitaminMomentExercise = dynamic(() => import('@/components/paths/VitaminMomentExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 12
const EmotionalGratificationMapExercise = dynamic(() => import('@/components/paths/EmotionalGratificationMapExercise'), { loading: LoaderComponent, ssr: false });
const DailyEnergyCheckExercise = dynamic(() => import('@/components/paths/DailyEnergyCheckExercise'), { loading: LoaderComponent, ssr: false });
const DailyWellbeingPlanExercise = dynamic(() => import('@/components/paths/DailyWellbeingPlanExercise'), { loading: LoaderComponent, ssr: false });
const MorningRitualExercise = dynamic(() => import('@/components/paths/MorningRitualExercise'), { loading: LoaderComponent, ssr: false });
const MotivationIn3LayersExercise = dynamic(() => import('@/components/paths/MotivationIn3LayersExercise'), { loading: LoaderComponent, ssr: false });
const VisualizeDayExercise = dynamic(() => import('@/components/paths/VisualizeDayExercise'), { loading: LoaderComponent, ssr: false });
const IlluminatingMemoriesAlbumExercise = dynamic(() => import('@/components/paths/IlluminatingMemoriesAlbumExercise'), { loading: LoaderComponent, ssr: false });
const PositiveEmotionalFirstAidKitExercise = dynamic(() => import('@/components/paths/PositiveEmotionalFirstAidKitExercise'), { loading: LoaderComponent, ssr: false });
// RUTA 13 (NUEVA)
const AnsiedadTieneSentidoExercise = dynamic(() => import('@/components/paths/AnsiedadTieneSentidoExercise'), { loading: LoaderComponent, ssr: false });
const VisualizacionGuiadaCuerpoAnsiedadExercise = dynamic(() => import('@/components/paths/VisualizacionGuiadaCuerpoAnsiedadExercise'), { loading: LoaderComponent, ssr: false });
const StopExercise = dynamic(() => import('@/components/paths/StopExercise'), { loading: LoaderComponent, ssr: false });
const QuestionYourIfsExercise = dynamic(() => import('@/components/paths/QuestionYourIfsExercise'), { loading: LoaderComponent, ssr: false });
const ExposureLadderExercise = dynamic(() => import('@/components/paths/ExposureLadderExercise'), { loading: LoaderComponent, ssr: false });
const CalmVisualizationExercise = dynamic(() => import('@/components/paths/CalmVisualizationExercise'), { loading: LoaderComponent, ssr: false });
const AnxietyReframingExercise = dynamic(() => import('@/components/paths/AnxietyReframingExercise'), { loading: LoaderComponent, ssr: false });

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

function ExerciseCardWithSteps({
  contentItem,
  index,
  path,
  module,
  onExerciseComplete,
}: {
  contentItem: ExerciseContent;
  index: number;
  path: Path;
  module: PathModule;
  onExerciseComplete: () => void;
}) {
  const isCalmBodyMindExercise =
    contentItem.title === 'Ejercicio 1: Calmar tu Cuerpo para Calmar tu Mente';

  const calmBodyMindSteps: ModuleContent[] = isCalmBodyMindExercise
    ? [
        {
          type: 'paragraphWithAudio',
          text:
            '¿Sientes que tu cuerpo se acelera cuando estás en tensión? Respirar más lento, mover el cuerpo o sentir el contacto con tu entorno puede ayudarte más de lo que imaginas.\n\nAquí encontrarás técnicas validadas por la ciencia para calmar tu sistema nervioso. Elige las que más te ayuden y practica durante unos minutos.\nPuedes usarlas cuando notes ansiedad o como parte de tu rutina diaria.\n\nSi lo prefieres, activa el audio y déjate guiar.',
          audioUrl:
            contentItem.content[0]?.type === 'paragraphWithAudio'
              ? contentItem.content[0].audioUrl
              : undefined,
        },
        {
          type: 'paragraph',
          text:
            '<strong>¿Por qué estas técnicas funcionan?</strong>\n¿Por qué ayudan estas técnicas?\nCuando estás en modo alerta —corazón acelerado, cuerpo tenso, mente agitada— tu sistema nervioso intenta protegerte.\nPero si esa activación se mantiene, tu bienestar se ve afectado.\n\nEstas técnicas activan el sistema parasimpático, que envía una señal clara al cuerpo: “ya no estás en peligro”.\n\nPracticar con regularidad te ayuda a recuperar el equilibrio con más facilidad.\n\nEstudios científicos muestran que 8 semanas de práctica de respiración o mindfulness pueden reducir el volumen de la amígdala, el centro del miedo en el cerebro.\nEs decir: estás entrenando tu cuerpo y tu mente para vivir con más calma.',
        },
        {
          type: 'paragraph',
          text:
            '<strong>¿Qué cambia cuando las practicas?</strong>\nEn tu cuerpo:\n• Respiración más profunda y regular\n• Regulación del CO₂ (menos mareos o ahogo)\n• Reducción de tensión muscular\n• Sensaciones de alivio, calor o calma\n\nEn tu mente:\n• Recuperas el control y vuelves al presente\n• Se interrumpe el bucle de pensamientos ansiosos\n• Refuerzas el autocuidado y la conexión contigo\n\nEstas técnicas usan el cuerpo como puerta de entrada al bienestar. Respiración, movimiento, atención plena o contacto sensorial...\nTodas comparten un mismo propósito: ayudarte a regularte y conectar contigo desde un lugar seguro.',
        },
        {
          type: 'paragraph',
          text: '<strong>¿Cuándo puedes usarlas?</strong>\nPuedes usar estas técnicas en el momento, si sientes ansiedad o bloqueo; antes de una situación desafiante; o como rutina diaria para entrenar tu equilibrio.\n\nPracticar no solo te calma en el momento. Te transforma a largo plazo. La calma también se entrena.',
        },
        contentItem.content.find(
          (item): item is ModuleContent => item.type === 'collapsible'
        ) ?? contentItem.content[0],
        {
          type: 'therapeuticNotebookReflection',
          title: 'Registro de experiencia personal',
          prompts: [
            '¿Cómo te sentiste después de practicar alguna de estas técnicas? Escribe aquí tus palabras clave, sensaciones o una breve reflexión que quieras recordar:',
          ],
          savedSummaryText:
            'RESUMEN\n\nCada vez que practicas una técnica de calma, estás enviando un mensaje claro a tu sistema nervioso:\n“No estás en peligro. Puedes estar en paz.”\n\nEstas experiencias repetidas se convierten en nuevas referencias internas. Lo incierto se vuelve más manejable.\nTu cuerpo aprende a activarse menos, calmarse antes y recuperar el equilibrio con mayor facilidad.\n\nEstás construyendo dentro de ti un pequeño refugio al que volver cuando todo alrededor es incierto.\nLa calma deja de ser solo una técnica… y se convierte en una capacidad que forma parte de ti.',
        },
      ]
    : contentItem.content;

  const renderedExerciseContent = isCalmBodyMindExercise ? calmBodyMindSteps : contentItem.content;

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = renderedExerciseContent.length;
  const isStepMode = (contentItem.stepMode === true || isCalmBodyMindExercise) && totalSteps > 1;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Card key={index} className="bg-muted/30 my-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent flex items-center">
          <Edit3 className="mr-2" />
          {contentItem.title}
        </CardTitle>
        {contentItem.audioUrl && (
          <div className="mt-2">
            <audio src={contentItem.audioUrl} controls controlsList="nodownload" className="w-full h-10" />
          </div>
        )}
        {contentItem.objective && <CardDescription className="pt-2">{contentItem.objective}</CardDescription>}
        {contentItem.duration && (
          <p className="text-xs text-muted-foreground pt-1">
            <Clock className="inline h-3 w-3 mr-1" />
            Duracion estimada: {contentItem.duration}
          </p>
        )}
        {isStepMode && (
          <p className="text-xs text-muted-foreground pt-1">
            Paso {currentStep + 1} de {totalSteps}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isStepMode ? (
          <ContentItemRenderer
            key={`${index}-exercise-step-${currentStep}`}
            contentItem={renderedExerciseContent[currentStep]}
            index={currentStep}
            path={path}
            module={module}
            onExerciseComplete={onExerciseComplete}
          />
        ) : (
          renderedExerciseContent.map((item, i) => (
            <ContentItemRenderer
              key={`${index}-exercise-${i}`}
              contentItem={item}
              index={i}
              path={path}
              module={module}
              onExerciseComplete={onExerciseComplete}
            />
          ))
        )}
      </CardContent>
      {isStepMode && (
        <CardFooter className="flex justify-between">
          <Button onClick={prevStep} variant="outline" disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
          >
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
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
  insideCollapsible = false,
}: {
  contentItem: ModuleContent;
  index: number;
  path: Path;
  module: PathModule;
  onExerciseComplete: () => void;
  insideCollapsible?: boolean;
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
  const stripBoldTags = (html: string): string => html.replace(/<\/?(b|strong)>/gi, '');
  const emphasizeStepPrefixes = (html: string): string =>
    html.replace(/(^|<br\s*\/?>)\s*(Paso\s+\d+:)/gi, '$1<strong>$2</strong>');
  const normalizeContentHtml = (html: string): string => {
    const base = insideCollapsible ? stripBoldTags(html) : html;
    return normalizeResourceContentHtml(emphasizeStepPrefixes(base));
  };
  const normalizeQuoteHtml = (html: string): string =>
    normalizeContentHtml(html)
      .trim()
      .replace(/^[\s"'“”‘’«»]+/, '')
      .replace(/[\s"'“”‘’«»]+$/, '');

  switch (contentItem.type) {
    case 'title':
      return (
        <div className="mt-6 mb-3 space-y-3">
          <h3 className="text-xl font-bold text-primary">{contentItem.text}</h3>
          {contentItem.audioUrl && (
            <SafeAudioPlayer src={contentItem.audioUrl} />
          )}
        </div>
      );
    case 'paragraphWithAudio':
      return (
        <div key={index} className="space-y-4 mb-4">
          {contentItem.audioUrl && (
            <SafeAudioPlayer src={contentItem.audioUrl} />
          )}
          <p
            className="text-base leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: normalizeContentHtml(contentItem.text).replace(/\\n/g, '<br />') }}
          />
        </div>
      );
    case 'paragraph':
      return (
        <p
          key={index}
          className="text-base leading-relaxed whitespace-pre-line mb-4"
          dangerouslySetInnerHTML={{ __html: normalizeContentHtml(contentItem.text).replace(/\\n/g, '<br />') }}
        />
      );
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4 text-base leading-relaxed">
          {contentItem.items.map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{
                __html: normalizeContentHtml(item).replace(
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
            <div className="px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <AccordionTrigger className="flex-1 p-0 py-1 text-base font-semibold hover:no-underline text-left">
                  <span>{contentItem.title}</span>
                </AccordionTrigger>
                {contentItem.audioUrl && (
                  <div className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[360px]">
                    <SafeAudioPlayer src={contentItem.audioUrl} compact />
                  </div>
                )}
              </div>
            </div>
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
                    insideCollapsible={true}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'exercise':
      return (
        <ExerciseCardWithSteps
          contentItem={contentItem}
          index={index}
          path={path}
          module={module}
          onExerciseComplete={onExerciseComplete}
        />
      );
    case 'quote':
      return (
        <blockquote
          key={index}
          className={cn("mt-6 italic text-muted-foreground", contentItem.align === 'center' ? "text-center" : "")}
          dangerouslySetInnerHTML={{ __html: normalizeQuoteHtml(contentItem.text) }}
        />
      );
    case 'stressMapExercise':
      return <StressMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'triggerExercise':
      return <TriggerExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'detectiveExercise':
      return <DetectiveExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'demandsExercise':
      return <DemandsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'wellbeingPlanExercise':
      return <WellbeingPlanExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'uncertaintyMapExercise':
      return <UncertaintyMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'controlTrafficLightExercise':
      return <ControlTrafficLightExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'alternativeStoriesExercise':
      return <AlternativeStoriesExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mantraExercise':
      return <MantraExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'ritualDeEntregaConscienteExercise':
        return <RitualDeEntregaConscienteExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'exposureToIntoleranceExercise':
      return <ExposureToIntoleranceExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'delSabotajeALaAccionExercise':
      return <DelSabotajeALaAccionExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'therapeuticNotebookReflection':
      return <TherapeuticNotebookReflectionExercise key={index} content={contentItem} pathId={path.id} pathTitle={path.title} onComplete={handleComplete} />;
    case 'twoMinuteRuleExercise':
      return <TwoMinuteRuleExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'microPlanExercise':
        return <MicroPlanExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'futureSelfVisualizationExercise':
      return <FutureSelfVisualizationExercise key={index} content={contentItem} pathId={path.id} audioUrl={contentItem.audioUrl} onComplete={handleComplete} />;
    case 'realisticRitualExercise':
      return <RealisticRitualExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'gentleTrackingExercise':
      return <GentleTrackingExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'blockageMapExercise':
      return <BlockageMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'compassionateReflectionExercise':
      return <CompassionateReflectionExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mapOfUnsaidThingsExercise':
      return (
        <MapOfUnsaidThingsExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'discomfortCompassExercise':
      return (
        <DiscomfortCompassExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'assertivePhraseExercise':
      return (
        <AssertivePhraseExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'noGuiltTechniquesExercise':
      return (
        <NoGuiltTechniquesExercise
          key={index}
          content={contentItem}
          pathId={path.id}
        />
      );
    case 'secureBoundaryPhraseExercise':
      return (
        <SecureBoundaryPhraseExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'postBoundaryEmotionsExercise':
      return <PostBoundaryEmotionsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'firmAndCalmSelfVisualizationExercise':
      return <FirmAndCalmSelfVisualizationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'compassionateFirmnessExercise':
      return (
        <CompassionateFirmnessExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'selfCareContractExercise':
      return (
        <SelfCareContractExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    // RUTA 5
    case 'authenticityThermometerExercise':
      return (
        <AuthenticityThermometerExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'empatheticDialogueExercise':
      return (
        <EmpatheticDialogueExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'empathicMirrorExercise':
      return (
        <EmpathicMirrorExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'validationIn3StepsExercise':
      return (
        <ValidationIn3StepsExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'empathicShieldVisualizationExercise': {
      return (
        <EmpathicShieldVisualizationExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    }
    case 'activateShieldExercise':
      return <ActivateShieldExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'emotionalInvolvementTrafficLightExercise':
      return (
        <EmotionalInvolvementTrafficLightExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'significantRelationshipsInventoryExercise':
      return (
        <SignificantRelationshipsInventoryExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    case 'relationalCommitmentExercise':
      return (
        <RelationalCommitmentExercise
          key={index}
          content={contentItem}
          pathId={path.id}
          onComplete={handleComplete}
        />
      );
    // RUTA 6
    case 'detectiveDeEmocionesExercise':
        return <DetectiveDeEmocionesExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'unaPalabraCadaDiaExercise':
        return <UnaPalabraCadaDiaExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mapaEmocionNecesidadCuidadoExercise':
        return <MapaEmocionNecesidadCuidadoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'cartaDesdeLaEmocionExercise':
        return <CartaDesdeLaEmocionExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mapaEmocionalRepetidoExercise':
        return <MapaEmocionalRepetidoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'semaforoEmocionalExercise':
        return <SemaforoEmocionalExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'meditacionGuiadaSinJuicioExercise':
        return <MeditacionGuiadaSinJuicioExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'diarioMeDiCuentaExercise':
        return <DiarioMeDiCuentaExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 7
    case 'valuesCompassExercise':
        return <ValuesCompassExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'energySenseMapExercise':
        return <EnergySenseMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'detoursInventoryExercise':
        return <DetoursInventoryExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'presentVsEssentialSelfExercise':
        return <PresentVsEssentialSelfExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mentalNoiseTrafficLightExercise':
        return <MentalNoiseTrafficLightExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'directedDecisionsExercise':
        return <DirectedDecisionsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'senseChecklistExercise':
      return <SenseChecklistExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'unfulfilledNeedsExercise':
        return <UnfulfilledNeedsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'braveRoadmapExercise':
        return <BraveRoadmapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'essentialReminderExercise':
        return <EssentialReminderExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'thoughtsThatBlockPurposeExercise':
        return <ThoughtsThatBlockPurposeExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 8
    case 'resilienceTimelineExercise':
        return <ResilienceTimelineExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'personalDefinitionExercise':
        return <PersonalDefinitionExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'anchorInStormExercise':
        return <AnchorInStormExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'intensityScaleExercise':
        return <IntensityScaleExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'braveDecisionsWheelExercise':
        return <BraveDecisionsWheelExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'planABExercise':
        return <PlanABExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'changeTimelineExercise':
      return <ChangeTimelineExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'myPactExercise':
        return <MyPactExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    // RUTA 9
    case 'coherenceCompassExercise':
      return <CoherenceCompassExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'smallDecisionsLogExercise':
      return <SmallDecisionsLogExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'internalTensionsMapExercise':
      return <InternalTensionsMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'ethicalMirrorExercise':
      return <EthicalMirrorExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'integrityDecisionsExercise':
      return <IntegrityDecisionsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'nonNegotiablesExercise':
      return <NonNegotiablesExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'environmentEvaluationExercise':
      return <EnvironmentEvaluationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'personalManifestoExercise':
      return <PersonalManifestoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 10
    case 'complaintTransformationExercise':
      return <ComplaintTransformationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'guiltRadarExercise':
      return <GuiltRadarExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'acceptanceWritingExercise':
      return <AcceptanceWritingExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'selfAcceptanceAudioExercise': {
        const exerciseContent = contentItem as SelfAcceptanceAudioExerciseContent;
        return <SelfAcceptanceAudioExercise key={index} content={exerciseContent} pathId={path.id} onComplete={handleComplete} audioUrl={exerciseContent.audioUrl} />;
    }
    case 'compassionateResponsibilityContractExercise':
      return <CompassionateResponsibilityContractExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'criticismToGuideExercise':
      return <CriticismToGuideExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'influenceWheelExercise':
      return <InfluenceWheelExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'personalCommitmentDeclarationExercise':
      return <PersonalCommitmentDeclarationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 11
    case 'supportMapExercise':
        return <SupportMapExercise key={index} content={contentItem} pathId={path.id} pathTitle={path.title} moduleTitle={module.title} onComplete={handleComplete} />;
    case 'blockingThoughtsExercise':
      return <BlockingThoughtsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'nutritiveDrainingSupportMapExercise':
      return <NutritiveDrainingSupportMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'nourishingConversationExercise':
      return <NourishingConversationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'clearRequestMapExercise':
        return <ClearRequestMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'supportBankExercise':
        return <SupportBankExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mutualCareCommitmentExercise':
        return <MutualCareCommitmentExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'symbolicSupportCircleExercise':
        return <SymbolicSupportCircleExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'vitaminMomentExercise':
        return <VitaminMomentExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 12
    case 'emotionalGratificationMapExercise':
        return <EmotionalGratificationMapExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'dailyEnergyCheckExercise':
        return <DailyEnergyCheckExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'dailyWellbeingPlanExercise':
        return <DailyWellbeingPlanExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'morningRitualExercise':
        return <MorningRitualExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'motivationIn3LayersExercise':
        return <MotivationIn3LayersExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'visualizeDayExercise':
        return <VisualizeDayExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'illuminatingMemoriesAlbumExercise':
        return <IlluminatingMemoriesAlbumExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'positiveEmotionalFirstAidKitExercise':
        return <PositiveEmotionalFirstAidKitExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 13 (NUEVA)
    case 'ansiedadTieneSentidoExercise':
        return <AnsiedadTieneSentidoExercise key={index} content={contentItem as any} pathId={path.id} onComplete={handleComplete} />;
    case 'visualizacionGuiadaCuerpoAnsiedadExercise':
        return <VisualizacionGuiadaCuerpoAnsiedadExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'stopExercise':
        return <StopExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'questionYourIfsExercise':
      return <QuestionYourIfsExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'exposureLadderExercise':
        return <ExposureLadderExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'calmVisualizationExercise': {
        return <CalmVisualizationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    }
    case 'imaginedCrisisRehearsalExercise':
      return <ImaginedCrisisRehearsalExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'anxietyReframingExercise':
        return <AnxietyReframingExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;

    // ...
    default:
      return null;
  }
}

function RepeatableContentItemRenderer({
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
  const [instanceKey, setInstanceKey] = useState(0);
  const [completedOnce, setCompletedOnce] = useState(false);
  const isRepeatableExercise = contentItem.type === 'exercise' || contentItem.type.endsWith('Exercise');

  const handleExerciseComplete = useCallback(() => {
    setCompletedOnce(true);
    onExerciseComplete();
  }, [onExerciseComplete]);

  const handleRepeat = useCallback(() => {
    if (typeof window !== 'undefined') {
      const prefix = `exercise-progress-${path.id}-`;
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => localStorage.removeItem(key));
    }
    setCompletedOnce(false);
    setInstanceKey(prev => prev + 1);
  }, [path.id]);

  return (
    <div className="space-y-3">
      <div key={`repeatable-${module.id}-${index}-${instanceKey}`}>
        <ContentItemRenderer
          contentItem={contentItem}
          index={index}
          path={path}
          module={module}
          onExerciseComplete={handleExerciseComplete}
        />
      </div>
      {isRepeatableExercise && completedOnce && (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleRepeat}>
            Realizar ejercicio de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}

export function PathDetailClient({ path }: { path: Path }) {
  const t = useTranslations();
  const { toast } = useToast();
  const { user } = useUser();
  const { loadPath, updateModuleCompletion: contextUpdateModuleCompletion } = useActivePath();
  const router = useRouter();
  const pathname = usePathname();

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [uncompleteModuleId, setUncompleteModuleId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pathUnlockInfo, setPathUnlockInfo] = useState<{ isUnlocked: boolean; previousPathTitle?: string }>({ isUnlocked: true });


  useEffect(() => {
    setIsClient(true);
    if (!path) return;

    const updateCompletedState = () => {
      const completed = getCompletedModules(path.id);
      setCompletedModules(completed);
      setPathUnlockInfo(getPathUnlockInfo(path.id, pathsData, getCompletedModules));
      // Actualizar el contexto también para consistencia
      loadPath(path.id, path.title, path.modules.length);
    };

    updateCompletedState(); // Carga inicial

    const handleProgressUpdate = () => {
      updateCompletedState();
    };
    
    window.addEventListener(`progress-updated-${path.id}`, handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate); // Fallback para otras pestañas

    return () => {
      window.removeEventListener(`progress-updated-${path.id}`, handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, [path, loadPath]); // Depender solo de `path` y `loadPath`

  useEffect(() => {
    // Si navegamos fuera de la sección de rutas, podríamos limpiar la ruta activa
    // Esto es opcional y depende del comportamiento deseado
    if (pathname && !pathname.startsWith('/paths/')) {
      // clearActivePath(); // Descomentar si se desea este comportamiento
    }
  }, [pathname]);

  const moduleUnlockMap = useMemo(() => {
    return getModuleUnlockMap(path, completedModules);
  }, [path, completedModules]);

  const completeModule = useCallback((moduleId: string, moduleTitle: string, moduleWeekNumber: number) => {
    if (completedModules.has(moduleId)) {
      return;
    }

    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(moduleId);
    
    setCompletedModules(newCompletedModules);
    saveCompletedModules(path.id, newCompletedModules);
    contextUpdateModuleCompletion(path.id, moduleId, true);

    const routeNumber = getRouteNumber(path.id);
    if (routeNumber) {
      syncRouteProgressCompletion({
        userId: user?.id,
        routeNumber,
        weekNumber: moduleWeekNumber,
      });
    }
    
    toast({
      title: t.moduleCompletedTitle,
      description: t.moduleCompletedMessage.replace('{moduleTitle}', moduleTitle),
      duration: 3000,
    });

    const allModulesCompleted = path.modules.every(m => newCompletedModules.has(m.id));
    if (allModulesCompleted) {
      router.push(`/paths/${path.id}/completed`);
    }
  }, [completedModules, path.id, path.modules, contextUpdateModuleCompletion, user?.id, t, toast, router]);


  const handleToggleComplete = (moduleId: string, moduleTitle: string, moduleWeekNumber: number) => {
    const moduleAccess = moduleUnlockMap.get(moduleId);
    if (moduleAccess && !moduleAccess.isUnlocked) {
      toast({
        title: 'Módulo bloqueado',
        description: moduleAccess.reason ?? 'Completa la semana anterior para continuar.',
        duration: 3000,
      });
      return;
    }

    if (completedModules.has(moduleId)) {
      setUncompleteModuleId(moduleId); // Open confirmation dialog to uncomplete
    } else {
      completeModule(moduleId, moduleTitle, moduleWeekNumber); // Directly complete it
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

  if (!pathUnlockInfo.isUnlocked) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Lock className="h-5 w-5" />
              Ruta bloqueada
            </CardTitle>
            <CardDescription>
              Para acceder a esta ruta primero debes completar la ruta anterior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ruta pendiente: <span className="font-medium">{pathUnlockInfo.previousPathTitle}</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/paths">Volver a rutas</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div
        data-analytics-context="path-overview"
        data-analytics-path-id={path.id}
        data-analytics-path-title={path.title}
      >
        <Card className="mb-12 shadow-xl overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src={`${EXTERNAL_SERVICES_BASE_URL}/imgapp/800x300/${encodeURIComponent(
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
            <p className="text-lg mt-2 text-center">{path.description}</p>
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
      </div>

      <div className="space-y-6">
        {path.modules.map((module) => {
          const moduleIndex = path.modules.findIndex((item) => item.id === module.id);
          const moduleAccess = moduleUnlockMap.get(module.id) ?? { isUnlocked: true };
          const isModuleLocked = !moduleAccess.isUnlocked;
          const moduleWeekNumber = getModuleWeekNumber(module);
          const resolvedModuleWeekNumber = resolveModuleWeekNumber(path, moduleIndex);

          return (
          <ModuleErrorBoundary key={module.id} pathId={path.id} module={module}>
            <div
              data-analytics-context="path-module"
              data-analytics-path-id={path.id}
              data-analytics-path-title={path.title}
              data-analytics-module-id={module.id}
              data-analytics-module-title={module.title}
              data-analytics-week-number={resolvedModuleWeekNumber}
            >
              <Card
                className={`shadow-lg transition-all duration-300 hover:shadow-xl ${
                  completedModules.has(module.id)
                    ? 'border-green-500/50 bg-green-50/30 dark:bg-green-900/10'
                    : 'border-transparent'
                } ${isModuleLocked ? 'opacity-70 pointer-events-none' : ''}`}
              >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    {getModuleIcon(module.type)}
                    <div>
                      <CardTitle className="text-xl text-accent">{module.title}</CardTitle>
                      {module.estimatedTime && (
                        <CardDescription className="flex items-center text-sm">
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
                  {isModuleLocked && (
                    <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">
                      <Lock className="mr-1.5 h-3.5 w-3.5" />
                      Bloqueado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
              {isModuleLocked ? (
                <p className="text-sm text-muted-foreground">{moduleAccess.reason}</p>
              ) : module.content.map((contentItem, i) => (
                <ContentItemErrorBoundary
                  key={i}
                  pathId={path.id}
                  module={module}
                  index={i}
                  contentItem={contentItem}
                >
                  {getSharedDuration(contentItem) && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Duración estimada:</span>{' '}
                      {getSharedDuration(contentItem)}
                    </p>
                  )}
                  <RepeatableContentItemRenderer
                    contentItem={contentItem}
                    index={i}
                    path={path}
                    module={module}
                    onExerciseComplete={() => completeModule(
                      module.id,
                      module.title,
                      resolvedModuleWeekNumber
                    )}
                  />
                </ContentItemErrorBoundary>
              ))}

              </CardContent>
              <CardFooter>
                 <Button
                  onClick={() => handleToggleComplete(
                    module.id,
                    module.title,
                    resolvedModuleWeekNumber
                  )}
                  variant={completedModules.has(module.id) ? 'default' : 'secondary'}
                  className={completedModules.has(module.id) ? 'bg-green-600 hover:bg-green-700' : ''}
                  disabled={isModuleLocked}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isModuleLocked ? "Módulo bloqueado" : completedModules.has(module.id) ? "Completado" : "Marcar como completado"}
                </Button>
              </CardFooter>
              </Card>
            </div>
          </ModuleErrorBoundary>
          );
        })}
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
    </div>
  );
}
