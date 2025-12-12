
"use client";

import { useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { useUser, type User } from '@/contexts/UserContext';
import { overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import { overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';
import { fetchUserActivities, fetchNotebookEntries } from '@/actions/user-data';
import { useToast } from '@/hooks/use-toast';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let userProfile: User;

          if (userDoc.exists()) {
            const data = userDoc.data();
            userProfile = {
              id: fbUser.uid,
              email: fbUser.email,
              name: data.name || fbUser.displayName || 'Usuario',
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
            await setDoc(userDocRef, {
              email: fbUser.email,
              name: userProfile.name,
              createdAt: new Date().toISOString(),
            });
            console.warn(`No Firestore document for user ${fbUser.uid}, created a new one.`);
          }
          
          setUser(userProfile);

          // Fetch user data from external API after setting user
          const activitiesResult = await fetchUserActivities(fbUser.uid);
          if (activitiesResult.success && activitiesResult.entries) {
            overwriteEmotionalEntries(activitiesResult.entries);
          } else {
             console.warn("AuthInit: Failed to fetch emotional entries:", activitiesResult.error);
          }
          
          const notebookResult = await fetchNotebookEntries(fbUser.uid);
          if (notebookResult.success && notebookResult.entries) {
            overwriteNotebookEntries(notebookResult.entries);
          } else {
             console.warn("AuthInit: Failed to fetch notebook entries:", notebookResult.error);
          }

        } catch (error) {
          console.error("Error during user data fetch in AuthInitializer:", error);
          // Set a minimal user object to prevent app from breaking
          setUser({ id: fbUser.uid, email: fbUser.email, name: 'Usuario' });
          toast({
            title: "Error de carga",
            description: "No se pudieron cargar todos tus datos. Algunas funciones podrían no estar disponibles.",
            variant: "destructive"
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, toast]);

  return <>{children}</>;
}
