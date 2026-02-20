
"use client";

import type { DailyQuestion, DailyQuestionApiResponse } from '@/types/daily-question';

export async function getDailyQuestion(userId?: string | null): Promise<DailyQuestionApiResponse | null> {
  try {
    const url = '/api/daily-question';
    const response = await fetch(url, { cache: 'no-store' });
    
    // We get the JSON regardless of the status code
    const data = await response.json();

    if (!response.ok) {
        console.error("Error fetching daily question from client-side proxy:", data);
        // We still return the data object as it might contain useful error details
        return data as DailyQuestionApiResponse;
    }

    return data as DailyQuestionApiResponse;
  } catch (error) {
    console.error("Critical error fetching or parsing daily question from client-side proxy:", error);
    return null;
  }
}

