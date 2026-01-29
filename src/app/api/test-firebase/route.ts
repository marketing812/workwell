import { admin } from "@/lib/firebase-admin";
export const runtime = "nodejs";

export async function GET() {
  const snap = await admin.firestore().collection("kb-chunks").limit(1).get();
  const first = snap.docs[0]?.data();

  return Response.json({
    ok: true,
    docs: snap.size,
    sample: first
      ? {
          keys: Object.keys(first),
          // ajusta estos campos según tu esquema real:
          hasText: typeof first.text === "string",
          textPreview: (first.text ?? "").slice(0, 200),
        }
      : null,
  });
}
