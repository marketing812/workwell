'use server';

/**
 * @fileOverview An AI-powered chatbot for emotional support and guidance using Cognitive-Behavioral Therapy principles.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import { googleAI } from "@genkit-ai/google-genai";
import { getDb } from "@/lib/firebase-admin";
import { embedText } from "@/ai/rag/embed";

// RAG (Retrieval-Augmented Generation) Logic

export type RetrievedChunk = {
  text: string;
  source?: string;
  chunkIndex?: number;
  distance?: number;
};
function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractEntityQuery(question: string) {
  const q = normalize(question);
  const m =
    q.match(/^(quien es|quien era|que es|que significa|define)\s+(.+?)$/i) ||
    q.match(/^(hablame de|dime sobre|informacion sobre)\s+(.+?)$/i);

  const entity = m?.[2]?.trim();
  if (!entity) return null;
  return entity.slice(0, 80);
}

function keywordScore(question: string, text: string) {
  const qn = normalize(question);
  const tn = normalize(text);

  const stop = new Set([
    "quien",
    "que",
    "es",
    "era",
    "de",
    "la",
    "el",
    "los",
    "las",
    "un",
    "una",
    "y",
    "o",
    "a",
    "en",
    "por",
    "para",
    "sobre",
    "dime",
    "hablame",
    "informacion",
    "define",
    "significa",
  ]);

  const tokens = qn.split(" ").filter((t) => t.length >= 3 && !stop.has(t));

  let score = 0;

  // boost fuerte para consultas tipo "quien es X"
  const entity = extractEntityQuery(question);
  if (entity) {
    const en = normalize(entity);
    if (en && tn.includes(en)) score += 100;
  }

  // boost por tokens
  for (const t of tokens) {
    if (!tn.includes(t)) continue;
    score += 10;

    // apariciones (máx 5)
    const re = new RegExp(`\\b${t}\\b`, "g");
    const matches = tn.match(re)?.length ?? 0;
    score += Math.min(matches, 5) * 2;
  }

  return score;
}

export async function retrieveDocsContext(
  question: string,
  opts?: { k?: number; minChars?: number }
): Promise<{ context: string; chunks: RetrievedChunk[] }> {
  const k = opts?.k ?? 8;
  const minChars = opts?.minChars ?? 80;

  const db = getDb();
  const qVec = await embedText(question);

  // Pedimos más candidatos para poder re-rankear por keyword
  const candidateLimit = Math.max(64, k * 4);

  const snap = await db
    .collection("kb-chunks")
    // @ts-ignore
    .findNearest("embedding", qVec, {
      limit: candidateLimit,
      distanceMeasure: "COSINE",
    })
    .get();

  const candidates: RetrievedChunk[] = snap.docs
    .map((d) => d.data() as any)
    .map((x) => ({
      text: String(x.text ?? ""),
      source: x.source ? String(x.source) : undefined,
      chunkIndex: typeof x.chunkIndex === "number" ? x.chunkIndex : undefined,
      // distance casi nunca viene aquí; no pasa nada si undefined
      distance: typeof x.distance === "number" ? x.distance : undefined,
    }))
    .filter((c) => c.text && c.text.length >= minChars);

  // Re-rank híbrido: vector candidates + keyword boost
  const ranked = candidates
    .map((c) => ({
      ...c,
      _kw: keywordScore(question, c.text),
    }))
    .sort((a, b) => b._kw - a._kw);

  const chunks = ranked.slice(0, k);

  const context = chunks
    .map((c, i) => {
      const src = c.source ? ` | ${c.source}` : "";
      const idx =
        typeof c.chunkIndex === "number" ? ` | chunk ${c.chunkIndex}` : "";
      return `[#${i + 1}${src}${idx}]\n${c.text}`;
    })
    .join("\n\n");

  return { context, chunks };
}
// End of RAG Logic

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
