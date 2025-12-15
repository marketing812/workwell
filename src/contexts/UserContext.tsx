"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { clearAllEmotionalEntries, overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries, overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { useRouter } from 'next/navigation';
import { fetchUserActivities, fetchNotebookEntries } from '@/actions/auth';

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
  fetchUserProfile: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!db || !userId) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(prevUser => ({
          ...prevUser,
          id: userId,
          name: userData.name || prevUser?.name || 'Usuario',
          email: userData.email || prevUser?.email,
          ageRange: userData.ageRange || null,
          gender: userData.gender || null,
          initialEmotionalState: userData.initialEmotionalState || null,
        }));
        
        const activitiesResult = await fetchUserActivities(userId);
        if (activitiesResult.success && activitiesResult.entries) {
          overwriteEmotionalEntries(activitiesResult.entries);
        }
        
        const notebookResult = await fetchNotebookEntries(userId);
        if (notebookResult.success && notebookResult.entries) {
          overwriteNotebookEntries(notebookResult.entries);
        }

      } else {
        if (auth?.currentUser && auth.currentUser.uid === userId) {
            const fbUser = auth.currentUser;
            const basicProfile: User & { createdAt: string } = {
                id: fbUser.uid,
                email: fbUser.email,
                name: fbUser.displayName || 'Usuario',
                createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, basicProfile, { merge: true });
            setUser(basicProfile);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
        setLoading(false);
    }
  }, [db, auth]);

  useEffect(() => {
    if (!auth || !db) {
        setLoading(true);
        return;
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
          const minimalUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Usuario',
            email: fbUser.email,
          };
          setUser(minimalUser);
          await fetchUserProfile(fbUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
        unsubscribe();
    }
  }, [auth, db, fetchUserProfile]);


  const logout = useCallback(async () => {
    if (!auth) return;
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
    if (!user || !user.id || !db) return;
    
    const userDocRef = doc(db, "users", user.id);
    try {
      await setDoc(userDocRef, { ...updatedData, updatedAt: serverTimestamp() }, { merge: true });
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    } catch (error) {
        console.error("Error updating user profile in Firestore:", error);
        throw error;
    }
  }, [user, db]);

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
