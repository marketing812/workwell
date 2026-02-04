
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import { sendEmail } from '@/actions/email';

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
    try {
      const lastCompletedTimestamp = localStorage.getItem(MOOD_CHECKIN_KEY);
      if (!lastCompletedTimestamp) {
        // If never completed, show it.
        setShowPopup(true);
        return;
      }

      const timeSinceLastCheck = getTodayTimestamp() - parseInt(lastCompletedTimestamp, 10);
      if (timeSinceLastCheck > TWO_DAYS_MS) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error checking mood check-in status:", error);
    }
  }, [getTodayTimestamp]);

  useEffect(() => {
    if (showPopup) {
      const triggerEmailReminder = async () => {
        try {
          const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
          const API_KEY = "4463";
          const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getavisoemail`;

          console.log("Fetching email reminder notice...");
          const response = await fetch(url, { cache: 'no-store' });

          if (response.ok) {
            const result = await response.json();
            if (result.status === 'OK' && result.message && result.data) {
              console.log(`Received OK status. Sending email to ${result.message}`);
              await sendEmail({
                to: result.message,
                subject: "Recordatorio de EMOTIVA",
                body: result.data,
              });
            } else {
              console.warn("getavisoemail responded OK, but with unexpected data:", result);
            }
          } else {
            const errorText = await response.text();
            console.error("Failed to fetch getavisoemail:", response.status, errorText);
          }
        } catch (error) {
          console.error("Error in getavisoemail logic:", error);
        }
      };

      triggerEmailReminder();
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
