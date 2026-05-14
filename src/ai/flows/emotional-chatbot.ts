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

const EMOTIONAL_DISTRESS_PATTERNS = [
  "no me siento con animo",
  "no estoy bien",
  "no me encuentro bien",
  "sin animo",
  "desanim",
  "triste",
  "decaid",
  "deprim",
  "agotad",
  "agobiad",
  "ansios",
  "ansiedad",
  "bloquead",
  "estresad",
  "estres",
  "no puedo mas",
  "me siento mal",
  "me encuentro mal",
  "estoy mal",
  "estoy regular",
  "estoy fatal",
  "me siento raro",
  "me siento rara",
  "me cuesta todo",
  "no tengo ganas",
  "no tengo energia",
  "sin fuerzas",
  "sin energia",
  "estoy saturad",
  "me siento superad",
  "me siento superada",
  "vac",
  "solo",
  "sola",
  "sobrepas",
  "abrum",
];

function isEmotionalDistress(message: string) {
  const text = normalize(message);
  if (!text) return false;

  return EMOTIONAL_DISTRESS_PATTERNS.some((pattern) => text.includes(pattern));
}

function startsWithPrematureResourceSuggestion(response: string) {
  const text = normalize(response).slice(0, 240);
  if (!text) return false;

  const leadingSuggestionPatterns = [
    /^te recomiendo\b/,
    /^te sugiero\b/,
    /^mi recomendacion es\b/,
    /^podrias empezar\b/,
    /^puedes empezar\b/,
    /^quizas te ayude\b/,
    /^quiza te ayude\b/,
    /^quizas te vendria bien\b/,
    /^quiza te vendria bien\b/,
    /^podria ayudarte\b/,
    /^puede ayudarte\b/,
    /^la ruta\b/,
    /^una ruta\b/,
    /^te iria bien\b/,
    /^te vendria bien\b/,
    /^haz la ruta\b/,
    /^prueba la ruta\b/,
  ];

  if (leadingSuggestionPatterns.some((pattern) => pattern.test(text))) {
    return true;
  }

  return /^(te recomiendo|te sugiero|mi recomendacion es|podrias empezar|puedes empezar|quizas te ayude|quiza te ayude|quizas te vendria bien|quiza te vendria bien|podria ayudarte|puede ayudarte).{0,120}\b(ruta|ejercicio|recurso|contenido)\b/.test(
    text
  );
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
Eres un asistente conversacional para la app EMOTIVA. Actúas como mentor psicoeducativo: cálido, profesional y basado en evidencia. Tu objetivo es ayudar al usuario de forma clara, cercana y profesional, utilizando la documentación interna como fuente principal.
No sustituyes a un profesional de salud mental y no debes presentarte como terapeuta ni como servicio clínico.
**REGLA CRÍTICA (USO DE DOCUMENTOS)**
1. Responde basándote en la información de DOCUMENTOS siempre que haya algo relacionado.
2. Si DOCUMENTOS contiene la respuesta, contesta directo y claro.
3. Si DOCUMENTOS NO contiene la respuesta exacta, NO inventes:
   - Di en 1 frase que en los documentos recuperados no aparece esa información de forma directa.
   - Aun así, ofrece lo más útil que sí aportan los documentos (resumen breve).
   - Haz 1 pregunta aclaratoria para identificar qué “Beck” o qué concepto busca.
4. Solo si DOCUMENTOS está vacío, responde exactamente:
   "No se han encontrado resultados en la documentación disponible. ¿Podrías reformular tu consulta o intentarlo con otras palabras?"

**MANEJO DEL MALESTAR EMOCIONAL**
- REGLA PRIORITARIA: si el mensaje expresa malestar emocional, tristeza, desánimo, ansiedad, agobio o bloqueo, queda prohibido recomendar una ruta, ejercicio, contenido o recurso como primera respuesta, aunque aparezca en DOCUMENTOS.
- En esos casos, sigue obligatoriamente este orden:
  1. valida emocionalmente lo que comparte el usuario;
  2. ofrece una explicación breve y psicoeducativa, sin sonar clínica ni distante;
  3. propone una microacción concreta, breve y segura;
  4. cierra con una pregunta abierta para continuar la conversación.
- Usa el contenido de las rutas para orientar la conversación y enriquecer tu respuesta, pero no derives automáticamente al usuario a una ruta.
- Solo puedes mencionar rutas si el usuario las pide explícitamente o como sugerencia secundaria al final de la respuesta, después de haber respondido con validación, explicación, microacción y pregunta abierta.
- En mensajes de malestar emocional, el primer bloque de la respuesta nunca debe empezar recomendando una ruta, ejercicio, contenido o recurso.

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

{{#if responseDirective}}
---
INSTRUCCION ADICIONAL DE RESPUESTA:
{{{responseDirective}}}
{{/if}}

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
     // console.log(`emotionalChatbotFlow: Buscando contexto para la pregunta: "${input.message}"`);
      
      const { context, chunks } = await retrieveDocsContext(input.message, { k: 6 });
      docsContext = context; // Assign to the outer scope variable
     // console.log("FLOW_FIRMA_123", { hasDocsContext: !!docsContext, len: docsContext?.length ?? 0 });
      
    // /* console.log("RAG_CHAT chunks:", chunks?.length ?? 0);
     // console.log("RAG_CHAT docsContext chars:", (docsContext ?? "").length);
     // console.log("RAG_CHAT first sources:", (chunks ?? []).slice(0, 3).map((c:any) => c.source));
     // console.log("emotionalChatbotFlow: RAG context retrieved successfully.");*/

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
      responseDirective?: string;
    } = {
      message: input.message,
    };

    const emotionalSupportMode = isEmotionalDistress(input.message);
    
    if (docsContext) {
        promptPayload.docsContext = docsContext;
    }

    if (typeof input.context === "string" && input.context.trim() !== "") {
      promptPayload.context = input.context;
    }
    if (typeof input.userName === "string" && input.userName.trim() !== "") {
      promptPayload.userName = input.userName;
    }

    if (emotionalSupportMode) {
      promptPayload.responseDirective =
        "El mensaje del usuario expresa malestar emocional. No puedes recomendar una ruta, ejercicio, contenido o recurso como apertura de la respuesta. Primero valida, luego explica brevemente, despues propone una microaccion concreta y termina con una pregunta abierta. Si mencionas una ruta, solo puede aparecer al final como sugerencia secundaria.";
    }

const result: any = await emotionalChatbotPrompt(promptPayload);

// Extrae texto de forma compatible con Genkit
const raw =
  typeof result?.text === "function"
    ? result.text()
    : (result?.text ?? result?.output ?? result?.message ?? "");
/*
// console.log("LLM_RESULT_KEYS:", result ? Object.keys(result) : null);
// console.log("LLM_RAW_TYPE:", typeof raw);
// console.log("LLM_RAW_PREVIEW:", String(raw).slice(0, 300));
*/
let assistantText = String(raw ?? "").trim();

if (
  emotionalSupportMode &&
  startsWithPrematureResourceSuggestion(assistantText)
) {
  const retryPayload = {
    ...promptPayload,
    responseDirective:
      "Corrige la respuesta anterior. El usuario expresa malestar emocional y esta prohibido empezar recomendando una ruta, ejercicio, contenido o recurso. Reescribe la respuesta empezando por validacion emocional, seguida de una explicacion breve, una microaccion concreta y una pregunta abierta. Solo si aporta valor, menciona una ruta al final como sugerencia secundaria.",
  };

  const retryResult: any = await emotionalChatbotPrompt(retryPayload);
  const retryRaw =
    typeof retryResult?.text === "function"
      ? retryResult.text()
      : (retryResult?.text ?? retryResult?.output ?? retryResult?.message ?? "");

  assistantText = String(retryRaw ?? "").trim() || assistantText;
}

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
