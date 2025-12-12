
"use server";

import { z } from "zod";
import {
  sendPasswordResetEmail,
  deleteUser as deleteFirebaseUser,
} from "firebase/auth";
import { auth } from "@/firebase/config"; 
import { t } from "@/lib/translations";

export async function resetPassword(email: string): Promise<{success: boolean, message: string}> {
    if (!email) {
        return { success: false, message: "El email es requerido."};
    }
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Se ha enviado un correo para restablecer tu contraseña."};
    } catch(error: any) {
        console.error("Error sending password reset email:", error);
        if (error.code === 'auth/invalid-email') {
            return { success: false, message: "El formato del correo electrónico no es válido."};
        }
        return { success: false, message: "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto."};
    }
}

export type DeleteAccountState = {
  errors?: {
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function deleteUserAccount(
  prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, errors: { _form: ["No hay un usuario autenticado para eliminar."] } };
  }

  try {
    await deleteFirebaseUser(user);
    return { success: true, message: "Tu cuenta ha sido eliminada exitosamente." };
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    let errorMessage = t.deleteAccountErrorMessage;
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = "Esta operación es sensible y requiere una autenticación reciente. Por favor, vuelve a iniciar sesión antes de intentar eliminar tu cuenta.";
    }
    return { success: false, errors: { _form: [errorMessage] } };
  }
}
