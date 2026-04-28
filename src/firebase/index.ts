'use client';

import { Capacitor } from '@capacitor/core';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // During static export/build, automatic App Hosting init is expected to fail.
      // Keep the fallback, but avoid noisy server-side build warnings.
      if (typeof window !== 'undefined' && process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
  const isNativeCapacitor = typeof window !== 'undefined' && Capacitor.isNativePlatform();
  const auth = (() => {
    try {
      if (isNativeCapacitor) {
        return initializeAuth(firebaseApp, {
          persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            inMemoryPersistence,
          ],
        });
      }

      return initializeAuth(firebaseApp, {
        persistence: [
          indexedDBLocalPersistence,
          browserLocalPersistence,
          browserSessionPersistence,
        ],
      });
    } catch {
      return getAuth(firebaseApp);
    }
  })();

  if (typeof window !== 'undefined' && !isNativeCapacitor && siteKey) {
    void import('firebase/app-check')
      .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
        initializeAppCheck(firebaseApp, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      })
      .catch((error) => {
        console.warn('No se pudo inicializar App Check en web.', error);
      });
  } else if (typeof window !== 'undefined' && !isNativeCapacitor) {
    console.warn('App Check no inicializado: falta NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY');
  }

  return {
    firebaseApp,
    auth,
    firestore: getFirestore(firebaseApp, "defaultue")
  };
}



export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
