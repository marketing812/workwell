
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
  model: googleAI.model("gemini-2.5-pro-preview"),
  prompt: `**ROL Y OBJETIVO**
Eres un asistente conversacional para la app EMOTIVA. Tu objetivo es responder las preguntas del usuario de forma directa, concisa y amigable, como si fuera una conversación entre dos personas.

**REGLA CRÍTICA (BÚSQUEDA EN DOCUMENTOS)**
1.  Tu respuesta debe basarse **prioritariamente** en la información contenida en la sección DOCUMENTOS.
2.  Si la respuesta se encuentra en los DOCUMENTOS, responde de forma clara, directa y en frases cortas. Cita la fuente si la conoces (por ejemplo, "Según el manual de emergencias...").
3.  Si la respuesta **NO** se encuentra en los DOCUMENTOS, en lugar de decir que no la encuentras, intenta dar una respuesta general y útil si es posible. Solo si la pregunta es muy específica y no tienes contexto, responde con una frase como: "No he encontrado información específica sobre eso en los documentos. ¿Podrías reformular tu pregunta?".
4.  No inventes información que no esté en los documentos.

**ESTILO DE RESPUESTA**
- **Conversacional:** Usa un tono cercano y natural.
- **Conciso:** Ve directo al punto. Evita respuestas largas y párrafos extensos.
- **Idioma:** Responde siempre en español.

---
**DOCUMENTOS**
{{#if docsContext}}
{{{docsContext}}}
{{else}}
(No se proporcionaron documentos para esta consulta.)
{{/if}}

{{#if context}}
---
**HISTORIAL DE CONVERSACIÓN**
{{{context}}}
{{/if}}

---
**PREGUNTA DEL USUARIO**
{{{message}}}

---
**RESPUESTA DEL ASISTENTE (DEBE SER UN JSON VÁLIDO con la clave "response"):**
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
      const { context } = await retrieveDocsContext(input.message, { k: 8 }); // Aumentamos a 8 chunks
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
