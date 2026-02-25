'use server';

import { sendReminderEmailByUserId } from '@/actions/email';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";

export async function triggerReminderAction(): Promise<{ success: boolean; message: string; }> {
  console.log("Server Action (trigger-reminder): Received request.");
  try {
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getavisoemail`;

    console.log("Server Action (trigger-reminder): Fetching from external API...");
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Action (trigger-reminder): Failed to fetch from getavisoemail. Status:", response.status, "Text:", errorText);
      return { success: false, message: 'Failed to fetch reminder data from external API.' };
    }

    const result = await response.json();
    console.log("Server Action (trigger-reminder): Parsed response from external API:", result);

    if (result.status === 'OK' && result.message && result.data) {
      const userId = result.message;
      const emailBody = result.data;

      console.log(`Server Action (trigger-reminder): Triggering email for userId: ${userId}`);
      const emailResult = await sendReminderEmailByUserId(userId, emailBody);

      if (emailResult.success) {
        console.log("Server Action (trigger-reminder): Email sent successfully.");
        return { success: true, message: 'Reminder email sent.' };
      } else {
        console.error("Server Action (trigger-reminder): sendReminderEmailByUserId failed.", emailResult.error);
        return { success: false, message: emailResult.error || 'Failed to send reminder email.' };
      }
    } else {
      console.log("Server Action (trigger-reminder): No email reminder to send based on API response.");
      return { success: true, message: 'No email reminder to send at this time.' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Server Action (trigger-reminder): Uncaught error.", errorMessage);
    return { success: false, message: 'Internal Server Error' };
  }
}
