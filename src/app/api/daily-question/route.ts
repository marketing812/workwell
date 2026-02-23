import { NextResponse, type NextRequest } from 'next/server';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

// Force Node.js runtime to use Buffer
export const runtime = 'nodejs';

// This is the function that will be called by the GET handler.
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
  
  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
  
  let responseText = await response.text();
  
  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Error del servicio externo (HTTP ${response.status}): ${responseText.substring(0, 200)}`);
  }
  
  if (!responseText.trim()) {
    console.warn("API Route (daily-question): External response was empty.");
    return { question: null, debugUrl: externalUrl };
  }

  // --- START: Robust JSON parsing ---
  let jsonToParse = responseText.trim();
  const jsonStartIndex = jsonToParse.indexOf('{');
  const jsonEndIndex = jsonToParse.lastIndexOf('}');
  
  if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
    jsonToParse = jsonToParse.substring(jsonStartIndex, jsonEndIndex + 1);
  } else {
     console.error("API Route (daily-question): Could not find valid JSON object in the response:", responseText);
     throw new Error(`Respuesta del servidor no contenía un JSON válido: ${responseText.substring(0, 200)}...`);
  }
  // --- END: Robust JSON parsing ---

  try {
    const data = JSON.parse(jsonToParse);
    return { question: data, debugUrl: externalUrl };
  } catch (e) {
    console.error("API Route (daily-question): Could not parse JSON from response:", jsonToParse);
    throw new Error(`No se pudo interpretar la respuesta del servidor: ${jsonToParse.substring(0, 200)}...`);
  }
}

// The main GET handler for the /api/daily-question route.
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  let debugUrl = 'URL not constructed'; // Initialize here
  
  if (!userId) {
      return NextResponse.json(
        { 
          questions: [],
          error: 'User ID is required.', 
        },
        { status: 400 }
      );
  }

  try {
    const { question: externalQuestion, debugUrl: fetchedUrl } = await fetchExternalDailyQuestion(userId);
    debugUrl = fetchedUrl;
    
    // The PHP script returns a single question object, not an array inside a 'questions' property.
    if (!externalQuestion || !externalQuestion.codigo || !externalQuestion.pregunta) {
      return NextResponse.json({ questions: [], debugUrl });
    }

    // Map the external data structure to our internal DailyQuestion type
    const question = {
      id: externalQuestion.codigo,
      text: externalQuestion.pregunta,
    };

    // The client expects an array inside a 'questions' property.
    // Wrap it correctly.
    return NextResponse.json({ questions: [question], debugUrl });

  } catch (error) {
    console.error('[API /api/daily-question] Error:', error);
    
    const errorDetails = error instanceof Error 
        ? { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined } 
        : { message: 'An unknown error occurred.' };

    return NextResponse.json(
      { 
        questions: [],
        error: 'Internal Server Error while proxying the daily question request.', 
        details: errorDetails,
        debugUrl: debugUrl
      },
      { status: 500 }
    );
  }
}
