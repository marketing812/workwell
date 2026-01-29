
import { admin } from "@/lib/firebase-admin";
// ⬇️ USA EXACTAMENTE el mismo import que en emotional-chatbot.ts
import { retrieveDocsContext } from "@/ai/rag/retrieve";

export const runtime = "nodejs";

export async function GET() {
  // 1️⃣ Auth / credenciales
  const app = admin.app();

  // 2️⃣ Firestore básico
  const snap = await admin.firestore().collection("kb-chunks").limit(1).get();
  const first = snap.docs[0]?.data();

  // 3️⃣ Retrieval real (vector search)
  const query = "desregulación emocional";
  const { context } = await retrieveDocsContext(query);

  return Response.json({
    ok: true,

    // AUTH
    auth: {
      credentialType: app.options.credential?.constructor?.name ?? "unknown",
      projectId: app.options.projectId,
    },

    // FIRESTORE
    firestore: {
      docs: snap.size,
      sampleKeys: first ? Object.keys(first) : [],
      textPreview: (first?.text ?? "").slice(0, 200),
    },

    // RETRIEVAL
    rag: {
      query,
      contextLen: context?.length ?? 0,
      contextPreview: (context ?? "").slice(0, 400),
    },
  });
}
