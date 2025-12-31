
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
// No importamos sendLegacyNotebookEntry porque ahora se llamará a una API interna

export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
  ruta?: string; // The name of the path (route)
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
const MAX_NOTEBOOK_ENTRIES = 100;
const API_PROXY_URL = "/api/save-notebook-entry"; // Nueva ruta de API interna

async function syncNotebookEntryWithServer(userId: string, entry: NotebookEntry) {
    try {
        console.log(`Syncing notebook entry for user ${userId} via internal API proxy...`);
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, entryData: entry }),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            console.error(`Legacy notebook sync failed with status: ${response.status}.`, errorResult);
        } else {
            console.log(`Legacy notebook entry sync for user '${userId}' initiated successfully via proxy.`);
        }
    } catch (error) {
        console.error("Error calling internal notebook sync API:", error);
    }
}


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

export function addNotebookEntry(
  newEntryData: Omit<NotebookEntry, 'id' | 'timestamp'> & { userId?: string }
): NotebookEntry {
  const { userId, ...entryData } = newEntryData;
  const newEntry: NotebookEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entryData,
  };

  // Guardado local inmediato
  try {
    if (typeof window !== "undefined") {
      const currentEntries = getNotebookEntries();
      const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_NOTEBOOK_ENTRIES);
      localStorage.setItem(NOTEBOOK_ENTRIES_KEY, JSON.stringify(updatedEntries));
      window.dispatchEvent(new CustomEvent('notebook-updated'));
    }
  } catch (error) {
    console.error("Error saving notebook entry to localStorage:", error);
  }

  // Sincronización con el servidor externo a través de la API interna
  if (userId) {
    syncNotebookEntryWithServer(userId, newEntry);
  } else {
    console.warn("addNotebookEntry: userId not provided, skipping external sync.");
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
