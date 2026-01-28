// src/lib/firebase-admin.ts
import * as admin from "firebase-admin";
import fs from "fs";


function initAdmin() {
  if (admin.apps.length) return admin.app();

  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET || "workwell-c4rlk.firebasestorage.app";

  // Opción 1: credenciales por env vars (perfecto para Vercel/Netlify y también local)
  const projectId = process.env.FIREBASE_PROJECT_ID || "workwell-c4rlk";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  console.log("ENV CHECK", {
    nodeEnv: process.env.NODE_ENV,
    hasEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasKey: !!process.env.FIREBASE_PRIVATE_KEY,
    keyLen: process.env.FIREBASE_PRIVATE_KEY?.length ?? 0,
  });
  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      projectId,
      storageBucket,
    });
    console.log("🔥 Firebase Admin (cert):", admin.app().options.projectId);
   /* fs.writeFileSync(
      "/tmp/firebase-admin.log",
      JSON.stringify({ mode: "cert" })
    );*/
    return admin.app();
  }

  // Opción 2: ADC (ideal en Google Cloud: App Hosting / Cloud Run / Functions)
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId, // en local evita null si no lo detecta
    storageBucket,
  });

  console.log("🔥 Firebase Admin (ADC):", admin.app().options.projectId);
 /* fs.writeFileSync(
    "/tmp/firebase-admin.log",
    JSON.stringify({ mode: "ADC" })
  );*/
  return admin.app();
}

initAdmin();

export { admin };
