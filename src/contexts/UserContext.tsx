
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from '@/firebase/provider';
import { clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { useRouter } from 'next/navigation';

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
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) {
        setLoading(true); // Keep loading if firebase services are not ready
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let userProfile: User;

          if (userDoc.exists()) {
            const data = userDoc.data();
            userProfile = {
              id: fbUser.uid,
              email: fbUser.email,
              name: data.name || fbUser.displayName || 'Usuario',
              ageRange: data.ageRange,
              gender: data.gender,
              initialEmotionalState: data.initialEmotionalState,
            };
          } else {
            // Create a new user document if it doesn't exist
            userProfile = {
              id: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName || 'Usuario',
            };
            await setDoc(userDocRef, {
              email: fbUser.email,
              name: userProfile.name,
              createdAt: new Date().toISOString(),
            }, { merge: true });
          }
          
          setUser(userProfile);

        } catch (error) {
          console.error("Error fetching or creating user document from Firestore:", error);
          // Fallback to a minimal user object to prevent app crash
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || 'Usuario',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);


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
        if (prevUser) {
            const newUser = { ...prevUser, ...updatedData };
            // Here you would also save the updated user to your backend/localStorage
            return newUser;
        }
        return null;
    });
    // Add backend saving logic here if necessary
    return Promise.resolve();
  }, []);

  const contextValue = { user, setUser, loading, setLoading, logout, updateUser };

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
