
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from '@/firebase/provider'; // Importar los hooks correctos
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    // Si auth aún no está inicializado, no hagas nada.
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: fbUser.uid,
              name: data.name || null,
              email: data.email || fbUser.email,
              ageRange: data.ageRange || null,
              gender: data.gender || null,
              initialEmotionalState: data.initialEmotionalState || null,
            });
          } else {
            // El perfil no existe, créalo
            const newUserProfile: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Usuario',
              email: fbUser.email,
            };
            await setDoc(userDocRef, newUserProfile, { merge: true });
            setUser(newUserProfile);
          }
        } catch (error) {
          console.error("Error fetching or creating user document from Firestore:", error);
          // Fallback to a minimal user object to prevent app crash
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: 'Usuario',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]); // Se ejecutará cuando auth y db estén listos

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
    if (!user || !db) return;
    const userDocRef = doc(db, "users", user.id);
    await setDoc(userDocRef, updatedData, { merge: true });
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  }, [user, db]);

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
