import cors from "cors";
import CryptoJS from "crypto-js";
import express, {Request, Response} from "express";
import {getApps, initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

const EXTERNAL_SERVICES_BASE_URL =
  process.env.EXTERNAL_SERVICES_BASE_URL || "https://workwellfut.com";
const DAILY_QUESTION_KEY =
  process.env.DAILY_QUESTION_KEY || "SJDFgfds788sdfs8888KLLLL";
const NOTEBOOK_API_BASE =
  `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const NOTEBOOK_API_KEY = process.env.NOTEBOOK_API_KEY || "4463";
const NOTEBOOK_TIMEOUT_MS = 15000;
const SECRET_KEY =
  process.env.ENCRYPTION_SECRET || "0123456789abcdef0123456789abcdef";
const MAX_USERS_PER_REQUEST = 1000;

function getAdminApp() {
  return getApps().length ? getApps()[0] : initializeApp();
}

function getAdminApiKeyFromRequest(request: Request): string {
  const headerKey = request.header("x-admin-api-key");
  if (headerKey) return headerKey;

  const authHeader = request.header("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function validateUids(
  value: unknown
): { ok: true; uids: string[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return {ok: false, error: "El campo 'uids' debe ser un array de strings."};
  }

  if (value.length === 0) {
    return {ok: false, error: "El array 'uids' no puede estar vacio."};
  }

  if (value.length > MAX_USERS_PER_REQUEST) {
    return {
      ok: false,
      error: `Solo se permiten hasta ${MAX_USERS_PER_REQUEST} usuarios por peticion.`,
    };
  }

  const invalid = value.find(
    (uid) => typeof uid !== "string" || uid.trim().length === 0
  );
  if (invalid !== undefined) {
    return {
      ok: false,
      error: "Todos los elementos de 'uids' deben ser strings no vacios.",
    };
  }

  const cleaned = value.map((uid) => String(uid).trim());
  const deduped = [...new Set(cleaned)];

  return {ok: true, uids: deduped};
}

function isDepartmentValidResponse(raw: string): boolean {
  const text = String(raw || "").trim();
  if (!text) return false;

  const normalized = text.toLowerCase();
  if (normalized === "ok") return true;

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      const status = String(parsed.status ?? "").toLowerCase();
      const result = String(parsed.result ?? "").toLowerCase();
      return status === "ok" || result === "ok" || parsed.ok === true;
    }
  } catch {
    // Ignore non-JSON responses; plain text is handled above.
  }

  return false;
}

function forceEncryptStringAES(value: string): string {
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
  const encrypted = CryptoJS.AES.encrypt(
    value,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}
  );
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(),
  });
}

function encryptDataAES(obj: unknown): string {
  const json = JSON.stringify(obj);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
  const encrypted = CryptoJS.AES.encrypt(
    json,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}
  );
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(),
  });
}

function decryptDataAES(encryptedData: string): any | null {
  try {
    const parsed = JSON.parse(encryptedData);
    if (parsed?.iv && parsed?.data) {
      const bytes = CryptoJS.AES.decrypt(
        parsed.data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        {
          iv: CryptoJS.enc.Base64.parse(parsed.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedText ? JSON.parse(decryptedText) : null;
    }
  } catch {
    // Continue with raw decrypt fallback.
  }

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText ? JSON.parse(decryptedText) : null;
  } catch {
    return null;
  }
}

function parseJsonFromNoisyText(text: string): any | null {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;

  const varDumpMatch = trimmed.match(/^string\(\d+\)\s*"([\s\S]*)"\s*$/);
  const normalizedText = varDumpMatch?.[1] ?
    varDumpMatch[1].replace(/\\"/g, "\"").replace(/\\\\/g, "\\") :
    trimmed;

  if (normalizedText.startsWith("{") || normalizedText.startsWith("[")) {
    return JSON.parse(normalizedText);
  }

  const objectStart = normalizedText.indexOf("{");
  const objectEnd = normalizedText.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd > objectStart) {
    return JSON.parse(normalizedText.slice(objectStart, objectEnd + 1));
  }

  const arrayStart = normalizedText.indexOf("[");
  const arrayEnd = normalizedText.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    return JSON.parse(normalizedText.slice(arrayStart, arrayEnd + 1));
  }

  return null;
}

function normalizeDateInput(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return new Date().toISOString();
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function extractLegacyEntries(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.registros)) return payload.registros;
  if (Array.isArray(payload.entries)) return payload.entries;
  return [];
}

function normalizeLegacyAutoregistro(raw: any, fallbackIndex: number) {
  if (Array.isArray(raw)) {
    const timestamp = normalizeDateInput(raw[1]);
    const sourceId = String(raw[2] ?? "").trim();
    return {
      id: sourceId ?
        `${sourceId}-${new Date(timestamp).getTime()}-${fallbackIndex}` :
        `legacy-autoregistro-${new Date(timestamp).getTime()}-${fallbackIndex}`,
      thought: String(raw[0] ?? "").trim(),
      situation: String(raw[3] ?? "").trim(),
      emotion: String(raw[4] ?? "").trim(),
      timestamp,
    };
  }

  return {
    id: String(
      raw?.id ??
      raw?.idtarea ??
      raw?.entryId ??
      raw?.codigo ??
      `legacy-autoregistro-${Date.now()}-${fallbackIndex}`
    ),
    situation: String(raw?.situation ?? raw?.situacion ?? raw?.context ?? "").trim(),
    thought: String(raw?.thought ?? raw?.pensamiento ?? raw?.thoughts ?? "").trim(),
    emotion: String(raw?.emotion ?? raw?.emocion ?? raw?.mood ?? "").trim(),
    timestamp: normalizeDateInput(raw?.timestamp ?? raw?.fecha ?? raw?.createdAt ?? raw?.fechahora),
  };
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY / GOOGLE_API_KEY");
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      contents: [{parts: [{text: prompt}]}],
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini API error (${response.status}): ${text.slice(0, 250)}`);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON from Gemini API.");
  }

  return (
    parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    "No he podido generar una respuesta util. Prueba a reformular."
  );
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ok: true});
});

app.get("/daily-question", async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || "");
    if (!userId) {
      return res.status(400).json({questions: [], error: "User ID is required."});
    }

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const token = Buffer.from(`${DAILY_QUESTION_KEY}|${fecha}`).toString("base64");
    const base64UserId = Buffer.from(userId).toString("base64");
    const externalUrl =
      `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/traejson.php` +
      `?archivo=clima&idusuario=${encodeURIComponent(base64UserId)}` +
      `&token=${encodeURIComponent(token)}`;

    const response = await fetch(externalUrl, {cache: "no-store"});
    const responseText = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        questions: [],
        error: `External API error (${response.status})`,
        details: responseText.slice(0, 300),
      });
    }

    const trimmed = responseText.trim();
    let parsed: any;
    try {
      if (trimmed.startsWith("[")) {
        const arr = JSON.parse(trimmed);
        parsed = Array.isArray(arr) ? arr[0] : null;
      } else {
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        const payload = start >= 0 && end > start ?
          trimmed.slice(start, end + 1) :
          trimmed;
        parsed = JSON.parse(payload);
      }
    } catch {
      return res.status(502).json({
        questions: [],
        error: "Invalid JSON from external API",
        details: trimmed.slice(0, 300),
      });
    }

    if (!parsed || !parsed.codigo || !parsed.pregunta) {
      return res.json({questions: [], debugUrl: externalUrl});
    }
    return res.json({
      questions: [{id: String(parsed.codigo), text: String(parsed.pregunta)}],
      debugUrl: externalUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      questions: [],
      error: error?.message || "Internal Server Error",
    });
  }
});

app.post("/save-daily-check-in", async (req: Request, res: Response) => {
  try {
    const {userId, questionCode, answer} = req.body || {};
    if (!userId || !questionCode || !answer) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos en la peticion.",
      });
    }
    const encryptedPayload = encryptDataAES({codigo: questionCode, respuesta: answer});
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardaclima` +
      `&idusuario=${encodeURIComponent(userId)}&token=` +
      `&datos=${encodeURIComponent(encryptedPayload)}`;

    const saveResponse = await fetch(saveUrl, {
      method: "GET",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({
        success: false,
        message: `Error externo (${saveResponse.status})`,
        debugUrl: saveUrl,
      });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") {
        return res.json({
          success: true,
          message: parsed.message || "Respuesta guardada.",
          debugUrl: saveUrl,
        });
      }
      return res.status(400).json({
        success: false,
        message: parsed.message || "Error del servicio externo.",
        debugUrl: saveUrl,
      });
    } catch {
      return res.json({
        success: true,
        message: "Guardado (respuesta no JSON).",
        debugUrl: saveUrl,
      });
    }
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al conectar con el servidor externo." :
      (error?.message || "Error interno");
    return res.status(500).json({success: false, message});
  }
});

app.post("/chatbot", async (req: Request, res: Response) => {
  try {
    const {message, context, userName} = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({success: false, error: "Message is required"});
    }

    const prompt = [
      "Eres un asistente emocional para una app de bienestar.",
      "Responde siempre en espanol, claro, breve y empatico.",
      userName ? `Usuario: ${userName}` : "",
      context ? `Contexto:\n${context}` : "",
      `Pregunta:\n${message}`,
    ].filter(Boolean).join("\n\n");

    const responseText = await callGemini(prompt);
    return res.json({success: true, data: {response: responseText}});
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.post("/knowledge-assistant", async (req: Request, res: Response) => {
  try {
    const {question, context} = req.body || {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    const prompt = [
      "Responde en espanol y de forma precisa.",
      "Si no tienes suficiente contexto, dilo explicitamente.",
      context ? `Contexto:\n${String(context)}` : "",
      `Pregunta:\n${question.trim()}`,
    ].filter(Boolean).join("\n\n");

    const responseText = await callGemini(prompt);
    return res.json({success: true, data: {response: responseText}});
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.post("/department/validate", async (req: Request, res: Response) => {
  try {
    const departmentId = String(req.body?.departmentId || "").trim();
    if (!departmentId) {
      return res.status(400).json({
        ok: false,
        valid: false,
        error: "El codigo de departamento es obligatorio.",
      });
    }

    const url =
      `${NOTEBOOK_API_BASE}?apikey=${encodeURIComponent(NOTEBOOK_API_KEY)}` +
      `&tipo=getdepartamento` +
      `&token=${encodeURIComponent(departmentId)}` +
      `&departamento=${encodeURIComponent(departmentId)}` +
      `&iddepartamento=${encodeURIComponent(departmentId)}`;

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const responseText = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        valid: false,
        error: `Error del servicio externo (HTTP ${response.status}).`,
      });
    }

    const valid = isDepartmentValidResponse(responseText);
    return res.json({
      ok: true,
      valid,
      message: valid ?
        "Departamento validado correctamente." :
        "Codigo de departamento no valido.",
    });
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al validar el departamento." :
      (error?.message || "No se pudo validar el departamento.");
    return res.status(500).json({ok: false, valid: false, error: message});
  }
});

app.post("/submit-assessment", async (req: Request, res: Response) => {
  try {
    const {answers} = req.body || {};
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        error: "Answers are required",
      });
    }

    const numericScores = Object.entries(answers)
      .map(([, value]: [string, any]) => Number(value?.score))
      .filter((score) => Number.isFinite(score) && score >= 1 && score <= 5);

    if (numericScores.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid scores found.",
      });
    }

    const avg = Number((
      numericScores.reduce((acc, v) => acc + v, 0) / numericScores.length
    ).toFixed(2));

    const output = {
      emotionalProfile: {"Estado Emocional General": avg},
      priorityAreas: [
        "Regulacion Emocional y Estres",
        "Habitos de autocuidado",
        "Apoyo social",
      ],
      feedback:
        "Comprueba los datos de la evaluación que has introducido en el sistema.",
    };

    return res.json({success: true, data: output});
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.post("/save-assessment", async (req: Request, res: Response) => {
  try {
    const payloadToSave = req.body;
    if (!payloadToSave) {
      return res.status(400).json({success: false, message: "Missing payload"});
    }
    const encryptedPayload = encryptDataAES(payloadToSave);
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardarevaluacion` +
      `&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, {
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({
        success: false,
        message: `Error externo (${saveResponse.status})`,
        debugUrl: saveUrl,
      });
    }
    try {
      const parsed = JSON.parse(text);
      return res.json({
        success: parsed.status === "OK",
        message: parsed.message,
        debugUrl: saveUrl,
      });
    } catch {
      return res.json({
        success: true,
        message: "Guardado (respuesta no JSON).",
        debugUrl: saveUrl,
      });
    }
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al conectar con el servidor externo." :
      (error?.message || "Error interno");
    return res.status(500).json({success: false, message});
  }
});

app.post("/save-notebook-entry", async (req: Request, res: Response) => {
  try {
    const {userId, entryData} = req.body || {};
    if (!userId || !entryData) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos en la peticion.",
      });
    }
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardarcuaderno` +
      `&idusuario=${encodeURIComponent(userId)}&token=` +
      `&datos=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, {
      method: "GET",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({
        success: false,
        message: `Error externo (${saveResponse.status})`,
        debugUrl: saveUrl,
      });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") {
        return res.json({
          success: true,
          message: parsed.message || "Entrada guardada.",
          debugUrl: saveUrl,
        });
      }
      return res.status(400).json({
        success: false,
        message: parsed.message || "Error del servicio externo.",
        debugUrl: saveUrl,
      });
    } catch {
      return res.json({
        success: true,
        message: "Guardado (respuesta no JSON).",
        debugUrl: saveUrl,
      });
    }
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al conectar con el servidor externo." :
      (error?.message || "Error interno");
    return res.status(500).json({success: false, message});
  }
});

app.post("/save-mood-check-in", async (req: Request, res: Response) => {
  try {
    const {userId, mood, score} = req.body || {};
    if (!userId || !mood || score === undefined) {
      return res.status(400).json({
        success: false,
        error: "Faltan datos en la peticion.",
      });
    }
    const encryptedPayload = forceEncryptStringAES(JSON.stringify({
      mood,
      score,
      timestamp: new Date().toISOString(),
    }));
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardaranimo` +
      `&idusuario=${encodeURIComponent(userId)}&token=` +
      `&datos=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, {
      method: "GET",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${saveResponse.status})`,
        debugUrl: saveUrl,
      });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") {
        return res.json({success: true, debugUrl: saveUrl});
      }
      return res.status(400).json({
        success: false,
        error: parsed.message || "Error del servicio externo.",
        debugUrl: saveUrl,
      });
    } catch {
      return res.json({success: true, debugUrl: saveUrl});
    }
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al conectar con el servidor externo." :
      (error?.message || "Error interno");
    return res.status(500).json({success: false, error: message});
  }
});

app.get("/trigger-reminder", async (_req: Request, res: Response) => {
  try {
    const url = `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getavisoemail`;
    const response = await fetch(url, {cache: "no-store"});
    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status})`,
        details: text.slice(0, 300),
      });
    }
    const result = await response.json();
    return res.json({
      success: true,
      message: result?.message || "OK",
      data: result?.data || null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.get("/mood-check-ins", async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({success: false, error: "User ID is required."});
    }

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const token = Buffer.from(`${DAILY_QUESTION_KEY}|${fecha}`).toString("base64");
    const base64UserId = Buffer.from(userId).toString("base64");
    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getanimo` +
      `&idusuario=${encodeURIComponent(base64UserId)}` +
      `&token=${encodeURIComponent(token)}`;

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    let parsed: any;
    try {
      parsed = parseJsonFromNoisyText(text);
    } catch {
      return res.status(502).json({
        success: false,
        error: "Respuesta invalida del servicio externo.",
        debugUrl: url,
      });
    }

    if (!parsed || typeof parsed !== "object") {
      return res.json({success: true, entries: [], debugUrl: url});
    }

    const rawData = Array.isArray(parsed.data) ? parsed.data : [];
    const entries = rawData.map((item: any, index: number) => ({
      id: `mood-${Date.now()}-${index}`,
      mood: String(item?.mood ?? ""),
      score: Number(item?.score ?? 0),
      timestamp: normalizeDateInput(item?.timestamp),
    })).filter((entry: any) => entry.mood && Number.isFinite(entry.score));

    return res.json({success: true, entries, debugUrl: url});
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al cargar animo." :
      (error?.message || "Internal Server Error");
    return res.status(500).json({success: false, error: message});
  }
});

app.get("/notebook", async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({success: false, error: "User ID is required."});
    }

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const token = Buffer.from(`${DAILY_QUESTION_KEY}|${fecha}`).toString("base64");
    const base64UserId = Buffer.from(userId).toString("base64");
    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getcuaderno` +
      `&usuario=${encodeURIComponent(base64UserId)}` +
      `&token=${encodeURIComponent(token)}`;

    const response = await fetch(url, {cache: "no-store"});
    const responseText = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    let jsonText = responseText.trim();
    if (jsonText.startsWith("{") && jsonText.endsWith("}")) {
      jsonText = `[${jsonText.replace(/}\s*{/g, "},{")}]`;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.status) {
        parsed = parsed[0];
      }
    } catch {
      parsed = parseJsonFromNoisyText(responseText);
    }

    if (!parsed || typeof parsed !== "object") {
      return res.json({success: true, entries: [], debugUrl: url});
    }

    let notebookRaw = Array.isArray(parsed.data) ? parsed.data : null;
    if (!notebookRaw && typeof parsed.data === "string" && parsed.data.trim()) {
      const decrypted = decryptDataAES(parsed.data);
      if (Array.isArray(decrypted)) notebookRaw = decrypted;
    }
    if (!notebookRaw && Array.isArray(parsed)) {
      notebookRaw = parsed;
    }
    if (!notebookRaw) notebookRaw = [];

    const entries = notebookRaw.map((item: any, index: number) => {
      if (Array.isArray(item) && item.length >= 5) {
        const timestamp = normalizeDateInput(item[1]);
        const pathId = item[5] ? String(item[5]) : undefined;
        return {
          id: String(item[0] || `legacy-notebook-${Date.now()}-${index}`),
          timestamp,
          title: String(item[3] || ""),
          content: String(item[4] || ""),
          pathId,
          ruta: pathId ?
            (pathId.replace(/-/g, " ").charAt(0).toUpperCase() + pathId.slice(1).replace(/-/g, " ")) :
            undefined,
        };
      }

      const pathId = item?.pathId ? String(item.pathId) :
        (item?.ruta ? String(item.ruta) : undefined);
      return {
        id: String(item?.id || `legacy-notebook-${Date.now()}-${index}`),
        timestamp: normalizeDateInput(item?.timestamp ?? item?.fecha ?? item?.createdAt),
        title: String(item?.title || ""),
        content: String(item?.content || ""),
        pathId,
        ruta: item?.ruta ? String(item.ruta) : undefined,
      };
    }).filter((entry: any) => entry.id && (entry.title || entry.content));

    return res.json({success: true, entries, debugUrl: url});
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.get("/assessments", async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({success: false, error: "User ID is required."});
    }

    const encryptedUserId = forceEncryptStringAES(userId);
    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getEvaluacion` +
      `&usuario=${encodeURIComponent(encryptedUserId)}`;

    const response = await fetch(url, {signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS)});
    const responseText = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    const parsed = parseJsonFromNoisyText(responseText);
    if (!parsed || typeof parsed !== "object") {
      return res.json({success: true, entries: [], debugUrl: url});
    }

    let records: any[] = [];
    if (Array.isArray(parsed.data)) {
      records = parsed.data;
    } else if (typeof parsed.data === "string" && parsed.data.trim()) {
      const decrypted = decryptDataAES(parsed.data);
      if (Array.isArray(decrypted)) records = decrypted;
    }

    return res.json({success: true, entries: records, debugUrl: url});
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Tiempo de espera agotado al cargar evaluaciones." :
      (error?.message || "Internal Server Error");
    return res.status(500).json({success: false, error: message});
  }
});

app.post("/save-autoregistro", async (req: Request, res: Response) => {
  try {
    const userId = String(req.body?.userId || "").trim();
    const entry = req.body?.entry || {};
    if (!userId || !entry?.situation || !entry?.thought || !entry?.emotion) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos del autorregistro.",
      });
    }

    const payload = {
      entry: {
        id: String(Date.now()),
        emotion: String(entry.emotion),
        situation: String(entry.situation),
        thought: String(entry.thought),
        timestamp: new Date().toISOString(),
      },
    };
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(payload));
    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardarautoregistro` +
      `&idusuario=${encodeURIComponent(userId)}` +
      `&token=` +
      `&datosactividad=${encodeURIComponent(encryptedPayload)}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
    });
    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    const parsed = parseJsonFromNoisyText(text);
    if (parsed && typeof parsed === "object" && parsed.status && parsed.status !== "OK") {
      return res.status(400).json({
        success: false,
        message: parsed.message || "El servicio devolvio error.",
        debugUrl: url,
      });
    }

    return res.json({success: true, message: "Autorregistro guardado.", debugUrl: url});
  } catch (error: any) {
    const message = error?.name === "AbortError" ?
      "Timeout al guardar autorregistro." :
      "No se pudo guardar el autorregistro.";
    return res.status(500).json({success: false, message});
  }
});

app.get("/autoregistros", async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({success: false, error: "User ID is required."});
    }

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const token = Buffer.from(`${DAILY_QUESTION_KEY}|${fecha}`).toString("base64");
    const base64UserId = Buffer.from(userId).toString("base64");
    const candidateUrls = [
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getautoregistro&idusuario=${encodeURIComponent(userId)}&token=`,
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getautoregistros&idusuario=${encodeURIComponent(userId)}&token=`,
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getautoregistro&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`,
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getautoregistros&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`,
    ];

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS),
        });
        const text = await response.text();
        if (!response.ok) continue;

        const parsed = parseJsonFromNoisyText(text);
        const rawEntries = extractLegacyEntries(parsed);
        if (!rawEntries.length) continue;

        const entries = rawEntries
          .map((entry, index) => normalizeLegacyAutoregistro(entry, index))
          .filter((entry) => entry.situation || entry.thought || entry.emotion)
          .sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

        return res.json({success: true, entries, debugUrl: url});
      } catch {
        // Continue with the next candidate URL.
      }
    }

    return res.json({success: true, entries: []});
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
});

app.post("/legacy/sync", async (req: Request, res: Response) => {
  try {
    const type = String(req.body?.type || "").trim();
    const data = req.body?.data;
    const allowedTypes = new Set(["usuario", "guardaranimo", "guardarlogin", "otro_tipo"]);
    if (!allowedTypes.has(type)) {
      return res.status(400).json({success: false, error: "Tipo no permitido."});
    }
    if (!data || typeof data !== "object") {
      return res.status(400).json({success: false, error: "Data invalida."});
    }

    const userId = String((data as any).id || "").trim();
    const departmentCode = String((data as any).department_code || "");
    if (!userId) {
      return res.status(400).json({success: false, error: "Falta id de usuario."});
    }

    const {id, name, email, department_code, ...encryptedData} = data as any;
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(encryptedData));
    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=${encodeURIComponent(type)}` +
      `&idusuario=${encodeURIComponent(userId)}` +
      `&token=${encodeURIComponent(departmentCode)}` +
      `&datos=${encodeURIComponent(encryptedPayload)}`;

    const response = await fetch(url, {signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS)});
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    return res.json({success: true, debugUrl: url});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error?.message || "Internal Server Error"});
  }
});

app.post("/legacy/delete-user", async (req: Request, res: Response) => {
  try {
    const userId = String(req.body?.userId || "").trim();
    if (!userId) {
      return res.status(400).json({success: false, error: "Falta id de usuario."});
    }

    const url =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=borrarusuario` +
      `&idusuario=${encodeURIComponent(userId)}`;

    const response = await fetch(url, {signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS)});
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Error externo (${response.status}).`,
        debugUrl: url,
      });
    }

    return res.json({success: true, debugUrl: url});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error?.message || "Internal Server Error"});
  }
});

app.post("/admin/auth/delete-users", async (req: Request, res: Response) => {
  const expectedApiKey = process.env.ADMIN_DELETE_USERS_API_KEY;
  if (!expectedApiKey) {
    return res.status(500).json({
      ok: false,
      error: "Falta configurar ADMIN_DELETE_USERS_API_KEY en el servidor.",
    });
  }

  const requestApiKey = getAdminApiKeyFromRequest(req);
  if (!requestApiKey || requestApiKey !== expectedApiKey) {
    return res.status(401).json({ok: false, error: "No autorizado."});
  }

  const validation = validateUids(req.body?.uids);
  if (!validation.ok) {
    return res.status(400).json({ok: false, error: validation.error});
  }
  const deleteFirestoreUsers = req.body?.deleteFirestoreUsers === true;

  try {
    const appInstance = getAdminApp();
    const result = await getAuth(appInstance).deleteUsers(validation.uids);

    let firestoreUsersDeleted = 0;
    const firestoreErrors: Array<{ uid: string; message: string }> = [];

    if (deleteFirestoreUsers) {
      const db = getFirestore(appInstance);
      for (const uid of validation.uids) {
        try {
          await db.collection("users").doc(uid).delete();
          firestoreUsersDeleted += 1;

          const qs = await db.collection("users").where("id", "==", uid).get();
          if (!qs.empty) {
            const batch = db.batch();
            qs.docs.forEach((docSnap) => {
              if (docSnap.id !== uid) {
                batch.delete(docSnap.ref);
                firestoreUsersDeleted += 1;
              }
            });
            await batch.commit();
          }
        } catch (error: any) {
          firestoreErrors.push({uid, message: error?.message ?? "Unknown error"});
        }
      }
    }

    return res.json({
      ok: true,
      requestedCount: validation.uids.length,
      successCount: result.successCount,
      failureCount: result.failureCount,
      firestore: {
        attempted: deleteFirestoreUsers,
        deletedCount: firestoreUsersDeleted,
        failureCount: firestoreErrors.length,
        errors: firestoreErrors,
      },
      errors: result.errors.map((err) => ({
        index: err.index,
        uid: validation.uids[err.index] ?? null,
        code: err.error.code,
        message: err.error.message,
      })),
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: "Error interno al borrar usuarios.",
      details: error?.message ?? "Unknown error",
    });
  }
});

const WP_API_BASE = `${EXTERNAL_SERVICES_BASE_URL}/wp-json/wp/v2`;

app.get("/resources", async (_req: Request, res: Response) => {
  try {
    const categoriesRes = await fetch(
      `${WP_API_BASE}/categories?per_page=100&_fields=id,name,slug,count`
    );
    if (!categoriesRes.ok) {
      return res.status(502).json({
        error: "Failed to fetch categories from WP",
        status: categoriesRes.status,
      });
    }
    const categories = (await categoriesRes.json())
      .filter((cat: any) => cat.slug !== "sin-categoria" && cat.count > 0);
    return res.json(categories);
  } catch {
    return res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/resources/category/:slug", async (req: Request, res: Response) => {
  const {slug} = req.params;
  try {
    const categoriesRes = await fetch(
      `${WP_API_BASE}/categories?per_page=100&_fields=id,name,slug,count`
    );
    if (!categoriesRes.ok) {
      return res.status(502).json({
        error: "Failed to fetch categories from WP",
        status: categoriesRes.status,
      });
    }
    const categories = await categoriesRes.json();
    const category = categories.find((c: any) => c.slug === slug);
    if (!category) {
      return res.status(404).json({error: "Category not found"});
    }

    const postsRes = await fetch(
      `${WP_API_BASE}/posts?per_page=100&_embed&_fields=` +
      "id,slug,title,excerpt,content,date,categories,featured_media,_embedded"
    );
    if (!postsRes.ok) {
      return res.status(502).json({
        error: "Failed to fetch posts from WP",
        status: postsRes.status,
      });
    }
    const posts = await postsRes.json();
    const filtered = posts.filter(
      (p: any) => Array.isArray(p.categories) && p.categories.includes(category.id)
    );
    return res.json({category, posts: filtered});
  } catch {
    return res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/resources/post/:slug", async (req: Request, res: Response) => {
  const {slug} = req.params;
  try {
    const postRes = await fetch(
      `${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed&_fields=` +
      "id,slug,title,excerpt,content,date,categories,featured_media,_embedded"
    );
    if (!postRes.ok) {
      return res.status(502).json({
        error: "Failed to fetch post from WP",
        status: postRes.status,
      });
    }
    const posts = await postRes.json();
    return res.json(posts[0] || null);
  } catch {
    return res.status(500).json({error: "Internal Server Error"});
  }
});

export default app;
