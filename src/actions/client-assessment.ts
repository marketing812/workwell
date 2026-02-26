"use client";

import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
import { t } from '@/lib/translations';

const API_PROXY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/save-assessment`;
const API_SAVE_TIMEOUT_MS = 35000;

interface AssessmentSavePayload {
  assessmentId: string;
  userId: string;
  rawAnswers: Record<string, { score: number; weight: number }>;
  aiInterpretation: InitialAssessmentOutput;
  assessmentTimestamp: string;
}

export type SaveResult = {
  success: boolean;
  message: string;
  debugUrl?: string;
};

export async function saveAssessment(payloadToSave: AssessmentSavePayload): Promise<SaveResult> {
  try {
    const response = await fetch(API_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadToSave),
      signal: AbortSignal.timeout(API_SAVE_TIMEOUT_MS),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || `Error en backend (HTTP ${response.status})`, debugUrl: result.debugUrl };
    }

    return { success: result.success, message: result.message, debugUrl: result.debugUrl };
  } catch (error: any) {
    let errorMessage = t.assessmentSavedErrorGeneric;
    if (error.name === 'AbortError') {
      errorMessage = t.assessmentSavedErrorTimeout;
    } else if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
      errorMessage = t.assessmentSavedErrorFetchFailed;
    }
    return { success: false, message: errorMessage };
  }
}
