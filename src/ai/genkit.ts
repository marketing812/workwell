import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

// Al inicializar el plugin sin una apiKey, Genkit intentará usar las 
// credenciales del entorno de aplicación (Application Default Credentials),
// que es el método de autenticación correcto (OAuth2) para este servidor.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
