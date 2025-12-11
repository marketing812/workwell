
"use server";

import { z } from "zod";
import { forceEncryptStringAES, decryptDataAES } from "@/lib/encryption";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore";

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface ExternalApiResponse {
  status: "OK" | "NOOK";
  message: string;
  data: any;
}

const EmotionalEntrySchema = z.object({
  id: z.string(),
  situation: z.string(),
  thought: z.string(),
  emotion: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
});
const FetchedEmotionalEntriesSchema = z.array(EmotionalEntrySchema);

const NotebookEntrySchema = z.object({
    id: z.string(),
    timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Timestamp must be a valid ISO date string",
    }),
    title: z.string(),
    content: z.string(),
    pathId: z.string().optional().nullable().transform(val => val ?? undefined),
    ruta: z.string().optional().nullable(),
  });
const FetchedNotebookEntriesSchema = z.array(NotebookEntrySchema);

// --- Fetch User Activities ---
export async function fetchUserActivities(
  userId: string
): Promise<{ success: boolean; entries?: EmotionalEntry[]; error?: string }> {
  console.log(`fetchUserActivities action: Initiated for userId: ${userId}.`);

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.warn("fetchUserActivities action: Invalid or missing userId.");
    return { success: false, error: "ID de usuario inválido." };
  }

  let encryptedUserIdForActivities: string;
  try {
    encryptedUserIdForActivities = forceEncryptStringAES(userId);
  } catch (encError: any) {
    console.error("fetchUserActivities action: Error encrypting userId:", encError);
    return { success: false, error: "Error al preparar el ID de usuario para la solicitud." };
  }

  const activitiesType = "getactividades";
  const activitiesApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${activitiesType}&usuario=${encodeURIComponent(encryptedUserIdForActivities)}`;
  console.log("fetchUserActivities action: Fetching activities from URL:", activitiesApiUrl.substring(0, 150) + "...");

  try {
    const activitiesSignal = AbortSignal.timeout(API_TIMEOUT_MS);
    const activitiesResponse = await fetch(activitiesApiUrl, { signal: activitiesSignal });
    const activitiesResponseText = await activitiesResponse.text();
    console.log("fetchUserActivities action: API call status:", activitiesResponse.status, "Raw Response Text:", activitiesResponseText);

    if (!activitiesResponse.ok) {
      console.warn("fetchUserActivities action: Failed to fetch activities. Status:", activitiesResponse.status, "Response:", activitiesResponseText);
      return { success: false, error: `Error del servidor de actividades (HTTP ${activitiesResponse.status}): ${activitiesResponseText.substring(0, 100)}` };
    }

    const activitiesApiResult: ExternalApiResponse = JSON.parse(activitiesResponseText);
    if (activitiesApiResult.status === "OK" && activitiesApiResult.data !== undefined) { 
      let potentialEntriesArray: any = null;

      if (Array.isArray(activitiesApiResult.data)) {
        potentialEntriesArray = activitiesApiResult.data;
      } else if (typeof activitiesApiResult.data === 'string') {
        const decrypted = decryptDataAES(activitiesApiResult.data);
        if (decrypted && Array.isArray(decrypted)) {
          potentialEntriesArray = decrypted;
        } else {
          console.warn("fetchUserActivities: Decrypted data is not an array or decryption failed. Decrypted data:", decrypted);
        }
      } else {
        console.warn("fetchUserActivities: API data is neither an array nor a string. Data:", activitiesApiResult.data);
      }

      if (potentialEntriesArray && Array.isArray(potentialEntriesArray)) {
        const transformedEntries = potentialEntriesArray.map((rawEntry: any) => {
            if (Array.isArray(rawEntry) && rawEntry.length >= 5) {
                let timestamp = rawEntry[1];
                try {
                    timestamp = new Date(rawEntry[1]).toISOString();
                } catch (dateError) {
                    console.warn(`fetchUserActivities: Could not parse date string "${rawEntry[1]}" for entry ID ${rawEntry[0]}. Using original.`, dateError);
                }
                return {
                  id: String(rawEntry[0]),
                  timestamp: timestamp, 
                  situation: String(rawEntry[3]),
                  thought: String(rawEntry[2]), // Asumiendo que `thought` es el tercer elemento
                  emotion: String(rawEntry[4]),
                };
            }
            return rawEntry;
        }).filter(entry => entry && typeof entry === 'object');

        const validationResult = FetchedEmotionalEntriesSchema.safeParse(transformedEntries);
        if (validationResult.success) {
          return { success: true, entries: validationResult.data };
        } else {
          console.warn("fetchUserActivities: Fetched/decrypted emotional entries validation failed:", validationResult.error.flatten());
          return { success: false, error: `Datos de actividades recibidos no son válidos.` };
        }
      } else {
         console.warn("fetchUserActivities: No valid array of entries obtained after processing API data.");
         return { success: false, error: "No se pudieron procesar los datos de actividades." };
      }
    } else if (activitiesApiResult.status === "OK" && activitiesApiResult.data === undefined) {
        return { success: true, entries: [] };
    }
     else {
      return { success: false, error: `El servidor de actividades indicó un problema: ${activitiesApiResult.message || 'Error desconocido.'}` };
    }
  } catch (error: any) {
    let errorMessage = "Error de red al obtener actividades.";
    if (error.name === 'AbortError') {
      errorMessage = "Tiempo de espera agotado al conectar con el servidor de actividades.";
    }
    console.error("fetchUserActivities action: Error during API call or processing:", error);
    return { success: false, error: errorMessage };
  }
}

// --- Fetch User Notebook Entries ---
export async function fetchNotebookEntries(
  userId: string
): Promise<{ success: boolean; entries?: NotebookEntry[]; error?: string; debugApiUrl?: string; }> {
  console.log(`fetchNotebookEntries action: Initiated for userId: ${userId}.`);

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.warn("fetchNotebookEntries action: Invalid or missing userId.");
    return { success: false, error: "ID de usuario inválido." };
  }

  let encryptedUserId: string;
  try {
    encryptedUserId = forceEncryptStringAES(userId);
  } catch (encError: any) {
    console.error("fetchNotebookEntries action: Error encrypting userId:", encError);
    return { success: false, error: "Error al preparar el ID de usuario para la solicitud." };
  }

  const notebookType = "getcuaderno";
  const notebookApiUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${notebookType}&usuario=${encodeURIComponent(encryptedUserId)}`;
  console.log("fetchNotebookEntries action: Fetching from URL:", notebookApiUrl.substring(0, 150) + "...");

  try {
    const signal = AbortSignal.timeout(API_TIMEOUT_MS);
    const response = await fetch(notebookApiUrl, { signal });
    const responseText = await response.text();
    console.log("fetchNotebookEntries action: API call status:", response.status, "Raw Response Text:", responseText.substring(0, 500) + "...");

    if (!response.ok) {
      console.warn("fetchNotebookEntries action: Failed. Status:", response.status, "Response:", responseText);
      return { success: false, error: `Error del servidor del cuaderno (HTTP ${response.status}): ${responseText.substring(0, 100)}`, debugApiUrl: notebookApiUrl };
    }

    const apiResult: ExternalApiResponse = JSON.parse(responseText);
    if (apiResult.status === "OK" && apiResult.data !== undefined) {
      let potentialEntriesArray: any = null;

      if (Array.isArray(apiResult.data)) {
        potentialEntriesArray = apiResult.data;
      } else if (typeof apiResult.data === 'string') {
        const decrypted = decryptDataAES(apiResult.data);
        if (decrypted && Array.isArray(decrypted)) {
          potentialEntriesArray = decrypted;
        } else {
          console.warn("fetchNotebookEntries: Decrypted data is not an array or decryption failed.");
        }
      }

      if (potentialEntriesArray && Array.isArray(potentialEntriesArray)) {
        const transformedEntries = potentialEntriesArray.map((rawEntry: any) => {
            if (Array.isArray(rawEntry) && rawEntry.length >= 4) {
                let timestamp = rawEntry[1];
                try {
                    timestamp = new Date(rawEntry[1]).toISOString();
                } catch(e) {
                    console.warn(`Could not parse notebook date ${rawEntry[1]}. Using original.`);
                }
                return {
                    id: String(rawEntry[0]),
                    timestamp: timestamp,
                    title: String(rawEntry[2]),
                    content: String(rawEntry[3]),
                    pathId: rawEntry.length > 4 ? String(rawEntry[4]) : null,
                    ruta: rawEntry.length > 5 ? String(rawEntry[5]) : null,
                };
            }
            return rawEntry;
        }).filter(entry => entry && typeof entry === 'object');

        const validationResult = FetchedNotebookEntriesSchema.safeParse(transformedEntries);
        
        if (validationResult.success) {
          return { success: true, entries: validationResult.data, debugApiUrl: notebookApiUrl };
        } else {
          console.warn("fetchNotebookEntries: Zod validation failed for notebook entries:", validationResult.error.flatten());
          return { success: false, error: "Datos de cuaderno recibidos no son válidos.", debugApiUrl: notebookApiUrl };
        }
      } else {
        console.warn("fetchNotebookEntries: No valid array of entries obtained.");
        return { success: false, error: "No se pudieron procesar los datos del cuaderno.", debugApiUrl: notebookApiUrl };
      }
    } else if (apiResult.status === "OK" && apiResult.data === undefined) {
      return { success: true, entries: [], debugApiUrl: notebookApiUrl };
    } else {
      console.warn("fetchNotebookEntries: API reported 'NOOK'. Message:", apiResult.message);
      return { success: false, error: `El servidor del cuaderno indicó un problema: ${apiResult.message || 'Error desconocido.'}`, debugApiUrl: notebookApiUrl };
    }
  } catch (error: any) {
    let errorMessage = "Error de red al obtener el cuaderno.";
    if (error.name === 'AbortError') {
      errorMessage = "Tiempo de espera agotado al conectar con el servidor del cuaderno.";
    }
    console.error("fetchNotebookEntries action: Error during API call/processing:", error);
    return { success: false, error: errorMessage, debugApiUrl: notebookApiUrl };
  }
}
