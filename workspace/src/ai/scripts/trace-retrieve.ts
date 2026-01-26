
"use server";

import { admin } from "@/lib/firebase-admin";
import { embedText } from "../rag/embed";
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

const db = admin.firestore();

async function main() {
  const q = process.argv.slice(2).join(" ") || "terapia cognitiva beck reestructuración cognitiva";

  console.log("QUERY:", q);

  // A) Confirmar que hay docs en la colección
  const countSnap = await db.collection("kb-chunks").limit(3).get();
  console.log("SAMPLE DOCS:", countSnap.size);
  countSnap.docs.forEach((d: QueryDocumentSnapshot, i: number) => {
    const data: any = d.data();
    console.log(`DOC#${i} fields:`, Object.keys(data));
    console.log(`DOC#${i} source:`, data.source);
    console.log(`DOC#${i} embedding type:`, Array.isArray(data.embedding) ? "array" : typeof data.embedding);
    console.log(`DOC#${i} embedding length:`, Array.isArray(data.embedding) ? data.embedding.length : null);
    console.log(`DOC#${i} text chars:`, (data.text ?? "").length);
  });

  // B) Confirmar que el embedding de la query existe y tiene dimensión correcta
  const qVec = await embedText(q);
  console.log("QUERY EMBEDDING LENGTH:", qVec.length);

  // C) Ejecutar vector search y mostrar resultados
  // @ts-ignore
  const snap = await db.collection("kb-chunks").findNearest("embedding", admin.firestore.FieldValue.vector(qVec), {
    limit: 6,
    distanceMeasure: "COSINE",
  }).get();

  console.log("NEAREST RESULTS:", snap.size);
  snap.docs.forEach((d: QueryDocumentSnapshot, idx: number) => {
    const data: any = d.data();
    console.log(`RES#${idx} source:`, data.source, "chunkIndex:", data.chunkIndex, "text chars:", (data.text ?? "").length);
    console.log(String(data.text ?? "").slice(0, 200).replace(/\s+/g, " "));
  });
}

main().catch((e) => {
  console.error("TRACE ERROR:", e?.message ?? e);
  console.error(e);
  process.exit(1);
});

    