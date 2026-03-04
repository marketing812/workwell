import * as admin from 'firebase-admin';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

let app: admin.app.App | undefined;

function getAdminApp(): admin.app.App {
  if (app) {
    return app;
  }

  if (admin.apps.length > 0 && admin.apps[0]) {
    app = admin.apps[0];
    return app;
  }

  console.log("🕵️ Intentando inicializar Firebase Admin...");

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: "workwell-c4rlk.firebasestorage.app",

    });
    console.log("✅ Firebase Admin inicializado con credenciales de Certificado (variables de entorno).");
    return app;
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'workwell-c4rlk',
      storageBucket: "workwell-c4rlk.firebasestorage.app",

    });
    console.log("✅ Firebase Admin inicializado con Credenciales de Aplicación por Defecto (ADC).");
    return app;
  } catch (error: any) {
    console.warn("⚠️  La inicialización con ADC falló. Esto es normal si no estás en un entorno de Google Cloud o no has configurado ADC localmente.", error.message);
  }

  throw new Error("❌ ERROR: No se pudo inicializar Firebase Admin. Asegúrate de tener configuradas las credenciales (ADC o variables de entorno).");
}

export const getDb = () => getAdminFirestore(getAdminApp(), "defaultue");
export const getStorage = () => admin.storage(getAdminApp());
export const getAuthAdmin = () => admin.auth(getAdminApp());
export const FieldValue = admin.firestore.FieldValue;

export { admin };
