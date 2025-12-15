
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/config"; 
import type { User } from "@/contexts/UserContext";

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
 * Esta es una Server Action que puede ser llamada desde componentes de cliente.
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  if (!userId) return null;
  try {
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    const db = getFirestore(app);

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      // Validar datos con Zod es una buena práctica aquí
      const profile = userProfileSchema.safeParse({ id: userId, ...data });
      if (profile.success) {
        return profile.data;
      } else {
        console.warn("User profile data from Firestore is invalid:", profile.error);
        return { // Devolver un perfil mínimo si la validación falla
            id: userId,
            name: data.name || null,
            email: data.email || null,
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}


export type DeleteAccountState = {
  errors?: { _form?: string[] };
  message?: string | null;
  success?: boolean;
};

export async function deleteUserAccount(
  prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  return { success: true, message: "Cuenta eliminada (simulado)." };
}

export type ChangePasswordState = {
  errors?: {
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function resetPassword(email: string): Promise<{success: boolean; message: string}> {
  console.log(`Simulating password reset for ${email}`);
  return { success: true, message: "Se ha enviado un correo para restablecer tu contraseña." };
}
