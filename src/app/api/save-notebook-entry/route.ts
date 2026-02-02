
import { NextResponse } from 'next/server';
import { forceEncryptStringAES } from '@/lib/encryption';

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

interface NotebookEntryPayload {
  userId: string;
  entryData: Record<string, any>;
}

// This is the API route that acts as a proxy to the external service
export async function POST(request: Request) {
  let saveUrl = ''; // Define url at the top to be accessible in catch block
  try {
    const body: NotebookEntryPayload = await request.json();
    const { userId, entryData } = body;

    if (!userId || !entryData) {
      return NextResponse.json({ success: false, message: "Faltan datos en la petición (userId o entryData)." }, { status: 400 });
    }

    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    
    // CONSTRUCT A GET URL INSTEAD OF A POST BODY
    // Use the raw userId without base64 encoding as per user's debugging insight.
    saveUrl = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarcuaderno&idusuario=${encodeURIComponent(userId)}&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log(`[API Route] Sending notebook entry via GET to: ${saveUrl.substring(0,150)}...`);

    const saveResponse = await fetch(saveUrl, {
      method: 'GET', // EXPLICITLY USE GET
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn(`API Route (save-notebook-entry): External API call failed. Status: ${saveResponse.status}, Text: ${saveResponseText}`);
      return NextResponse.json(
        { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 150)}`, debugUrl: saveUrl },
        { status: 502 }
      );
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return NextResponse.json({ success: true, message: finalApiResult.message || "Entrada guardada en el servidor externo.", debugUrl: saveUrl });
        } else {
           return NextResponse.json({ success: false, message: finalApiResult.message || "El servidor externo indicó un error.", debugUrl: saveUrl }, { status: 400 });
        }
    } catch (e) {
        console.warn("API Route (save-notebook-entry): External API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return NextResponse.json({ success: true, message: "Guardado en el servidor externo, pero la respuesta no fue JSON.", debugUrl: saveUrl });
    }

  } catch (error: any) {
    console.error("API Route (save-notebook-entry): Internal error.", error);
    let errorMessage = "Error interno en el proxy de guardado del cuaderno.";
    if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado al conectar con el servidor externo.";
    } else if (error instanceof SyntaxError) {
        errorMessage = "El cuerpo de la petición no es un JSON válido.";
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage, debugUrl: saveUrl || "Error creating URL" },
      { status: 500 }
    );
  }
}
