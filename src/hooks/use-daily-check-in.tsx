
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import type { DailyQuestion } from '@/types/daily-question';
import { useUser } from '@/contexts/UserContext';
import { getDailyQuestion, DailyQuestionApiResponse } from '@/data/dailyQuestion';
import { useToast } from '@/hooks/use-toast';

const DAILY_CHECKIN_COMPLETED_KEY_PREFIX = 'workwell-daily-checkin-answered-ids-v2-';
const DAILY_CHECKIN_CYCLE_COMPLETED_KEY_PREFIX = 'workwell-daily-checkin-cycle-completed-v1-';
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours
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
  
  const getStorageKey = useCallback(() => {
    return user?.id ? `${DAILY_CHECKIN_COMPLETED_KEY_PREFIX}${user.id}` : null;
  }, [user?.id]);


  const loadAndFilterQuestions = useCallback(async (): Promise<DailyQuestion[]> => {
    const storageKey = getStorageKey();
    const cycleCompletedKey = user?.id ? `${DAILY_CHECKIN_CYCLE_COMPLETED_KEY_PREFIX}${user.id}` : null;

    if (!user?.id || !storageKey || !cycleCompletedKey) {
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
      const cycleCompletedTimestamp = localStorage.getItem(cycleCompletedKey);
      const now = new Date().getTime();
      
      if (cycleCompletedTimestamp && (now - parseInt(cycleCompletedTimestamp, 10) > ONE_DAY_MS)) {
        console.log("useDailyCheckIn: More than 24 hours passed since cycle completion. Resetting for new cycle.");
        localStorage.removeItem(storageKey);
        localStorage.removeItem(cycleCompletedKey);
      }

      const storedData = localStorage.getItem(storageKey);
      const answeredIds: DailyCheckInData = storedData ? JSON.parse(storedData) : [];
      
      const nextUnansweredQuestion = allQuestionsOrdered.find(q => !answeredIds.includes(q.id));

      if (nextUnansweredQuestion) {
        setUnansweredQuestions([nextUnansweredQuestion]);
        return [nextUnansweredQuestion];
      } else {
        // All questions are answered for this cycle.
        if (!localStorage.getItem(cycleCompletedKey)) {
             console.log("useDailyCheckIn: All questions answered for this cycle. Marking as complete.");
             localStorage.setItem(cycleCompletedKey, now.toString());
        }
        setUnansweredQuestions([]);
        return [];
      }

    } catch (error) {
      console.error("Error processing daily questions:", error);
      // Fallback in case of error: show first question if not answered, otherwise empty.
      const storedData = localStorage.getItem(storageKey);
      const answeredIds: DailyCheckInData = storedData ? JSON.parse(storedData) : [];
      if (allQuestionsOrdered.length > 0) {
        const firstQuestion = allQuestionsOrdered[0];
        if (firstQuestion && !answeredIds.includes(firstQuestion.id)) {
            setUnansweredQuestions([firstQuestion]);
            return [firstQuestion];
        }
      }
      setUnansweredQuestions([]);
      return [];
    }
  }, [user?.id, getStorageKey]);
  
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
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    // Close popup and mark as dismissed for this session
    setIsForcedOpen(false);
    setWasDismissedThisSession(true); 
    setUnansweredQuestions([]);
    
    try {
      const storedData = localStorage.getItem(storageKey);
      const answeredIds: DailyCheckInData = storedData ? JSON.parse(storedData) : [];
      
      if (!answeredIds.includes(questionId)) {
        answeredIds.push(questionId);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(answeredIds));
      
      // Do NOT call loadAndFilterQuestions() here. Let the interval handle the next check.
      
    } catch (error) {
        console.error("Error setting daily check-in as completed:", error);
    }
  }, [getStorageKey]);

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
