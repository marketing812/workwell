
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
import type { AssessmentDimension } from '@/data/paths/pathTypes';

// INCRUSTADO: Las preguntas de la evaluación están ahora directamente aquí.
const assessmentDimensions: AssessmentDimension[] = [
    {
      "id": "dim1",
      "name": "Regulación Emocional y Estrés",
      "definition": "Capacidad para gestionar emociones difíciles, mantener el equilibrio en momentos de tensión y responder con serenidad frente a la incertidumbre o el conflicto.",
      "recommendedPathId": "gestion-estres",
      "items": [
        { "id": "dim1_item1", "text": "Suelo mantener la calma cuando las cosas se complican.", "weight": 1 },
        { "id": "dim1_item2", "text": "Me desbordo fácilmente ante el estrés o la presión.", "weight": 1, "isInverse": true },
        { "id": "dim1_item3", "text": "Soy capaz de respirar hondo y pensar con claridad incluso en momentos difíciles.", "weight": 1 },
        { "id": "dim1_item4", "text": "Me recupero con rapidez después de una situación emocionalmente intensa.", "weight": 1 }
      ]
    },
    {
      "id": "dim2",
      "name": "Flexibilidad Mental y Adaptabilidad",
      "definition": "Capacidad para abrirse a nuevas ideas, aceptar el cambio como parte natural de la vida y adaptarse mentalmente a escenarios inciertos o inesperados.",
      "recommendedPathId": "tolerar-incertidumbre",
      "items": [
        { "id": "dim2_item1", "text": "Me entusiasma aprender cosas nuevas, incluso si desafían lo que ya sé.", "weight": 1 },
        { "id": "dim2_item2", "text": "Suelo encontrar soluciones creativas cuando algo no sale como esperaba.", "weight": 1 },
        { "id": "dim2_item3", "text": "A menudo cuestiono mis propias creencias o formas de pensar.", "weight": 1 },
        { "id": "dim2_item4", "text": "Me adapto con rapidez cuando las circunstancias cambian.", "weight": 1 }
      ]
    },
    {
      "id": "dim3",
      "name": "Autorregulación personal y constancia",
      "definition": "Capacidad de organizarse, mantenerse disciplinado/a y cumplir con lo que uno se propone, incluso cuando requiere esfuerzo o perseverancia.",
      "recommendedPathId": "superar-procrastinacion",
      "items": [
        { "id": "dim3_item1", "text": "Suelo cumplir mis objetivos, aunque me cuesten.", "weight": 1 },
        { "id": "dim3_item2", "text": "Soy constante con mis compromisos personales y profesionales.", "weight": 1 },
        { "id": "dim3_item3", "text": "Planifico mis días para aprovechar bien el tiempo.", "weight": 1 },
        { "id": "dim3_item4", "text": "Me cuesta priorizar lo importante cuando tengo muchas cosas pendientes.", "weight": 1, "isInverse": true }
      ]
    },
    {
      "id": "dim4",
      "name": "Autoafirmación y Expresión Personal",
      "definition": "Capacidad de expresar opiniones, necesidades y límites de forma clara y segura, manteniendo el respeto por uno mismo y por los demás.",
      "recommendedPathId": "poner-limites",
      "items": [
        { "id": "dim4_item1", "text": "Me siento con derecho a expresar lo que necesito, aunque sea incómodo.", "weight": 1 },
        { "id": "dim4_item2", "text": "Soy capaz de defender mi opinión sin imponerla.", "weight": 1 },
        { "id": "dim4_item3", "text": "Me cuesta decir \"no\", incluso cuando lo deseo.", "weight": 1, "isInverse": true },
        { "id": "dim4_item4", "text": "En situaciones difíciles, puedo mantener mi postura con respeto.", "weight": 1 }
      ]
    },
    {
      "id": "dim5",
      "name": "Empatía y Conexión Interpersonal",
      "definition": "Capacidad de ponerse en el lugar del otro, construir vínculos saludables y actuar desde la comprensión y el respeto mutuo.",
      "recommendedPathId": "relaciones-autenticas",
      "items": [
        { "id": "dim5_item1", "text": "Me interesa entender cómo se sienten las personas que me rodean.", "weight": 1 },
        { "id": "dim5_item2", "text": "A veces actúo sin considerar el impacto emocional que puede tener en otros.", "weight": 1, "isInverse": true },
        { "id": "dim5_item3", "text": "Suelo conectar fácilmente con las emociones de los demás.", "weight": 1 },
        { "id": "dim5_item4", "text": "Tengo sensibilidad para detectar cuándo alguien necesita apoyo.", "weight": 1 }
      ]
    },
    {
      "id": "dim6",
      "name": "Insight y Autoconciencia",
      "definition": "Capacidad de observarse a uno mismo, reconocer patrones emocionales y conductuales y comprender cómo afectan a la vida personal y profesional.",
      "recommendedPathId": "comprender-mejor-cada-dia",
      "items": [
        { "id": "dim6_item1", "text": "Reflexiono con frecuencia sobre lo que siento y por qué.", "weight": 1 },
        { "id": "dim6_item2", "text": "Se con claridad quién soy porque conozco mis puntos fuertes y también mis áreas a mejorar.", "weight": 1 },
        { "id": "dim6_item3", "text": "Soy consciente de cómo influyen mis emociones en mis decisiones.", "weight": 1 },
        { "id": "dim6_item4", "text": "Reconozco cuándo repito patrones que no me benefician y trato de cambiarlos.", "weight": 1 }
      ]
    },
    {
      "id": "dim7",
      "name": "Propósito Vital y Dirección Personal",
      "definition": "Claridad sobre lo que uno quiere lograr en la vida, conexión con los propios valores y motivación para avanzar hacia metas significativas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim7_item1", "text": "Tengo claro qué es importante para mí en la vida.", "weight": 1 },
        { "id": "dim7_item2", "text": "Tomo decisiones alineadas con mis prioridades y valores personales.", "weight": 1 },
        { "id": "dim7_item3", "text": "Siento que lo que hago tiene sentido y propósito.", "weight": 1 },
        { "id": "dim7_item4", "text": "Estoy construyendo un camino de vida que me representa.", "weight": 1 }
      ]
    },
    {
      "id": "dim8",
      "name": "Estilo de Afrontamiento",
      "definition": "Estilo de enfrentar los desafíos con determinación, capacidad de adaptación y actitud constructiva ante las dificultades.",
      "recommendedPathId": "resiliencia-en-accion",
      "items": [
        { "id": "dim8_item1", "text": "Cuando tengo un problema, rápidamente busco cómo solucionarlo sin quedarme estancado/a.", "weight": 1 },
        { "id": "dim8_item2", "text": "Trato de sacar un aprendizaje personal incluso en los momentos más difíciles.", "weight": 1 },
        { "id": "dim8_item3", "text": "Frente a la dificultad, trato de mantener la mente abierta y flexible.", "weight": 1 },
        { "id": "dim8_item4", "text": "Me adapto sin perder de vista lo que quiero conseguir.", "weight": 1 }
      ]
    },
    {
      "id": "dim9",
      "name": "Integridad y Coherencia Ética",
      "definition": "Capacidad de actuar de acuerdo con valores personales sólidos, ser coherente entre lo que se piensa, se siente y se hace, y tener sensibilidad ética en las decisiones.",
      "recommendedPathId": "vivir-con-coherencia",
      "items": [
        { "id": "dim9_item1", "text": "Intento actuar con integridad, incluso cuando no es lo mejor o más fácil.", "weight": 1 },
        { "id": "dim9_item2", "text": "Me importa mucho el impacto de mis acciones en otras personas.", "weight": 1 },
        { "id": "dim9_item3", "text": "La honestidad guía mis decisiones, también en lo pequeño.", "weight": 1 },
        { "id": "dim9_item4", "text": "Me esfuerzo por ser la misma persona en todos los ámbitos de mi vida.", "weight": 1 }
      ]
    },
    {
      "id": "dim10",
      "name": "Responsabilidad Personal y Aceptación Consciente",
      "definition": "Capacidad de reconocer el papel que uno tiene en las situaciones que atraviesa, asumir la parte de responsabilidad sin caer en la culpa, y actuar desde la aceptación y el compromiso con el cambio.",
      "recommendedPathId": "ni-culpa-ni-queja",
      "items": [
        { "id": "dim10_item1", "text": "Reflexiono y se reconocer cuándo he contribuido a que algo no salga como esperaba.", "weight": 1 },
        { "id": "dim10_item2", "text": "Cuando afronto dificultades, pienso y me pregunto qué puedo hacer diferente.", "weight": 1 },
        { "id": "dim10_item3", "text": "Asumo la responsabilidad de mis actos incluso cuando es incómodo.", "weight": 1 },
        { "id": "dim10_item4", "text": "Soy consciente del papel que tengo en las situaciones que vivo y eso me permite aprender y crecer.", "weight": 1 }
      ]
    },
    {
      "id": "dim11",
      "name": "Apoyo Social Percibido",
      "definition": "Grado en que la persona percibe tener apoyo emocional, instrumental y profesional disponible tanto en su vida personal como laboral. Evalúa la sensación de sentirse acompañado/a, comprendido/a y respaldado/a por otros.",
      "recommendedPathId": "confiar-en-mi-red",
      "items": [
        { "id": "dim11_item1", "text": "Siento que tengo personas en mi vida con las que puedo contar cuando lo necesito.", "weight": 1 },
        { "id": "dim11_item2", "text": "En mi entorno laboral, me siento respaldado/a por compañeros y superiores.", "weight": 1 },
        { "id": "dim11_item3", "text": "Me cuesta pedir ayuda, incluso cuando la necesito.", "weight": 1, "isInverse": true },
        { "id": "dim11_item4", "text": "Me siento parte de una red de apoyo y sostén emocional sólida y accesible.", "weight": 1 }
      ]
    },
    {
      "id": "dim12",
      "name": "Estado de Ánimo",
      "definition": "Evaluación del estado de ánimo general y la presencia de síntomas relacionados con el desánimo o la anhedonia en las últimas semanas.",
      "recommendedPathId": "volver-a-lo-importante",
      "items": [
        { "id": "dim12_item1", "text": "Me siento triste o desanimado/a.", "weight": 1 },
        { "id": "dim12_item2", "text": "Tengo dificultad para disfrutar de las actividades que solían gustarme.", "weight": 1 },
        { "id": "dim12_item3", "text": "Me siento inútil o inferior a los demás.", "weight": 1 },
        { "id": "dim12_item4", "text": "Me siento culpable por cosas que hago o no hago.", "weight": 1 },
        { "id": "dim12_item5", "text": "Me siento agotado/a física o mentalmente.", "weight": 1 },
        { "id": "dim12_item6", "text": "Tengo dificultad para mantener la concentración en tareas.", "weight": 1 },
        { "id": "dim12_item7", "text": "Me falta motivación para realizar actividades cotidianas.", "weight": 1 },
        { "id": "dim12_item8", "text": "Siento que mi vida carece de sentido o dirección.", "weight": 1 },
        { "id": "dim12_item9", "text": "Me aíslo o evito el contacto con otras personas.", "weight": 1 },
        { "id": "dim12_item10", "text": "Siento que nada va a cambiar, aunque me esfuerce.", "weight": 1 },
        { "id": "dim12_item11", "text": "Siento que he perdido interés por cuidar de mí mismo/a (higiene, salud, descanso...).", "weight": 1 },
        { "id": "dim12_item12", "text": "Últimamente me cuesta identificar o expresar lo que siento.", "weight": 1 }
      ]
    },
    {
      "id": "dim13",
      "name": "Ansiedad Estado",
      "definition": "Evaluación del nivel de ansiedad y tensión experimentado en el momento presente o en los últimos días.",
      "recommendedPathId": "regular-ansiedad-paso-a-paso",
      "items": [
        { "id": "dim13_item1", "text": "Me siento tenso/a o nervioso/a actualmente.", "weight": 1 },
        { "id": "dim13_item2", "text": "Me preocupo por cosas que normalmente no me afectan.", "weight": 1 },
        { "id": "dim13_item3", "text": "Siento una inquietud interna difícil de controlar.", "weight": 1 },
        { "id": "dim13_item4", "text": "Me cuesta relajarme incluso en situaciones tranquilas.", "weight": 1 },
        { "id": "dim13_item5", "text": "Reacciono con irritabilidad ante pequeñas molestias.", "weight": 1 },
        { "id": "dim13_item6", "text": "Siento que pierdo el control fácilmente sobre mis emociones.", "weight": 1 }
      ]
    }
  ];

const InitialAssessmentInputSchema = z.object({
  answers: z
    .record(z.string(), z.number().min(1).max(5)) // item ID to Likert scale score
    .describe('A map of question item identifiers to Likert scale responses (1-5).'),
});
export type InitialAssessmentInput = z.infer<typeof InitialAssessmentInputSchema>;

const InitialAssessmentOutputSchema = z.object({
  emotionalProfile: z
    .record(z.string(), z.number().min(1).max(5)) // Dimension NAME to NUMERIC score (1-5)
    .describe('A map of emotional dimension names to their numeric assessment score (1-5, e.g., "Calma en la Tormenta": 3.5).'),
  priorityAreas: z.array(z.string()).min(3, "Debe haber al menos 3 áreas prioritarias.").max(3, "Debe haber exactamente 3 áreas prioritarias.").describe('An array of the top 3 priority dimension names for the user (e.g., ["Calma en la Tormenta (Regulación Emocional y Estrés)", "Mente Abierta, Cambio Ágil (Flexibilidad Mental y Adaptabilidad)"]).'),
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
