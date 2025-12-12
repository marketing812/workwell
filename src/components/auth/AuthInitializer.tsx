
"use client";

import { useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { useUser, type User } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { fetchUserActivities, fetchNotebookEntries } from '@/actions/user-data';
import { overwriteEmotionalEntries } from '@/data/emotionalEntriesStore';
import { overwriteNotebookEntries } from '@/data/therapeuticNotebookStore';

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
            }, { merge: true });
          }
          
          setUser(userProfile);

        } catch (error) {
          console.error("Error fetching or creating user document from Firestore:", error);
          setUser({
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || 'Usuario',
          });
          toast({
            title: "Error de Conexión",
            description: "No se pudo cargar tu perfil. Algunas funciones pueden no estar disponibles.",
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
