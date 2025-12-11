import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
function initializeFirebase() {
  if (getApps().length) {
    const app = getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  } else {
    // Check for missing config values
    const requiredConfig = [
        "apiKey", "authDomain", "projectId", "storageBucket", 
        "messagingSenderId", "appId"
    ];
    const missingConfig = requiredConfig.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
    
    if (missingConfig.length > 0) {
        // This will be caught by Next.js and shown in an error overlay in development
        throw new Error(`Firebase config is missing: ${missingConfig.join(", ")}. Please check your environment variables.`);
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  }
}

export { initializeFirebase };
