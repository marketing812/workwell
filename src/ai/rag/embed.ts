import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";

// Modelo de embeddings de texto
const embedder = googleAI.embedder("text-embedding-004");

export async function embedText(text: string): Promise<number[]> {
  const res = await ai.embed({
    embedder,
    content: text,
  });

  const vec = res?.[0]?.embedding;
  if (!vec || !Array.isArray(vec)) throw new Error("Embedding vacío");
  return vec;
}
