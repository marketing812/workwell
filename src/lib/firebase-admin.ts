import * as admin from 'firebase-admin';

// Esta función encapsula la lógica de inicialización para asegurar que solo se ejecute una vez.
function initializeAdminApp() {
  // Si la app ya está inicializada, no hacemos nada más.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  console.log("🕵️ Intentando inicializar Firebase Admin...");

  // Prioridad 1: Usar variables de entorno para las credenciales (común en Vercel, Netlify, etc.)
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: "workwell-c4rlk.appspot.com",
    });
    console.log("✅ Firebase Admin inicializado con credenciales de Certificado (variables de entorno).");
    return app;
  }

  // Prioridad 2: Usar Application Default Credentials (ADC)
  // Ideal para Google Cloud (App Hosting, Cloud Run) y para desarrollo local con `gcloud auth application-default login`.
  try {
    const app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
      storageBucket: "workwell-c4rlk.appspot.com",
    });
    console.log("✅ Firebase Admin inicializado con Credenciales de Aplicación por Defecto (ADC).");
    return app;
  } catch (error: any) {
    console.warn("⚠️  La inicialización con ADC falló. Esto es normal si no estás en un entorno de Google Cloud o no has configurado ADC localmente.", error.message);
  }

  // Si llegamos aquí, ninguna de las opciones funcionó.
  console.error("❌ ERROR: No se pudo inicializar Firebase Admin. Asegúrate de tener configuradas las credenciales (ADC o variables de entorno).");
  // Throw an error to make it clear that initialization failed.
  throw new Error("Could not initialize Firebase Admin SDK.");
}

const app = initializeAdminApp();

export const db = admin.firestore(app);
export const storage = admin.storage(app);
export const authAdmin = admin.auth(app); // Renamed to avoid conflict with client-side auth
export const FieldValue = admin.firestore.FieldValue;

export { admin };
