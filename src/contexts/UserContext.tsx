
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebase } from '@/firebase/config';
import type { EmotionalEntry } from '@/data/emotionalEntriesStore';
import { clearAllEmotionalEntries, overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import type { NotebookEntry } from '@/data/therapeuticNotebookStore';
import { clearAllNotebookEntries, overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  ageRange?: string | null;
  gender?: string | null;
  initialEmotionalState?: number | null;
}

interface LoginContextPayload {
  user: User;
  emotionalEntries?: EmotionalEntry[] | null;
  notebookEntries?: NotebookEntry[] | null; 
}

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (loginData: LoginContextPayload) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { auth, db } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          const userProfile = userDoc.data();
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: userProfile.name,
            ageRange: userProfile.ageRange,
            gender: userProfile.gender,
            initialEmotionalState: userProfile.initialEmotionalState,
          });
        } else {
            // Profile doesn't exist, maybe it's being created.
            // For now, we can set a minimal user object.
             setUser({
                id: fbUser.uid,
                email: fbUser.email,
                name: fbUser.displayName || 'Usuario',
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

  const login = useCallback((loginData: LoginContextPayload) => {
    setUser(loginData.user);
    if (loginData.emotionalEntries) {
      overwriteEmotionalEntries(loginData.emotionalEntries);
    }
    if (loginData.notebookEntries) {
      overwriteNotebookEntries(loginData.notebookEntries);
    }
    // No es necesario llamar a setLoading(false) aquí porque onAuthStateChanged se encargará.
  }, []);

  const logout = useCallback(async () => {
    const { auth } = getFirebase();
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    // Clear all local data on logout
    clearAllEmotionalEntries();
    clearAllNotebookEntries();
    clearAssessmentHistory();
    localStorage.removeItem('workwell-active-path-details');
    // Consider a more robust way to clear all progress
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('workwell-progress-')) {
        localStorage.removeItem(key);
      }
    }
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (!user) return;
    const { db } = getFirebase();
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    try {
      await setDoc(doc(db, "users", user.id), updatedData, { merge: true });
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      // Optionally revert state or show error
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, firebaseUser, login, logout, loading, updateUser }}>
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
