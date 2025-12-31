
"use client";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface NotebookEntry {
  id: string;
  timestamp: string; // ISO string
  title: string; // e.g., "Reflexión: Identifica tu disparador"
  content: string; // The user's full written reflection
  pathId?: string; // Optional: ID of the path this reflection is associated with
  ruta?: string; // The name of the path (route)
  userId?: string; // Optional: include userId for sync purposes
}

const NOTEBOOK_ENTRIES_KEY = "workwell-therapeutic-notebook";
const MAX_NOTEBOOK_ENTRIES = 100;
const API_PROXY_URL = "/api/save-notebook-entry"; // The internal API route that proxies to the external service
const DEBUG_SAVE_NOTEBOOK_URL_KEY = "workwell-debug-save-notebook-url";


// This async function sends the data to the internal API route
async function syncNotebookEntryWithServer(userId: string, entry: NotebookEntry) {
    try {
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, entryData: entry }),
        });

        const result = await response.json();
        
        if (result.debugUrl && typeof window !== 'undefined') {
            sessionStorage.setItem(DEBUG_SAVE_NOTEBOOK_URL_KEY, result.debugUrl);
            window.dispatchEvent(new Event('notebook-save-url-updated')); // Dispatch a specific event
        }

        if (!response.ok) {
            console.error(`[Client] Notebook sync failed with status: ${response.status}.`, result);
        } else {
            console.log(`[Client] Notebook entry for user '${userId}' sync initiated successfully.`);
        }
    } catch (error) {
        console.error("[Client] Error calling internal notebook sync API:", error);
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

  // 1. Save to local storage for immediate UI update
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

  // 2. Sync with the external server via our internal API route (non-blocking)
  if (userId) {
    // We don't await this call, so it's "fire and forget" and doesn't block the UI
    syncNotebookEntryWithServer(userId, newEntry);
  } else {
    console.warn("addNotebookEntry: userId not provided, skipping external sync.");
  }

  return newEntry;
}


export function overwriteNotebookEntries(entries: NotebookEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const sortedEntries = [...entries].sort((a, b) => {
        try {
            return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
        } catch(e) {
             try {
                // Fallback for non-ISO dates from legacy system
                return new Date(b.timestamp.replace(' ', 'T')).getTime() - new Date(a.timestamp.replace(' ', 'T')).getTime();
             } catch (e2) {
                 console.warn("Could not parse timestamps for sorting in overwriteNotebookEntries:", b.timestamp, a.timestamp);
                 return 0;
             }
        }
    });
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
