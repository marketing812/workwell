/**
 * @fileOverview An AI-powered chatbot for emotional support and guidance using Cognitive-Behavioral Therapy principles.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import { googleAI } from "@genkit-ai/google-genai";
import { db, FieldValue } from "@/lib/firebase-admin";
import { embedText } from "@/ai/rag/embed";

// ====================================================================================
// Inlined content from retrieve.ts to fix module boundary issue with 'use server'
// ====================================================================================
type RetrievedChunk = {
  text: string;
  source?: string;
  chunkIndex?: number;
  distance?: number;
};

async function retrieveDocsContext(
  question: string,
  opts?: { k?: number; minChars?: number }
): Promise<{ context: string; chunks: RetrievedChunk[] }> {
  const k = opts?.k ?? 8;
  const minChars = opts?.minChars ?? 80;

  const qVec = await embedText(question);

  const snap = await db
    .collection("kb-chunks")
    // @ts-ignore
    .findNearest("embedding", FieldValue.vector(qVec), {
      limit: k,
      distanceMeasure: "COSINE",
    })
    .get();

  const chunks: RetrievedChunk[] = snap.docs
    .map((d) => d.data() as any)
    .map((x) => ({
      text: String(x.text ?? ""),
      source: x.source ? String(x.source) : undefined,
      chunkIndex: typeof x.chunkIndex === "number" ? x.chunkIndex : undefined,
      distance: typeof x.distance === "number" ? x.distance : undefined,
    }))
    .filter((c) => c.text && c.text.length >= minChars);

  const context = chunks
    .map((c, i) => {
      const src = c.source ? ` | ${c.source}` : "";
      const idx = typeof c.chunkIndex === "number" ? ` | chunk ${c.chunkIndex}` : "";
      return `[#${i + 1}${src}${idx}]\n${c.text}`;
    })
    .join("\n\n");

  return { context, chunks };
}
// ====================================================================================
// End of inlined content
// ====================================================================================

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
  input: { schema: EmotionalChatbotInputSchema },
  output: { schema: EmotionalChatbotOutputSchema },
  prompt: `**ROL Y OBJETIVO**
Eres EMOTIVA, un asistente conversacional de apoyo emocional. Tu objetivo es ayudar al usuario a explorar sus pensamientos y emociones con calidez, comprensión y basándote en los principios de la Terapia Cognitivo-Conductual (TCC). Responde siempre en español.

**INSTRUCCIONES CLAVE**
1.  **Prioridad en el Apoyo Emocional:** Tu función principal es ser un apoyo conversacional. Ayuda al usuario a identificar pensamientos negativos, a reformular perspectivas y promueve la autocompasión.
2.  **Uso de la Base de Conocimiento:** Si la pregunta del usuario parece buscar información específica (p. ej., "¿qué es un código rojo?", "¿cómo pido vacaciones?"), usa la sección DOCUMENTOS como tu fuente principal y exclusiva de verdad. Cita el documento si es posible (ej., "Según el manual de emergencias...").
3.  **Respuesta si no encuentras información:** Si la pregunta es informativa y la respuesta NO está en los DOCUMENTOS, en lugar de inventar, responde de forma amable: "No tengo información específica sobre eso en mi base de conocimiento. ¿Hay algo más en lo que te pueda ayudar o quieres que hablemos sobre cómo te hace sentir esto?"
4.  **Mantén el rol conversacional:** Si la pregunta del usuario es más sobre sentimientos o una situación personal, y los DOCUMENTOS no son relevantes, continúa con tu rol de apoyo emocional sin necesidad de mencionar los documentos.

**HISTORIAL DE LA CONVERSACIÓN (SI APLICA)**
{{#if context}}
{{{context}}}
{{/if}}

**DOCUMENTOS DE APOYO (SI APLICA)**
{{#if docsContext}}
{{{docsContext}}}
{{else}}
(No se proporcionaron documentos para esta consulta.)
{{/if}}

---
**MENSAJE DEL USUARIO**
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
