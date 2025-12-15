
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface EmotionalEntry {
  id: string;
  situation: string;
  thought: string;
  emotion: string; // e.g., "alegria"
  timestamp: string | { toDate: () => Date } | null; // ISO string or Firestore Timestamp
}

const EMOTIONAL_ENTRIES_KEY = "workwell-emotional-entries";
const MAX_ENTRIES_TO_STORE = 50;
const MAX_ENTRIES_TO_DISPLAY = 5;

// LEGACY: Estas funciones operan en localStorage y serán reemplazadas por acciones de Firestore.
// Se mantienen por ahora para no romper la compilación, pero su uso debería ser eliminado.

export function getEmotionalEntries(): EmotionalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(EMOTIONAL_ENTRIES_KEY);
    const entries = item ? (JSON.parse(item) as EmotionalEntry[]) : [];
    return entries.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const dateA = typeof a.timestamp === 'string' ? parseISO(a.timestamp) : (a.timestamp as any).toDate();
        const dateB = typeof b.timestamp === 'string' ? parseISO(b.timestamp) : (b.timestamp as any).toDate();
        return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error reading emotional entries from localStorage:", error);
    return [];
  }
}

export function addEmotionalEntry(newEntryData: Omit<EmotionalEntry, 'id' | 'timestamp'>): EmotionalEntry {
   console.warn("`addEmotionalEntry` is deprecated and operates on localStorage. Use Firestore actions instead.");
   const newEntry: EmotionalEntry = {
    id: crypto.randomUUID(),
    ...newEntryData,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    return newEntry;
  }
  
  try {
    const currentEntries = getEmotionalEntries();
    const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_ENTRIES_TO_STORE);
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
    window.dispatchEvent(new CustomEvent('emotional-entries-updated'));
  } catch (error) {
    console.error("Error saving emotional entry to localStorage:", error);
  }
  return newEntry;
}

export function overwriteEmotionalEntries(entries: EmotionalEntry[]): void {
  if (typeof window === "undefined") return;
  console.warn("`overwriteEmotionalEntries` is deprecated and operates on localStorage. Use Firestore actions instead.");
  try {
    const sortedEntries = [...entries].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const dateA = typeof a.timestamp === 'string' ? parseISO(a.timestamp) : (a.timestamp as any).toDate();
        const dateB = typeof b.timestamp === 'string' ? parseISO(b.timestamp) : (b.timestamp as any).toDate();
        return dateB.getTime() - dateA.getTime();
    });
    const entriesToStore = sortedEntries.slice(0, MAX_ENTRIES_TO_STORE);
    localStorage.setItem(EMOTIONAL_ENTRIES_KEY, JSON.stringify(entriesToStore));
    window.dispatchEvent(new CustomEvent('emotional-entries-updated'));
  } catch (error) {
    console.error("Error overwriting emotional entries in localStorage:", error);
  }
}

export function getRecentEmotionalEntries(count: number = MAX_ENTRIES_TO_DISPLAY): EmotionalEntry[] {
    return getEmotionalEntries().slice(0, count);
}

export function formatEntryTimestamp(timestamp: string | { toDate: () => Date } | null): string {
  if (!timestamp) {
    return "Fecha pendiente...";
  }
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp.toDate();
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Fecha inválida";
  }
}

export function clearAllEmotionalEntries(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(EMOTIONAL_ENTRIES_KEY);
    window.dispatchEvent(new CustomEvent('emotional-entries-updated'));
  } catch (error) {
    console.error("Error clearing emotional entries from localStorage:", error);
  }
}
