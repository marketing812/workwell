"use client";

import type { DailyQuestionApiResponse } from '@/types/daily-question';

export async function getDailyQuestion(userId?: string | null): Promise<DailyQuestionApiResponse | null> {
  if (!userId) {
    console.warn('getDailyQuestion called without a userId. Aborting call.');
    return { questions: [], error: 'User ID is required.' };
  }

  try {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
    if (!base) {
      return {
        questions: [],
        error: 'NEXT_PUBLIC_API_BASE_URL no configurada.',
        details: { envVar: 'NEXT_PUBLIC_API_BASE_URL', userId },
      };
    }

    const endpoint = `${base}/daily-question?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    const json = await response.json();

    if (!response.ok) {
      return {
        questions: [],
        error: json?.error || `HTTP ${response.status}`,
        details: json?.details,
      };
    }

    return json;
  } catch (error) {
    console.error('Critical error calling daily-question backend endpoint:', error);
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

    if (error instanceof TypeError) {
      return {
        questions: [],
        error: `No se pudo conectar con ${base || 'la API configurada'} (network/CORS/DNS).`,
        details: {
          originalError: error.message,
          baseUrl: base || '(empty)',
          endpoint: base ? `${base}/daily-question?userId=${encodeURIComponent(userId)}` : '(unresolved)',
        },
      };
    }

    return {
      questions: [],
      error: error instanceof Error ? error.message : 'Error desconocido al contactar el backend.',
      details: error,
    };
  }
}
