
export type ParagraphContent = {
  type: 'paragraph';
  text: string;
};

export type ParagraphWithAudioContent = {
  type: 'paragraphWithAudio';
  text: string;
  audioUrl?: string;
};

export type TitleContent = {
  type: 'title';
  text: string;
  audioUrl?: string;
};

export type ListContent = {
  type: 'list';
  items: string[];
};

export type QuoteContent = {
  type: 'quote';
  text: string;
  align?: 'center' | 'left' | 'right';
};

export type CollapsibleContent = {
  type: 'collapsible';
  title: string;
  content: ModuleContent[];
  audioUrl?: string;
};

export type ExerciseContent = {
    type: 'exercise';
    title: string;
    objective?: string;
    duration?: string;
    content: ModuleContent[];
    audioUrl?: string;
};

export type StressMapExerciseContent = {
    type: 'stressMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type TriggerExerciseContent = {
    type: 'triggerExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type TherapeuticNotebookReflection = {
    type: 'therapeuticNotebookReflection';
    title: string;
    prompts: string[];
    audioUrl?: string;
}

export type DetectiveExerciseContent = {
    type: 'detectiveExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DemandsExerciseContent = {
    type: 'demandsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type WellbeingPlanExerciseContent = {
    type: 'wellbeingPlanExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type UncertaintyMapExerciseContent = {
    type: 'uncertaintyMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type ControlTrafficLightExerciseContent = {
    type: 'controlTrafficLightExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type AlternativeStoriesExerciseContent = {
    type: 'alternativeStoriesExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MantraExerciseContent = {
    type: 'mantraExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type RitualDeEntregaConscienteExerciseContent = {
    type: 'ritualDeEntregaConscienteExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DelSabotajeALaAccionExerciseContent = {
    type: 'delSabotajeALaAccionExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type TwoMinuteRuleExerciseContent = {
    type: 'twoMinuteRuleExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MicroPlanExerciseContent = {
    type: 'microPlanExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type FutureSelfVisualizationExerciseContent = {
    type: 'futureSelfVisualizationExercise';
    title: string;
    objective: string;
    duration?: string;
    audioUrl?: string;
};

export type RealisticRitualExerciseContent = {
    type: 'realisticRitualExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type GentleTrackingExerciseContent = {
    type: 'gentleTrackingExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type BlockageMapExerciseContent = {
  type: 'blockageMapExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type CompassionateReflectionExerciseContent = {
  type: 'compassionateReflectionExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type MapOfUnsaidThingsExerciseContent = {
    type: 'mapOfUnsaidThingsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DiscomfortCompassExerciseContent = {
    type: 'discomfortCompassExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type AssertivePhraseExerciseContent = {
    type: 'assertivePhraseExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type NoGuiltTechniquesExerciseContent = {
    type: 'noGuiltTechniquesExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type SecureBoundaryPhraseExerciseContent = {
    type: 'secureBoundaryPhraseExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type PostBoundaryEmotionsExerciseContent = {
    type: 'postBoundaryEmotionsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type FirmAndCalmSelfVisualizationExerciseContent = {
    type: 'firmAndCalmSelfVisualizationExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl: string;
};

export type CompassionateFirmnessExerciseContent = {
    type: 'compassionateFirmnessExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SelfCareContractExerciseContent = {
    type: 'selfCareContractExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 5
export type AuthenticityThermometerExerciseContent = {
    type: 'authenticityThermometerExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EmpatheticDialogueExerciseContent = {
    type: 'empatheticDialogueExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EmpathicMirrorExerciseContent = {
    type: 'empathicMirrorExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type ValidationIn3StepsExerciseContent = {
    type: 'validationIn3StepsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EmpathicShieldVisualizationExerciseContent = {
    type: 'empathicShieldVisualizationExercise';
    title: string;
    objective?: string;
    duration?: string;
    content?: { type: 'paragraph', text: string }[];
    audioUrl?: string;
};

export type EmotionalInvolvementTrafficLightExerciseContent = {
    type: 'emotionalInvolvementTrafficLightExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SignificantRelationshipsInventoryExerciseContent = {
    type: 'significantRelationshipsInventoryExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type RelationalCommitmentExerciseContent = {
    type: 'relationalCommitmentExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 6
export type DetectiveDeEmocionesExerciseContent = {
    type: 'detectiveDeEmocionesExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type UnaPalabraCadaDiaExerciseContent = {
    type: 'unaPalabraCadaDiaExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MapaEmocionNecesidadCuidadoExerciseContent = {
    type: 'mapaEmocionNecesidadCuidadoExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type CartaDesdeLaEmocionExerciseContent = {
    type: 'cartaDesdeLaEmocionExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MapaEmocionalRepetidoExerciseContent = {
    type: 'mapaEmocionalRepetidoExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SemaforoEmocionalExerciseContent = {
    type: 'semaforoEmocionalExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MeditacionGuiadaSinJuicioExerciseContent = {
    type: 'meditacionGuiadaSinJuicioExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DiarioMeDiCuentaExerciseContent = {
    type: 'diarioMeDiCuentaExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 7
export type ValuesCompassExerciseContent = {
    type: 'valuesCompassExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EnergySenseMapExerciseContent = {
    type: 'energySenseMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DetoursInventoryExerciseContent = {
    type: 'detoursInventoryExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type PresentVsEssentialSelfExerciseContent = {
    type: 'presentVsEssentialSelfExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MentalNoiseTrafficLightExerciseContent = {
    type: 'mentalNoiseTrafficLightExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type DirectedDecisionsExerciseContent = {
    type: 'directedDecisionsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SenseChecklistExerciseContent = {
    type: 'senseChecklistExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type UnfulfilledNeedsExerciseContent = {
    type: 'unfulfilledNeedsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type BraveRoadmapExerciseContent = {
    type: 'braveRoadmapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EssentialReminderExerciseContent = {
    type: 'essentialReminderExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type ThoughtsThatBlockPurposeExerciseContent = {
    type: 'thoughtsThatBlockPurposeExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 8
export type ResilienceTimelineExerciseContent = {
    type: 'resilienceTimelineExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type PersonalDefinitionExerciseContent = {
    type: 'personalDefinitionExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type AnchorInStormExerciseContent = {
    type: 'anchorInStormExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type IntensityScaleExerciseContent = {
    type: 'intensityScaleExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type BraveDecisionsWheelExerciseContent = {
    type: 'braveDecisionsWheelExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type PlanABExerciseContent = {
    type: 'planABExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type ChangeTimelineExerciseContent = {
    type: 'changeTimelineExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type MyPactExerciseContent = {
    type: 'myPactExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

// RUTA 9
export type CoherenceCompassExerciseContent = {
    type: 'coherenceCompassExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SmallDecisionsLogExerciseContent = {
    type: 'smallDecisionsLogExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type InternalTensionsMapExerciseContent = {
    type: 'internalTensionsMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EthicalMirrorExerciseContent = {
    type: 'ethicalMirrorExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type IntegrityDecisionsExerciseContent = {
    type: 'integrityDecisionsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type NonNegotiablesExerciseContent = {
    type: 'nonNegotiablesExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type EnvironmentEvaluationExerciseContent = {
    type: 'environmentEvaluationExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type PersonalManifestoExerciseContent = {
    type: 'personalManifestoExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 10
export type ComplaintTransformationExerciseContent = {
    type: 'complaintTransformationExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type GuiltRadarExerciseContent = {
    type: 'guiltRadarExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type AcceptanceWritingExerciseContent = {
    type: 'acceptanceWritingExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type SelfAcceptanceAudioExerciseContent = {
    type: 'selfAcceptanceAudioExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type CompassionateResponsibilityContractExerciseContent = {
    type: 'compassionateResponsibilityContractExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type CriticismToGuideExerciseContent = {
    type: 'criticismToGuideExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type InfluenceWheelExerciseContent = {
    type: 'influenceWheelExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type PersonalCommitmentDeclarationExerciseContent = {
    type: 'personalCommitmentDeclarationExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

// RUTA 11
export type SupportMapExerciseContent = {
    type: 'supportMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type BlockingThoughtsExerciseContent = {
    type: 'blockingThoughtsExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type NutritiveDrainingSupportMapExerciseContent = {
    type: 'nutritiveDrainingSupportMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type NourishingConversationExerciseContent = {
    type: 'nourishingConversationExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type ClearRequestMapExerciseContent = {
    type: 'clearRequestMapExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SupportBankExerciseContent = {
    type: 'supportBankExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type MutualCareCommitmentExerciseContent = {
    type: 'mutualCareCommitmentExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type SymbolicSupportCircleExerciseContent = {
    type: 'symbolicSupportCircleExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

// RUTA 12
export type EmotionalGratificationMapExerciseContent = {
  type: 'emotionalGratificationMapExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type DailyEnergyCheckExerciseContent = {
  type: 'dailyEnergyCheckExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type DailyWellbeingPlanExerciseContent = {
  type: 'dailyWellbeingPlanExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type MorningRitualExerciseContent = {
  type: 'morningRitualExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type MotivationIn3LayersExerciseContent = {
  type: 'motivationIn3LayersExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type VisualizeDayExerciseContent = {
  type: 'visualizeDayExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type IlluminatingMemoriesAlbumExerciseContent = {
  type: 'illuminatingMemoriesAlbumExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

export type PositiveEmotionalFirstAidKitExerciseContent = {
  type: 'positiveEmotionalFirstAidKitExercise';
  title: string;
  objective?: string;
  duration?: string;
  audioUrl?: string;
};

// RUTA 13 (NUEVA)
export type AnsiedadTieneSentidoExerciseContent = {
    type: 'ansiedadTieneSentidoExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type VisualizacionGuiadaCuerpoAnsiedadExerciseContent = {
    type: 'visualizacionGuiadaCuerpoAnsiedadExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type StopExerciseContent = {
    type: 'stopExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type QuestionYourIfsExerciseContent = {
    type: 'questionYourIfsExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type ExposureLadderExerciseContent = {
    type: 'exposureLadderExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type CalmVisualizationExerciseContent = {
    type: 'calmVisualizationExercise';
    title: string;
    objective: string;
    duration: string;
    audioUrl?: string;
};

export type AnxietyReframingExerciseContent = {
    type: 'anxietyReframingExercise';
    title: string;
    objective?: string;
    duration?: string;
    audioUrl?: string;
};

export type ImaginedCrisisRehearsalExerciseContent = {
    type: 'imaginedCrisisRehearsalExercise';
    title: string;
    objective: string;
    duration?: string;
    audioUrl?: string;
};

export type ExposureToIntoleranceExerciseContent = {
    type: 'exposureToIntoleranceExercise';
    title: string;
    objective: string;
    audioUrl?: string;
    content: [];
};

// A union type for all possible content blocks that make up a module
export type ModuleContent =
  | ParagraphContent
  | ParagraphWithAudioContent
  | TitleContent
  | ListContent
  | QuoteContent
  | CollapsibleContent
  | ExerciseContent
  | StressMapExerciseContent
  | TriggerExerciseContent
  | TherapeuticNotebookReflection
  | DetectiveExerciseContent
  | DemandsExerciseContent
  | WellbeingPlanExerciseContent
  | UncertaintyMapExerciseContent
  | ControlTrafficLightExerciseContent
  | AlternativeStoriesExerciseContent
  | MantraExerciseContent
  | DelSabotajeALaAccionExerciseContent
  | TwoMinuteRuleExerciseContent
  | MicroPlanExerciseContent
  | FutureSelfVisualizationExerciseContent
  | RealisticRitualExerciseContent
  | GentleTrackingExerciseContent
  | BlockageMapExerciseContent
  | CompassionateReflectionExerciseContent
  | RitualDeEntregaConscienteExerciseContent
  | MapOfUnsaidThingsExerciseContent
  | DiscomfortCompassExerciseContent
  | AssertivePhraseExerciseContent
  | NoGuiltTechniquesExerciseContent
  | SecureBoundaryPhraseExerciseContent
  | PostBoundaryEmotionsExerciseContent
  | FirmAndCalmSelfVisualizationExerciseContent
  | CompassionateFirmnessExerciseContent
  | SelfCareContractExerciseContent
  // RUTA 5
  | AuthenticityThermometerExerciseContent
  | EmpatheticDialogueExerciseContent
  | EmpathicMirrorExerciseContent
  | ValidationIn3StepsExerciseContent
  | EmpathicShieldVisualizationExerciseContent
  | EmotionalInvolvementTrafficLightExerciseContent
  | SignificantRelationshipsInventoryExerciseContent
  | RelationalCommitmentExerciseContent
  // RUTA 6
  | DetectiveDeEmocionesExerciseContent
  | UnaPalabraCadaDiaExerciseContent
  | MapaEmocionNecesidadCuidadoExerciseContent
  | CartaDesdeLaEmocionExerciseContent
  | MapaEmocionalRepetidoExerciseContent
  | SemaforoEmocionalExerciseContent
  | MeditacionGuiadaSinJuicioExerciseContent
  | DiarioMeDiCuentaExerciseContent
  // RUTA 7
  | ValuesCompassExerciseContent
  | EnergySenseMapExerciseContent
  | DetoursInventoryExerciseContent
  | PresentVsEssentialSelfExerciseContent
  | MentalNoiseTrafficLightExerciseContent
  | DirectedDecisionsExerciseContent
  | SenseChecklistExerciseContent
  | UnfulfilledNeedsExerciseContent
  | BraveRoadmapExerciseContent
  | EssentialReminderExerciseContent
  | ThoughtsThatBlockPurposeExerciseContent
  // RUTA 8
  | ResilienceTimelineExerciseContent
  | PersonalDefinitionExerciseContent
  | AnchorInStormExerciseContent
  | IntensityScaleExerciseContent
  | BraveDecisionsWheelExerciseContent
  | PlanABExerciseContent
  | ChangeTimelineExerciseContent
  | MyPactExerciseContent
  // RUTA 9
  | CoherenceCompassExerciseContent
  | SmallDecisionsLogExerciseContent
  | InternalTensionsMapExerciseContent
  | EthicalMirrorExerciseContent
  | IntegrityDecisionsExerciseContent
  | NonNegotiablesExerciseContent
  | EnvironmentEvaluationExerciseContent
  | PersonalManifestoExerciseContent
  // RUTA 10
  | ComplaintTransformationExerciseContent
  | GuiltRadarExerciseContent
  | AcceptanceWritingExerciseContent
  | SelfAcceptanceAudioExerciseContent
  | CompassionateResponsibilityContractExerciseContent
  | CriticismToGuideExerciseContent
  | InfluenceWheelExerciseContent
  | PersonalCommitmentDeclarationExerciseContent
  // RUTA 11
  | SupportMapExerciseContent
  | BlockingThoughtsExerciseContent
  | NutritiveDrainingSupportMapExerciseContent
  | NourishingConversationExerciseContent
  | ClearRequestMapExerciseContent
  | SupportBankExerciseContent
  | MutualCareCommitmentExerciseContent
  | SymbolicSupportCircleExerciseContent
  // RUTA 12
  | EmotionalGratificationMapExerciseContent
  | DailyEnergyCheckExerciseContent
  | DailyWellbeingPlanExerciseContent
  | MorningRitualExerciseContent
  | MotivationIn3LayersExerciseContent
  | VisualizeDayExerciseContent
  | IlluminatingMemoriesAlbumExerciseContent
  | PositiveEmotionalFirstAidKitExerciseContent
  // RUTA 13 (NUEVA)
  | AnsiedadTieneSentidoExerciseContent
  | VisualizacionGuiadaCuerpoAnsiedadExerciseContent
  | StopExerciseContent
  | QuestionYourIfsExerciseContent
  | ExposureLadderExerciseContent
  | CalmVisualizationExerciseContent
  | AnxietyReframingExerciseContent
  | ImaginedCrisisRehearsalExerciseContent
  | ExposureToIntoleranceExerciseContent;

// Defines a single module within a guided path
export type PathModule = {
  id: string;
  title: string; // Spanish
  type: 'introduction' | 'skill_practice' | 'summary'; // Categorizes the module's role in the path
  content: ModuleContent[]; // An array of different content blocks that make up the module
  estimatedTime?: string; // e.g., "20-30 min"
  dataAiHint?: string; // For images if any
  audioUrl?: string; // Optional audio URL for the entire module
};

// Represents a single assessment dimension (e.g., "Emotional Regulation")
export interface AssessmentDimension {
  id: string;
  name: string; // The user-facing name of the dimension
  definition: string;
  items: AssessmentItem[]; // The questions related to this dimension
  recommendedPathId?: string; // Optional ID of a path recommended for this dimension
}

// Represents a single question/item within an assessment dimension
export interface AssessmentItem {
  id: string; // Unique identifier for the question item (e.g., "item1")
  text: string; // The question text
  weight: number; // The weight of the item for calculating scores
  isInverse?: boolean; // True if a low score is "good" and a high score is "bad"
}

export type Path = {
  id: string;
  title: string; // Spanish
  description: string; // Spanish
  modules: PathModule[];
  dataAiHint?: string;
  audioUrl?: string; // Optional audio URL for the entire path
};
