import { NextResponse, type NextRequest } from 'next/server';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface DailyQuestionFromApi {
  numero: number;
  area: string;
  codigo: string;
  pregunta: string;
}

const clave = "SJDFgfds788sdfs8888KLLLL";
const API_KEY = "4463";

async function fetchExternalDailyQuestion(userId?: string | null): Promise<{ questions: DailyQuestionFromApi[], debugUrl: string }> {
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw).toString('base64');
  let externalUrl = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php?apikey=${API_KEY}&tipo=clima&token=${encodeURIComponent(token)}`;

  if (userId) {
    const base64UserId = Buffer.from(userId).toString('base64');
    externalUrl += `&idusuario=${encodeURIComponent(base64UserId)}`;
  }

  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store',
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.statusText}`);
  }
  
  let jsonToParse = responseText.trim();
  // The API might return characters before the JSON array. Find the start of the array.
  const startIndex = jsonToParse.indexOf('[');
  if (startIndex > 0) { // Only substring if there's leading text.
      jsonToParse = jsonToParse.substring(startIndex);
  }

  const data = JSON.parse(jsonToParse);
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray, debugUrl: externalUrl };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const { questions: externalQuestions, debugUrl } = await fetchExternalDailyQuestion(userId);
    
    const questions = externalQuestions.map(q => ({
      id: q.codigo,
      text: q.pregunta,
    }));

    return NextResponse.json({ questions, debugUrl });
  } catch (error) {
    console.error('Error in /api/daily-question proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error while proxying daily question.', details: errorMessage },
      { status: 500 }
    );
  }
}
