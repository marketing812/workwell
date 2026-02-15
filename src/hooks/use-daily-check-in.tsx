
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import type { DailyQuestion } from '@/types/daily-question';
import { useUser } from '@/contexts/UserContext';
import { getDailyQuestion, DailyQuestionApiResponse } from '@/data/dailyQuestion';
import { useToast } from '@/hooks/use-toast';

const DAILY_CHECKIN_COMPLETED_KEY = 'workwell-daily-checkin-answered-ids';
const CHECK_INTERVAL_MS = 1000 * 60 * 30; // Check every 30 minutes

interface DailyCheckInData extends Array<string> {}

interface DailyCheckInContextType {
  unansweredQuestions: DailyQuestion[];
  forceOpen: () => void;
  closePopup: (questionId: string) => void;
  showPopup: boolean;
  dismissPopup: () => void;
}

const DailyCheckInContext = createContext<DailyCheckInContextType | undefined>(undefined);

export const DailyCheckInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [unansweredQuestions, setUnansweredQuestions] = useState<DailyQuestion[]>([]);
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const [wasDismissedThisSession, setWasDismissedThisSession] = useState(false);

  const loadAndFilterQuestions = useCallback(async (): Promise<DailyQuestion[]> => {
    if (!user?.id) {
      setUnansweredQuestions([]);
      return [];
    }

    const apiResponse: DailyQuestionApiResponse | null = await getDailyQuestion(user.id);
    
    if (!apiResponse || !Array.isArray(apiResponse.questions) || apiResponse.questions.length === 0) {
      setUnansweredQuestions([]);
      return [];
    }
    
    const allQuestionsOrdered = apiResponse.questions;

    try {
      const storedData = localStorage.getItem(DAILY_CHECKIN_COMPLETED_KEY);
      const answeredIds: DailyCheckInData = storedData ? JSON.parse(storedData) : [];
      
      const nextUnansweredQuestion = allQuestionsOrdered.find(q => !answeredIds.includes(q.id));

      if (nextUnansweredQuestion) {
        setUnansweredQuestions([nextUnansweredQuestion]);
        return [nextUnansweredQuestion];
      } else {
        // All questions have been answered, reset the cycle.
        console.log("useDailyCheckIn: All questions answered. Resetting progress for next cycle.");
        localStorage.removeItem(DAILY_CHECKIN_COMPLETED_KEY);
        // The first question of the new cycle is the first one from the API.
        if (allQuestionsOrdered.length > 0) {
          setUnansweredQuestions([allQuestionsOrdered[0]]);
          return [allQuestionsOrdered[0]];
        }
        setUnansweredQuestions([]);
        return [];
      }

    } catch (error) {
      console.error("Error processing daily questions:", error);
      setUnansweredQuestions(allQuestionsOrdered.length > 0 ? [allQuestionsOrdered[0]] : []); // Fallback
      return allQuestionsOrdered.length > 0 ? [allQuestionsOrdered[0]] : [];
    }
  }, [user?.id]);
  
  useEffect(() => {
    const initialTimer = setTimeout(() => {
        loadAndFilterQuestions();
    }, 5000);

    const intervalId = setInterval(() => {
        setWasDismissedThisSession(false); // Periodically reset dismissal
        loadAndFilterQuestions();
    }, CHECK_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [loadAndFilterQuestions]);
  

  const forceOpen = useCallback(async () => {
    const questions = await loadAndFilterQuestions();
    if (questions.length > 0) {
      setWasDismissedThisSession(false);
      setIsForcedOpen(true);
    } else {
      toast({
        title: "¡Todo listo por hoy!",
        description: "Ya has respondido a todas las preguntas diarias. ¡Gracias por tu participación!",
      });
      setIsForcedOpen(false);
    }
  }, [loadAndFilterQuestions, toast]);
  
  const dismissPopup = useCallback(() => {
    setIsForcedOpen(false);
    setWasDismissedThisSession(true);
  }, []);

  const closePopup = useCallback((questionId: string) => {
    setIsForcedOpen(false);
    setWasDismissedThisSession(false);
    setUnansweredQuestions(prev => prev.filter(q => q.id !== questionId));
    
    try {
      const storedData = localStorage.getItem(DAILY_CHECKIN_COMPLETED_KEY);
      const answeredIds: DailyCheckInData = storedData ? JSON.parse(storedData) : [];
      
      if (!answeredIds.includes(questionId)) {
        answeredIds.push(questionId);
      }
      
      localStorage.setItem(DAILY_CHECKIN_COMPLETED_KEY, JSON.stringify(answeredIds));

      // Immediately check for the next question to update the state
      loadAndFilterQuestions();

    } catch (error) {
        console.error("Error setting daily check-in as completed:", error);
    }
  }, [loadAndFilterQuestions]);

  const showPopup = isForcedOpen || (unansweredQuestions.length > 0 && !wasDismissedThisSession);

  const contextValue = { 
    unansweredQuestions, 
    forceOpen, 
    closePopup,
    showPopup,
    dismissPopup
  };

  return (
    <DailyCheckInContext.Provider value={contextValue}>
      {children}
    </DailyCheckInContext.Provider>
  );
};

export function useDailyCheckIn(): DailyCheckInContextType {
  const context = useContext(DailyCheckInContext);
  if (context === undefined) {
    throw new Error('useDailyCheckIn must be used within a DailyCheckInProvider');
  }
  return context;
}
