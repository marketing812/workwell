import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

console.log("[genkit] GEMINI_API_KEY set?", Boolean(process.env.GEMINI_API_KEY));

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY! })],
});