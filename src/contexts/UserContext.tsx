
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client"; // Import directly from client
import { clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';

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
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  updateUser: (updatedData: Partial<Omit<User, 'id' | 'email'>>) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userProfile: User = {
              id: fbUser.uid,
              email: fbUser.email,
              name: data.name || 'Usuario',
              ageRange: data.ageRange,
              gender: data.gender,
              initialEmotionalState: data.initialEmotionalState,
            };
            setUser(userProfile);
          } else {
             // If user exists in auth but not firestore, create a basic profile
             const userProfile: User = {
                id: fbUser.uid,
                email: fbUser.email,
                name: fbUser.displayName || 'Usuario',
             };
             setUser(userProfile);
             console.warn(`No Firestore document for user ${fbUser.uid}, created basic profile.`);
          }
        } catch (error) {
          console.error("Error fetching user document from Firestore:", error);
          // Fallback to a minimal user object to prevent app crash
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: 'Usuario',
          });
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      // Clear all local data on logout
      clearAllEmotionalEntries();
      clearAllNotebookEntries();
      clearAssessmentHistory();
      localStorage.removeItem('workwell-active-path-details');
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Omit<User, 'id' | 'email'>>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    try {
      await setDoc(doc(db, "users", user.id), updatedData, { merge: true });
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      // Optional: revert state or show toast
    }
  }, [user]);

  const contextValue = { user, firebaseUser, loading, updateUser, logout };

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
