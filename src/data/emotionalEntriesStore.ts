
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';

export interface EmotionalEntry {
  id: string;
  situation: string;
  thought: string;
  emotion: string; // e.g., "alegria"
  timestamp: string | Timestamp | null; // ISO string, Firestore Timestamp, or null for optimistic UI
}

// These functions are now deprecated as we move to a full Firestore implementation.
// They will be removed in a future refactor.
export function getEmotionalEntries(): EmotionalEntry[] {
  console.warn("`getEmotionalEntries` from localStore is deprecated. Data is now fetched directly from Firestore in the component.");
  return [];
}

export function addEmotionalEntry(newEntryData: Omit<EmotionalEntry, 'id' | 'timestamp'>): EmotionalEntry {
   console.warn("`addEmotionalEntry` from localStore is deprecated. Use Firestore `addDoc` in the component.");
   return {
    id: crypto.randomUUID(),
    ...newEntryData,
    timestamp: new Date().toISOString(),
  };
}

export function overwriteEmotionalEntries(entries: EmotionalEntry[]): void {
  console.warn("`overwriteEmotionalEntries` is deprecated. Local storage is no longer the source of truth.");
}

export function getRecentEmotionalEntries(count: number = 5): EmotionalEntry[] {
    console.warn("`getRecentEmotionalEntries` is deprecated.");
    return [];
}

export function clearAllEmotionalEntries(): void {
  console.warn("`clearAllEmotionalEntries` is deprecated.");
}


export function formatEntryTimestamp(timestamp: string | Timestamp | null): string {
  if (!timestamp) {
    return "Fecha pendiente...";
  }
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp.toDate();
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided to formatEntryTimestamp:", timestamp);
      return "Fecha inválida";
    }
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Fecha inválida";
  }
}
