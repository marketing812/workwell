
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
  try {
    const body: NotebookEntryPayload = await request.json();
    const { userId, entryData } = body;

    if (!userId || !entryData) {
      return NextResponse.json({ success: false, message: "Faltan datos en la petición (userId o entryData)." }, { status: 400 });
    }

    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    
    // The user ID should be sent unencrypted in the body for POST requests, same as the logic for `getcuaderno`
    const requestBody = new URLSearchParams();
    requestBody.append('apikey', API_KEY);
    requestBody.append('tipo', 'guardarcuaderno');
    requestBody.append('idusuario', userId); 
    requestBody.append('datos', encryptedPayload);

    console.log("[SERVER LOG] Calling external notebook service...");
    console.log("URL:", API_BASE_URL);
    console.log("METHOD: POST");
    console.log("BODY:", requestBody.toString().substring(0, 200) + "..."); // Log first 200 chars of body

    const saveResponse = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    
    const saveResponseText = await saveResponse.text();

    if (!saveResponse.ok) {
      console.warn(`API Route (save-notebook-entry): External API call failed. Status: ${saveResponse.status}, Text: ${saveResponseText}`);
      return NextResponse.json(
        { success: false, message: `Error en el servidor externo (HTTP ${saveResponse.status}): ${saveResponseText.substring(0, 150)}` },
        { status: 502 }
      );
    }
    
    try {
        const finalApiResult = JSON.parse(saveResponseText);
        if (finalApiResult.status === 'OK') {
           return NextResponse.json({ success: true, message: finalApiResult.message || "Entrada guardada en el servidor externo." });
        } else {
           return NextResponse.json({ success: false, message: finalApiResult.message || "El servidor externo indicó un error." }, { status: 400 });
        }
    } catch (e) {
        console.warn("API Route (save-notebook-entry): External API response was not valid JSON, but status was OK. Raw text:", saveResponseText);
        return NextResponse.json({ success: true, message: "Guardado en el servidor externo, pero la respuesta no fue JSON." });
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
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
