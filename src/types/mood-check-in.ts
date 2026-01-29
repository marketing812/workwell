
export interface MoodCheckIn {
  id: string;
  mood: string; // 'muy-mal', 'mal', etc.
  score: number;
  timestamp: Date; // Now always a Date object for consistency
}
