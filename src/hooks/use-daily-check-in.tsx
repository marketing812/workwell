
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import type { DailyQuestion } from '@/types/daily-question';
import { useUser } from '@/contexts/UserContext';
import { getDailyQuestion, DailyQuestionApiResponse } from '@/data/dailyQuestion';

const DAILY_CHECKIN_COMPLETED_KEY = 'workwell-daily-checkin-completed';
const CHECK_INTERVAL_MS = 1000 * 60 * 30; // Check every 30 minutes

interface DailyCheckInData {
  [date: string]: string[]; // date (YYYY-MM-DD) -> array of answered question IDs
}

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
  const [unansweredQuestions, setUnansweredQuestions] = useState<DailyQuestion[]>([]);
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const [wasDismissedThisSession, setWasDismissedThisSession] = useState(false);
  
  const getTodayKey = useCallback(() => new Date().toISOString().split('T')[0], []);

  const loadAndFilterQuestions = useCallback(async () => {
    if (!user?.id) {
      setUnansweredQuestions([]);
      return;
    }

    const apiResponse: DailyQuestionApiResponse | null = await getDailyQuestion(user.id);
    
    if (!apiResponse || !Array.isArray(apiResponse.questions) || apiResponse.questions.length === 0) {
      setUnansweredQuestions([]);
      return;
    }
    
    const allQuestions = apiResponse.questions;

    try {
      const storedData = localStorage.getItem(DAILY_CHECKIN_COMPLETED_KEY);
      const completedData: DailyCheckInData = storedData ? JSON.parse(storedData) : {};
      const todayKey = getTodayKey();
      const answeredToday = completedData[todayKey] || [];
      
      const filteredQuestions = allQuestions.filter(q => !answeredToday.includes(q.id));
      
      // Shuffle the array to show a random question first, if multiple are available
      const shuffledQuestions = [...filteredQuestions].sort(() => 0.5 - Math.random());
      
      setUnansweredQuestions(shuffledQuestions);

    } catch (error) {
      console.error("Error processing daily questions:", error);
      setUnansweredQuestions(allQuestions);
    }
  }, [user?.id, getTodayKey]);
  
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
  

  const forceOpen = useCallback(() => {
    loadAndFilterQuestions(); // Reload questions on force open
    setWasDismissedThisSession(false); // If user forces it, it's not dismissed
    setIsForcedOpen(true);
  }, [loadAndFilterQuestions]);
  
  const dismissPopup = useCallback(() => {
    setIsForcedOpen(false);
    setWasDismissedThisSession(true);
  }, []);

  const closePopup = useCallback((questionId: string) => {
    setIsForcedOpen(false);
    setWasDismissedThisSession(false);
    setUnansweredQuestions(prev => prev.filter(q => q.id !== questionId));
    
    try {
      const todayKey = getTodayKey();
      const storedData = localStorage.getItem(DAILY_CHECKIN_COMPLETED_KEY);
      const completedData: DailyCheckInData = storedData ? JSON.parse(storedData) : {};
      
      const answeredToday = completedData[todayKey] || [];
      if (!answeredToday.includes(questionId)) {
        answeredToday.push(questionId);
      }
      
      completedData[todayKey] = answeredToday;

      localStorage.setItem(DAILY_CHECKIN_COMPLETED_KEY, JSON.stringify(completedData));
    } catch (error) {
        console.error("Error setting daily check-in as completed:", error);
    }
  }, [getTodayKey]);

  // Determine if the popup should be shown
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
