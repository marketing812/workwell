'use server';

import admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");

  let cleaned = raw.trim();
  if (
    (cleaned.startsWith("'") && cleaned.endsWith("'")) ||
    (cleaned.startsWith('"') && cleaned.endsWith('"'))
  ) {
    cleaned = cleaned.slice(1, -1);
  }

  const serviceAccount = JSON.parse(cleaned);

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function sendReminderEmailByUserId(
  userId: string,
  bodyHtml: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) return { success: false, error: "No userId provided." };
    if (!bodyHtml) return { success: false, error: "No email body provided." };

    const app = getAdminApp();
    const db = admin.firestore(app);

    // 🔥 AQUÍ: obtener email desde Firebase Auth
    const userRecord = await admin.auth(app).getUser(userId);

    const userEmail = userRecord.email;
    if (!userEmail) {
      return { success: false, error: "User has no email in Firebase Auth." };
    }

    // 🔥 Encolar email en Firestore para la extensión Trigger Email
    await db.collection("mail").add({
      to: userEmail,
      message: {
        subject: "Recordatorio de EMOTIVA",
        html: bodyHtml,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      meta: {
        kind: "mood-checkin-reminder",
        userId,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("[sendReminderEmailByUserId] FAILED:", err);
    return { success: false, error: err?.message || "Failed to queue email." };
  }
}
