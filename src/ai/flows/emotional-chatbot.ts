"use server";

/**
 * @fileOverview An AI-powered chatbot for emotional support and guidance using Cognitive-Behavioral Therapy principles.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import { googleAI } from "@genkit-ai/google-genai";
import { retrieveDocsContext } from "@/ai/rag/retrieve"; // ✅

const EmotionalChatbotInputSchema = z.object({
  message: z.string().describe("The user message to the chatbot."),
  context: z
    .string()
    .optional()
    .describe("Previous messages in the conversation to maintain context."),
  userName: z.string().optional().describe("The user's name."),
  docsContext: z
    .string()
    .optional()
    .describe("Retrieved context from knowledge base documents."),
});
export type EmotionalChatbotInput = z.infer<typeof EmotionalChatbotInputSchema>;

const EmotionalChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot response message."),
});
export type EmotionalChatbotOutput = z.infer<typeof EmotionalChatbotOutputSchema>;

export async function emotionalChatbot(
  input: EmotionalChatbotInput
): Promise<EmotionalChatbotOutput> {
  return emotionalChatbotFlow(input);
}
const emotionalChatbotPrompt = ai.definePrompt({
  name: "emotionalChatbotPrompt",
    model: googleAI.model("gemini-2.5-flash"),

  prompt: `You are an empathetic and supportive AI chatbot designed to provide guidance based on Cognitive-Behavioral Therapy (CBT) principles.
Your responses should be warm, understanding, and aimed at helping the user explore their thoughts and feelings in a constructive way.
You are not a substitute for a therapist, so do not give definitive advice.

**IMPORTANT INSTRUCTIONS:**
1. **Language and Tone:** Respond exclusively in Spanish.
2. **Gender Personalization:**{{#if userName}} The user's name is {{userName}}. Infer their gender from the name (e.g., 'Andrea' is likely female, 'Andrés' is likely male). Use gender-specific adjectives and pronouns accordingly (e.g., 'abrumada' for female, 'abrumado' for male). If the name is ambiguous (e.g., 'Alex') or not provided, use gender-neutral language (e.g., "persona", "ser humano", or rephrase to avoid gender markers).{{/if}}
3. **Character Encoding:** Ensure all responses are properly encoded in UTF-8.

REGLA CRÍTICA (RAG):
- Responde basándote SOLAMENTE en la información contenida en DOCUMENTOS.
- Si la respuesta NO aparece en DOCUMENTOS, responde exactamente: "No aparece en los documentos disponibles."
- Si hay información relevante, cita la fuente indicando el nombre del PDF (aparece en los fragmentos).

{{#if docsContext}}
DOCUMENTOS:
{{docsContext}}
{{else}}
DOCUMENTOS:
(No hay documentos recuperados)
{{/if}}

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

If the user expresses a crisis or suicidal thoughts, respond with:
"Lamento que estés pasando por esto. No estás solo/a. Por favor, considera contactar con un/a profesional de salud mental."

Devuelve SOLO un JSON válido con esta forma exacta:
{"response":"..."}`,
});

const emotionalChatbotFlow = ai.defineFlow(
  {
    name: "emotionalChatbotFlow",
    inputSchema: EmotionalChatbotInputSchema,
    outputSchema: EmotionalChatbotOutputSchema,
  },
  async (rawInput) => {
    const input = EmotionalChatbotInputSchema.parse(rawInput);

    // ✅ 1) Recupera contexto desde Firestore (kb-chunks)
    const { context: docsContext } = await retrieveDocsContext(input.message, { k: 6 });

    // ✅ 2) Construye payload del prompt incluyendo docsContext
    const promptPayload: {
      message: string;
      context?: string;
      userName?: string;
      docsContext?: string;
    } = {
      message: input.message,
      docsContext,
    };

    if (typeof input.context === "string" && input.context.trim() !== "") {
      promptPayload.context = input.context;
    }
    if (typeof input.userName === "string" && input.userName.trim() !== "") {
      promptPayload.userName = input.userName;
    }

    const { output } = await emotionalChatbotPrompt(promptPayload);

    if (!output?.response) {
      throw new Error("Genkit devolvió un 'output' vacío o sin la propiedad 'response'.");
    }

    return output;
  }
);
