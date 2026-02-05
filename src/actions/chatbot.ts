
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

export async function sendMessageToChatbot(
  userInput: { message: string; context?: string; userName?: string }
): Promise<ServerChatbotResult> {
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
    console.error("Error en sendMessageToChatbot:", error);
    // Provide a more user-friendly but still informative error
    const userFriendlyError = "Lo siento, he tenido un problema al procesar tu solicitud. Puede ser un fallo temporal de conexión. Por favor, inténtalo de nuevo en un momento.";
    
    return { success: false, error: userFriendlyError };
  }
}
