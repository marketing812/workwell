"use server";

import {
  emotionalChatbot,
  type EmotionalChatbotInput,
  type EmotionalChatbotOutput,
} from "@/ai/flows/emotional-chatbot";
import { z } from "zod";

const chatbotMessageSchema = z.object({
  message: z.string().min(1, "El mensaje no puede estar vacío."),
  context: z.string().optional(),
  userName: z.string().optional(),
});

export type ServerChatbotResult =
  | { success: true; data: EmotionalChatbotOutput }
  | { success: false; error: string };

function buildEnvDebug() {
  return {
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    keyUsed: process.env.GEMINI_API_KEY
      ? "GEMINI_API_KEY"
      : process.env.GOOGLE_API_KEY
      ? "GOOGLE_API_KEY"
      : null,
    googleGenaiUseVertex: process.env.GOOGLE_GENAI_USE_VERTEXAI ?? null,
    hasAdc: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),

    // Estos 3 suelen empujar a “modo Vertex/OAuth” sin querer
    googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT ?? null,
    gcloudProject: process.env.GCLOUD_PROJECT ?? null,
    googleCloudLocation: process.env.GOOGLE_CLOUD_LOCATION ?? null,

    nodeEnv: process.env.NODE_ENV ?? null,
  };
}

export async function sendMessageToChatbot(
  userInput: { message: string; context?: string; userName?: string }
): Promise<ServerChatbotResult> {
  const envDebug = buildEnvDebug();

  try {
    const validatedInput = chatbotMessageSchema.parse(userInput);

    const input: EmotionalChatbotInput = {
      message: validatedInput.message,
      context: validatedInput.context,
      userName: validatedInput.userName,
    };

    const result = await emotionalChatbot(input);

    if (!result || !result.response) {
      throw new Error("Respuesta incompleta del chatbot IA.");
    }

    return { success: true, data: result };
  } catch (error) {
    // Log the detailed error for debugging on the server
    console.error("sendMessageToChatbot error:", error, "ENV_DEBUG:", JSON.stringify(envDebug));
    
    // Return a generic, user-friendly message as requested.
    return { success: false, error: "Lo sentimos, ocurrió un error. Por favor, inténtalo de nuevo." };
  }
}
