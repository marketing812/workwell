import { admin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  const app = admin.app();

  const hasEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
  const hasKey = !!process.env.FIREBASE_PRIVATE_KEY;
  const keyLen = process.env.FIREBASE_PRIVATE_KEY?.length ?? 0;

  const snap = await admin.firestore().collection("kb-chunks").limit(1).get();

  return Response.json({
    ok: true,
    projectId: app.options.projectId,
    credentialType: app.options.credential?.constructor?.name ?? "unknown",
    env: { hasEmail, hasKey, keyLen },
    docs: snap.size,
  });
}
