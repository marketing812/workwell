'use server';

import { encryptDataAES } from '@/lib/encryption';
import type { InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, { score: number; weight: number }>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

export type SaveResult = {
  success: boolean;
  message: string;
  debugUrl?: string;
};

// This function is now a Server Action.
export async function saveAssessment(payloadToSave: AssessmentSavePayload): Promise<SaveResult> {
  let saveUrl = ''; // For debugging in case of error
  try {
    const encryptedPayload = encryptDataAES(payloadToSave);
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;

    console.log("Server Action (save-assessment): Attempting to save. URL:", saveUrl.substring(0, 150) + "...");

    const saveResponse = await fetch(saveUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("Server Action (save-assessment): API call failed. Status:", saveResponse.status, "Text:", saveResponseText);
      return { 
        success: false, 
        message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 100)}`, 
        debugUrl: saveUrl 
      };
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
         return { success: finalApiResult.status === 'OK', message: finalApiResult.message, debugUrl: saveUrl };
    } catch (e) {
        console.warn("Server Action (save-assessment): API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return { success: true, message: "Guardado, pero la respuesta del servidor no fue JSON.", debugUrl: saveUrl };
    }

  } catch (error: any) {
    console.error("Server Action (save-assessment): Internal error.", error);
    let errorMessage = "Error interno en el servidor al guardar la evaluación.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    }
    return { 
      success: false, 
      message: errorMessage, 
      debugUrl: saveUrl || "URL no construida" 
    };
  }
}
