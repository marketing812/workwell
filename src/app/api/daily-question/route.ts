import { NextResponse, type NextRequest } from 'next/server';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

interface DailyQuestionFromApi {
  numero: number;
  area: string;
  codigo: string;
  pregunta: string;
}

// Reverting to the original, simpler URL as suggested.
async function fetchExternalDailyQuestion(): Promise<{ questions: DailyQuestionFromApi[], debugUrl: string }> {
  // Original URL structure for fetching daily questions
  const externalUrl = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/themes/workwell/traejson.php?archivo=clima`;
  
  console.log("API Route (daily-question): Fetching from external URL:", externalUrl);

  const response = await fetch(externalUrl, {
    cache: 'no-store', // Ensure fresh data is fetched every time
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(`API Route (daily-question): Failed to fetch. Status: ${response.status}. Body: ${responseText}`);
    throw new Error(`Failed to fetch external daily question. Status: ${response.statusText}`);
  }
  
  // More robust JSON parsing
  let jsonToParse = responseText.trim();
  if (!jsonToParse.startsWith('[')) {
      const startIndex = jsonToParse.indexOf('[');
      const endIndex = jsonToParse.lastIndexOf(']');
      if (startIndex !== -1 && endIndex > startIndex) {
        jsonToParse = jsonToParse.substring(startIndex, endIndex + 1);
      }
  }

  const data = JSON.parse(jsonToParse);
  // The API returns an array of questions directly
  const questionsArray = Array.isArray(data) ? data : [data];
  
  return { questions: questionsArray, debugUrl: externalUrl };
}

export async function GET(request: NextRequest) {
  try {
    // No longer need userId for this fetch
    const { questions: externalQuestions, debugUrl } = await fetchExternalDailyQuestion();
    
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
