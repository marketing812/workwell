import { admin } from "@/lib/firebase-admin";
import { embedText } from "./embed";
/*
if (!admin.apps.length) {
  admin.initializeApp();
}
*/
const db = admin.firestore();

export type RetrievedChunk = {
  text: string;
  source?: string;
  chunkIndex?: number;
  distance?: number;
};
export async function retrieveDocsContext(question: string, opts?: { k?: number; minChars?: number }) {
  const k = opts?.k ?? 6;
  const minChars = opts?.minChars ?? 80;

  const qVec = await embedText(question);

  // @ts-ignore
  const snap = await db
    .collection("kb-chunks")
    .findNearest("embedding", admin.firestore.FieldValue.vector(qVec), {
      limit: k,
      distanceMeasure: "COSINE",
    })
    .get();

  const chunks = snap.docs
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
