
"use server";

// Este archivo se ha simplificado enormemente.
// Las operaciones de registro y login ahora se manejan en el cliente para
// asegurar una correcta inicialización de Firebase.

import { z } from "zod";
import { forceEncryptStringAES } from "@/lib/encryption";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore";
import { fetchUserActivities, fetchNotebookEntries } from "./user-data";

export interface ActionUser {
  id: string;
  name: string;
  email: string;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

// Las acciones de registro y login se eliminan, ya que se manejan en el cliente.
// Se mantiene deleteUserAccount ya que es una acción de modificación de datos que
// es seguro mantener en el servidor.

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
