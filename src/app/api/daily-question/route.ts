
import { NextResponse, type NextRequest } from 'next/server';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface DailyQuestionFromApi {
  numero: number;
  area: string;
  codigo: string;
  pregunta: string;
}

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";

// This is the function that will be called by the GET handler.
// It contains the logic to fetch the data from the external API.
async function fetchExternalDailyQuestion(): Promise<{ questions: DailyQuestionFromApi[], debugUrl: string }> {
  // Let's try the simpler URL structure first, as seen in other parts of the app.
  // The token logic seemed to cause issues before.
  const externalUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getclima`;
  
  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
  
  const responseText = await response.text();

  // If the response is not OK, we throw an error with details to be caught by the GET handler.
  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.status}. Body: ${responseText.substring(0, 200)}`);
  }
  
  if (!responseText.trim()) {
    console.warn("API Route (daily-question): External response was empty.");
    return { questions: [], debugUrl: externalUrl };
  }

  // Robust JSON parsing
  let jsonToParse = responseText.trim();
  if (!jsonToParse.startsWith('[')) {
      const startIndex = jsonToParse.indexOf('[');
      const endIndex = jsonToParse.lastIndexOf(']');
      if (startIndex !== -1 && endIndex > startIndex) {
        jsonToParse = jsonToParse.substring(startIndex, endIndex + 1);
      } else {
        // If we can't find a JSON array, it's an invalid format.
        throw new Error(`Could not parse JSON from response: ${responseText.substring(0, 200)}...`);
      }
  }

  const data = JSON.parse(jsonToParse);
  // Ensure the data is an array
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray, debugUrl: externalUrl };
}

// The main GET handler for the /api/daily-question route.
export async function GET(request: NextRequest) {
  let debugUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getclima`; // Define here for catch block
  try {
    const { questions: externalQuestions, debugUrl: fetchedUrl } = await fetchExternalDailyQuestion();
    debugUrl = fetchedUrl; // Update with the actual URL used
    
    // Map the external data structure to our internal DailyQuestion type
    const questions = externalQuestions.map(q => ({
      id: q.codigo,
      text: q.pregunta,
    }));

    return NextResponse.json({ questions, debugUrl });
  } catch (error) {
    console.error('[API /api/daily-question] Error:', error);
    
    // Provide a detailed error response for better debugging on the client
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
