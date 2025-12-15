
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';

export interface EmotionalEntry {
  id: string;
  situation: string;
  thought: string;
  emotion: string; // e.g., "alegria"
  timestamp: string; // Always ISO string for consistency
}

const EMOTIONAL_ENTRIES_KEY = "workwell-emotional-entries";
const MAX_ENTRIES_TO_STORE = 50;

// DEPRECATED WARNING: The functions in this file manage a local-only copy of emotional
// entries. They are being phased out in favor of direct Firestore integration within
// the application components (e.g., DashboardPage, EmotionalLogPage).
// These functions will be removed in a future refactor.


export function getEmotionalEntries(): EmotionalEntry[] {
  console.warn("`getEmotionalEntries` from localStore is deprecated. Data is now fetched directly from Firestore.");
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(EMOTIONAL_ENTRIES_KEY);
    const entries = item ? (JSON.parse(item) as EmotionalEntry[]) : [];
    return entries.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  } catch (error) {
    console.error("Error reading emotional entries from localStorage:", error);
    return [];
  }
}

export function addEmotionalEntry(newEntryData: Omit<EmotionalEntry, 'id' | 'timestamp'>): EmotionalEntry {
   console.warn("`addEmotionalEntry` is deprecated. Use Firestore `addDoc` in components.");
   const newEntry: EmotionalEntry = {
    id: crypto.randomUUID(),
    ...newEntryData,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const currentEntries = getEmotionalEntries();
      const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_ENTRIES_TO_STORE);
      localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
      window.dispatchEvent(new Event('emotional-entries-updated'));
    } catch (error) {
      console.error("Error saving emotional entry to localStorage:", error);
    }
  }
  return newEntry;
}


export function overwriteEmotionalEntries(entries: EmotionalEntry[]): void {
  console.warn("`overwriteEmotionalEntries` is deprecated. Local storage is no longer the source of truth.");
  if (typeof window === "undefined") return;
  try {
    const sortedEntries = [...entries].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(sortedEntries.slice(0, MAX_ENTRIES_TO_STORE)));
    window.dispatchEvent(new Event('emotional-entries-updated'));
  } catch (error) {
    console.error("Error overwriting emotional entries in localStorage:", error);
  }
}


export function getRecentEmotionalEntries(count: number = 5): EmotionalEntry[] {
    console.warn("`getRecentEmotionalEntries` is deprecated.");
    return getEmotionalEntries().slice(0, count);
}


export function clearAllEmotionalEntries(): void {
  console.warn("`clearAllEmotionalEntries` is deprecated.");
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(EMOTIONAL_ENTRIES_KEY);
    window.dispatchEvent(new Event('emotional-entries-updated'));
  } catch (error) {
    console.error("Error clearing emotional entries from localStorage:", error);
  }
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
