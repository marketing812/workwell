
import CryptoJS from "crypto-js";

// SECRET_KEY is still defined but will only be used if ENCRYPTION_ENABLED is true
// or by functions that force encryption like forceEncryptStringAES.
const SECRET_KEY = "0123456789abcdef0123456789abcdef"; // 32 bytes

// --- FLAG TO CONTROL GLOBAL AES ENCRYPTION ---
const ENCRYPTION_ENABLED = true; // SET TO true TO ENABLE GLOBAL AES ENCRYPTION
// ---

export function encryptDataAES(data: object): string {
  if (!ENCRYPTION_ENABLED) {
    // When encryption is disabled, just return the JSON string representation of the object.
    return JSON.stringify(data);
  }

  // MODIFIED: Use a static IV derived from the secret key to always get the same encrypted string for the same input.
  // This is necessary if the backend compares encrypted strings directly.
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16)); // Use the first 16 bytes of the key as IV

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data), // Data to be encrypted is still the stringified object
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  // Return a stringified JSON object containing both IV and encrypted data (Base64 encoded)
  // Although the IV is static, we continue to send it in case the backend needs it for decryption.
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(),
  });
}

export function decryptDataAES(payloadString: string): object | string | null {
  if (!ENCRYPTION_ENABLED) {
    // When encryption is disabled, try to parse the string as JSON.
    // If it's not valid JSON (e.g., it's a plain string like "Juan Perez"),
    // return the original string.
    try {
      return JSON.parse(payloadString);
    } catch (e) {
      // payloadString was not a valid JSON string, return it as is.
      return payloadString;
    }
  }

  // Original AES decryption logic (active if ENCRYPTION_ENABLED is true)
  let parsedPayload: any;

  try {
    parsedPayload = JSON.parse(payloadString);
  } catch (e) {
    // It might be a simple string that's not JSON, which is a valid case in some scenarios (e.g. forceDecryptStringAES)
    // We'll let the next block handle it. For decryptDataAES, we typically expect a JSON object.
    console.warn("AES Decryption (Global Encryption ON): Input string is not valid JSON. Cannot decrypt as a structured payload.", payloadString, e);
    // If we strictly expect a JSON payload, we should return null here.
    // However, if it could be a raw encrypted string, we'd need a different handling path.
    // Given the logic in login, it's safer to return null if the outer structure isn't JSON.
    return null;
  }

  if (parsedPayload && typeof parsedPayload === 'object' &&
      typeof parsedPayload.iv === 'string' && typeof parsedPayload.data === 'string') {
    try {
      const iv = CryptoJS.enc.Base64.parse(parsedPayload.iv);
      const decrypted = CryptoJS.AES.decrypt(
        parsedPayload.data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        console.error("AES Decryption (Global Encryption ON): Decrypted string is empty. Possible key mismatch or data corruption. Original encrypted data:", parsedPayload.data);
        return null;
      }
      try {
        // The decrypted content itself is expected to be a JSON string
        return JSON.parse(decryptedString);
      } catch (jsonParseError) {
        // This handles cases where the decrypted content is a plain string, like with forceDecryptStringAES
        console.warn("AES Decryption (Global Encryption ON): Decrypted content is not JSON. Returning as plain string.", decryptedString);
        return decryptedString; 
      }
    } catch (decryptionProcessError) {
      console.error("AES Decryption (Global Encryption ON): Error during the decryption process.", decryptionProcessError);
      return null;
    }
  } else {
     if (parsedPayload && typeof parsedPayload === 'object' && parsedPayload !== null) {
      if ('id' in parsedPayload || 'email' in parsedPayload || 'name' in parsedPayload) {
        console.warn("AES Decryption (Global Encryption ON): Payload does not match encrypted structure but looks like user data. Returning as is.", parsedPayload);
        return parsedPayload;
      }
    }
    console.warn("AES Decryption (Global Encryption ON): Payload is JSON but not recognized as encrypted structure or valid user data.", parsedPayload);
    return null;
  }
}

/**
 * Forces AES encryption for a given string value, regardless of ENCRYPTION_ENABLED.
 * Returns a JSON string: '{"iv":"<base64_iv>", "data":"<base64_ciphertext>"}'.
 * MODIFIED to use a static IV.
 */
export function forceEncryptStringAES(value: string): string {
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16)); // Use static IV
  const encrypted = CryptoJS.AES.encrypt(
    value, // Encrypt the raw string directly
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(), // This is already Base64
  });
}

/**
 * Forces AES decryption for a string previously encrypted with forceEncryptStringAES.
 * Expects a JSON string: '{"iv":"<base64_iv>", "data":"<base64_ciphertext>"}'.
 * Returns the original decrypted string, or null on error.
 */
export function forceDecryptStringAES(encryptedStringJson: string): string | null {
  let parsedPayload: any;
  try {
    parsedPayload = JSON.parse(encryptedStringJson);
  } catch (e) {
    // If parsing fails, it's not a JSON object.
    // It might be the unencrypted ID itself from a legacy state. Return it.
    console.warn("forceDecryptStringAES: Input is not JSON. Returning original value as fallback.", encryptedStringJson);
    return encryptedStringJson;
  }

  // If it parsed as JSON, it MUST have the iv and data structure.
  if (parsedPayload && typeof parsedPayload.iv === 'string' && typeof parsedPayload.data === 'string') {
    try {
      const iv = CryptoJS.enc.Base64.parse(parsedPayload.iv);
      const decrypted = CryptoJS.AES.decrypt(
        parsedPayload.data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        console.error("Force Decryption: Decrypted string is empty.");
        return null;
      }
      return decryptedString;
    } catch (decryptionError) {
      console.error("Force Decryption: Error during decryption process.", decryptionError);
      return null;
    }
  } else {
    // It was a JSON object but not the expected structure. Could be an unencrypted object or just wrong format.
    // Returning the original stringified JSON is not safe as it's not the decrypted ID. Best to return null.
    console.error("Force Decryption: Payload is JSON but does not match expected encrypted structure {iv, data}.", parsedPayload);
    return null;
  }
}
