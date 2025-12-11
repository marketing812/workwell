"use client";

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';

// Define the shape of the context
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

// Create the context with a default undefined value
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Define the provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { app, auth, db } = initializeFirebase();

  const value = useMemo(() => ({
    app,
    auth,
    db
  }), [app, auth, db]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Define the hook for consuming the context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
