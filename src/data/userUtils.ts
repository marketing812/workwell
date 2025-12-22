
"use server";

import { forceEncryptStringAES } from '@/lib/encryption';

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";
const API_TIMEOUT_MS = 15000;

export async function sendLegacyData(
  data: Record<string, any>,
  type: 'usuario' | 'otro_tipo'
): Promise<{ success: boolean; debugUrl: string }> {
  try {
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(data));
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&datos=${encodeURIComponent(encryptedPayload)}`;

    console.log(`Sending legacy data of type '${type}' to old URL...`);

    // We are not awaiting the response to make the process faster for the user.
    // The call is "fire and forget".
    fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) })
      .then(response => {
        if (!response.ok) {
          console.warn(`Legacy data sync failed with status: ${response.status}`);
        } else {
          console.log(`Legacy data sync for type '${type}' initiated successfully.`);
        }
      })
      .catch(error => {
        console.error(`Error sending legacy data for type '${type}':`, error);
      });

    return { success: true, debugUrl: url };
  } catch (error) {
    console.error(`Error preparing legacy data for sending (type: ${type}):`, error);
    return { success: false, debugUrl: "Error creating URL" };
  }
}

    
