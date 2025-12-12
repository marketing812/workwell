
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
import { getUserProfile } from '@/actions/auth'; // Importar la acción

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
  fetchUserProfile: (userId: string) => Promise<void>; // Nueva función para cargar el perfil
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth) {
        setLoading(true);
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      console.log("onAuthStateChanged triggered. fbUser:", fbUser ? fbUser.uid : "null");
      if (fbUser) {
          // Ya no intentamos leer de Firestore aquí.
          // Establecemos un usuario mínimo con los datos de autenticación.
          const minimalUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Usuario', // Usar lo que tengamos
            email: fbUser.email,
          };
          setUser(minimalUser);
          console.log("User object set from Auth state:", minimalUser);
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
  }, [auth]);

  const fetchUserProfile = async (userId: string) => {
    if (!db || !userId) return;
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setUser(prevUser => ({...prevUser, ...profile}));
        console.log("User profile data fetched and merged:", profile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

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
    <UserContext.Provider value={{ user, loading, logout, updateUser, fetchUserProfile }}>
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
