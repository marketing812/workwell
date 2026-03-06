import { forceEncryptStringAES } from "@/lib/encryption";
import { EXTERNAL_SERVICES_BASE_URL } from "@/lib/constants";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;
const TOKEN_KEY = "SJDFgfds788sdfs8888KLLLL";

function buildLegacyToken(): string {
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  return btoa(`${TOKEN_KEY}|${fecha}`);
}

function parseJsonFromNoisyText(text: string): any {
  const trimmed = (text || "").trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }

  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd > objectStart) {
    return JSON.parse(trimmed.slice(objectStart, objectEnd + 1));
  }

  const arrayStart = trimmed.indexOf("[");
  const arrayEnd = trimmed.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    return JSON.parse(trimmed.slice(arrayStart, arrayEnd + 1));
  }

  return null;
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return new Date().toISOString();
  }
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeEntry(raw: any, fallbackIndex: number): EmotionalEntry {
  if (Array.isArray(raw)) {
    const thought = String(raw[0] ?? "").trim();
    const timestamp = normalizeTimestamp(raw[1]);
    const sourceId = String(raw[2] ?? "").trim();
    const situation = String(raw[3] ?? "").trim();
    const emotion = String(raw[4] ?? "").trim();

    return {
      id: sourceId
        ? `${sourceId}-${new Date(timestamp).getTime()}-${fallbackIndex}`
        : `legacy-autoregistro-${new Date(timestamp).getTime()}-${fallbackIndex}`,
      situation,
      thought,
      emotion,
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
    timestamp: normalizeTimestamp(raw?.timestamp ?? raw?.fecha ?? raw?.createdAt ?? raw?.fechahora),
  };
}

function extractEntries(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.registros)) return payload.registros;
  if (Array.isArray(payload.entries)) return payload.entries;
  return [];
}

export async function saveAutoregistroLegacy(params: {
  userId: string;
  entry: { situation: string; thought: string; emotion: string };
}): Promise<{ success: boolean; message: string; debugUrl?: string }> {
  const { userId, entry } = params;

  if (!userId) return { success: false, message: "Falta id de usuario." };
  if (!entry?.situation || !entry?.thought || !entry?.emotion) {
    return { success: false, message: "Faltan campos del autorregistro." };
  }

  const payload = {
    entry: {
      id: String(Date.now()),
      emotion: entry.emotion,
      situation: entry.situation,
      thought: entry.thought,
      timestamp: new Date().toISOString(),
    },
  };

  const encryptedPayload = forceEncryptStringAES(JSON.stringify(payload));
  const url =
    `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarautoregistro` +
    `&idusuario=${encodeURIComponent(userId)}` +
    `&token=` +
    `&datosactividad=${encodeURIComponent(encryptedPayload)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: "no-store",
    });
    const text = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: `Error externo (${response.status}).`,
        debugUrl: url,
      };
    }

    const parsed = parseJsonFromNoisyText(text);
    if (parsed && typeof parsed === "object" && parsed.status && parsed.status !== "OK") {
      return {
        success: false,
        message: parsed.message || "El servicio devolvió error.",
        debugUrl: url,
      };
    }

    return { success: true, message: "Autorregistro guardado.", debugUrl: url };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.name === "AbortError"
          ? "Timeout al guardar autorregistro."
          : "No se pudo guardar el autorregistro.",
      debugUrl: url,
    };
  }
}

export async function getAutoregistrosLegacy(userId: string): Promise<EmotionalEntry[]> {
  if (!userId) return [];

  const base64UserId = btoa(userId);
  const token = buildLegacyToken();
  const candidateUrls = [
    `${API_BASE_URL}?apikey=${API_KEY}&tipo=getautoregistro&idusuario=${encodeURIComponent(userId)}&token=`,
    `${API_BASE_URL}?apikey=${API_KEY}&tipo=getautoregistros&idusuario=${encodeURIComponent(userId)}&token=`,
    `${API_BASE_URL}?apikey=${API_KEY}&tipo=getautoregistro&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`,
    `${API_BASE_URL}?apikey=${API_KEY}&tipo=getautoregistros&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(API_TIMEOUT_MS) });
      const text = await response.text();
      if (!response.ok) continue;

      const parsed = parseJsonFromNoisyText(text);
      const rawEntries = extractEntries(parsed);
      if (!rawEntries.length) continue;

      return rawEntries
        .map((entry, idx) => normalizeEntry(entry, idx))
        .filter((entry) => entry.situation || entry.thought || entry.emotion)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      // Continue with next candidate endpoint.
    }
  }

  return [];
}
