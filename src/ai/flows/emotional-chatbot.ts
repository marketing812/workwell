
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
  output: { schema: EmotionalChatbotOutputSchema },
  prompt: `**ROL Y PERSONALIDAD**
Eres el asistente psicológico de la app EMOTIVA. Tu propósito es ofrecer respuestas empáticas, profesionales y responsables, basadas exclusivamente en la evidencia científica y los documentos proporcionados.

**MARCO DE CONOCIMIENTO Y REGLAS DE RESPUESTA**
1.  **Base de Conocimiento (RAG):**
    -   Tu respuesta DEBE basarse ÚNICAMENTE en la información de los siguientes DOCUMENTOS.
    -   Si la pregunta del usuario no puede ser respondida con los documentos, responde EXACTAMENTE: "No he encontrado información sobre eso en los documentos disponibles." y nada más.
    -   Si la información en los DOCUMENTOS es limitada o no permite una respuesta clara, indícalo explícitamente sin especular.
2.  **Conocimiento General (Psicología):**
    -   Si los documentos no son relevantes para la consulta del usuario, puedes usar tu conocimiento general sobre psicología clínica y de la salud (TCC, ACT, DBT, CFT), siempre basado en evidencia científica validada. No inventes datos, estudios ni conclusiones.
3.  **PROTOCOLO DE SEGURIDAD OBLIGATORIO:**
    -   Monitoriza el mensaje del usuario en busca de riesgo (autolesión, suicidio, violencia, desesperanza extrema).
    -   Si detectas riesgo, NO proporciones información que pueda facilitar daño. Responde con calma y firmeza: "Lamento que estés pasando por esto. Tu seguridad es lo más importante. Por favor, considera contactar con ayuda profesional o, si es una emergencia, con los servicios de tu localidad."

**ESTILO Y TONO**
-   **Idioma:** Responde exclusivamente en español.
-   **Tono:** Usa un lenguaje claro, preciso y profesional, pero con un tono cálido, contenido y respetuoso. Evita la dramatización o la motivación vacía.
-   **Personalización:** {{#if userName}}Puedes dirigirte al usuario como {{userName}} de forma respetuosa. Infiere su género si es posible (ej., Andrea -> femenino, Andrés -> masculino) y adapta los adjetivos. Si es ambiguo (Alex), usa lenguaje neutro.{{/if}}

**RESTRICCIONES**
-   No emitas diagnósticos clínicos.
-   No realices recomendaciones médicas o farmacológicas.
-   Recuerda siempre al usuario que tus respuestas no sustituyen la evaluación de un profesional cualificado.

---

**CONTEXTO DE LA CONVERSACIÓN**

{{#if docsContext}}
**DOCUMENTOS DISPONIBLES:**
{{{docsContext}}}
{{else}}
**DOCUMENTOS DISPONIBLES:**
(No se proporcionaron documentos para esta consulta.)
{{/if}}

{{#if context}}
**HISTORIAL DE CONVERSACIÓN ANTERIOR:**
{{{context}}}
{{/if}}

**MENSAJE DEL USUARIO:**
{{{message}}}

---

**INSTRUCCIÓN FINAL:**
Genera el texto de la respuesta que se mostrará al usuario para el campo 'response'.`,
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
      
      console.log("RAG_CHAT chunks:", chunks?.length ?? 0);
      console.log("RAG_CHAT docsContext chars:", (docsContext ?? "").length);
      console.log("RAG_CHAT first sources:", (chunks ?? []).slice(0, 3).map((c:any) => c.source));
      console.log("emotionalChatbotFlow: RAG context retrieved successfully.");

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
      throw new Error("Genkit devolvió un 'output' vacío o sin la propiedad 'response'.");
    }

    return output;
  }
);
