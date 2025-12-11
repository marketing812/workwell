
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { clearAllEmotionalEntries, overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries, overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { fetchUserActivities, fetchNotebookEntries } from '@/actions/user-data';

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

  const fetchAndSetUserData = useCallback(async (fbUser: FirebaseUser) => {
    setFirebaseUser(fbUser);
    const userDoc = await getDoc(doc(db, "users", fbUser.uid));
    let userProfile: User;
    if (userDoc.exists()) {
      const data = userDoc.data();
      userProfile = {
        id: fbUser.uid,
        email: fbUser.email,
        name: data.name,
        ageRange: data.ageRange,
        gender: data.gender,
        initialEmotionalState: data.initialEmotionalState,
      };
    } else {
      userProfile = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Usuario',
      };
    }
    setUser(userProfile);

    // After setting user, fetch their data
    const [activitiesResult, notebookResult] = await Promise.all([
      fetchUserActivities(fbUser.uid),
      fetchNotebookEntries(fbUser.uid)
    ]);
    
    if (activitiesResult.success && activitiesResult.entries) {
      overwriteEmotionalEntries(activitiesResult.entries);
    } else {
      clearAllEmotionalEntries();
    }
    if (notebookResult.success && notebookResult.entries) {
      overwriteNotebookEntries(notebookResult.entries);
    } else {
      clearAllNotebookEntries();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await fetchAndSetUserData(fbUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchAndSetUserData]);

  const login = useCallback(async (loginData: LoginContextPayload) => {
    const fbUser = auth.currentUser;
    if (fbUser && fbUser.uid === loginData.user.id) {
       await fetchAndSetUserData(fbUser);
    }
    // The onAuthStateChanged listener handles setting user state, so this function is mainly for compatibility.
  }, [fetchAndSetUserData]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    clearAllEmotionalEntries();
    clearAllNotebookEntries();
    clearAssessmentHistory();
    localStorage.removeItem('workwell-active-path-details');
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
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    try {
      await setDoc(doc(db, "users", user.id), updatedData, { merge: true });
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
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
