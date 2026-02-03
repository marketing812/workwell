
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
}

const DailyCheckInContext = createContext<DailyCheckInContextType | undefined>(undefined);

export const DailyCheckInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [unansweredQuestions, setUnansweredQuestions] = useState<DailyQuestion[]>([]);
  const [isPopupForced, setIsPopupForced] = useState(false);
  
  const getTodayKey = useCallback(() => new Date().toISOString().split('T')[0], []);

  const loadAndFilterQuestions = useCallback(async () => {
    if (!user?.id) {
      setUnansweredQuestions([]);
      return;
    }

    const apiResponse: DailyQuestionApiResponse | null = await getDailyQuestion();
    
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
      setUnansweredQuestions(filteredQuestions);

    } catch (error) {
      console.error("Error processing daily questions:", error);
      setUnansweredQuestions(allQuestions); // Fallback to show all if storage fails
    }
  }, [user?.id, getTodayKey]);
  
  // Initial load and periodic check
  useEffect(() => {
    const initialTimer = setTimeout(() => {
        loadAndFilterQuestions();
    }, 5000); // Wait 5 seconds after app load

    const intervalId = setInterval(() => {
        loadAndFilterQuestions();
    }, CHECK_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [loadAndFilterQuestions]);
  

  const forceOpen = useCallback(() => {
    setIsPopupForced(true);
    loadAndFilterQuestions(); // Recargar preguntas al forzar la apertura
  }, [loadAndFilterQuestions]);

  const closePopup = useCallback((questionId: string) => {
    // Optimistically remove the question from the local state
    setUnansweredQuestions(prev => prev.filter(q => q.id !== questionId));
    setIsPopupForced(false); // Reset forced state

    // Persist the completion in localStorage
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

  const showPopup = isPopupForced || unansweredQuestions.length > 0;

  const contextValue = { 
    unansweredQuestions, 
    forceOpen, 
    closePopup,
    // The component needs to know if it should show, which depends on state
    // We'll manage the visibility in the manager component that consumes this
    showPopup
  };

  // This is a simplified context just to expose the functions
  const valueForProvider = { unansweredQuestions, forceOpen, closePopup };

  return (
    <DailyCheckInContext.Provider value={valueForProvider}>
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
