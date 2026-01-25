
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

  prompt: `Tu tarea principal es actuar como un asistente de IA empático y responder a la pregunta del usuario basándote ESTRICTAMENTE en el contenido de la sección "DOCUMENTOS".

**REGLAS CRÍTICAS DE RESPUESTA:**
1.  **Basamento en Documentos:** Basa TODA tu respuesta únicamente en la información de los DOCUMENTOS proporcionados. No utilices conocimiento externo.
2.  **Respuesta si no se encuentra:** Si la información para responder a la pregunta del usuario NO está en los DOCUMENTOS, responde con esta frase exacta y nada más: "No he encontrado información sobre eso en los documentos disponibles."
3.  **Cita de Fuentes:** Si la información está en los documentos, cita la fuente si es posible (por ejemplo, el nombre del PDF que se indica en los fragmentos del contexto).

**TONO Y PERSONA:**
- **Tono:** Tus respuestas deben ser siempre cálidas, comprensivas y de apoyo, ayudando al usuario a explorar sus pensamientos y sentimientos de forma constructiva.
- **Rol:** No eres un terapeuta, así que no des consejos médicos o diagnósticos definitivos.
- **Idioma:** Responde exclusivamente en español.
- **Personalización de Género:**{{#if userName}} El nombre del usuario es {{userName}}. Infiere su género del nombre (ej. 'Andrea' es probablemente femenino, 'Andrés' masculino) y utiliza adjetivos y pronombres de género correspondientes (e.g., 'abrumada' para mujer, 'abrumado' para hombre). Si el nombre es ambiguo (e.g., 'Álex') o no se proporciona, utiliza un lenguaje neutro.{{/if}}

**GESTIÓN DE CRISIS:**
Si el usuario expresa una crisis o pensamientos suicidas, tu ÚNICA respuesta debe ser: "Lamento que estés pasando por esto. No estás solo/a. Por favor, considera contactar con un/a profesional de salud mental."

---
**CONTEXTO PROPORCIONADO:**

{{#if docsContext}}
DOCUMENTOS:
{{{docsContext}}}
{{else}}
DOCUMENTOS:
(No se han proporcionado documentos para esta consulta.)
{{/if}}

{{#if context}}
HISTORIAL DE CONVERSACIÓN:
{{{context}}}
{{/if}}

---
**PREGUNTA DEL USUARIO:**
{{{message}}}

---
**FORMATO DE SALIDA:**
Devuelve SOLO un JSON válido con esta forma exacta: {"response":"..."}`,
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
      const { context, chunks } = await retrieveDocsContext(input.message, { k: 6 });
      docsContext = context; // Assign to the outer scope variable
     console.log("RAG_CHAT chunks:", chunks?.length ?? 0);
    console.log("RAG_CHAT docsContext chars:", (docsContext ?? "").length);
    console.log("RAG_CHAT first sources:", (chunks ?? []).slice(0, 3).map((c:any) => c.source));
    console.log("RAG_CHAT preview:", String(docsContext ?? "").slice(0, 200));
   
      console.log("emotionalChatbotFlow: RAG context retrieved successfully.");
    } catch (e: any) {
      console.warn(
        "emotionalChatbotFlow: Failed to retrieve RAG context. This is expected if the 'kb-chunks' collection doesn't exist. Proceeding without it.",
        e.message
      );
      // This is not a fatal error. We can continue without the RAG context.
      // The prompt is designed to handle cases where docsContext is not provided.
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
      throw new Error("Genkit devolvió un 'output' vacío o sin la propiedad 'response'.");
    }

    return output;
  }
);
