
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    // En dev usa GOOGLE_APPLICATION_CREDENTIALS; en prod App Hosting usa identidad del runtime.
    credential: admin.credential.applicationDefault(),

    // Evita projectId = null en dev
    projectId: process.env.FIREBASE_PROJECT_ID || "workwell-c4rlk",

    // Para Storage (scripts). No molesta en prod.
    storageBucket: "workwell-c4rlk.appspot.com",
  });

  console.log("🔥 Firebase Admin Project:", admin.app().options.projectId);
}

export { admin };
