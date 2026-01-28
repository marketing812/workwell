import { admin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  const snap = await admin.firestore().collection("kb-chunks").limit(1).get();

  return Response.json({
    ok: true,
    docs: snap.docs.length,
  });
}