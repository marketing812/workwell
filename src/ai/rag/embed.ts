import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";

export async function embedText(text: string): Promise<number[]> {
  const embedder = googleAI.embedder("text-embedding-004");

  const res = await ai.embed({
    embedder,
    content: text,
  });

  const vec = res?.[0]?.embedding;
  if (!vec || !Array.isArray(vec)) throw new Error("Embedding vacío");
  return vec;
}
