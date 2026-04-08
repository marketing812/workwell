"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from '@/lib/translations';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { renderSimpleMarkdown } from '@/lib/chatFormatting';
import { trackUserAnalyticsEvent } from '@/lib/analytics/user-analytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type ServerChatbotResult =
  | { success: true; data: { response: string } }
  | { success: false; error: string };

export function ChatInterface() {
  const t = useTranslations();
  const { user: currentUser } = useUser();
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>(crypto.randomUUID());
  const userMessageCountRef = useRef<number>(0);
  const assistantMessageCountRef = useRef<number>(0);
  const sessionStartedRef = useRef<boolean>(false);

  useEffect(() => {
    sessionStartedRef.current = false;
    conversationIdRef.current = crypto.randomUUID();
    userMessageCountRef.current = 0;
    assistantMessageCountRef.current = 0;
  }, [currentUser?.id]);

  useEffect(() => {
    // Add initial welcome message from bot.
    // This effect runs only once after the component mounts due to the empty dependency array [].
    // It uses a functional update for setMessages to safely update based on the previous state.
    setMessages((prevMessages) => {
      // Only add the welcome message if the messages array is currently empty.
      if (prevMessages.length === 0) {
        return [
          {
            id: crypto.randomUUID(), // Generates a unique ID for the message
            text: t.chatbotWelcome,   // Uses a stable translation string
            sender: 'bot',
            timestamp: new Date(),    // Timestamp for the message
          },
        ];
      }
      // If messages already exist (e.g., from a previous state or HMR), do not modify them.
      return prevMessages;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only ONCE after initial mount.

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]); // This effect depends on the 'messages' state.

  useEffect(() => {
    if (!currentUser?.id || sessionStartedRef.current) {
      return;
    }

    sessionStartedRef.current = true;
    trackUserAnalyticsEvent({
        userId: currentUser.id,
      category: 'chat',
      eventName: 'chat_session_started',
      payload: {
        pagePath: pathname,
        chatChannel: 'mentor_ia',
        conversationId: conversationIdRef.current,
      },
    });

    return () => {
      trackUserAnalyticsEvent({
        userId: currentUser.id,
        category: 'chat',
        eventName: 'chat_session_ended',
        payload: {
          pagePath: pathname,
          chatChannel: 'mentor_ia',
          conversationId: conversationIdRef.current,
          userMessageCount: userMessageCountRef.current,
          assistantMessageCount: assistantMessageCountRef.current,
        },
      });
    };
  }, [currentUser?.id, pathname]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    const requestStartedAt = performance.now();
    userMessageCountRef.current += 1;

    if (currentUser?.id) {
      trackUserAnalyticsEvent({
        userId: currentUser.id,
        category: 'chat',
        eventName: 'chat_user_message_sent',
        payload: {
          pagePath: pathname,
          chatChannel: 'mentor_ia',
          conversationId: conversationIdRef.current,
          messageLength: userMessage.text.length,
          messageIndex: userMessageCountRef.current,
        },
      });
    }

    const context = messages
      .slice(-5)
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
      .join('\n');

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
    let result: ServerChatbotResult;
    try {
      const response = await fetch(`${base}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          context,
          userName: currentUser?.name || undefined,
        }),
      });
      const json = await response.json();
      result = response.ok ? json : { success: false, error: json.error || `HTTP ${response.status}` };
    } catch (error: any) {
      result = { success: false, error: error?.message || 'Error conectando con el chatbot.' };
    }

    setIsLoading(false);
    if (result.success) {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: result.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      assistantMessageCountRef.current += 1;

      if (currentUser?.id) {
        trackUserAnalyticsEvent({
        userId: currentUser.id,
          category: 'chat',
          eventName: 'chat_ai_response_received',
          payload: {
            pagePath: pathname,
            chatChannel: 'mentor_ia',
            conversationId: conversationIdRef.current,
            responseLength: botMessage.text.length,
            responseIndex: assistantMessageCountRef.current,
            latencyMs: Math.round(performance.now() - requestStartedAt),
          },
        });
      }
    } else {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: result.error,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      if (currentUser?.id) {
        trackUserAnalyticsEvent({
        userId: currentUser.id,
          category: 'chat',
          eventName: 'chat_ai_response_failed',
          payload: {
            pagePath: pathname,
            chatChannel: 'mentor_ia',
            conversationId: conversationIdRef.current,
            errorMessage: result.error?.slice(0, 250),
            latencyMs: Math.round(performance.now() - requestStartedAt),
          },
        });
      }
    }
  };
  
  const userInitials = currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : "US";
  const userAvatarSrc = `https://placehold.co/100x100.png?text=${userInitials}`;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] w-full max-w-2xl mx-auto bg-card shadow-xl rounded-lg">
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 max-w-[85%]",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender === 'user' ? userAvatarSrc : `https://placehold.co/100x100.png?text=AI`} data-ai-hint={msg.sender === 'user' ? 'user avatar' : 'chatbot avatar'}/>
              <AvatarFallback>
                {msg.sender === 'user' ? <User className="h-4 w-4"/> : <Bot className="h-4 w-4"/>}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-3 rounded-lg shadow",
                msg.sender === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              )}
            >
              <p className="text-sm whitespace-pre-line">
                {msg.sender === 'bot' ? renderSimpleMarkdown(msg.text) : msg.text}
              </p>
              <p className={cn(
                  "text-xs mt-1",
                  msg.sender === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                )}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 mr-auto">
             <Avatar className="h-8 w-8">
               <AvatarImage src={`https://placehold.co/100x100.png?text=AI`} data-ai-hint="chatbot avatar" />
               <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg shadow bg-muted text-foreground rounded-tl-none">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.chatbotInputPlaceholder}
          className="flex-grow"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}



