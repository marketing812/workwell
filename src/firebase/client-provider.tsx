
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { FirebaseProvider } from "./provider";

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    db: Firestore | null;
  }>({ app: null, auth: null, db: null });

  useEffect(() => {
    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Solo actualizamos el estado una vez que todo está listo.
    setFirebase({ app, auth, db });
  }, []);

  // No renderizamos los children hasta que firebase esté inicializado.
  if (!firebase.app) {
    return null; 
  }

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
