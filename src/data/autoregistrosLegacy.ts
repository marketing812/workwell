import type { EmotionalEntry } from "@/data/emotionalEntriesStore";

const API_TIMEOUT_MS = 15000;

function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export async function saveAutoregistroLegacy(params: {
  userId: string;
  entry: { situation: string; thought: string; emotion: string };
}): Promise<{ success: boolean; message: string; debugUrl?: string }> {
  const base = getApiBase();
  if (!base) return { success: false, message: "API base no configurada." };

  try {
    const response = await fetch(`${base}/save-autoregistro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.success !== true) {
      return {
        success: false,
        message: payload?.message || `Error externo (${response.status}).`,
        debugUrl: payload?.debugUrl,
      };
    }

    return {
      success: true,
      message: payload?.message || "Autorregistro guardado.",
      debugUrl: payload?.debugUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.name === "AbortError"
          ? "Timeout al guardar autorregistro."
          : "No se pudo guardar el autorregistro.",
    };
  }
}

export async function getAutoregistrosLegacy(userId: string): Promise<EmotionalEntry[]> {
  const base = getApiBase();
  if (!base || !userId) return [];

  try {
    const response = await fetch(`${base}/autoregistros?userId=${encodeURIComponent(userId)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) return [];

    const payload = await response.json().catch(() => ({}));
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    return entries as EmotionalEntry[];
  } catch {
    return [];
  }
}
