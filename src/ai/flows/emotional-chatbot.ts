'use server';

/**
 * @fileOverview An AI-powered chatbot for emotional support and guidance using Cognitive-Behavioral Therapy principles.
 *
 * - emotionalChatbot - A function that handles the chatbot interaction.
 * - EmotionalChatbotInput - The input type for the emotionalChatbot function.
 * - EmotionalChatbotOutput - The return type for the emotionalChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  context: z
    .string()
    .optional()
    .describe('Previous messages in the conversation to maintain context.'),
});
export type EmotionalChatbotInput = z.infer<typeof EmotionalChatbotInputSchema>;

const EmotionalChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response message.'),
});
export type EmotionalChatbotOutput = z.infer<typeof EmotionalChatbotOutputSchema>;

export async function emotionalChatbot(input: EmotionalChatbotInput): Promise<EmotionalChatbotOutput> {
  return emotionalChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalChatbotPrompt',
  input: {schema: EmotionalChatbotInputSchema},
  output: {schema: EmotionalChatbotOutputSchema},
  prompt: `You are an empathetic and supportive AI chatbot designed to provide guidance based on Cognitive-Behavioral Therapy (CBT) principles.
  Your responses should be warm, understanding, and aimed at helping the user explore their thoughts and feelings in a constructive way.
  You are not a substitute for a therapist, so do not give definitive advice.
  
  **IMPORTANT INSTRUCTIONS:**
  1.  **Language and Tone:** Respond exclusively in Spanish. Use a gender-neutral and inclusive language (e.g., use "persona", "ser humano", or rephrase to avoid specific gender markers like "cansado/a").
  2.  **Character Encoding:** Ensure all responses are properly encoded in UTF-8 to correctly display special characters like accents (á, é, í, ó, ú) and ñ. Do not use escaped unicode characters.

  Previous conversation context:
  {{context}}

  User message: {{{message}}}

  Generate a response that incorporates CBT techniques such as:
  - Identifying and challenging negative thoughts
  - Encouraging the user to reframe their perspective
  - Suggesting coping mechanisms or relaxation techniques
  - Promoting self-compassion and acceptance

  Please keep responses brief and focused and offer support and guidance.
  If the user expresses a crisis or suicidal thoughts, respond with: "Lamento que estés pasando por esto. No estás solo/a. Por favor, considera contactar con un/a profesional de salud mental."
  Response: `,
});

const emotionalChatbotFlow = ai.defineFlow(
  {
    name: 'emotionalChatbotFlow',
    inputSchema: EmotionalChatbotInputSchema,
    outputSchema: EmotionalChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
