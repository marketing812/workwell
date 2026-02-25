
"use client";

import type { DailyQuestion, DailyQuestionApiResponse } from '@/types/daily-question';
import { getDailyQuestionAction } from '@/actions/daily-question';

export async function getDailyQuestion(userId?: string | null): Promise<DailyQuestionApiResponse | null> {
  if (!userId) {
    console.warn("getDailyQuestion called without a userId. Aborting call.");
    return { questions: [], error: 'User ID is required.' };
  }

  try {
    // Call the server action directly
    const result = await getDailyQuestionAction(userId);
    return result;
  } catch (error) {
    console.error("Critical error calling getDailyQuestionAction:", error);
    return {
        questions: [],
        error: error instanceof Error ? error.message : "Error desconocido al contactar la acción del servidor.",
        details: error
    };
  }
}
