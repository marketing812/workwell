'use server';

import { encryptDataAES } from '@/lib/encryption';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface CheckInData {
  userId: string;
  questionCode: string;
  answer: string;
}

export async function saveDailyCheckInAction(payload: CheckInData): Promise<{ success: boolean; message: string, debugUrl: string }> {
  let saveUrl = ''; // Define url at the top to be accessible in catch block
  try {
    const { userId, questionCode, answer } = payload;

    if (!userId || !questionCode || !answer) {
      return { success: false, message: "Faltan datos en la petición.", debugUrl: '' };
    }

    const payloadToEncrypt = {
        codigo: questionCode,
        respuesta: answer,
    };
    const encryptedPayload = encryptDataAES(payloadToEncrypt);
    
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardaclima&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log("Server Action (save-daily-check-in): Attempting to save. URL constructed.");

    const saveResponse = await fetch(saveUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(API_TIMEOUT_MS) 
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("Server Action (save-daily-check-in): API call failed. Status:", saveResponse.status, "Text:", saveResponseText);
      return { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 100)}`, debugUrl: saveUrl };
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return { success: true, message: finalApiResult.message || "Respuesta guardada.", debugUrl: saveUrl };
        } else {
           return { success: false, message: finalApiResult.message || "El servidor externo indicó un error.", debugUrl: saveUrl };
        }
    } catch (e) {
        console.warn("Server Action (save-daily-check-in): API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return { success: true, message: "Guardado, pero la respuesta del servidor no fue JSON.", debugUrl: saveUrl };
    }

  } catch (error: any) {
    console.error("Server Action (save-daily-check-in): Internal error.", error);
    let errorMessage = "Error interno en el proxy de guardado.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    } else if (error instanceof SyntaxError) {
        errorMessage = "El cuerpo de la petición no es un JSON válido.";
    }
    
    return { success: false, message: errorMessage, debugUrl: saveUrl || "URL not constructed" };
  }
}
