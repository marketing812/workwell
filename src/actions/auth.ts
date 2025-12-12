
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Asumimos una instancia 'db' de servidor
import type { User } from "@/contexts/UserContext";

// El schema del perfil, útil para validaciones
const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  ageRange: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  initialEmotionalState: z.number().nullable().optional(),
});

/**
 * Obtiene el perfil de un usuario desde Firestore.
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userId,
        name: data.name || null,
        email: data.email || null,
        ageRange: data.ageRange || null,
        gender: data.gender || null,
        initialEmotionalState: data.initialEmotionalState || null,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Guarda o actualiza el perfil de un usuario en Firestore.
 */
export async function saveUserProfile(userData: Omit<User, 'email'> & { email: string }): Promise<{ success: boolean; error?: string }> {
  const { id, ...profileData } = userData;
  if (!id) {
    return { success: false, error: "User ID is required." };
  }
  try {
    const userDocRef = doc(db, "users", id);
    await setDoc(userDocRef, {
        ...profileData,
        lastLogin: new Date().toISOString(),
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving user profile:", error);
    return { success: false, error: "Could not save user profile." };
  }
}


// Las funciones de loginUser, registerUser, etc., se eliminan de aquí
// porque la autenticación se manejará en el cliente.
// Solo mantenemos las interacciones con la base de datos de perfiles.

export type DeleteAccountState = {
  errors?: { _form?: string[] };
  message?: string | null;
  success?: boolean;
};

export async function deleteUserAccount(
  prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  // This function would call the external API for user deletion
  // For now, it's a simulation.
  return { success: true, message: "Cuenta eliminada (simulado)." };
}

