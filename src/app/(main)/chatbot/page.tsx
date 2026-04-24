"use client";

import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { useTranslations } from '@/lib/translations';

export default function ChatbotPage() {
  const t = useTranslations();
  return (
    <div className="container mx-auto flex flex-col items-center py-3 sm:py-8">
      <h1 className="mb-3 text-center text-2xl font-bold text-primary sm:mb-8 sm:text-3xl">{t.chatbotTitle}</h1>
      <ChatInterface />
    </div>
  );
}
