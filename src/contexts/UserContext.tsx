'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase/provider";
import { doc, getDoc, getDocs, collection, writeBatch } from "firebase/firestore";
import { Capacitor } from '@capacitor/core';
import { clearAssessmentHistory } from '@/data/assessmentHistoryStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/translations';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { overwriteNotebookEntries, type NotebookEntry } from '@/data/therapeuticNotebookStore';
import { deleteLegacyData } from '@/data/userUtils';

const DEBUG_DELETE_FETCH_URL_KEY = "workwell-debug-delete-fetch-url";
const DEBUG_NOTEBOOK_FETCH_URL_KEY = "workwell-debug-notebook-fetch-url";
const LAST_LOGIN_AT_KEY = "workwell-last-login-at";
const WELCOME_SEEN_KEY = "workwell-welcome-seen";
const MAX_SESSION_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 dias
const AUTH_INIT_TIMEOUT_MS = 6000;
const IOS_FIRESTORE_AUTH_RETRY_DELAY_MS = 1200;

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
  notebookEntries: NotebookEntry[];
  isNotebookLoading: boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  deleteUserAccount: () => Promise<{ success: boolean; error?: string }>;
  fetchAndSetNotebook: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

async function fetchNotebook(userId: string): Promise<{entries: NotebookEntry[], debugUrl: string}> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  const url = `${base}/notebook?userId=${encodeURIComponent(userId)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Error fetching notebook:", errorText);
        return { entries: [], debugUrl: url };
    }
    const payload = await res.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    return { entries, debugUrl: payload?.debugUrl || url };

  } catch (error) {
    console.error("Failed to fetch or process notebook:", error);
    return { entries: [], debugUrl: url };
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>([]);
  const [isNotebookLoading, setIsNotebookLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const fetchAndSetNotebook = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsNotebookLoading(true);
    const { entries, debugUrl } = await fetchNotebook(userId);
    overwriteNotebookEntries(entries);
    setNotebookEntries(entries); // Actualizar el estado del contexto
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(DEBUG_NOTEBOOK_FETCH_URL_KEY, debugUrl);
        window.dispatchEvent(new Event('notebook-url-updated'));
    }
    setIsNotebookLoading(false);
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!db || !userId) {
      return;
    }
    const userDocRef = doc(db, "users", userId);
    try {
      const userDoc = await getDoc(userDocRef);
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
    } catch (error: any) {
      const isNativeIos = Capacitor.getPlatform() === 'ios';
      if (isNativeIos && error?.code === 'permission-denied') {
        try {
          await new Promise((resolve) => window.setTimeout(resolve, IOS_FIRESTORE_AUTH_RETRY_DELAY_MS));
          const retryDoc = await getDoc(userDocRef);
          if (retryDoc.exists()) {
            const userData = retryDoc.data();
            setUser(prevUser => ({
              ...(prevUser as User),
              id: userId,
              name: userData.name || prevUser?.name || 'Usuario',
              email: userData.email || prevUser?.email,
              ageRange: userData.ageRange || null,
              gender: userData.gender || null,
              initialEmotionalState: userData.initialEmotionalState || null,
            }));
            return;
          }
        } catch (retryError) {
          console.warn("iOS Firestore profile retry failed:", retryError);
        }
      }
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'get',
        databaseId: (db as any)?._databaseId?.database ?? (db as any)?._databaseId ?? undefined,
        originalErrorCode: error?.code,
        originalErrorMessage: error?.message,
      }));
    }
  }, [db]);


  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let authStateResolved = false;
    const authInitTimeout = window.setTimeout(() => {
      if (!authStateResolved) {
        console.warn("Auth initialization timed out. Falling back to unauthenticated state.");
        setUser(null);
        setNotebookEntries([]);
        setLoading(false);
      }
    }, AUTH_INIT_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      authStateResolved = true;
      window.clearTimeout(authInitTimeout);

      if (fbUser) {
        setLoading(true);
        try {
          if (typeof window !== 'undefined') {
            const now = Date.now();
            const lastLoginAtRaw = localStorage.getItem(LAST_LOGIN_AT_KEY);
            if (lastLoginAtRaw) {
              const lastLoginAt = Number(lastLoginAtRaw);
              const isValidTimestamp = Number.isFinite(lastLoginAt) && lastLoginAt > 0;
              if (isValidTimestamp && (now - lastLoginAt) > MAX_SESSION_AGE_MS) {
                await signOut(auth);
                localStorage.removeItem(LAST_LOGIN_AT_KEY);
                setUser(null);
                setNotebookEntries([]);
                toast({
                  title: "Sesión expirada",
                  description: "Por seguridad, vuelve a iniciar sesión.",
                  variant: "destructive",
                });
                router.push('/login');
                setLoading(false);
                return;
              }
            } else {
              // Backfill for existing sessions created before this policy.
              localStorage.setItem(LAST_LOGIN_AT_KEY, String(now));
            }
          }

          const minimalUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Usuario',
            email: fbUser.email,
          };
          setUser(minimalUser);
          setLoading(false);

          try {
            await fbUser.getIdToken();
          } catch (tokenError) {
            console.warn("Could not prefetch auth token before Firestore access:", tokenError);
          }

          // Keep profile and notebook hydration in the background so auth never blocks navigation.
          await fetchUserProfile(fbUser.uid);
          fetchAndSetNotebook(fbUser.uid);

        } catch (error) {
          console.error("Failed to initialize user session:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setNotebookEntries([]);
        setLoading(false);
      }
    });

    return () => {
      window.clearTimeout(authInitTimeout);
      unsubscribe();
    };
  }, [auth, db, fetchUserProfile, fetchAndSetNotebook, router, toast]);

  useEffect(() => {
    const handleNotebookUpdate = () => {
      if (user?.id) {
        fetchAndSetNotebook(user.id);
      }
    };
    window.addEventListener('notebook-updated', handleNotebookUpdate);
    return () => {
      window.removeEventListener('notebook-updated', handleNotebookUpdate);
    };
  }, [user?.id, fetchAndSetNotebook]);


  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setNotebookEntries([]);
      if (typeof window !== 'undefined') {
        const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
        localStorage.clear();
        if (welcomeSeen) {
          localStorage.setItem(WELCOME_SEEN_KEY, welcomeSeen);
        }
        sessionStorage.clear();
      }
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router, auth]);

 const updateUser = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'ageRange' | 'gender'>>) => {
    const authUid = auth?.currentUser?.uid;
    if (!user || !user.id || !db || !authUid || authUid !== user.id) return;

    const userDocRef = doc(db, "users", user.id);
    const nowIso = new Date().toISOString();

    await setDoc(userDocRef, { ...updatedData, updatedAt: nowIso }, { merge: true });
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  }, [user, db, auth]);

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
      const collectionsToDelete = ["notebook_entries", "psychologicalAssessments", "userRoutes", "userPreferences", "journalEntries", "emotionalCheckIns", "userProfiles", "analyticsEvents"];
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
    <UserContext.Provider value={{ user, loading, logout, updateUser, fetchUserProfile, deleteUserAccount, notebookEntries, fetchAndSetNotebook, isNotebookLoading }}>
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
