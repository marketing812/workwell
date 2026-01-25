import { admin } from "@/lib/firebase-admin";
import { PDFParse } from "pdf-parse";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { embedText } from "../rag/embed";

const db = admin.firestore();
const bucket = admin.storage().bucket();

function chunkText(text: string, size = 1200, overlap = 200) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + size));
    i += size - overlap;
  }
  return chunks.filter((c) => c.length > 80);
}

async function main() {
  const prefix = ""; // raíz del bucket
  const [files] = await bucket.getFiles({ prefix });

  const pdfFiles = files.filter((f) => f.name.toLowerCase().endsWith(".pdf"));
  console.log("PDFs encontrados:", pdfFiles.map((f) => f.name));

  for (const file of pdfFiles) {
    const already = await db
      .collection("kb-chunks")
      .where("source", "==", file.name)
      .limit(1)
      .get();

    if (!already.empty) {
      console.log("⏭️ Ya indexado, salto:", file.name);
      continue;
    }
    console.log("\nIndexando:", file.name);

    const tmp = path.join(os.tmpdir(), path.basename(file.name));
    await file.download({ destination: tmp });

    const data = await fs.readFile(tmp);

    // ✅ API correcta de pdf-parse v2/v3
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    await parser.destroy();

    const text = result.text || "";

    if (text.trim().length < 200) {
      console.warn("⚠️ Poco texto (¿PDF escaneado?):", file.name);
      await fs.unlink(tmp);
      continue;
    }

    const chunks = chunkText(text);
    console.log("Chunks:", chunks.length);

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const embedding = await embedText(chunk);
      //console.log("EMBEDDING_DIM=", embedding.length);return;
      await db.collection("kb-chunks").add({
        text: chunk,
        embedding: admin.firestore.FieldValue.vector(embedding),
        source: file.name,
        chunkIndex: idx,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await fs.unlink(tmp);
    console.log("✅ OK:", file.name);
  }

  console.log("\nFIN ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
