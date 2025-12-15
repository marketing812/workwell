"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase/provider";
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
    if (!db || !userId) {
      console.warn("fetchUserProfile: db or userId not available. Aborting.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(prevUser => ({
          ...(prevUser as User), // Keep the basic user object from auth
          id: userId,
          name: userData.name || prevUser?.name || 'Usuario',
          email: userData.email || prevUser?.email,
          ageRange: userData.ageRange || null,
          gender: userData.gender || null,
          initialEmotionalState: userData.initialEmotionalState || null,
        }));
      } else if (auth?.currentUser && auth.currentUser.uid === userId) {
        // This case handles a user that exists in Auth but not Firestore. Let's create their document.
        const fbUser = auth.currentUser;
        const basicProfile: User & { createdAt: string } = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || 'Usuario',
            createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, basicProfile, { merge: true });
        setUser(basicProfile); // Set the user state with the newly created profile
        console.log(`User document created for ${userId} as it was missing.`);
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
      setLoading(true); 
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

    return () => unsubscribe();
    
  }, [auth, db, fetchUserProfile]);


  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      // Clear all local storage data on logout
      clearAllEmotionalEntries();
      clearAllNotebookEntries();
      clearAssessmentHistory();
      localStorage.removeItem('workwell-active-path-details');
      // Find all keys related to path progress and remove them
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('workwell-progress-')) {
          localStorage.removeItem(key);
        }
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router, auth]);

 const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (!user || !user.id || !db) return;
    
    const userDocRef = doc(db, "users", user.id);
    try {
      await setDoc(userDocRef, { ...updatedData, updatedAt: new Date().toISOString() }, { merge: true });
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    } catch (error) {
        console.error("Error updating user profile in Firestore:", error);
        throw error; // Re-throw so the calling component knows about the error
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
