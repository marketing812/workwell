
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


// This async function sends the data to the internal API route
async function syncNotebookEntryWithServer(userId: string, entry: NotebookEntry) {
    try {
        console.log(`[Client] Preparing to sync notebook entry for user '${userId}'...`);
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, entryData: entry }),
        });

        const result = await response.json();

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
  // 1. Separate userId from the rest of the data.
  const { userId, ...entryProps } = newEntryData;

  // 2. Create the full entry object for local storage.
  const newEntry: NotebookEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entryProps,
  };

  // 3. Save to local storage for immediate UI update.
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

  // 4. Sync with the server (non-blocking).
  if (userId) {
    // Create a clean object for the server payload, ensuring userId is NOT included.
    const entryDataForServer = {
        id: newEntry.id,
        timestamp: newEntry.timestamp,
        title: newEntry.title,
        content: newEntry.content,
        pathId: newEntry.pathId,
        ruta: newEntry.ruta,
    };
    // The 'as NotebookEntry' is safe because the server function only needs these properties.
    syncNotebookEntryWithServer(userId, entryDataForServer as NotebookEntry);
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
    // Do NOT dispatch 'notebook-updated' here to avoid infinite loops when called from the context.
  } catch (error) {
    console.error("Error overwriting notebook entries in localStorage:", error);
  }
}

export function formatEntryTimestamp(isoTimestamp: string | null | undefined): string {
  if (!isoTimestamp) {
    return "Fecha no disponible";
  }
  try {
    // Primero, intentar parsear como si fuera un ISO string estándar.
    const date = parseISO(isoTimestamp);
    if (!isNaN(date.getTime())) {
       return format(date, "dd MMM yyyy, HH:mm", { locale: es });
    }
    
    // Si falla, probar con el formato que podría venir de la API (YYYY-MM-DD HH:MM:SS)
    const flexibleDate = new Date(isoTimestamp.replace(' ', 'T'));
    if (!isNaN(flexibleDate.getTime())) {
      return format(flexibleDate, "dd MMM yyyy, HH:mm", { locale: es });
    }
    
    // Si ambos fallan, es una fecha inválida.
    console.error("Error critical formatting entry timestamp: Invalid date string provided -", isoTimestamp);
    return "Fecha inválida";

  } catch (error) {
    console.error("Error formatting entry timestamp:", error, "Input:", isoTimestamp);
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
