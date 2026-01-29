
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
import { overwriteNotebookEntries, clearAllNotebookEntries, type NotebookEntry } from '@/data/therapeuticNotebookStore';
import { deleteLegacyData, sendLegacyData } from '@/data/userUtils'; // Importar la nueva función
import { forceEncryptStringAES, decryptDataAES } from '@/lib/encryption';

const DEBUG_DELETE_FETCH_URL_KEY = "workwell-debug-delete-fetch-url";
const DEBUG_NOTEBOOK_FETCH_URL_KEY = "workwell-debug-notebook-fetch-url";

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

const API_BASE_URL = "https://workwellfut.com/wp-content/programacion/wscontenido.php";
const API_KEY = "4463";

async function fetchNotebook(userId: string): Promise<{entries: NotebookEntry[], debugUrl: string}> {
  const clave = "SJDFgfds788sdfs8888KLLLL";
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const raw = `${clave}|${fecha}`;
  const token = Buffer.from(raw).toString('base64');
  const encryptedUserId = forceEncryptStringAES(userId);
  const url = `${API_BASE_URL}?apikey=${API_KEY}&tipo=getcuaderno&usuario=${encodeURIComponent(encryptedUserId)}&token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const responseText = await res.text();

    if (!res.ok) {
        console.error("Error fetching notebook:", responseText);
        return { entries: [], debugUrl: url };
    }
    
    const decryptedData = decryptDataAES(responseText);
    
    if (Array.isArray(decryptedData)) {
      // The API returns an array of arrays: [["id", "timestamp", "userId", "title", "content", "pathId"], ...]
      // We need to map this to an array of NotebookEntry objects.
      const entries = decryptedData.map((item: any[]): NotebookEntry | null => {
        if (Array.isArray(item) && item.length >= 5) {
          return {
            id: item[0],
            timestamp: item[1],
            // item[2] is userId, which we don't store directly in the entry object
            title: item[3],
            content: item[4],
            pathId: item[5] || undefined, // pathId is optional
            ruta: item[5] ? (item[5].replace(/-/g, ' ').charAt(0).toUpperCase() + item[5].slice(1).replace(/-/g, ' ')) : undefined, // Also map pathId to ruta
          };
        }
        console.warn("Invalid item format in notebook data:", item);
        return null;
      }).filter((item): item is NotebookEntry => item !== null); // Filter out any null entries from mapping
      
      return { entries, debugUrl: url };
    }
    return { entries: [], debugUrl: url };

  } catch (error) {
    console.error("Failed to fetch or decrypt notebook:", error);
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
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'get',
      }));
    }
  }, [db]);


  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      setLoading(true);
      if (fbUser) {
        try {
          const minimalUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Usuario',
            email: fbUser.email,
          };
          setUser(minimalUser);

          // We fetch user profile and notebook entries.
          // These can fail, so they must be handled.
          await Promise.all([
            fetchUserProfile(fbUser.uid),
            fetchAndSetNotebook(fbUser.uid),
          ]);

        } catch (error) {
          console.error("Failed to initialize user session:", error);
          // It's important to not leave the app in a loading state.
          // We can decide if we want to log the user out or show an error state.
          // For now, just stopping the loading is enough to prevent the frozen spinner.
        } finally {
          // This ensures that loading is always set to false, even if an error occurs.
          setLoading(false);
        }
      } else {
        setUser(null);
        setNotebookEntries([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db, fetchUserProfile, fetchAndSetNotebook]);


  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setNotebookEntries([]);
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
