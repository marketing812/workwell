"use client";

import type { DailyQuestion } from '@/types/daily-question';

export interface DailyQuestionApiResponse {
    questions: DailyQuestion[];
    debugUrl?: string;
}

export async function getDailyQuestion(userId?: string | null): Promise<DailyQuestionApiResponse | null> {
  try {
    const url = userId ? `/api/daily-question?userId=${userId}` : '/api/daily-question';
    const response = await fetch(url, { cache: 'no-store' });
    // We don't check for response.ok here, so we can pass the error JSON to the component for debugging
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily question from client-side proxy:", error);
    return null;
  }
}
