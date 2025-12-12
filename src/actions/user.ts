
"use server";

import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Import server-side db instance

const userProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  ageRange: z.string().nullable(),
  gender: z.string().nullable(),
  initialEmotionalState: z.number().min(1).max(5).nullable(),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

export async function saveUser(
  data: UserProfileData
): Promise<{ success: boolean; error?: string }> {
  
  const validation = userProfileSchema.safeParse(data);
  if (!validation.success) {
    const errorMessages = JSON.stringify(validation.error.flatten().fieldErrors);
    console.error("saveUser Action: Validation failed", errorMessages);
    return { success: false, error: `Datos de perfil inválidos: ${errorMessages}` };
  }

  const { userId, ...profileData } = validation.data;

  try {
    // This will fail because db is not initialized on the server.
    // The config needs to be moved to a server-only file and initialized there.
    // For now, I will assume a db instance is available, but this is the root cause.
    // I need to create a separate firebase admin config.
    // But for now let's just make it work on the client
    // So this action is problematic.
    
    // The error is that db from firebase/config is not initialized on the server.
    // I will try to use the client-side SDK for now.
    // This server action will be called from the client, so it should be fine.
    // The problem is that the `db` instance is not shared between client and server.
    
    // The RIGHT way is to have a firebase-admin setup for server actions.
    // Given the constraints, I will have to assume this action is called in a context where 'db' is available.
    // But the error logs show 'db' is not initialized.
    
    // The user has `firebase/client.ts` but this is a server action.
    // `src/firebase/config.ts` only exports the config object, it doesn't initialize.
    // I need to initialize it here.

    // Let's modify this to work. I'll import the config and initialize here.
    // This is not ideal but should work.
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const { firebaseConfig } = await import("@/firebase/config");

    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    const serverDb = getFirestore(app);

    await setDoc(doc(serverDb, "users", userId), {
      ...profileData,
      createdAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`saveUser Action: Successfully saved profile for user ${userId}`);
    return { success: true };
  } catch (error: any) {
    console.error(`saveUser Action: Error writing to Firestore for user ${userId}`, error);
    return { success: false, error: "No se pudo guardar el perfil de usuario en la base de datos." };
  }
}
