"use client";

interface SyncRouteProgressInput {
  userId: string | null | undefined;
  routeNumber: number;
  weekNumber: number;
}

const PRODUCTION_API_BASE_URL =
  "https://europe-west4-workwell-c4rlk.cloudfunctions.net/api";

function isLocalhostUrl(value: string): boolean {
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value);
}

function resolveApiBaseUrl(): string {
  const envBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

  if (!envBase) {
    return PRODUCTION_API_BASE_URL;
  }

  if (typeof window === "undefined") {
    return envBase;
  }

  const currentHost = window.location.hostname;
  const isRunningLocally =
    currentHost === "localhost" ||
    currentHost === "127.0.0.1";

  if (!isRunningLocally && isLocalhostUrl(envBase)) {
    return PRODUCTION_API_BASE_URL;
  }

  return envBase;
}

export function syncRouteProgressCompletion(
  input: SyncRouteProgressInput
): void {
  const userId = String(input.userId || "").trim();
  if (!userId) {
    console.warn("[route-progress] Sync skipped: missing userId.");
    return;
  }

  if (
    !Number.isInteger(input.routeNumber) ||
    input.routeNumber <= 0 ||
    !Number.isInteger(input.weekNumber) ||
    input.weekNumber <= 0
  ) {
    console.warn("[route-progress] Sync skipped: invalid route/week.", input);
    return;
  }

  const base = resolveApiBaseUrl();
  if (!base) {
    console.warn("[route-progress] Sync skipped: missing API base URL.");
    return;
  }

  void fetch(`${base}/save-route-progress`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      userId,
      routeNumber: input.routeNumber,
      weekNumber: input.weekNumber,
      status: 1,
    }),
    keepalive: true,
  }).then(async (response) => {
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false) {
      console.error("[route-progress] Sync failed.", {
        status: response.status,
        baseUrl: base,
        payload,
        input,
      });
      return;
    }
    console.info("[route-progress] Sync OK.", {
      baseUrl: base,
      payload,
      input,
    });
  }).catch(() => {
    console.error("[route-progress] Network error during sync.", {
      baseUrl: base,
      input,
    });
  });
}
