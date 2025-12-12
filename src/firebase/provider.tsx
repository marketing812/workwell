"use client";

// This file is deprecated and no longer in use.
// Firebase initialization is now handled in src/firebase/client.ts
// and the UserContext manages auth state.
// This file can be safely deleted in a future cleanup.

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const FirebaseContext = createContext<any>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    // This hook should no longer be used.
    // console.warn('useFirebase hook is deprecated. Import instances from @/firebase/client.');
  }
  return context || {};
}
