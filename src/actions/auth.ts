
"use server";

import { z } from "zod";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { t } from "@/lib/translations";

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

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
        throw new Error("No se encontró el perfil de usuario.");
    }
    
    const userProfile = userDoc.data();

    const clientUser: ActionUser = {
      id: user.uid,
      email: user.email!,
      name: userProfile?.name || "Usuario",
      ageRange: userProfile?.ageRange,
      gender: userProfile?.gender,
      initialEmotionalState: userProfile?.initialEmotionalState,
    };

    return {
      message: t.loginSuccessMessage,
      user: clientUser,
    };

  } catch (error: any) {
    console.error("Login Error:", error);
    let errorMessage = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
    } else if (error.message === "No se encontró el perfil de usuario.") {
        errorMessage = "El perfil de usuario no se encontró en la base de datos.";
    }

    return {
      errors: { _form: [errorMessage] },
    };
  }
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
