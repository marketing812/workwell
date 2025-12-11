
"use server";

import { z } from "zod";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { t } from "@/lib/translations";
import { fetchUserActivities, fetchNotebookEntries } from './user-data'; // Import moved functions

export interface ActionUser {
  id: string;
  name: string;
  email: string;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null;
};

// This action is now simplified and will not be used directly by the form.
// It remains for potential future server-to-server auth needs.
// The primary login logic is now in UserContext.tsx client-side.
export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // This server action is being deprecated in favor of client-side auth
  // to prevent serialization issues with Next.js.
  // It returns a generic error if called.
  return {
    errors: { _form: ["La función de inicio de sesión del servidor está obsoleta. La autenticación ahora se maneja en el cliente."] },
  };
}

export type DeleteAccountState = {
  errors?: {
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// This function has been moved to src/actions/user.ts as it's a server-only database operation.
// export async function deleteUserAccount...

export type ChangePasswordState = {
  errors?: {
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function resetPassword(email: string): Promise<{success: boolean, message: string}> {
    if (!email) {
        return { success: false, message: "El email es requerido."};
    }
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Se ha enviado un correo para restablecer tu contraseña."};
    } catch(error: any) {
        console.error("Error sending password reset email:", error);
        return { success: false, message: "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto."};
    }
}
