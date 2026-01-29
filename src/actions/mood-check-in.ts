
"use server";

import { sendLegacyData } from "@/data/userUtils";
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

interface SaveMoodCheckInPayload {
  userId: string;
  mood: string;
  score: number;
}

// Ensure Firebase is initialized for server actions, in case other parts of the system need it.
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export async function saveMoodCheckIn(payload: SaveMoodCheckInPayload): Promise<{ success: boolean; error?: string; debugUrl?: string }> {
  const { userId, mood, score } = payload;

  if (!userId || !mood || score === undefined) {
    return { success: false, error: "Faltan datos en la petición." };
  }

  try {
    // Save to WordPress (Legacy System) via fire-and-forget
    const legacyPayload = {
      id: userId,
      mood: mood,
      score: score,
      timestamp: new Date().toISOString(),
    };
    
    // Capture the debugUrl from sendLegacyData
    const { debugUrl } = await sendLegacyData(legacyPayload, 'guardaranimo'); 
    console.log(`Mood check-in sent to legacy system for user ${userId}`);

    // Return the URL for debugging purposes
    return { success: true, debugUrl };
  } catch (error: any) {
    console.error("Error saving mood check-in:", error);
    return { success: false, error: error.message || "Error desconocido al guardar el registro." };
  }
}
