import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: '' }), // Forzar el uso de ADC en el entorno de App Hosting
  ],
  model: 'googleai/gemini-2.0-flash',
});
