'use server';

import * as admin from 'firebase-admin';

// Esta función encapsula la lógica de inicialización para asegurar que solo se ejecute una vez.
function initializeAdminApp() {
  // Si la app ya está inicializada, no hacemos nada más.
  if (admin.apps.length > 0) {
    return;
  }

  console.log("🕵️ Intentando inicializar Firebase Admin...");

  // Prioridad 1: Usar variables de entorno para las credenciales (común en Vercel, Netlify, etc.)
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: "workwell-c4rlk.appspot.com",
    });
    console.log("✅ Firebase Admin inicializado con credenciales de Certificado (variables de entorno).");
    return;
  }

  // Prioridad 2: Usar Application Default Credentials (ADC)
  // Ideal para Google Cloud (App Hosting, Cloud Run) y para desarrollo local con `gcloud auth application-default login`.
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
      storageBucket: "workwell-c4rlk.appspot.com",
    });
    console.log("✅ Firebase Admin inicializado con Credenciales de Aplicación por Defecto (ADC).");
    return;
  } catch (error: any) {
    console.warn("⚠️  La inicialización con ADC falló. Esto es normal si no estás en un entorno de Google Cloud o no has configurado ADC localmente.", error.message);
  }

  // Si llegamos aquí, ninguna de las opciones funcionó.
  console.error("❌ ERROR: No se pudo inicializar Firebase Admin. Asegúrate de tener configuradas las credenciales (ADC o variables de entorno).");
}

// Ejecutamos la inicialización al cargar el módulo.
initializeAdminApp();

export { admin };
