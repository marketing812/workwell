import { config } from 'dotenv';
config(); // Carga las variables de entorno desde el archivo .env

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY! }),
  ],
});