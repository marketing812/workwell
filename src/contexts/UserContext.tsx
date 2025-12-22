
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase/provider";
import { doc, getDoc, setDoc, getDocs, collection, query, orderBy, writeBatch } from "firebase/firestore";
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/translations';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { clearAllEmotionalEntries } from '@/data/emotionalEntriesStore';
import { clearAllNotebookEntries } from '@/data/therapeuticNotebookStore';
import { deleteLegacyData } from '@/data/userUtils'; // Importar la nueva función

const DEBUG_DELETE_FETCH_URL_KEY = "workwell-debug-delete-fetch-url";

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
  deleteUserAccount: () => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!db || !userId) return;

    const userDocRef = doc(db, "users", userId);
    
    getDoc(userDocRef).then(userDoc => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(prevUser => ({
          ...(prevUser as User),
          id: userId,
          name: userData.name || prevUser?.name || 'Usuario',
          email: userData.email || prevUser?.email,
          ageRange: userData.ageRange || null,
          gender: userData.gender || null,
          initialEmotionalState: userData.initialEmotionalState || null,
        }));
      }
    }).catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'get',
        }));
    }).finally(() => {
        setLoading(false);
    });
  }, [db]);


  useEffect(() => {
    if (!auth || !db) {
        setLoading(false);
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
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router, auth]);

 const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    if (!user || !user.id || !db) return;
    
    const userDocRef = doc(db, "users", user.id);
    setDocumentNonBlocking(userDocRef, { ...updatedData, updatedAt: new Date().toISOString() }, { merge: true });
    
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);

  }, [user, db]);

  const deleteUserAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const currentUser = auth?.currentUser;

    if (!currentUser || !db) {
      const errorMsg = "Usuario no autenticado o base de datos no disponible.";
      toast({ title: t.deleteAccountErrorTitle, description: errorMsg, variant: "destructive" });
      return { success: false, error: errorMsg };
    }
    
    const userId = currentUser.uid;

    try {
      // First, call to delete from the old platform
      const { debugUrl } = await deleteLegacyData(userId, 'borrarusuario');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(DEBUG_DELETE_FETCH_URL_KEY, debugUrl);
      }

      // Then, proceed to delete Firestore data
      const collectionsToDelete = ["emotional_entries", "notebook_entries", "psychologicalAssessments", "userRoutes", "userPreferences", "journalEntries", "emotionalCheckIns", "userProfiles"];
      const batch = writeBatch(db);

      for (const collectionName of collectionsToDelete) {
        const userSubCollectionRef = collection(db, "users", userId, collectionName);
        try {
          const querySnapshot = await getDocs(userSubCollectionRef);
          querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
        } catch (error) {
            // If listing subcollections fails, emit a contextual error
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userSubCollectionRef.path,
                operation: 'list',
            }));
            // We need to stop the process here as we can't guarantee a clean deletion.
            return { success: false, error: "Error listing user sub-collections for deletion." };
        }
      }
      
      const userDocRef = doc(db, "users", userId);
      batch.delete(userDocRef);
      
      // The batch write itself is a permission-sensitive operation.
      await batch.commit().catch(error => {
          // This catch block handles if the batch.commit() fails due to permissions.
          // Since a batch can contain multiple operations, we emit a general 'write' error
          // on the user's root document as the most likely point of failure.
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: `users/${userId}`,
              operation: 'delete', // The intent is to delete
          }));
          // We must throw to prevent the user from being deleted from Auth if Firestore data remains.
          throw error; 
      });
      
      // Finally, if all Firestore operations succeed, delete the user from Firebase Auth
      await deleteFirebaseUser(currentUser);

      toast({ title: t.deleteAccountSuccessTitle, description: t.deleteAccountSuccessMessage });
      logout();
      return { success: true };

    } catch (error: any) {
      // This generic catch will now handle re-thrown batch commit errors or other unexpected errors.
      // Firebase Auth errors (like requires-recent-login) will also be caught here.
      let errorMessage = t.deleteAccountErrorMessage;
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Esta operación es sensible y requiere una autenticación reciente. Por favor, cierra sesión y vuelve a iniciarla antes de intentarlo de nuevo.";
      }
      // Avoid showing a generic toast if a specific one was already emitted by the permission error handler
      if (error.name !== 'FirebaseError') {
          toast({ title: t.deleteAccountErrorTitle, description: errorMessage, variant: "destructive" });
      }
      return { success: false, error: errorMessage };
    }

  }, [auth, db, logout, toast, t]);

  return (
    <UserContext.Provider value={{ user, loading, logout, updateUser, fetchUserProfile, deleteUserAccount }}>
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
