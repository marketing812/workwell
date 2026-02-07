'use server';

import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";

const embedder = googleAI.embedder("gemini-embedding-001");

export async function embedText(text: string): Promise<number[]> {
  const res: any = await ai.embed({
    embedder,
    content: text,
     options: { outputDimensionality: 768 }, // o 1536, o 2048
  });

  // Soporta ambos formatos:
  // A) [{ embedding: number[] }]
  // B) { embedding: number[] }
  const vec =
    Array.isArray(res) ? res?.[0]?.embedding : res?.embedding;
//console.log("QUERY EMBEDDING DIM:", vec.length);
  if (!vec || !Array.isArray(vec) || vec.length === 0) {
    console.error("Embedding inválido:", res);
    throw new Error("Embedding vacío o inválido");
  }

  return vec as number[];
}
