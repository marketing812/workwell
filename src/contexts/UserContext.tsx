
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, getDoc } from "firebase/firestore";
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
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) {
        setLoading(true);
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      console.log("onAuthStateChanged triggered. fbUser:", fbUser ? fbUser.uid : "null");
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const appUser: User = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Usuario',
              email: data.email || fbUser.email,
              ageRange: data.ageRange || null,
              gender: data.gender || null,
              initialEmotionalState: data.initialEmotionalState || null,
            };
            setUser(appUser);
            console.log("User profile loaded from Firestore:", appUser);
          } else {
             const newUserProfile: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Usuario',
              email: fbUser.email,
            };
            // No creamos el documento aquí, solo establecemos un usuario mínimo
            setUser(newUserProfile);
            console.warn("User profile document does not exist for UID:", fbUser.uid, ". Using minimal user object.");
          }
        } catch (error) {
          console.error("Error fetching user document from Firestore:", error);
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || 'Usuario',
          });
        }
      } else {
        setUser(null);
        console.log("No Firebase user. Setting context user to null.");
      }
      setLoading(false);
    });

    return () => {
        console.log("Unsubscribing from onAuthStateChanged.");
        unsubscribe();
    }
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
    if (!user) return;
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, logout, updateUser }}>
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
