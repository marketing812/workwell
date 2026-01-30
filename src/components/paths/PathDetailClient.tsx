

"use client";

import React, { type ReactNode, useState, useEffect, useCallback, type FormEvent } from 'react';
import dynamic from 'next/dynamic';

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
import { useRouter } from 'next/navigation';

const LoaderComponent = () => <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

// RUTA 1
const StressMapExercise = dynamic(() => import('@/components/paths/StressMapExercise').then(mod => mod.default || mod.StressMapExercise), { loading: LoaderComponent, ssr: false });
const TriggerExercise = dynamic(() => import('@/components/paths/TriggerExercise').then(mod => mod.default || mod.TriggerExercise), { loading: LoaderComponent, ssr: false });
const DetectiveExercise = dynamic(() => import('@/components/paths/DetectiveExercise').then(mod => mod.default || mod.DetectiveExercise), { loading: LoaderComponent, ssr: false });
const DemandsExercise = dynamic(() => import('@/components/paths/DemandsExercise').then(mod => mod.default || mod.DemandsExercise), { loading: LoaderComponent, ssr: false });
const WellbeingPlanExercise = dynamic(() => import('@/components/paths/WellbeingPlanExercise').then(mod => mod.default || mod.WellbeingPlanExercise), { loading: LoaderComponent, ssr: false });
// RUTA 2
const UncertaintyMapExercise = dynamic(() => import('@/components/paths/UncertaintyMapExercise').then(mod => mod.default || mod.UncertaintyMapExercise), { loading: LoaderComponent, ssr: false });
const ControlTrafficLightExercise = dynamic(() => import('@/components/paths/ControlTrafficLightExercise').then(mod => mod.ControlTrafficLightExercise || mod.default), { loading: LoaderComponent, ssr: false });
const AlternativeStoriesExercise = dynamic(() => import('@/components/paths/AlternativeStoriesExercise').then(mod => mod.AlternativeStoriesExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MantraExercise = dynamic(() => import('@/components/paths/MantraExercise').then(mod => mod.MantraExercise || mod.default), { loading: LoaderComponent, ssr: false });
const RitualDeEntregaConscienteExercise = dynamic(() => import('@/components/paths/RitualDeEntregaConscienteExercise').then(mod => mod.RitualDeEntregaConscienteExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ExposureToIntoleranceExercise = dynamic(() => import('@/components/paths/ExposureToIntoleranceExercise').then(mod => mod.ExposureToIntoleranceExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 3
const DelSabotajeALaAccionExercise = dynamic(() => import('@/components/paths/DelSabotajeALaAccionExercise').then(mod => mod.DelSabotajeALaAccionExercise || mod.default), { loading: LoaderComponent, ssr: false });
const TwoMinuteRuleExercise = dynamic(() => import('@/components/paths/TwoMinuteRuleExercise').then(mod => mod.TwoMinuteRuleExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MicroPlanExercise = dynamic(() => import('@/components/paths/MicroPlanExercise').then(mod => mod.MicroPlanExercise || mod.default), { loading: LoaderComponent, ssr: false });
const FutureSelfVisualizationExercise = dynamic(() => import('@/components/paths/FutureSelfVisualizationExercise').then(mod => mod.FutureSelfVisualizationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const RealisticRitualExercise = dynamic(() => import('@/components/paths/RealisticRitualExercise').then(mod => mod.RealisticRitualExercise || mod.default), { loading: LoaderComponent, ssr: false });
const GentleTrackingExercise = dynamic(() => import('@/components/paths/GentleTrackingExercise').then(mod => mod.GentleTrackingExercise || mod.default), { loading: LoaderComponent, ssr: false });
const BlockageMapExercise = dynamic(() => import('@/components/paths/BlockageMapExercise').then(mod => mod.default || mod.BlockageMapExercise), { loading: LoaderComponent, ssr: false });
const CompassionateReflectionExercise = dynamic(() => import('@/components/paths/CompassionateReflectionExercise').then(mod => mod.CompassionateReflectionExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 4
const MapOfUnsaidThingsExercise = dynamic(() => import('@/components/paths/MapOfUnsaidThingsExercise').then(mod => mod.MapOfUnsaidThingsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DiscomfortCompassExercise = dynamic(() => import('@/components/paths/DiscomfortCompassExercise').then(mod => mod.DiscomfortCompassExercise || mod.default), { loading: LoaderComponent, ssr: false });
const AssertivePhraseExercise = dynamic(() => import('@/components/paths/AssertivePhraseExercise').then(mod => mod.AssertivePhraseExercise || mod.default), { loading: LoaderComponent, ssr: false });
const NoGuiltTechniquesExercise = dynamic(() => import('@/components/paths/NoGuiltTechniquesExercise').then(mod => mod.NoGuiltTechniquesExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SecureBoundaryPhraseExercise = dynamic(() => import('@/components/paths/SecureBoundaryPhraseExercise').then(mod => mod.SecureBoundaryPhraseExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PostBoundaryEmotionsExercise = dynamic(() => import('@/components/paths/PostBoundaryEmotionsExercise').then(mod => mod.PostBoundaryEmotionsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const FirmAndCalmSelfVisualizationExercise = dynamic(() => import('@/components/paths/FirmAndCalmSelfVisualizationExercise').then(mod => mod.FirmAndCalmSelfVisualizationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const CompassionateFirmnessExercise = dynamic(() => import('@/components/paths/CompassionateFirmnessExercise').then(mod => mod.CompassionateFirmnessExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SelfCareContractExercise = dynamic(() => import('@/components/paths/SelfCareContractExercise').then(mod => mod.SelfCareContractExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 5
const AuthenticityThermometerExercise = dynamic(() => import('@/components/paths/AuthenticityThermometerExercise').then(mod => mod.AuthenticityThermometerExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EmpatheticDialogueExercise = dynamic(() => import('@/components/paths/EmpatheticDialogueExercise').then(mod => mod.EmpatheticDialogueExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EmpathicMirrorExercise = dynamic(() => import('@/components/paths/EmpathicMirrorExercise').then(mod => mod.EmpathicMirrorExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ValidationIn3StepsExercise = dynamic(() => import('@/components/paths/ValidationIn3StepsExercise').then(mod => mod.ValidationIn3StepsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EmpathicShieldVisualizationExercise = dynamic(() => import('@/components/paths/EmpathicShieldVisualizationExercise').then(mod => mod.EmpathicShieldVisualizationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EmotionalInvolvementTrafficLightExercise = dynamic(() => import('@/components/paths/EmotionalInvolvementTrafficLightExercise').then(mod => mod.EmotionalInvolvementTrafficLightExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SignificantRelationshipsInventoryExercise = dynamic(() => import('@/components/paths/SignificantRelationshipsInventoryExercise').then(mod => mod.SignificantRelationshipsInventoryExercise || mod.default), { loading: LoaderComponent, ssr: false });
const RelationalCommitmentExercise = dynamic(() => import('@/components/paths/RelationalCommitmentExercise').then(mod => mod.RelationalCommitmentExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 6
const DetectiveDeEmocionesExercise = dynamic(() => import('@/components/paths/DetectiveDeEmocionesExercise').then(mod => mod.DetectiveDeEmocionesExercise || mod.default), { loading: LoaderComponent, ssr: false });
const UnaPalabraCadaDiaExercise = dynamic(() => import('@/components/paths/UnaPalabraCadaDiaExercise').then(mod => mod.UnaPalabraCadaDiaExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MapaEmocionNecesidadCuidadoExercise = dynamic(() => import('@/components/paths/MapaEmocionNecesidadCuidadoExercise').then(mod => mod.MapaEmocionNecesidadCuidadoExercise || mod.default), { loading: LoaderComponent, ssr: false });
const CartaDesdeLaEmocionExercise = dynamic(() => import('@/components/paths/CartaDesdeLaEmocionExercise').then(mod => mod.CartaDesdeLaEmocionExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MapaEmocionalRepetidoExercise = dynamic(() => import('@/components/paths/MapaEmocionalRepetidoExercise').then(mod => mod.MapaEmocionalRepetidoExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SemaforoEmocionalExercise = dynamic(() => import('@/components/paths/SemaforoEmocionalExercise').then(mod => mod.SemaforoEmocionalExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MeditacionGuiadaSinJuicioExercise = dynamic(() => import('@/components/paths/MeditacionGuiadaSinJuicioExercise').then(mod => mod.MeditacionGuiadaSinJuicioExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DiarioMeDiCuentaExercise = dynamic(() => import('@/components/paths/DiarioMeDiCuentaExercise').then(mod => mod.DiarioMeDiCuentaExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 7
const ValuesCompassExercise = dynamic(() => import('@/components/paths/ValuesCompassExercise').then(mod => mod.ValuesCompassExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EnergySenseMapExercise = dynamic(() => import('@/components/paths/EnergySenseMapExercise').then(mod => mod.EnergySenseMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DetoursInventoryExercise = dynamic(() => import('@/components/paths/DetoursInventoryExercise').then(mod => mod.DetoursInventoryExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PresentVsEssentialSelfExercise = dynamic(() => import('@/components/paths/PresentVsEssentialSelfExercise').then(mod => mod.PresentVsEssentialSelfExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MentalNoiseTrafficLightExercise = dynamic(() => import('@/components/paths/MentalNoiseTrafficLightExercise').then(mod => mod.MentalNoiseTrafficLightExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DirectedDecisionsExercise = dynamic(() => import('@/components/paths/DirectedDecisionsExercise').then(mod => mod.DirectedDecisionsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SenseChecklistExercise = dynamic(() => import('@/components/paths/SenseChecklistExercise').then(mod => mod.SenseChecklistExercise || mod.default), { loading: LoaderComponent, ssr: false });
const UnfulfilledNeedsExercise = dynamic(() => import('@/components/paths/UnfulfilledNeedsExercise').then(mod => mod.UnfulfilledNeedsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const BraveRoadmapExercise = dynamic(() => import('@/components/paths/BraveRoadmapExercise').then(mod => mod.BraveRoadmapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EssentialReminderExercise = dynamic(() => import('@/components/paths/EssentialReminderExercise').then(mod => mod.EssentialReminderExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ThoughtsThatBlockPurposeExercise = dynamic(() => import('@/components/paths/ThoughtsThatBlockPurposeExercise').then(mod => mod.ThoughtsThatBlockPurposeExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 8
const ResilienceTimelineExercise = dynamic(() => import('@/components/paths/ResilienceTimelineExercise').then(mod => mod.ResilienceTimelineExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PersonalDefinitionExercise = dynamic(() => import('@/components/paths/PersonalDefinitionExercise').then(mod => mod.PersonalDefinitionExercise || mod.default), { loading: LoaderComponent, ssr: false });
const AnchorInStormExercise = dynamic(() => import('@/components/paths/AnchorInStormExercise').then(mod => mod.AnchorInStormExercise || mod.default), { loading: LoaderComponent, ssr: false });
const IntensityScaleExercise = dynamic(() => import('@/components/paths/IntensityScaleExercise').then(mod => mod.IntensityScaleExercise || mod.default), { loading: LoaderComponent, ssr: false });
const BraveDecisionsWheelExercise = dynamic(() => import('@/components/paths/BraveDecisionsWheelExercise').then(mod => mod.BraveDecisionsWheelExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PlanABExercise = dynamic(() => import('@/components/paths/PlanABExercise').then(mod => mod.PlanABExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ChangeTimelineExercise = dynamic(() => import('@/components/paths/ChangeTimelineExercise').then(mod => mod.ChangeTimelineExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MyPactExercise = dynamic(() => import('@/components/paths/MyPactExercise').then(mod => mod.MyPactExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 9
const CoherenceCompassExercise = dynamic(() => import('@/components/paths/CoherenceCompassExercise').then(mod => mod.CoherenceCompassExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SmallDecisionsLogExercise = dynamic(() => import('@/components/paths/SmallDecisionsLogExercise').then(mod => mod.SmallDecisionsLogExercise || mod.default), { loading: LoaderComponent, ssr: false });
const InternalTensionsMapExercise = dynamic(() => import('@/components/paths/InternalTensionsMapExercise').then(mod => mod.InternalTensionsMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EthicalMirrorExercise = dynamic(() => import('@/components/paths/EthicalMirrorExercise').then(mod => mod.EthicalMirrorExercise || mod.default), { loading: LoaderComponent, ssr: false });
const IntegrityDecisionsExercise = dynamic(() => import('@/components/paths/IntegrityDecisionsExercise').then(mod => mod.IntegrityDecisionsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const NonNegotiablesExercise = dynamic(() => import('@/components/paths/NonNegotiablesExercise').then(mod => mod.NonNegotiablesExercise || mod.default), { loading: LoaderComponent, ssr: false });
const EnvironmentEvaluationExercise = dynamic(() => import('@/components/paths/EnvironmentEvaluationExercise').then(mod => mod.EnvironmentEvaluationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PersonalManifestoExercise = dynamic(() => import('@/components/paths/PersonalManifestoExercise').then(mod => mod.PersonalManifestoExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 10
const ComplaintTransformationExercise = dynamic(() => import('@/components/paths/ComplaintTransformationExercise').then(mod => mod.ComplaintTransformationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const GuiltRadarExercise = dynamic(() => import('@/components/paths/GuiltRadarExercise').then(mod => mod.GuiltRadarExercise || mod.default), { loading: LoaderComponent, ssr: false });
const AcceptanceWritingExercise = dynamic(() => import('@/components/paths/AcceptanceWritingExercise').then(mod => mod.AcceptanceWritingExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SelfAcceptanceAudioExercise = dynamic(() => import('@/components/paths/SelfAcceptanceAudioExercise').then(mod => mod.SelfAcceptanceAudioExercise || mod.default), { loading: LoaderComponent, ssr: false });
const CompassionateResponsibilityContractExercise = dynamic(() => import('@/components/paths/CompassionateResponsibilityContractExercise').then(mod => mod.CompassionateResponsibilityContractExercise || mod.default), { loading: LoaderComponent, ssr: false });
const CriticismToGuideExercise = dynamic(() => import('@/components/paths/CriticismToGuideExercise').then(mod => mod.CriticismToGuideExercise || mod.default), { loading: LoaderComponent, ssr: false });
const InfluenceWheelExercise = dynamic(() => import('@/components/paths/InfluenceWheelExercise').then(mod => mod.InfluenceWheelExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PersonalCommitmentDeclarationExercise = dynamic(() => import('@/components/paths/PersonalCommitmentDeclarationExercise').then(mod => mod.PersonalCommitmentDeclarationExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 11
const SupportMapExercise = dynamic(() => import('@/components/paths/SupportMapExercise').then(mod => mod.SupportMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const BlockingThoughtsExercise = dynamic(() => import('@/components/paths/BlockingThoughtsExercise').then(mod => mod.BlockingThoughtsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const NutritiveDrainingSupportMapExercise = dynamic(() => import('@/components/paths/NutritiveDrainingSupportMapExercise').then(mod => mod.NutritiveDrainingSupportMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const NourishingConversationExercise = dynamic(() => import('@/components/paths/NourishingConversationExercise').then(mod => mod.NourishingConversationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ClearRequestMapExercise = dynamic(() => import('@/components/paths/ClearRequestMapExercise').then(mod => mod.ClearRequestMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SupportBankExercise = dynamic(() => import('@/components/paths/SupportBankExercise').then(mod => mod.SupportBankExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MutualCareCommitmentExercise = dynamic(() => import('@/components/paths/MutualCareCommitmentExercise').then(mod => mod.MutualCareCommitmentExercise || mod.default), { loading: LoaderComponent, ssr: false });
const SymbolicSupportCircleExercise = dynamic(() => import('@/components/paths/SymbolicSupportCircleExercise').then(mod => mod.SymbolicSupportCircleExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 12
const EmotionalGratificationMapExercise = dynamic(() => import('@/components/paths/EmotionalGratificationMapExercise').then(mod => mod.EmotionalGratificationMapExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DailyEnergyCheckExercise = dynamic(() => import('@/components/paths/DailyEnergyCheckExercise').then(mod => mod.DailyEnergyCheckExercise || mod.default), { loading: LoaderComponent, ssr: false });
const DailyWellbeingPlanExercise = dynamic(() => import('@/components/paths/DailyWellbeingPlanExercise').then(mod => mod.DailyWellbeingPlanExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MorningRitualExercise = dynamic(() => import('@/components/paths/MorningRitualExercise').then(mod => mod.MorningRitualExercise || mod.default), { loading: LoaderComponent, ssr: false });
const MotivationIn3LayersExercise = dynamic(() => import('@/components/paths/MotivationIn3LayersExercise').then(mod => mod.MotivationIn3LayersExercise || mod.default), { loading: LoaderComponent, ssr: false });
const VisualizeDayExercise = dynamic(() => import('@/components/paths/VisualizeDayExercise').then(mod => mod.VisualizeDayExercise || mod.default), { loading: LoaderComponent, ssr: false });
const IlluminatingMemoriesAlbumExercise = dynamic(() => import('@/components/paths/IlluminatingMemoriesAlbumExercise').then(mod => mod.IlluminatingMemoriesAlbumExercise || mod.default), { loading: LoaderComponent, ssr: false });
const PositiveEmotionalFirstAidKitExercise = dynamic(() => import('@/components/paths/PositiveEmotionalFirstAidKitExercise').then(mod => mod.PositiveEmotionalFirstAidKitExercise || mod.default), { loading: LoaderComponent, ssr: false });
// RUTA 13 (NUEVA)
const AnsiedadTieneSentidoExercise = dynamic(() => import('@/components/paths/AnsiedadTieneSentidoExercise').then(mod => mod.AnsiedadTieneSentidoExercise || mod.default), { loading: LoaderComponent, ssr: false });
const VisualizacionGuiadaCuerpoAnsiedadExercise = dynamic(() => import('@/components/paths/VisualizacionGuiadaCuerpoAnsiedadExercise').then(mod => mod.VisualizacionGuiadaCuerpoAnsiedadExercise || mod.default), { loading: LoaderComponent, ssr: false });
const StopExercise = dynamic(() => import('@/components/paths/StopExercise').then(mod => mod.StopExercise || mod.default), { loading: LoaderComponent, ssr: false });
const QuestionYourIfsExercise = dynamic(() => import('@/components/paths/QuestionYourIfsExercise').then(mod => mod.QuestionYourIfsExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ExposureLadderExercise = dynamic(() => import('@/components/paths/ExposureLadderExercise').then(mod => mod.ExposureLadderExercise || mod.default), { loading: LoaderComponent, ssr: false });
const CalmVisualizationExercise = dynamic(() => import('@/components/paths/CalmVisualizationExercise').then(mod => mod.CalmVisualizationExercise || mod.default), { loading: LoaderComponent, ssr: false });
const ImaginedCrisisRehearsalExercise = dynamic(() => import('@/components/paths/ImaginedCrisisRehearsalExercise').then(mod => mod.ImaginedCrisisRehearsalExercise || mod.default), { loading: LoaderComponent, ssr: false });
const AnxietyReframingExercise = dynamic(() => import('@/components/paths/AnxietyReframingExercise').then(mod => mod.AnxietyReframingExercise || mod.default), { loading: LoaderComponent, ssr: false });
const TherapeuticNotebookReflectionExercise = dynamic(() => import('@/components/paths/TherapeuticNotebookReflectionExercise').then(mod => mod.default), { loading: LoaderComponent, ssr: false });

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
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4 text-base leading-relaxed">
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
            contentItem.align === 'center' 
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
      return <UncertaintyMapExercise key={index} content={contentItem} />;
    case 'controlTrafficLightExercise':
      return <ControlTrafficLightExercise key={index} content={contentItem} />;
    case 'alternativeStoriesExercise':
      return <AlternativeStoriesExercise key={index} content={contentItem} />;
    case 'mantraExercise':
      return <MantraExercise key={index} content={contentItem} />;
    case 'ritualDeEntregaConscienteExercise':
        return <RitualDeEntregaConscienteExercise key={index} content={contentItem} pathId={path.id} />;
    case 'exposureToIntoleranceExercise':
      return <ExposureToIntoleranceExercise key={index} content={contentItem} pathId={path.id} />;
    case 'delSabotajeALaAccionExercise':
      return <DelSabotajeALaAccionExercise key={index} content={contentItem} />;
    case 'therapeuticNotebookReflection':
      return <TherapeuticNotebookReflectionExercise key={index} content={contentItem} pathId={path.id} pathTitle={path.title} onComplete={handleComplete} />;
    case 'twoMinuteRuleExercise':
      return <TwoMinuteRuleExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'microPlanExercise':
        return <MicroPlanExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    case 'futureSelfVisualizationExercise':
      return <FutureSelfVisualizationExercise key={index} content={contentItem} pathId={path.id} audioUrl={contentItem.audioUrl} />;
    case 'realisticRitualExercise':
      return <RealisticRitualExercise key={index} content={contentItem} pathId={path.id} />;
    case 'gentleTrackingExercise':
      return <GentleTrackingExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'blockageMapExercise':
      return <BlockageMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'compassionateReflectionExercise':
      return <CompassionateReflectionExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mapOfUnsaidThingsExercise':
      return (
        <MapOfUnsaidThingsExercise
          key={index}
          content={contentItem}
          pathId={path.id}
        />
      );
    case 'discomfortCompassExercise':
      return (
        <DiscomfortCompassExercise
          key={index}
          content={contentItem}
          pathId={path.id}
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
        />
      );
    case 'postBoundaryEmotionsExercise':
      return <PostBoundaryEmotionsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'firmAndCalmSelfVisualizationExercise':
      return <FirmAndCalmSelfVisualizationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'compassionateFirmnessExercise':
      return (
        <CompassionateFirmnessExercise
          key={index}
          content={contentItem}
          pathId={path.id}
        />
      );
    case 'selfCareContractExercise':
      return (
        <SelfCareContractExercise
          key={index}
          content={contentItem}
          pathId={path.id}
        />
      );
    // RUTA 5
    case 'authenticityThermometerExercise':
      return (
        <AuthenticityThermometerExercise
          key={index}
          content={contentItem}
          pathId={path.id}
        />
      );
    case 'empatheticDialogueExercise':
      return (
        <EmpatheticDialogueExercise
          key={index}
          content={contentItem}
          pathId={path.id}
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
    case 'emotionalInvolvementTrafficLightExercise':
      return (
        <EmotionalInvolvementTrafficLightExercise
          key={index}
          content={contentItem}
          pathId={path.id}
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
        />
      );
    // RUTA 6
    case 'detectiveDeEmocionesExercise':
        return <DetectiveDeEmocionesExercise key={index} content={contentItem} pathId={path.id} />;
    case 'unaPalabraCadaDiaExercise':
        return <UnaPalabraCadaDiaExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'mapaEmocionNecesidadCuidadoExercise':
        return <MapaEmocionNecesidadCuidadoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'cartaDesdeLaEmocionExercise':
        return <CartaDesdeLaEmocionExercise key={index} content={contentItem} pathId={path.id} />;
    case 'mapaEmocionalRepetidoExercise':
        return <MapaEmocionalRepetidoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'semaforoEmocionalExercise':
        return <SemaforoEmocionalExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'meditacionGuiadaSinJuicioExercise':
        return <MeditacionGuiadaSinJuicioExercise key={index} content={contentItem} pathId={path.id} />;
    case 'diarioMeDiCuentaExercise':
        return <DiarioMeDiCuentaExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 7
    case 'valuesCompassExercise':
        return <ValuesCompassExercise key={index} content={contentItem} pathId={path.id} />;
    case 'energySenseMapExercise':
        return <EnergySenseMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'detoursInventoryExercise':
        return <DetoursInventoryExercise key={index} content={contentItem} pathId={path.id} />;
    case 'presentVsEssentialSelfExercise':
        return <PresentVsEssentialSelfExercise key={index} content={contentItem} pathId={path.id} />;
    case 'mentalNoiseTrafficLightExercise':
        return <MentalNoiseTrafficLightExercise key={index} content={contentItem} pathId={path.id} />;
    case 'directedDecisionsExercise':
        return <DirectedDecisionsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'senseChecklistExercise':
      return <SenseChecklistExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'unfulfilledNeedsExercise':
        return <UnfulfilledNeedsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'braveRoadmapExercise':
        return <BraveRoadmapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'essentialReminderExercise':
        return <EssentialReminderExercise key={index} content={contentItem} pathId={path.id} />;
    case 'thoughtsThatBlockPurposeExercise':
        return <ThoughtsThatBlockPurposeExercise key={index} content={contentItem} pathId={path.id} />;
    // RUTA 8
    case 'resilienceTimelineExercise':
        return <ResilienceTimelineExercise key={index} content={contentItem} pathId={path.id} />;
    case 'personalDefinitionExercise':
        return <PersonalDefinitionExercise key={index} content={contentItem} pathId={path.id} />;
    case 'anchorInStormExercise':
        return <AnchorInStormExercise key={index} content={contentItem} pathId={path.id} />;
    case 'intensityScaleExercise':
        return <IntensityScaleExercise key={index} content={contentItem} pathId={path.id} />;
    case 'braveDecisionsWheelExercise':
        return <BraveDecisionsWheelExercise key={index} content={contentItem} pathId={path.id} />;
    case 'planABExercise':
        return <PlanABExercise key={index} content={contentItem} pathId={path.id} />;
    case 'changeTimelineExercise':
      return <ChangeTimelineExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'myPactExercise':
        return <MyPactExercise key={index} content={contentItem} pathId={path.id} />;
    // RUTA 9
    case 'coherenceCompassExercise':
      return <CoherenceCompassExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    case 'smallDecisionsLogExercise':
      return <SmallDecisionsLogExercise key={index} content={contentItem} pathId={path.id} />;
    case 'internalTensionsMapExercise':
      return <InternalTensionsMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'ethicalMirrorExercise':
      return <EthicalMirrorExercise key={index} content={contentItem} pathId={path.id} />;
    case 'integrityDecisionsExercise':
      return <IntegrityDecisionsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'nonNegotiablesExercise':
      return <NonNegotiablesExercise key={index} content={contentItem} pathId={path.id} />;
    case 'environmentEvaluationExercise':
      return <EnvironmentEvaluationExercise key={index} content={contentItem} pathId={path.id} />;
    case 'personalManifestoExercise':
      return <PersonalManifestoExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;
    // RUTA 10
    case 'complaintTransformationExercise':
      return <ComplaintTransformationExercise key={index} content={contentItem} pathId={path.id} />;
    case 'guiltRadarExercise':
      return <GuiltRadarExercise key={index} content={contentItem} pathId={path.id} />;
    case 'acceptanceWritingExercise':
      return <AcceptanceWritingExercise key={index} content={contentItem} pathId={path.id} />;
    case 'selfAcceptanceAudioExercise': {
        const exerciseContent = contentItem as SelfAcceptanceAudioExerciseContent;
        return <SelfAcceptanceAudioExercise key={index} content={exerciseContent} pathId={path.id} onComplete={handleComplete} audioUrl={exerciseContent.audioUrl} />;
    }
    case 'compassionateResponsibilityContractExercise':
      return <CompassionateResponsibilityContractExercise key={index} content={contentItem} pathId={path.id} />;
    case 'criticismToGuideExercise':
      return <CriticismToGuideExercise key={index} content={contentItem} pathId={path.id} />;
    case 'influenceWheelExercise':
      return <InfluenceWheelExercise key={index} content={contentItem} pathId={path.id} />;
    case 'personalCommitmentDeclarationExercise':
      return <PersonalCommitmentDeclarationExercise key={index} content={contentItem} pathId={path.id} />;
    // RUTA 11
    case 'supportMapExercise':
        return <SupportMapExercise key={index} content={contentItem} pathId={path.id} pathTitle={path.title} moduleTitle={module.title} />;
    case 'blockingThoughtsExercise':
      return <BlockingThoughtsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'nutritiveDrainingSupportMapExercise':
      return <NutritiveDrainingSupportMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'nourishingConversationExercise':
      return <NourishingConversationExercise key={index} content={contentItem} pathId={path.id} />;
    case 'clearRequestMapExercise':
        return <ClearRequestMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'supportBankExercise':
        return <SupportBankExercise key={index} content={contentItem} pathId={path.id} />;
    case 'mutualCareCommitmentExercise':
        return <MutualCareCommitmentExercise key={index} content={contentItem} pathId={path.id} />;
    case 'symbolicSupportCircleExercise':
        return <SymbolicSupportCircleExercise key={index} content={contentItem} pathId={path.id} />;
    // RUTA 12
    case 'emotionalGratificationMapExercise':
        return <EmotionalGratificationMapExercise key={index} content={contentItem} pathId={path.id} />;
    case 'dailyEnergyCheckExercise':
        return <DailyEnergyCheckExercise key={index} content={contentItem} pathId={path.id} />;
    case 'dailyWellbeingPlanExercise':
        return <DailyWellbeingPlanExercise key={index} content={contentItem} pathId={path.id} />;
    case 'morningRitualExercise':
        return <MorningRitualExercise key={index} content={contentItem} pathId={path.id} />;
    case 'motivationIn3LayersExercise':
        return <MotivationIn3LayersExercise key={index} content={contentItem} pathId={path.id} />;
    case 'visualizeDayExercise':
        return <VisualizeDayExercise key={index} content={contentItem} pathId={path.id} />;
    case 'illuminatingMemoriesAlbumExercise':
        return <IlluminatingMemoriesAlbumExercise key={index} content={contentItem} pathId={path.id} />;
    case 'positiveEmotionalFirstAidKitExercise':
        return <PositiveEmotionalFirstAidKitExercise key={index} content={contentItem} pathId={path.id} />;
    // RUTA 13 (NUEVA)
    case 'ansiedadTieneSentidoExercise':
        return <AnsiedadTieneSentidoExercise key={index} content={contentItem} pathId={path.id} />;
    case 'visualizacionGuiadaCuerpoAnsiedadExercise':
        return <VisualizacionGuiadaCuerpoAnsiedadExercise key={index} content={contentItem} pathId={path.id} />;
    case 'stopExercise':
        return <StopExercise key={index} content={contentItem} pathId={path.id} />;
    case 'questionYourIfsExercise':
      return <QuestionYourIfsExercise key={index} content={contentItem} pathId={path.id} />;
    case 'exposureLadderExercise':
        return <ExposureLadderExercise key={index} content={contentItem} pathId={path.id} />;
    case 'calmVisualizationExercise': {
        return <CalmVisualizationExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete}/>;
    }
    case 'imaginedCrisisRehearsalExercise': {
      return <ImaginedCrisisRehearsalExercise key={index} content={contentItem} pathId={path.id} />;
    }
    case 'anxietyReframingExercise':
        return <AnxietyReframingExercise key={index} content={contentItem} pathId={path.id} onComplete={handleComplete} />;

    // ...
    default:
      return null;
  }
}

export function PathDetailClient({ path }: { path: Path }) {
  const t = useTranslations();
  const { toast } = useToast();
  const { loadPath, updateModuleCompletion: contextUpdateModuleCompletion } = useActivePath();
  const router = useRouter();

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
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
      router.push(`/paths/${path.id}/completed`);
    }
  }, [completedModules, path.id, path.modules, contextUpdateModuleCompletion, t, toast, router]);


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
    </div>
  );
}
