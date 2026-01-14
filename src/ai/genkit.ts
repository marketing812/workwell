import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

console.log("[genkit] GEMINI_API_KEY set?", Boolean(process.env.GEMINI_API_KEY));

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});