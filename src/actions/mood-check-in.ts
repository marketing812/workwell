
"use server";

import { getFirestore } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendLegacyData } from "@/data/userUtils";
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

interface SaveMoodCheckInPayload {
  userId: string;
  mood: string;
  score: number;
}

// Ensure Firebase is initialized for server actions
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export async function saveMoodCheckIn(payload: SaveMoodCheckInPayload): Promise<{ success: boolean; error?: string }> {
  const { userId, mood, score } = payload;
  const db = getFirestore();

  if (!userId || !mood || score === undefined) {
    return { success: false, error: "Faltan datos en la petición." };
  }

  try {
    // 1. Save to Firestore
    const moodCheckInsRef = collection(db, "users", userId, "mood_check_ins");
    await addDoc(moodCheckInsRef, {
      mood,
      score,
      timestamp: serverTimestamp(),
    });
    console.log(`Mood check-in saved to Firestore for user ${userId}`);

    // 2. Save to WordPress (Legacy System) via fire-and-forget
    const legacyPayload = {
      id: userId,
      mood: mood,
      score: score,
      timestamp: new Date().toISOString(),
    };
    sendLegacyData(legacyPayload, 'guardaranimo'); 
    console.log(`Mood check-in sent to legacy system for user ${userId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error saving mood check-in:", error);
    return { success: false, error: error.message || "Error desconocido al guardar el registro." };
  }
}
