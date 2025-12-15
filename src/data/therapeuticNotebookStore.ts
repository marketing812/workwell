
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { User } from '@/contexts/UserContext';
import { useFirestore, addDoc, collection, serverTimestamp } from '@/firebase/provider'; // Esto no funcionará, es una simulación

export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
  ruta?: string; // NEW: The name of the path (route)
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
const MAX_NOTEBOOK_ENTRIES = 100;


export function getNotebookEntries(): NotebookEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(NOTEBOOK_ENTRIES_KEY);
    const entries = item ? (JSON.parse(item) as NotebookEntry[]) : [];
    // Sort by timestamp descending (newest first) before returning
    return entries.sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  } catch (error) {
    console.error("Error reading notebook entries from localStorage:", error);
    return [];
  }
}

export function getNotebookEntryById(id: string): NotebookEntry | undefined {
  if (typeof window === "undefined") return undefined;
  const entries = getNotebookEntries();
  return entries.find(entry => entry.id === id);
}

export function addNotebookEntry(newEntryData: Omit<NotebookEntry, 'id' | 'timestamp'>): NotebookEntry {
   // This function remains synchronous for immediate UI update, but the actual save will be async
   // Firestore logic should be handled in the component calling this.
  const newEntry: NotebookEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...newEntryData,
  };

  try {
    const currentEntries = getNotebookEntries();
    const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_NOTEBOOK_ENTRIES);
    localStorage.setItem(NOTEBOOK_ENTRIES_KEY, JSON.stringify(updatedEntries));
    window.dispatchEvent(new Event('notebook-updated'));
  } catch (error) {
    console.error("Error saving notebook entry to localStorage:", error);
  }
  return newEntry;
}

export function overwriteNotebookEntries(entries: NotebookEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const sortedEntries = [...entries].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    const entriesToStore = sortedEntries.slice(0, MAX_NOTEBOOK_ENTRIES);
    localStorage.setItem(NOTEBOOK_ENTRIES_KEY, JSON.stringify(entriesToStore));
    window.dispatchEvent(new Event('notebook-updated'));
  } catch (error) {
    console.error("Error overwriting notebook entries in localStorage:", error);
  }
}

export function formatEntryTimestamp(isoTimestamp: string): string {
  try {
    const date = parseISO(isoTimestamp);
    if (isNaN(date.getTime())) {
      const flexibleDate = new Date(isoTimestamp.replace(' ', 'T'));
      if (isNaN(flexibleDate.getTime())) {
        throw new Error('Invalid date string provided');
      }
      return format(flexibleDate, "dd MMM yyyy, HH:mm", { locale: es });
    }
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting timestamp:", error, "Input:", isoTimestamp);
    return "Fecha inválida";
  }
}

export function clearAllNotebookEntries(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(NOTEBOOK_ENTRIES_KEY);
    window.dispatchEvent(new Event('notebook-updated'));
  } catch (error) {
    console.error("Error clearing notebook entries from localStorage:", error);
  }
}
