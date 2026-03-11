'use server';

import type { DailyQuestionApiResponse } from '@/types/daily-question';

export async function getDailyQuestionAction(userId: string): Promise<DailyQuestionApiResponse | null> {
  if (!userId) {
    return { questions: [], error: 'User ID is required.' };
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
  if (!base) {
    return { questions: [], error: 'NEXT_PUBLIC_API_BASE_URL no configurada.' };
  }

  try {
    const response = await fetch(`${base}/daily-question?userId=${encodeURIComponent(userId)}`, {
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        questions: [],
        error: payload?.error || `HTTP ${response.status}`,
        details: payload?.details,
      };
    }

    return payload as DailyQuestionApiResponse;
  } catch (error) {
    return {
      questions: [],
      error: error instanceof Error ? error.message : 'Internal Server Error',
    };
  }
}
