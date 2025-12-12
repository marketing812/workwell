
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/config"; // Asumimos una instancia 'db' de servidor
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

// Las funciones de loginUser, registerUser, etc., se eliminan de aquí
// porque la autenticación ahora se manejará en el cliente con los SDK de Firebase.

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

export type ChangePasswordState = {
  errors?: {
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Esta función se mantiene como ejemplo, pero la lógica de reset
// se hará en el cliente para evitar problemas de inicialización.
export async function resetPassword(email: string): Promise<{success: boolean; message: string}> {
  // En una implementación real, aquí llamarías a la API de Firebase Admin
  // o a un servicio externo. Para este ejemplo, simulamos el éxito.
  console.log(`Simulating password reset for ${email}`);
  return { success: true, message: "Se ha enviado un correo para restablecer tu contraseña." };
}
