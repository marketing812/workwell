
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth } from '@/firebase/provider';
import { clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { useRouter } from 'next/navigation';
import { getUserProfile, saveUserProfile } from '@/actions/auth';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth) {
        setLoading(true);
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // First, set a minimal user to stop the main loader
        const minimalUser = {
          id: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || 'Usuario',
        };
        setUser(minimalUser);
        setLoading(false); // App is usable with basic auth info

        // Then, fetch the full profile in the background
        try {
          let userProfile = await getUserProfile(fbUser.uid);
          
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Profile doesn't exist in Firestore, create it
            const newUserProfile: User = {
              id: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName || 'Usuario',
            };
            await saveUserProfile(newUserProfile as any);
            setUser(newUserProfile);
          }
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          // Keep the minimal user if profile fetch fails
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = useCallback(async () => {
    if (!auth) {
        console.error("Logout failed: auth instance is not available.");
        return;
    }
    try {
      await signOut(auth);
      setUser(null);
      clearAllEmotionalEntries();
      clearAllNotebookEntries();
      clearAssessmentHistory();
      localStorage.removeItem('workwell-active-path-details');
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router, auth]);

 const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newUser = { ...prevUser, ...updatedData };
        // Save to backend
        saveUserProfile(newUser as any);
        return newUser;
    });
  }, []);

  // Removed the explicit `setUser` from context value to enforce updates via `updateUser`
  const contextValue = { user, loading, logout, updateUser };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
