
"use server";

import { z } from "zod";
import { encryptDataAES, decryptDataAES, forceEncryptStringAES, forceDecryptStringAES } from "@/lib/encryption";
import { t } from "@/lib/translations";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore";
import { fetchUserActivities, fetchNotebookEntries } from "./user-data"; // Importar las funciones de user-data

// Define the User interface that actions will deal with
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
  token: z.string().optional(),
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

// Updated schema for the API response *data* part
const ApiLoginSuccessDataSchema = z.object({
  id: z.string().min(1, "El ID de usuario de la API no puede estar vacío.").describe("El ID del usuario, que podría estar encriptado como un string JSON {'iv':'...','data':'...'}"),
  name: z.object({
    value: z.string().min(1, "El valor encriptado/raw del nombre en la API no puede estar vacío.")
  }).describe("Contiene el nombre, posiblemente encriptado como un string JSON {'value':'nombreEncriptado'} o {'value':'nombreDirecto'} si la encriptación está desactivada."),
  email: z.object({
    value: z.string().min(1, "El valor encriptado/raw del email en la API no puede estar vacío.")
  }).describe("Contiene el email, similar estructura que el nombre."),
  ageRange: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  initialEmotionalState: z.coerce.number().min(1).max(5).nullable().optional(),
});


export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    token?: string[];
    ageRange?: string[];
    gender?: string[];
    initialEmotionalState?: string[];
    agreeTerms?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null;
  debugApiUrl?: string;
};

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: any; // Can be various structures or an encrypted string
}

const API_TIMEOUT_MS = 15000;
const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  // Logic remains the same as it doesn't involve Firestore client SDK directly.
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación en los datos ingresados.",
    };
  }
  
  // Existing register logic...
  // ... (el resto del código de registro que se comunica con la API externa)
  // No lo incluyo por brevedad, ya que el problema principal está en el login y el contexto.
  return { message: "Función de registro no implementada completamente en este snippet." };
}

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  user?: ActionUser | null;
  fetchedEmotionalEntries?: EmotionalEntry[] | null;
  fetchedNotebookEntries?: NotebookEntry[] | null;
};

// Esta es la acción de servidor que se llamará desde el formulario de login.
export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Datos de inicio de sesión inválidos.",
    };
  }

  // Lógica para llamar a la API externa...
  // ... (similar a la que tenías antes, pero simplificada para el ejemplo)

  // SIMULACIÓN DE LLAMADA EXITOSA A LA API
  // En un caso real, aquí iría tu `fetch` a la API de WordPress
  const { email } = validatedFields.data;
  
  // Simulación: Si el login es exitoso, la API externa devolvería un ID de usuario.
  // Vamos a simular que lo obtenemos.
  const userId = `simulated-id-for-${email}`;
  const userName = email.split('@')[0];

  // Ahora, con el ID de usuario, obtenemos los datos adicionales desde el servidor.
  const activitiesResult = await fetchUserActivities(userId);
  const notebookResult = await fetchNotebookEntries(userId);

  const finalUser: ActionUser = {
    id: userId,
    email: email,
    name: userName,
  };

  return {
    user: finalUser,
    message: t.loginSuccessMessage,
    fetchedEmotionalEntries: activitiesResult.entries,
    fetchedNotebookEntries: notebookResult.entries,
  };
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
  // This function would call the external API for user deletion
  return { success: true, message: "Cuenta eliminada (simulado)." };
}
