import { NextResponse } from 'next/server';
import { encryptDataAES } from '@/lib/encryption';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

// Force Node.js runtime to use Buffer
export const runtime = 'nodejs';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;
const SECRET_KEY = 'SJDFgfds788sdfs8888KLLLL';

interface CheckInData {
  userId: string;
  questionCode: string;
  answer: string;
}

export async function POST(request: Request) {
  let saveUrl = ''; // Define url at the top to be accessible in catch block
  try {
    const body: CheckInData = await request.json();
    const { userId, questionCode, answer } = body;

    if (!userId || !questionCode || !answer) {
      return NextResponse.json({ success: false, message: "Faltan datos en la petición." }, { status: 400 });
    }

    const payloadToEncrypt = {
        codigo: questionCode,
        respuesta: answer,
    };
    const encryptedPayload = encryptDataAES(payloadToEncrypt);
    
    // CONSISTENCY FIX: Based on other 'wscontenido.php' calls (like guardarcuaderno),
    // the userId is sent raw, not base64 encoded. And the token is empty.
    // The previous implementation was incorrectly mimicking 'traerjson.php' auth.
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardaclima&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log("API Route (save-daily-check-in): Attempting to save. URL constructed.");

    const saveResponse = await fetch(saveUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(API_TIMEOUT_MS) 
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn("API Route (save-daily-check-in): API call failed. Status:", saveResponse.status, "Text:", saveResponseText);
      return NextResponse.json(
        { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 100)}`, debugUrl: saveUrl },
        { status: 502 }
      );
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return NextResponse.json({ success: true, message: finalApiResult.message || "Respuesta guardada.", debugUrl: saveUrl });
        } else {
           return NextResponse.json({ success: false, message: finalApiResult.message || "El servidor externo indicó un error.", debugUrl: saveUrl }, { status: 400 });
        }
    } catch (e) {
        console.warn("API Route (save-daily-check-in): API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return NextResponse.json({ success: true, message: "Guardado, pero la respuesta del servidor no fue JSON.", debugUrl: saveUrl });
    }

  } catch (error: any) {
    console.error("API Route (save-daily-check-in): Internal error.", error);
    let errorMessage = "Error interno en el proxy de guardado.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    } else if (error instanceof SyntaxError) {
        errorMessage = "El cuerpo de la petición no es un JSON válido.";
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage, debugUrl: saveUrl || "URL not constructed" },
      { status: 500 }
    );
  }
}
