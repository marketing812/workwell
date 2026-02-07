
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
Eres un asistente conversacional para la app EMOTIVA. Tu objetivo es ayudar al usuario de forma clara, cercana y profesional, como un orientador emocional que utiliza documentación interna como fuente principal.
**REGLA CRÍTICA (USO DE DOCUMENTOS)**
1. Responde basándote en la información de DOCUMENTOS siempre que haya algo relacionado.
2. Si DOCUMENTOS contiene la respuesta, contesta directo y claro.
3. Si DOCUMENTOS NO contiene la respuesta exacta, NO inventes:
   - Di en 1 frase que en los documentos recuperados no aparece esa información de forma directa.
   - Aun así, ofrece lo más útil que sí aportan los documentos (resumen breve).
   - Haz 1 pregunta aclaratoria para identificar qué “Beck” o qué concepto busca.
4. Solo si DOCUMENTOS está vacío, responde exactamente:
   "No se han encontrado resultados en la documentación disponible. ¿Podrías reformular tu consulta o intentarlo con otras palabras?"

**ESTILO DE RESPUESTA**
- Conversacional, cercano y profesional.
- Directo y conciso: máximo 8-12 líneas.
- Usa frases cortas y fáciles de entender.
- Idioma: responde siempre en español.
- No uses markdown, ni listas con viñetas excesivas.
- No menciones “chunks”, embeddings ni detalles técnicos internos.
- No menciones la palabra “DOCUMENTOS” en la respuesta final. El usuario no debe saber que estás leyendo PDFs.
´- No menciones “DOCUMENTOS”, “chunks”, PDFs, ni fuentes internas en la respuesta.
---
DOCUMENTOS:
{{{docsContext}}}

{{#if context}}
---
HISTORIAL DE CONVERSACIÓN:
{{{context}}}
{{/if}}

---
PREGUNTA DEL USUARIO:
{{{message}}}

---
RESPUESTA DEL ASISTENTE (TEXTO PLANO, SIN JSON, SIN MARKDOWN):

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
      console.log("FLOW_FIRMA_123", { hasDocsContext: !!docsContext, len: docsContext?.length ?? 0 });
      
     /* console.log("RAG_CHAT chunks:", chunks?.length ?? 0);
      console.log("RAG_CHAT docsContext chars:", (docsContext ?? "").length);
      console.log("RAG_CHAT first sources:", (chunks ?? []).slice(0, 3).map((c:any) => c.source));
      console.log("emotionalChatbotFlow: RAG context retrieved successfully.");*/

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
const result: any = await emotionalChatbotPrompt(promptPayload);

// Extrae texto de forma compatible con Genkit
const raw =
  typeof result?.text === "function"
    ? result.text()
    : (result?.text ?? result?.output ?? result?.message ?? "");
/*
console.log("LLM_RESULT_KEYS:", result ? Object.keys(result) : null);
console.log("LLM_RAW_TYPE:", typeof raw);
console.log("LLM_RAW_PREVIEW:", String(raw).slice(0, 300));
*/
const assistantText = String(raw ?? "").trim();

// Si viene vacío, NO devuelvas vacío nunca
if (!assistantText) {
  console.error("LLM devolvió vacío. result=", result);
  return {
    response:
      "Ahora mismo no he podido generar una respuesta con la información disponible. " +
      "Prueba a reformular la pregunta o a darme un poco más de contexto.",
  };
}

return { response: assistantText };
  }
);
