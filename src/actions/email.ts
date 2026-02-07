import { db, authAdmin, FieldValue } from "@/lib/firebase-admin";

export async function sendReminderEmailByUserId(
  userId: string,
  bodyHtml: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) return { success: false, error: "No userId provided." };
    if (!bodyHtml) return { success: false, error: "No email body provided." };

    // 🔥 AQUÍ: obtener email desde Firebase Auth usando el admin SDK
    const userRecord = await authAdmin.getUser(userId);

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
      createdAt: FieldValue.serverTimestamp(),
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
