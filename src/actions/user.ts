
"use server";

import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/config";

const userProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  ageRange: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  initialEmotionalState: z.number().min(1).max(5).nullable().optional(),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

// This function might still be useful if you need to update profiles from the server in the future,
// but it's not strictly necessary for the client-side registration flow anymore.
// It's important that it initializes its own Firebase instance if it's a server action.
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

    