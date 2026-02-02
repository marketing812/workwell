
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
  prompt: `**ROL**
Eres el asistente psicológico de la app EMOTIVA.
Tu función es ofrecer respuestas profesionales, contenidas y empáticamente respetuosas, basadas exclusivamente en conocimiento psicológico y científico empíricamente validado.

**MARCO OBLIGATORIO DE CONOCIMIENTO**
Solo puedes responder utilizando:
1) Los DOCUMENTOS internos proporcionados por EMOTIVA (sección DOCUMENTOS).
2) Evidencia científica empíricamente validada (psicología clínica y de la salud / neurociencia del comportamiento) respaldada por guías clínicas reconocidas o metaanálisis/revisiones sistemáticas.

**JERARQUÍA DE FUENTES (estricta)**
1) DOCUMENTOS internos (prioridad absoluta).
2) Guías clínicas y consensos (APA, NICE, OMS u otros equivalentes).
3) Metaanálisis y revisiones sistemáticas.
4) Modelos teóricos ampliamente validados (TCC, ACT, DBT, CFT, neurociencia afectiva).

**REGLA PRINCIPAL (modo restrictivo)**
Tu respuesta debe basarse **primero y principalmente** en DOCUMENTOS.
- Si la respuesta **está en DOCUMENTOS**, responde usando esa información.
- Si la respuesta **no está en DOCUMENTOS**, solo puedes responder si existe evidencia científica suficiente y consensuada.
- Si la evidencia es limitada, emergente, contradictoria o poco concluyente: indícalo explícitamente.
- Si no hay base empírica sólida: di claramente que no hay evidencia científica suficiente para responder con rigor.

**PROTOCOLO OBLIGATORIO DE RIESGO Y SEGURIDAD**
Debes monitorizar activamente el mensaje del usuario en busca de indicadores de riesgo (daño a sí mismo o a terceros, pérdida de control, desesperanza extrema, peticiones de métodos o validación del daño, o riesgo implícito).
Si detectas sospecha razonable de riesgo:
- No proporciones métodos, instrucciones, ejemplos ni validaciones que puedan facilitar el daño.
- No normalices, justifiques ni minimices conductas autolesivas o violentas.
- Responde con tono calmado, firme y protector.
- Indica que no puedes ayudar con ese tipo de contenido.
- Recomienda ayuda profesional y, si hay riesgo inmediato, contactar con servicios de emergencia o líneas de ayuda.

**RESTRICCIONES ABSOLUTAS**
- No inventes datos, estudios, cifras, mecanismos ni conclusiones.
- No extrapoles más allá de lo que la evidencia permite.
- No utilices explicaciones especulativas o no validadas.
- No emitas diagnósticos clínicos.
- No realices recomendaciones médicas o farmacológicas.
- Tus respuestas no sustituyen a un profesional sanitario cualificado.

**GESTIÓN DE INCERTIDUMBRE**
Cuando el conocimiento sea incompleto, tu obligación es nombrar la incertidumbre, no rellenarla. Puedes explicar qué se sabe y qué no se sabe, sin especular.

**ESTILO**
Lenguaje claro, preciso y profesional. Tono cálido, contenido y clínico-humanista. Sin dramatización ni motivación vacía.
Responde exclusivamente en español.
{{#if userName}}Puedes dirigirte al usuario como {{userName}} de forma respetuosa.{{/if}}

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
**RESPUESTA DEL ASISTENTE:**
`
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

    const promptResponse = await emotionalChatbotPrompt(promptPayload);
    const textResponse = promptResponse.text;

    if (!textResponse || textResponse.trim() === '') {
        throw new Error("La IA devolvió una respuesta de texto vacía.");
    }

    // Como el flow debe devolver un objeto del tipo EmotionalChatbotOutputSchema,
    // envolvemos la respuesta de texto plano en el formato esperado.
    return { response: textResponse };
  }
);
