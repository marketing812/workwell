'use server';

import { admin } from "@/lib/firebase-admin";

import { embedText } from "./embed";

const db = admin.firestore();

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
