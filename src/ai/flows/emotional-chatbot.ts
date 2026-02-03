
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
  prompt: `**ROL Y OBJETIVO**
Eres un asistente conversacional para la app EMOTIVA. Tu objetivo es responder las preguntas del usuario de forma directa, concisa y amigable, como si fuera una conversación entre dos personas.

**REGLA CRÍTICA (BÚSQUEDA EN DOCUMENTOS)**
1.  Tu respuesta debe basarse **única y exclusivamente** en la información contenida en la sección DOCUMENTOS.
2.  Si la respuesta se encuentra en los DOCUMENTOS, responde de forma clara, directa y en frases cortas.
3.  Si la respuesta **NO** se encuentra en los DOCUMENTOS, debes responder **exactamente** con esta frase: "No se han encontrado resultados en la documentación disponible. ¿Podrías reformular tu pregunta o intentarlo con otras palabras?"
4.  No inventes información ni utilices conocimiento externo. Tu única fuente de verdad son los DOCUMENTOS proporcionados.

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
      // ✅ 1) Recupera contexto desde Firestore (kb-chunks)
      console.log(`emotionalChatbotFlow: Buscando contexto para la pregunta: "${input.message}"`);
      const { context, chunks } = await retrieveDocsContext(input.message, { k: 6 });
      docsContext = context; // Assign to the outer scope variable
      /*
      console.log("RAG_CHAT chunks:", chunks?.length ?? 0);
      console.log("RAG_CHAT docsContext chars:", (docsContext ?? "").length);
      console.log("RAG_CHAT first sources:", (chunks ?? []).slice(0, 3).map((c:any) => c.source));
      console.log("emotionalChatbotFlow: RAG context retrieved successfully.");
*/
    } catch (e: any) {
      console.error(
        "emotionalChatbotFlow: ERROR al recuperar el contexto RAG. Esto impedirá que el chatbot use los documentos.",
        e
      );
      // No re-lanzamos el error. El chatbot continuará sin contexto de documentos.
    }

    // ✅ 2) Construye payload del prompt incluyendo docsContext
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
    
    // output is already { response: "..." }
    return output;
  }
);
