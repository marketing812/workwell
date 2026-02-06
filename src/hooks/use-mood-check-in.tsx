"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import { sendReminderEmailByUserId } from '@/actions/email';

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
      console.log("useMoodCheckIn: showPopup is true, triggering email reminder logic.");
      const triggerEmailReminder = async () => {
        try {
          const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
          const API_KEY = "4463";
          const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getavisoemail`;

          console.log("useMoodCheckIn: Fetching email reminder notice from external API...");
          const response = await fetch(url, { cache: 'no-store' });

          if (response.ok) {
            console.log("useMoodCheckIn: API call successful (response.ok). Parsing JSON...");
            const result = await response.json();
            console.log("useMoodCheckIn: API response parsed:", result);
            if (result.status === 'OK' && result.message && result.data) {
              const userId = result.message;
              console.log(`useMoodCheckIn: API status is OK. Triggering email send for userId: ${userId}`);

              const body =
  typeof result.data === 'string'
    ? result.data
    : JSON.stringify(result.data);
try {
  console.log('ANTES server action', { userId, t: typeof result.data });
 

  const res = await sendReminderEmailByUserId(userId, body);
  console.log('DESPUÉS server action', res);
} catch (error: any) {
  console.error(`[sendReminderEmailByUserId] Error processing reminder for userId ${userId}:`, error);

  const msg =
    error?.message ||
    error?.toString?.() ||
    'Unknown error';

  return { success: false, error: msg };
}

            } else {
              console.warn("useMoodCheckIn: getavisoemail responded OK, but with unexpected data:", result);
            }
          } else {
            const errorText = await response.text();
            console.error("useMoodCheckIn: Failed to fetch getavisoemail. Status:", response.status, "Response text:", errorText);
          }
        } catch (error) {
          console.error("useMoodCheckIn: Error in triggerEmailReminder logic:", error);
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
