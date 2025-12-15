
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  type Firestore,
  enablePersistence,
  terminate,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { FirebaseProvider } from "./provider";
import { Loader2 } from "lucide-react";

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// Única instancia de Firebase para evitar reinicializaciones
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const checkFirestoreConnection = async () => {
      try {
        // Habilitar persistencia (offline)
        await enablePersistence(db);
        console.log("FirebaseClientProvider: Firestore persistence enabled.");
      } catch (error: any) {
        if (error.code === 'failed-precondition') {
          console.warn("FirebaseClientProvider: Multiple tabs open, persistence can only be enabled in one. Firestore will work online.");
        } else if (error.code === 'unimplemented') {
          console.warn("FirebaseClientProvider: The current browser does not support all of the features required to enable persistence.");
        }
      }

      // La forma más fiable de saber si Firestore está online es escuchar los metadatos.
      // Hacemos una escucha a un documento que no tiene por qué existir.
      const unsubscribe = onSnapshot(doc(db, "healthCheck", "status"), { includeMetadataChanges: true }, 
        (snapshot) => {
            const isOnline = !snapshot.metadata.fromCache;
            console.log("FirebaseClientProvider: Firestore online status:", isOnline);
            if (isOnline) {
                setIsFirebaseReady(true);
                unsubscribe(); // Nos desuscribimos una vez confirmada la conexión.
            }
        },
        (error) => {
            console.error("FirebaseClientProvider: Error checking Firestore connection:", error);
            // Incluso si hay un error (ej. permisos), lo marcamos como listo
            // para que la app no se quede colgada, y los errores se manejarán en su contexto.
            setIsFirebaseReady(true);
            unsubscribe();
        }
      );
       // Timeout por si la conexión no se establece
      const timeoutId = setTimeout(() => {
        if (!isFirebaseReady) {
          console.warn("FirebaseClientProvider: Timeout waiting for Firestore online status. Proceeding anyway.");
          setIsFirebaseReady(true);
          unsubscribe();
        }
      }, 5000); // 5 segundos de espera

      return () => {
        unsubscribe();
        clearTimeout(timeoutId);
      };
    };

    checkFirestoreConnection();

  }, []);

  if (!isFirebaseReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Conectando con los servicios...</p>
      </div>
    );
  }

  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, db }}>
      {children}
    </FirebaseProvider>
  );
}
