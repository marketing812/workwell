'use server';

/**
 * @fileOverview An AI-powered chatbot for emotional support and guidance using Cognitive-Behavioral Therapy principles.
 *
 * - emotionalChatbot - A function that handles the chatbot interaction.
 * - EmotionalChatbotInput - The input type for the emotionalChatbot function.
 * - EmotionalChatbotOutput - The return type for the emotionalChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EmotionalChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  context: z
    .string()
    .optional()
    .describe('Previous messages in the conversation to maintain context.'),
  userName: z
    .string()
    .optional()
    .describe("The user's name."),
});
export type EmotionalChatbotInput = z.infer<typeof EmotionalChatbotInputSchema>;

const EmotionalChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response message.'),
});
export type EmotionalChatbotOutput = z.infer<typeof EmotionalChatbotOutputSchema>;

export async function emotionalChatbot(input: EmotionalChatbotInput): Promise<EmotionalChatbotOutput> {
  return emotionalChatbotFlow(input);
}

const emotionalChatbotPrompt = ai.definePrompt({
  name: 'emotionalChatbotPrompt',
  inputSchema: EmotionalChatbotInputSchema,
  outputSchema: EmotionalChatbotOutputSchema,
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an empathetic and supportive AI chatbot designed to provide guidance based on Cognitive-Behavioral Therapy (CBT) principles.
  Your responses should be warm, understanding, and aimed at helping the user explore their thoughts and feelings in a constructive way.
  You are not a substitute for a therapist, so do not give definitive advice.
  
  **IMPORTANT INSTRUCTIONS:**
  1.  **Language and Tone:** Respond exclusively in Spanish.
  2.  **Gender Personalization:**{{#if userName}} The user's name is {{userName}}. Infer their gender from the name (e.g., 'Andrea' is likely female, 'Andrés' is likely male). Use gender-specific adjectives and pronouns accordingly (e.g., 'abrumada' for female, 'abrumado' for male). If the name is ambiguous (e.g., 'Alex') or not provided, use gender-neutral language (e.g., "persona", "ser humano", or rephrase to avoid gender markers).{{/if}}
  3.  **Character Encoding:** Ensure all responses are properly encoded in UTF-8 to correctly display special characters like accents (á, é, í, ó, ú) and ñ. Do not use escaped unicode characters.

  {{#if context}}
  Previous conversation context:
  {{context}}
  {{/if}}

  User message: {{{message}}}

  Generate a response that incorporates CBT techniques such as:
  - Identifying and challenging negative thoughts
  - Encouraging the user to reframe their perspective
  - Suggesting coping mechanisms or relaxation techniques
  - Promoting self-compassion and acceptance

  Please keep responses brief and focused and offer support and guidance.
  If the user expresses a crisis or suicidal thoughts, respond with: "Lamento que estés pasando por esto. No estás solo/a. Por favor, considera contactar con un/a profesional de salud mental."
  
  Devuelve SOLO un JSON válido con esta forma exacta:
  {"response":"..."}`,
});

const emotionalChatbotFlow = ai.defineFlow(
  {
    name: 'emotionalChatbotFlow',
    inputSchema: EmotionalChatbotInputSchema,
    outputSchema: EmotionalChatbotOutputSchema,
  },
  async (rawInput) => {
    // 1. Validate the input explicitly to catch errors early.
    const input = EmotionalChatbotInputSchema.parse(rawInput);

    // 2. Build the payload for the prompt safely.
    const promptPayload: { message: string; context?: string; userName?: string } = {
      message: input.message,
    };

    if (typeof input.context === "string" && input.context.trim() !== "") {
      promptPayload.context = input.context;
    }
    if (typeof input.userName === "string" && input.userName.trim() !== "") {
      promptPayload.userName = input.userName;
    }

    // 3. Call the prompt with the validated and constructed payload.
    const {output} = await emotionalChatbotPrompt(promptPayload);

    // 4. Ensure the output is not empty before returning.
    if (!output?.response) {
      throw new Error("Genkit devolvió un 'output' vacío o sin la propiedad 'response'.");
    }

    return output;
  }
);
