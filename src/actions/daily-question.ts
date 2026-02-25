'use server';

import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';
import type { DailyQuestion, DailyQuestionApiResponse } from '@/types/daily-question';

// This function contains the core logic from the old API route
async function fetchExternalDailyQuestion(userId: string): Promise<{ question: any, debugUrl: string }> {
  // CORRECTED: This now points to traejson.php as requested by user.
  const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/traejson.php`;
  const SECRET_KEY = 'SJDFgfds788sdfs8888KLLLL';

  // 1. Generate the token as required by the PHP script
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const rawToken = `${SECRET_KEY}|${fecha}`;
  const token = Buffer.from(rawToken).toString('base64');
  
  // 2. Encode user ID in Base64 as required by the PHP script
  const base64UserId = Buffer.from(userId).toString('base64');
  
  // 3. Construct the final URL with ALL required parameters
  const externalUrl = `${API_BASE_URL}?archivo=clima&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`;
  
  console.log("Server Action (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
  
  let responseText = await response.text();
  
  if (!response.ok) {
    console.error(`Server Action (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Error del servicio externo (HTTP ${response.status}): ${responseText.substring(0, 200)}`);
  }
  
  if (!responseText.trim()) {
    console.warn("Server Action (daily-question): External response was empty.");
    return { question: null, debugUrl: externalUrl };
  }

  // --- START: Robust JSON parsing ---
  let jsonToParse = responseText.trim();
  const jsonStartIndex = jsonToParse.indexOf('{');
  const jsonEndIndex = jsonToParse.lastIndexOf('}');
  
  if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
    jsonToParse = jsonToParse.substring(jsonStartIndex, jsonEndIndex + 1);
  } else {
     console.error("Server Action (daily-question): Could not find valid JSON object in the response:", responseText);
     throw new Error(`Respuesta del servidor no contenía un JSON válido: ${responseText.substring(0, 200)}...`);
  }
  // --- END: Robust JSON parsing ---

  try {
    const data = JSON.parse(jsonToParse);
    return { question: data, debugUrl: externalUrl };
  } catch (e) {
    console.error("Server Action (daily-question): Could not parse JSON from response:", jsonToParse);
    throw new Error(`No se pudo interpretar la respuesta del servidor: ${jsonToParse.substring(0, 200)}...`);
  }
}

// This is the exported server action
export async function getDailyQuestionAction(userId: string): Promise<DailyQuestionApiResponse | null> {
  let debugUrl = 'URL not constructed';
  
  if (!userId) {
    return { 
      questions: [],
      error: 'User ID is required.', 
    };
  }

  try {
    const { question: externalQuestion, debugUrl: fetchedUrl } = await fetchExternalDailyQuestion(userId);
    debugUrl = fetchedUrl;
    
    if (!externalQuestion || !externalQuestion.codigo || !externalQuestion.pregunta) {
      return { questions: [], debugUrl };
    }

    const question: DailyQuestion = {
      id: externalQuestion.codigo,
      text: externalQuestion.pregunta,
    };

    return { questions: [question], debugUrl };

  } catch (error) {
    console.error('[Server Action getDailyQuestionAction] Error:', error);
    
    const errorDetails = error instanceof Error 
        ? { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined } 
        : { message: 'An unknown error occurred.' };

    return { 
      questions: [],
      error: 'Internal Server Error while proxying the daily question request.', 
      details: errorDetails,
      debugUrl: debugUrl
    };
  }
}