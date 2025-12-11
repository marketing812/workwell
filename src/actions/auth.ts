
"use server";

import { z } from "zod";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase"; // Usamos la configuración centralizada
import { t } from "@/lib/translations";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore";

export interface ActionUser {
  id: string;
  name: string;
  email: string;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  initialEmotionalState: z.coerce.number().min(1).max(5).optional(),
  agreeTerms: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones para registrarte.",
    })
  ),
});

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    ageRange?: string[];
    gender?: string[];
    initialEmotionalState?: string[];
    agreeTerms?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    email,
    password,
    ageRange,
    gender,
    initialEmotionalState,
  } = validatedFields.data;

  try {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Guardar información adicional en Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      ageRange: ageRange || null,
      gender: gender || null,
      initialEmotionalState: initialEmotionalState || null,
      createdAt: new Date().toISOString(),
    });

    return { message: t.registrationSuccessLoginPrompt };
  } catch (error: any) {
    let errorMessage = "Ocurrió un error durante el registro.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Este correo electrónico ya está en uso.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña es demasiado débil.";
    }
    return {
      errors: { _form: [errorMessage] },
    };
  }
}

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null;
  // Estos ya no se devuelven desde el login, se cargarán en el cliente
  fetchedEmotionalEntries?: EmotionalEntry[] | null;
  fetchedNotebookEntries?: NotebookEntry[] | null;
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
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userProfile = userDoc.data();

    return {
      message: t.loginSuccessMessage,
      user: {
        id: user.uid,
        email: user.email!,
        name: userProfile?.name || "Usuario",
        ageRange: userProfile?.ageRange,
        gender: userProfile?.gender,
        initialEmotionalState: userProfile?.initialEmotionalState,
      },
    };
  } catch (error: any) {
    return {
      errors: { _form: ["Credenciales inválidas. Por favor, inténtalo de nuevo."] },
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

export async function deleteUserAccount(
  prevState: DeleteAccountState
): Promise<DeleteAccountState> {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    return { errors: { _form: ["Debes estar autenticado para borrar tu cuenta."] } };
  }

  try {
    // Primero, borra los datos de Firestore
    await deleteDoc(doc(db, "users", user.uid));
    // Luego, borra el usuario de Authentication
    await deleteUser(user);

    return { success: true, message: "Tu cuenta ha sido eliminada permanentemente." };
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    let errorMessage = "Ocurrió un error al eliminar tu cuenta.";
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = "Esta operación es sensible y requiere una autenticación reciente. Por favor, vuelve a iniciar sesión e inténtalo de nuevo.";
    }
    return { errors: { _form: [errorMessage] } };
  }
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

export async function resetPassword(email: string): Promise<{success: boolean, message: string}> {
    if (!email) {
        return { success: false, message: "El email es requerido."};
    }
    try {
        const auth = getAuth(app);
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Se ha enviado un correo para restablecer tu contraseña."};
    } catch(error: any) {
        console.error("Error sending password reset email:", error);
        return { success: false, message: "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto."};
    }
}
