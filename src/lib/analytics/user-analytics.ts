"use client";

export type AnalyticsEventCategory = "audio" | "chat";

export interface TrackUserAnalyticsEventInput {
  firestore?: unknown;
  userId: string | null | undefined;
  eventName: string;
  category: AnalyticsEventCategory;
  payload?: Record<string, unknown>;
}

type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsValue[] | { [key: string]: AnalyticsValue };

function sanitizeValue(value: unknown): AnalyticsValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    const sanitizedArray = value
      .map((item) => sanitizeValue(item))
      .filter((item): item is AnalyticsValue => item !== undefined);
    return sanitizedArray;
  }

  if (typeof value === "object") {
    const sanitizedObject: Record<string, AnalyticsValue> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      const sanitizedNestedValue = sanitizeValue(nestedValue);
      if (sanitizedNestedValue !== undefined) {
        sanitizedObject[key] = sanitizedNestedValue;
      }
    }
    return sanitizedObject;
  }

  return String(value);
}

function sanitizePayload(payload?: Record<string, unknown>): Record<string, AnalyticsValue> {
  if (!payload) {
    return {};
  }

  const sanitized: Record<string, AnalyticsValue> = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanValue = sanitizeValue(value);
    if (cleanValue !== undefined) {
      sanitized[key] = cleanValue;
    }
  }
  return sanitized;
}

export function trackUserAnalyticsEvent(input: TrackUserAnalyticsEventInput): void {
  if (!input.userId) {
    return;
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base) {
    return;
  }

  const now = new Date();
  const body = {
    schemaVersion: 1,
    userId: input.userId,
    eventName: input.eventName,
    eventCategory: input.category,
    eventDate: now.toISOString().slice(0, 10),
    clientTimestamp: now.toISOString(),
    payload: sanitizePayload(input.payload),
  };

  // Fire-and-forget: analytics must not block UI flows.
  void fetch(`${base}/save-analytics-event`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Silently drop analytics errors.
  });
}
