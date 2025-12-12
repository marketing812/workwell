
"use server";

import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

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
    await setDoc(doc(db, "users", userId), {
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
