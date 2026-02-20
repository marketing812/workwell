
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

async function fetchExternalDailyQuestion(): Promise<{ questions: DailyQuestionFromApi[], debugUrl: string }> {
  const clave = "SJDFgfds788sdfs8888KLLLL";
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const raw = `${clave}|${fecha}`;
  const token = btoa(raw);

  const externalUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getclima&token=${encodeURIComponent(token)}`;
  
  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });
  
  const responseText = await response.text();

  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.status}. Body: ${responseText.substring(0, 200)}`);
  }
  
  if (!responseText.trim()) {
    console.warn("API Route (daily-question): External response was empty.");
    return { questions: [], debugUrl: externalUrl };
  }

  let jsonToParse = responseText.trim();
  if (!jsonToParse.startsWith('[')) {
      const startIndex = jsonToParse.indexOf('[');
      const endIndex = jsonToParse.lastIndexOf(']');
      if (startIndex !== -1 && endIndex > startIndex) {
        jsonToParse = jsonToParse.substring(startIndex, endIndex + 1);
      } else {
        throw new Error(`Could not parse JSON from response: ${responseText.substring(0, 200)}...`);
      }
  }

  const data = JSON.parse(jsonToParse);
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray, debugUrl: externalUrl };
}

export async function GET(request: NextRequest) {
  try {
    const { questions: externalQuestions, debugUrl } = await fetchExternalDailyQuestion();
    
    const questions = externalQuestions.map(q => ({
      id: q.codigo,
      text: q.pregunta,
    }));

    return NextResponse.json({ questions, debugUrl });
  } catch (error) {
    console.error('[API /api/daily-question] Error:', error);
    
    const errorDetails = error instanceof Error 
        ? { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined } 
        : { message: 'An unknown error occurred.' };

    return NextResponse.json(
      { 
        error: 'Internal Server Error while proxying the daily question request.', 
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
