import { NextResponse, type NextRequest } from 'next/server';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

// Force Node.js runtime to use Buffer
export const runtime = 'nodejs';

// This is the function that will be called by the GET handler.
async function fetchExternalDailyQuestion(userId: string): Promise<{ question: any, debugUrl: string }> {
  const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/traerjson.php`;
  const SECRET_KEY = 'SJDFgfds788sdfs8888KLLLL';

  // 1. Generate the token
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const rawToken = `${SECRET_KEY}|${fecha}`;
  const token = Buffer.from(rawToken).toString('base64');
  
  // 2. Base64-encode the user ID
  const base64UserId = Buffer.from(userId).toString('base64');
  
  // 3. Construct the final URL
  const externalUrl = `${API_BASE_URL}?archivo=clima&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`;
  
  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Error del servicio externo (HTTP ${response.status}): ${responseText.substring(0, 200)}`);
  }
  
  if (!responseText.trim()) {
    console.warn("API Route (daily-question): External response was empty.");
    return { question: null, debugUrl: externalUrl };
  }

  try {
    const data = JSON.parse(responseText.trim());
    return { question: data, debugUrl: externalUrl };
  } catch (e) {
    console.error("API Route (daily-question): Could not parse JSON from response:", responseText);
    throw new Error(`No se pudo interpretar la respuesta del servidor: ${responseText.substring(0, 200)}...`);
  }
}

// The main GET handler for the /api/daily-question route.
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  let debugUrl = ''; 
  
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
    
    if (!externalQuestion || !externalQuestion.codigo || !externalQuestion.pregunta) {
      return NextResponse.json({ questions: [], debugUrl });
    }

    // Map the external data structure to our internal DailyQuestion type
    const question = {
      id: externalQuestion.codigo,
      text: externalQuestion.pregunta,
    };

    // The PHP returns a single object, but the client expects an array. Wrap it.
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
        debugUrl: debugUrl || 'URL not constructed'
      },
      { status: 500 }
    );
  }
}
