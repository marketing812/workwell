
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
    // Extract id and department_code to be sent unencrypted
    const userId = data.id;
    const departmentCode = data.department_code || '';

    // Create a new object for encryption that excludes the unencrypted fields
    const { id, name, email, department_code, ...encryptedData } = data;
    
    // Encrypt the rest of the data
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(encryptedData));

    // Build the URL with unencrypted id and department_code, and the encrypted data
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&idusuario=${encodeURIComponent(userId)}&token=${encodeURIComponent(departmentCode)}&datos=${encodeURIComponent(encryptedPayload)}`;

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

export async function deleteLegacyData(
  userId: string,
  type: 'borrarusuario'
): Promise<{ success: boolean; debugUrl: string }> {
  try {
    const encryptedUserId = forceEncryptStringAES(userId);
    // Build the URL for deletion, userId is not encrypted
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=${type}&idusuario=${encodeURIComponent(encryptedUserId)}`;

    console.log(`Sending delete request for user '${userId}' to legacy URL...`);

    // "Fire and forget" call
    fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) })
      .then(response => {
        if (!response.ok) {
          console.warn(`Legacy user deletion failed with status: ${response.status}`);
        } else {
          console.log(`Legacy user deletion for user '${userId}' initiated successfully.`);
        }
      })
      .catch(error => {
        console.error(`Error sending legacy delete request for user '${userId}':`, error);
      });

    return { success: true, debugUrl: url };
  } catch (error) {
    console.error(`Error preparing legacy delete request for user '${userId}':`, error);
    return { success: false, debugUrl: "Error creating delete URL" };
  }
}

// DEPRECATED - This function is no longer called directly from the client.
// The functionality has been moved to the /api/save-notebook-entry route.
// It is kept here for historical reference.
export async function sendLegacyNotebookEntry(
  userId: string,
  entryData: Record<string, any>
): Promise<{ success: boolean; debugUrl: string }> {
  console.warn("DEPRECATED: sendLegacyNotebookEntry is no longer in use. Please use the /api/save-notebook-entry endpoint.");
  try {
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    
    const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=guardarcuaderno&idusuario=${encodeURIComponent(btoa(userId))}&datos=${encodeURIComponent(encryptedPayload)}`;

    // This part of the code is effectively unused now.
    fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) })
        .catch(error => {
            console.error(`Error sending legacy notebook entry for user '${userId}':`, error);
        });

    return { success: true, debugUrl: url };
  } catch (error) {
    console.error(`Error preparing legacy notebook entry for sending for user '${userId}':`, error);
    return { success: false, debugUrl: "Error creating legacy notebook entry URL" };
  }
}
