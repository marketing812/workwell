import { NextResponse } from 'next/server';
import { sendReminderEmailByUserId } from '@/actions/email';
import { EXTERNAL_SERVICES_BASE_URL } from '@/lib/constants';

const API_BASE_URL = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const API_KEY = "4463";

export async function GET() {
  console.log("API Route (trigger-reminder): Received request.");
  try {
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getavisoemail`;

    console.log("API Route (trigger-reminder): Fetching from external API...");
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Route (trigger-reminder): Failed to fetch from getavisoemail. Status:", response.status, "Text:", errorText);
      return NextResponse.json({ success: false, error: 'Failed to fetch reminder data from external API.' }, { status: 502 });
    }

    const result = await response.json();
    console.log("API Route (trigger-reminder): Parsed response from external API:", result);

    if (result.status === 'OK' && result.message && result.data) {
      const userId = result.message;
      const emailBody = result.data;

      console.log(`API Route (trigger-reminder): Triggering email for userId: ${userId}`);
      const emailResult = await sendReminderEmailByUserId(userId, emailBody);

      if (emailResult.success) {
        console.log("API Route (trigger-reminder): Email sent successfully.");
        return NextResponse.json({ success: true, message: 'Reminder email sent.' });
      } else {
        console.error("API Route (trigger-reminder): sendReminderEmailByUserId failed.", emailResult.error);
        return NextResponse.json({ success: false, error: emailResult.error || 'Failed to send reminder email.' }, { status: 500 });
      }
    } else {
      console.log("API Route (trigger-reminder): No email reminder to send based on API response.");
      return NextResponse.json({ success: true, message: 'No email reminder to send at this time.' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("API Route (trigger-reminder): Uncaught error.", errorMessage);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
