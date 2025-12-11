"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import { clearAllEmotionalEntries, overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries, overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { fetchUserActivities, fetchNotebookEntries } from "@/actions/user-data";
import type { EmotionalEntry } from '@/data/emotionalEntriesStore';
import type { NotebookEntry } from '@/data/therapeuticNotebookStore';

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
  setUserAndData: (data: { user: User, emotionalEntries?: EmotionalEntry[] | null, notebookEntries?: NotebookEntry[] | null }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { auth, db } = useFirebase();

  const setUserAndData = useCallback(({ user, emotionalEntries, notebookEntries }: { user: User, emotionalEntries?: EmotionalEntry[] | null, notebookEntries?: NotebookEntry[] | null }) => {
    setUser(user);
    if (emotionalEntries) {
      overwriteEmotionalEntries(emotionalEntries);
    }
    if (notebookEntries) {
      overwriteNotebookEntries(notebookEntries);
    }
  }, []);

  const fetchAndSetUserData = useCallback(async (fbUser: FirebaseUser) => {
    if (!db) {
      console.warn("Firestore instance not ready in fetchAndSetUserData");
      setLoading(false);
      return;
    }
    setFirebaseUser(fbUser);
    const userDocRef = doc(db, "users", fbUser.uid);
    
    try {
      const userDoc = await getDoc(userDocRef);
      let userProfile: User;

      if (userDoc.exists()) {
        const data = userDoc.data();
        userProfile = {
          id: fbUser.uid,
          email: fbUser.email,
          name: data.name || 'Usuario',
          ageRange: data.ageRange,
          gender: data.gender,
          initialEmotionalState: data.initialEmotionalState,
        };
        
        const [activitiesResult, notebookResult] = await Promise.all([
          fetchUserActivities(fbUser.uid),
          fetchNotebookEntries(fbUser.uid)
        ]);

        setUserAndData({
          user: userProfile,
          emotionalEntries: activitiesResult.success ? activitiesResult.entries : [],
          notebookEntries: notebookResult.success ? notebookResult.entries : [],
        });

      } else {
        console.warn(`No Firestore document found for user ${fbUser.uid}. Creating a basic profile.`);
        userProfile = {
          id: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || 'Usuario',
        };
        await setDoc(userDocRef, {
          name: userProfile.name,
          email: userProfile.email,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user document from Firestore:", error);
      setUser({
        id: fbUser.uid,
        email: fbUser.email,
        name: 'Usuario (Error)',
      });
    } finally {
        setLoading(false);
    }
  }, [db, setUserAndData]);

  useEffect(() => {
    if (!auth) {
      setLoading(false); 
      return;
    };

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        fetchAndSetUserData(fbUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, fetchAndSetUserData]);

  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      clearAllEmotionalEntries();
      clearAllNotebookEntries();
      clearAssessmentHistory();
      localStorage.removeItem('workwell-active-path-details');
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [auth, router]);

  const updateUser = useCallback(async (updatedData: Partial<Omit<User, 'id' | 'email'>>) => {
    if (!user || !db) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    try {
      await setDoc(doc(db, "users", user.id), updatedData, { merge: true });
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
    }
  }, [user, db]);

  return (
    <UserContext.Provider value={{ user, firebaseUser, loading, updateUser, logout, setUserAndData }}>
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
