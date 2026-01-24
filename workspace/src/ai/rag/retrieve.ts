import * as admin from "firebase-admin";
import { embedText } from "./embed";

if (!admin.apps.length) {
  // Si tu script usa storageBucket explícito, aquí no hace falta para leer Firestore.
  // En App Hosting / Functions se inicializa con credenciales del runtime.
  admin.initializeApp();
}

const db = admin.firestore();

export type RetrievedChunk = {
  text: string;
  source?: string;
  chunkIndex?: number;
  // distance puede venir en metadata; la dejamos opcional
  distance?: number;
};

export async function retrieveDocsContext(
  question: string,
  opts?: { k?: number; minChars?: number }
): Promise<{ context: string; chunks: RetrievedChunk[] }> {
  const k = opts?.k ?? 6;
  const minChars = opts?.minChars ?? 80;

  const qVec = await embedText(question);

  // Vector search en Firestore (Node Admin SDK)
  // Si tu proyecto aún no tiene vector index "visible", aquí:
  // - o funciona directo,
  // - o te devuelve un error con enlace para crear el índice.
  const snap = await db
    .collection("kb-chunks")
    // @ts-ignore - findNearest puede no estar tipado según versión
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
      // algunos SDKs exponen distance en campos especiales; lo dejamos opcional
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
