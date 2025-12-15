"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  type Firestore,
  enablePersistence,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { FirebaseProvider } from "./provider";
import { Loader2 } from "lucide-react";

interface FirebaseClientProviderProps {
  children: ReactNode;
}

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
    if (isFirebaseReady) return;

    const checkFirestoreConnection = async () => {
      try {
        await enablePersistence(db);
        console.log("FirebaseClientProvider: Firestore persistence enabled.");
      } catch (error: any) {
        if (error.code === 'failed-precondition') {
          console.warn("FirebaseClientProvider: Multiple tabs open, persistence can only be enabled in one. Firestore will work online.");
        } else if (error.code === 'unimplemented') {
          console.warn("FirebaseClientProvider: The current browser does not support all of the features required to enable persistence.");
        }
      }

      // Check connection by listening to a dummy document. 
      // The listener will immediately fire with `fromCache: true` if offline,
      // and then fire again with `fromCache: false` once a connection is established.
      const unsubscribe = onSnapshot(doc(db, "healthCheck", "status"), { includeMetadataChanges: true }, 
        (snapshot) => {
            const isOnline = !snapshot.metadata.fromCache;
            console.log(`FirebaseClientProvider: Firestore online status check. Is online: ${isOnline}`);
            if (isOnline) {
                if (!isFirebaseReady) {
                    setIsFirebaseReady(true);
                    console.log("FirebaseClientProvider: Connection confirmed. Firebase is ready.");
                }
                unsubscribe(); 
            }
        },
        (error) => {
            console.error("FirebaseClientProvider: Error checking Firestore connection. Proceeding but might be offline.", error);
            if (!isFirebaseReady) setIsFirebaseReady(true);
            unsubscribe();
        }
      );

      // Timeout to prevent getting stuck if the network call never completes.
      const timeoutId = setTimeout(() => {
        if (!isFirebaseReady) {
          console.warn("FirebaseClientProvider: Timeout waiting for Firestore online status. Proceeding, but operations might fail if offline.");
          setIsFirebaseReady(true);
          unsubscribe();
        }
      }, 7000); // 7-second timeout

      return () => {
        unsubscribe();
        clearTimeout(timeoutId);
      };
    };

    checkFirestoreConnection();

  }, [isFirebaseReady]); // Re-run only if isFirebaseReady changes from false to true elsewhere

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
