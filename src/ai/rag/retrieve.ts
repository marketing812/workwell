import { admin } from "@/lib/firebase-admin";
import { embedText } from "./embed";

const db = admin.firestore();

export type RetrievedChunk = {
  text: string;
  source?: string;
  chunkIndex?: number;
  distance?: number;
};

export async function retrieveDocsContext(
  question: string,
  opts?: { k?: number; minChars?: number }
): Promise<{ context: string; chunks: RetrievedChunk[] }> {
  const k = opts?.k ?? 8;
  const minChars = opts?.minChars ?? 80;

  const qVec = await embedText(question);

  const snap = await db
    .collection("kb-chunks")
    // @ts-ignore
    .findNearest("embedding", qVec, {
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
