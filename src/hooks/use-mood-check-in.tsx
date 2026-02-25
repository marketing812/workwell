"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import { triggerReminderAction } from '@/actions/trigger-reminder';

const MOOD_CHECKIN_KEY = 'workwell-mood-checkin-last-completed';
const CHECK_INTERVAL_MS = 1000 * 60 * 60; // Check every hour
const TWO_DAYS_MS = 1000 * 60 * 60 * 48; // 48 hours

interface MoodCheckInContextType {
  showPopup: boolean;
  forceOpen: () => void;
  closePopup: () => void;
}

const MoodCheckInContext = createContext<MoodCheckInContextType | undefined>(undefined);

export const MoodCheckInProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  const getTodayTimestamp = useCallback(() => {
    return new Date().getTime();
  }, []);

  const checkShouldShowPopup = useCallback(() => {
    console.log("useMoodCheckIn: Checking if popup should be shown...");
    try {
      const lastCompletedTimestamp = localStorage.getItem(MOOD_CHECKIN_KEY);
      if (!lastCompletedTimestamp) {
        console.log("useMoodCheckIn: No last completed timestamp found. Showing popup.");
        setShowPopup(true);
        return;
      }

      const timeSinceLastCheck = getTodayTimestamp() - parseInt(lastCompletedTimestamp, 10);
      console.log(`useMoodCheckIn: Time since last check-in: ${Math.round(timeSinceLastCheck / (1000 * 60 * 60))} hours.`);
      if (timeSinceLastCheck > TWO_DAYS_MS) {
        console.log("useMoodCheckIn: More than 48 hours passed. Showing popup.");
        setShowPopup(true);
      } else {
        console.log("useMoodCheckIn: Less than 48 hours passed. Not showing popup.");
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error checking mood check-in status:", error);
    }
  }, [getTodayTimestamp]);

  useEffect(() => {
    if (showPopup) {
      console.log("useMoodCheckIn: showPopup is true, triggering email reminder logic via server action.");
      const triggerEmailReminder = async () => {
        try {
          // Call the server action directly
          const result = await triggerReminderAction();
          if (!result.success) {
            console.error("useMoodCheckIn: triggerReminderAction failed.", result.message);
          } else {
            console.log("useMoodCheckIn: triggerReminderAction responded.", result.message);
          }
        } catch (error) {
          console.error("useMoodCheckIn: Error calling triggerReminderAction.", error);
        }
      };
  
      triggerEmailReminder();
    } else {
      console.log("useMoodCheckIn: showPopup is false, not triggering email reminder.");
    }
  }, [showPopup]);


  useEffect(() => {
    const initialTimer = setTimeout(() => {
      checkShouldShowPopup();
    }, 5000); // Check 5 seconds after app load

    const intervalId = setInterval(() => {
      checkShouldShowPopup();
    }, CHECK_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [checkShouldShowPopup]);

  const forceOpen = useCallback(() => {
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    try {
        localStorage.setItem(MOOD_CHECKIN_KEY, getTodayTimestamp().toString());
    } catch (error) {
        console.error("Error setting mood check-in as completed:", error);
    }
  }, [getTodayTimestamp]);

  const value = { showPopup, forceOpen, closePopup };

  return (
    <MoodCheckInContext.Provider value={value}>
      {children}
    </MoodCheckInContext.Provider>
  );
};

export function useMoodCheckIn(): MoodCheckInContextType {
  const context = useContext(MoodCheckInContext);
  if (context === undefined) {
    throw new Error('useMoodCheckIn must be used within a MoodCheckInProvider');
  }
  return context;
}
