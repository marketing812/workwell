
'use server';

import { forceEncryptStringAES } from '@/lib/encryption';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface NotebookEntryPayload {
  userId: string;
  entryData: Record<string, any>;
}

export async function saveNotebookEntryAction(
  payload: NotebookEntryPayload
): Promise<{ success: boolean; message: string; debugUrl?: string }> {
  let saveUrl = '';
  try {
    const { userId, entryData } = payload;

    if (!userId || !entryData) {
      return { success: false, message: "Faltan datos en la petición (userId o entryData)." };
    }

    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarcuaderno&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log(`[Server Action] Sending notebook entry via GET to: ${saveUrl.substring(0,150)}...`);

    const saveResponse = await fetch(saveUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn(`Server Action (save-notebook-entry): External API call failed. Status: ${saveResponse.status}, Text: ${saveResponseText}`);
      return { 
        success: false, 
        message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 150)}`,
        debugUrl: saveUrl
      };
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return { success: true, message: finalApiResult.message || "Entrada guardada en el servidor externo.", debugUrl: saveUrl };
        } else {
           return { success: false, message: finalApiResult.message || "El servidor externo indicó un error.", debugUrl: saveUrl };
        }
    } catch (e) {
        console.warn("Server Action (save-notebook-entry): External API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return { success: true, message: "Guardado en el servidor externo, pero la respuesta no fue JSON.", debugUrl: saveUrl };
    }

  } catch (error: any) {
    console.error("Server Action (save-notebook-entry): Internal error.", error);
    let errorMessage = "Error interno en la acción de guardado del cuaderno.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    }
    return { success: false, message: errorMessage, debugUrl: saveUrl || 'URL no construida' };
  }
}
