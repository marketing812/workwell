'use server';

import { sendReminderEmailByUserId } from '@/actions/email';

export async function triggerReminderAction(): Promise<{ success: boolean; message: string }> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
  if (!base) {
    return { success: false, message: 'NEXT_PUBLIC_API_BASE_URL no configurada.' };
  }

  try {
    const response = await fetch(`${base}/trigger-reminder`, { cache: 'no-store' });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, message: result?.error || 'Failed to fetch reminder data.' };
    }

    if (result?.success && result?.message && result?.data) {
      const emailResult = await sendReminderEmailByUserId(String(result.message), String(result.data));
      if (!emailResult.success) {
        return { success: false, message: emailResult.error || 'Failed to send reminder email.' };
      }
      return { success: true, message: 'Reminder email sent.' };
    }

    return { success: true, message: 'No email reminder to send at this time.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: errorMessage };
  }
}
