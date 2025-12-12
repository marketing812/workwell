
"use client";

import { useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser, type User } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase/provider'; // Usar los nuevos hooks

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUser();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) {
      // Si la autenticación o la base de datos no están listas, no hacer nada todavía.
      return;
    }

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
  }, [auth, db, setUser, setLoading, toast]);

  return <>{children}</>;
}
