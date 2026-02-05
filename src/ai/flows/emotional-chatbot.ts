'use server';

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
  model: googleAI.model("gemini-1.5-pro"), // Upgraded model
  prompt: `You are EMOTIVA, an expert and empathetic AI assistant. Your goal is to provide helpful and supportive answers to the user in Spanish.

First, you MUST check the DOCUMENTS section. If it contains relevant information to answer the user's question, use it as your primary source.

If the DOCUMENTS section is empty or does not contain a relevant answer, you MUST switch to your general knowledge and act as a supportive, empathetic conversational AI.

**CRITICAL RULES:**
1.  **NEVER** say "I can't find information in the documents", "I don't have access to that information", or any similar phrase.
2.  If the documents are not useful, simply answer the user's question naturally and conversationally using your general knowledge and empathetic persona.
3.  Always respond in Spanish.
4.  The final output MUST be a valid JSON object with a "response" key: {"response": "..."}

---
**DOCUMENTOS**
{{#if docsContext}}
{{{docsContext}}}
{{else}}
(No se proporcionaron documentos relevantes para esta consulta.)
{{/if}}

---
**HISTORIAL DE CONVERSACIÓN**
{{#if context}}
{{{context}}}
{{/if}}

---
**PREGUNTA DEL USUARIO**
{{{message}}}

---
**ASISTENTE (JSON):**
`,
});


const emotionalChatbotFlow = ai.defineFlow(
  {
    name: "emotionalChatbotFlow",
    inputSchema: EmotionalChatbotInputSchema,
    outputSchema: EmotionalChatbotOutputSchema,
  },
  async (rawInput) => {
    const input = EmotionalChatbotInputSchema.parse(rawInput);

    let docsContext: string | undefined = undefined;
    try {
      console.log(`emotionalChatbotFlow: Buscando contexto para la pregunta: "${input.message}"`);
      // Use a larger k to increase chances of finding relevant info
      const { context } = await retrieveDocsContext(input.message, { k: 6 }); 
      docsContext = context;
      console.log("emotionalChatbotFlow: RAG context retrieved successfully.");

    } catch (e: any) {
      console.error(
        "emotionalChatbotFlow: ERROR al recuperar el contexto RAG. Esto impedirá que el chatbot use los documentos.",
        e
      );
    }

    const promptPayload: {
      message: string;
      context?: string;
      userName?: string;
      docsContext?: string;
    } = {
      message: input.message,
    };
    
    if (docsContext) {
        promptPayload.docsContext = docsContext;
    }

    if (typeof input.context === "string" && input.context.trim() !== "") {
      promptPayload.context = input.context;
    }
    if (typeof input.userName === "string" && input.userName.trim() !== "") {
      promptPayload.userName = input.userName;
    }

    const { output } = await emotionalChatbotPrompt(promptPayload);

    if (!output?.response) {
      console.error("emotionalChatbotFlow: Genkit devolvió un 'output' vacío o sin la propiedad 'response'. Raw output:", output);
      throw new Error("La IA devolvió una respuesta en un formato inesperado.");
    }
    
    return output;
  }
);
