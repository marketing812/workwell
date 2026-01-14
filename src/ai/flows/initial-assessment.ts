
'use server';
/**
 * @fileOverview An AI agent for conducting an initial psychological assessment.
 *
 * - initialAssessment - A function that handles the initial assessment process.
 * - InitialAssessmentInput - The input type for the initialAssessment function.
 * - InitialAssessmentOutput - The return type for the initialAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { assessmentDimensions } from '@/data/assessmentDimensions';
import type { AssessmentDimension } from '@/data/paths/pathTypes';
import { googleAI } from '@genkit-ai/google-genai';


const InitialAssessmentInputSchema = z.object({
  answers: z
    .record(z.string(), z.number().min(1).max(5)) // item ID to Likert scale score
    .describe('A map of question item identifiers to Likert scale responses (1-5).'),
});
export type InitialAssessmentInput = z.infer<typeof InitialAssessmentInputSchema>;

const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.number().min(1).max(5)) // Dimension NAME to NUMERIC score (1-5)
    .describe('A map of emotional dimension names to their numeric assessment score (1-5, e.g., "Regulación Emocional y Estrés": 3.5).'),
  priorityAreas: z.array(z.string()).min(3, "Debe haber al menos 3 áreas prioritarias.").max(3, "Debe haber exactamente 3 áreas prioritarias.").describe('An array of the top 3 priority dimension names for the user (e.g., ["Regulación Emocional y Estrés", "Flexibilidad Mental y Adaptabilidad"]).'),
  feedback: z.string().min(1, "El feedback no puede estar vacío.").describe('A summary of the assessment results in Spanish.'),
});
export type InitialAssessmentOutput = z.infer<typeof InitialAssessmentOutputSchema>;

// Schema for the direct AI response, where emotionalProfile is a JSON string of dimensionName: numericScore
const AIResponseSchema = z.object({
  emotionalProfileJSON: z
    .string()
    .describe('A JSON string representing a map of emotional dimensions to their NUMERIC assessment score (1-5). Keys are dimension names. Example: "{\\"Regulación Emocional y Estrés\\": 3.2, \\"Flexibilidad Mental y Adaptabilidad\\": 4.5}"'),
  priorityAreas: z.array(z.string()).min(3).max(3).describe('An array of the top 3 priority dimension names for the user.'),
  feedback: z.string().min(1).describe('A summary of the assessment results in Spanish.'),
});

// Schema for the data passed to the Handlebars template for the prompt
const PromptHandlebarsInputSchema = z.object({
  dimensionCalculations: z.array(z.string()).describe('An array of strings, each summarizing the pre-calculated weighted average for a dimension.'),
  dimensionNamesForPrompt: z.array(z.string()).describe('An array of all dimension names for reference within the prompt.'),
});
type PromptHandlebarsInput = z.infer<typeof PromptHandlebarsInputSchema>;


export async function initialAssessment(input: InitialAssessmentInput): Promise<InitialAssessmentOutput> {
  // Pre-calculate dimension scores here
  const dimensionScores: Record<string, number> = {};
  const dimensionCalculationsForPrompt: string[] = [];

  assessmentDimensions.forEach(dim => {
    let totalScore = 0;
    let totalWeight = 0;

    dim.items.forEach(item => {
      const originalScore = input.answers[item.id];
      if (originalScore === undefined) return;

      const score = item.isInverse ? 6 - originalScore : originalScore;
      totalScore += score * item.weight;
      totalWeight += item.weight;
    });

    if (totalWeight > 0) {
      let finalScore = totalScore / totalWeight;

      // Special calculation for state scales
      if (dim.id === 'dim12') { // Estado de Ánimo
        const rawSum = dim.items.reduce((acc, item) => acc + (input.answers[item.id] || 0) * item.weight, 0);
        const convertedScore = ((rawSum - 12) / 48) * 4 + 1;
        finalScore = 6 - convertedScore;
      } else if (dim.id === 'dim13') { // Ansiedad Estado
        const rawSum = dim.items.reduce((acc, item) => acc + (input.answers[item.id] || 0) * item.weight, 0);
        const convertedScore = ((rawSum - 6) / 24) * 4 + 1;
        finalScore = 6 - convertedScore;
      }
      
      const finalClampedScore = Math.max(1, Math.min(5, finalScore));
      dimensionScores[dim.name] = parseFloat(finalClampedScore.toFixed(2));
      dimensionCalculationsForPrompt.push(`${dim.name}: ${dimensionScores[dim.name]}`);
    }
  });

  const handlebarsInputForPrompt: PromptHandlebarsInput = {
      dimensionCalculations: dimensionCalculationsForPrompt,
      dimensionNamesForPrompt: assessmentDimensions.map(d => d.name),
  };
  
  return initialAssessmentFlow(handlebarsInputForPrompt);
}

const prompt = ai.definePrompt({
  name: 'initialAssessmentPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: {schema: PromptHandlebarsInputSchema},
  output: {schema: AIResponseSchema},
  prompt: `You are an AI assistant specialized in interpreting psychological assessment results to provide a personalized profile.
The user's dimension scores have been pre-calculated based on their answers to a questionnaire.

**User's Dimension Scores (1-5 scale):**
{{#each dimensionCalculations}}
- {{{this}}}
{{/each}}

Based on these pre-calculated scores, please perform the following tasks IN SPANISH. ALL fields in your response are MANDATORY and your entire output must be a single valid JSON object matching the AIResponseSchema:

1.  **Emotional Profile (emotionalProfileJSON)**: Based on the pre-calculated scores provided above, construct a JSON STRING. The keys must be the dimension names and the values must be the NUMERIC scores provided.
    Dimension Names: {{#each dimensionNamesForPrompt}} "{{this}}"{{#unless @last}}, {{/unless}}{{/each}}.

2.  **Priority Areas (priorityAreas)**: Identify EXACTLY 3 psychological dimensions (using their full names) that you consider priority areas for the user to focus on for their development or well-being. These should be the areas with the lowest scores.

3.  **Feedback (feedback)**: Provide a concise (2-3 paragraphs), empathetic, and constructive overall summary of the assessment. This feedback must be encouraging, acknowledge potential strengths (higher scores), and gently highlight areas for growth (lower scores) based on the profile. Avoid overly technical jargon. Frame it as a starting point for self-discovery.

Ensure your entire response is a single, valid JSON object. Do not include any text outside of this JSON structure.
The \`emotionalProfileJSON\` field MUST BE A JSON STRING.
`,
});

const initialAssessmentFlow = ai.defineFlow(
  {
    name: 'initialAssessmentFlow',
    inputSchema: PromptHandlebarsInputSchema,
    outputSchema: InitialAssessmentOutputSchema,
  },
  async (flowInput: PromptHandlebarsInput): Promise<InitialAssessmentOutput> => {
    console.log('InitialAssessmentFlow START: Received pre-calculated input:', JSON.stringify(flowInput, null, 2).substring(0,1000) + "...");

    const {output: aiResponse} = await prompt(flowInput);
    console.log('InitialAssessmentFlow: Received RAW aiResponse from prompt:', JSON.stringify(aiResponse, null, 2));

    if (!aiResponse) {
        console.error('InitialAssessmentFlow Error: AI response was null or undefined.');
        throw new Error('La respuesta de la IA fue nula o indefinida.');
    }
    if (typeof aiResponse.emotionalProfileJSON !== 'string' || aiResponse.emotionalProfileJSON.trim() === '') {
        console.error('InitialAssessmentFlow Error: aiResponse.emotionalProfileJSON is not a string or is empty. Received:', aiResponse.emotionalProfileJSON);
        throw new Error('La IA no proporcionó el perfil emocional como una cadena JSON válida.');
    }
    if (!aiResponse.priorityAreas || aiResponse.priorityAreas.length !== 3 || aiResponse.priorityAreas.some(area => typeof area !== 'string' || area.trim() === '')) {
        console.error('InitialAssessmentFlow Error: aiResponse.priorityAreas is missing, empty, not exactly 3 items, or contains invalid items. Received:', aiResponse.priorityAreas);
        throw new Error('La IA no identificó exactamente 3 áreas prioritarias válidas (strings no vacíos).');
    }
    if (typeof aiResponse.feedback !== 'string' || aiResponse.feedback.trim() === '') {
        console.error('InitialAssessmentFlow Error: aiResponse.feedback is not a string or is empty. Received:', aiResponse.feedback);
        throw new Error('La IA no proporcionó un feedback resumen válido (string no vacío).');
    }

    let parsedEmotionalProfile: Record<string, number>;
    try {
      parsedEmotionalProfile = JSON.parse(aiResponse.emotionalProfileJSON);
      const validationResult = z.record(z.string(), z.number().min(1).max(5)).safeParse(parsedEmotionalProfile);
      if (!validationResult.success) {
        console.error("InitialAssessmentFlow Error: Parsed emotionalProfileJSON does not match Record<string, number> with scores 1-5:", validationResult.error.flatten());
        throw new Error('El perfil emocional devuelto por la IA no tiene el formato de mapa de puntuaciones numéricas esperado (1-5).');
      }
      parsedEmotionalProfile = validationResult.data;
    } catch (e: any) {
      console.error("InitialAssessmentFlow Error: Failed to parse or validate emotionalProfileJSON. Raw JSON string was:", `"${aiResponse.emotionalProfileJSON}"`, "Error:", e.message);
      throw new Error(`La IA devolvió un perfil emocional en formato JSON inválido. JSON recibido: "${aiResponse.emotionalProfileJSON}".`);
    }

    const finalOutput: InitialAssessmentOutput = {
      emotionalProfile: parsedEmotionalProfile,
      priorityAreas: aiResponse.priorityAreas,
      feedback: aiResponse.feedback,
    };
    console.log('InitialAssessmentFlow END: Returning finalOutput to action:', JSON.stringify(finalOutput, null, 2));
    return finalOutput;
  }
);

    
