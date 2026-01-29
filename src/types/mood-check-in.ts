
import type { Timestamp } from 'firebase/firestore';

export interface MoodCheckIn {
  id: string;
  mood: string; // 'muy-mal', 'mal', etc.
  score: number;
  timestamp: string | Timestamp; // ISO string or Firestore Timestamp
}
