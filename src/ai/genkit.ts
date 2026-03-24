import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY/GOOGLE_API_KEY is not set at import time. AI flows may fail at runtime if not configured.");
}

export const ai = genkit({
  plugins: [
    googleAI(
      apiKey
        ? {
            apiKey, // Explicit API key when available.
          }
        : {}
    ),
  ],
});
