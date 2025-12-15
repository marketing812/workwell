
"use server";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc,
  serverTimestamp, 
  query, 
  orderBy, 
  limit
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/config";
import type { EmotionalEntry } from "@/data/emotionalEntriesStore";
import type { NotebookEntry } from "@/data/therapeuticNotebookStore";

let db: any;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore(getApp());
}

// --- Emotional Entries ---

export async function fetchEmotionalEntries(userId: string): Promise<EmotionalEntry[]> {
  const entriesRef = collection(db, "users", userId, "emotional_entries");
  const q = query(entriesRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmotionalEntry));
}

export async function addEmotionalEntryToFirestore(userId: string, entryData: Omit<EmotionalEntry, 'id' | 'timestamp'>): Promise<string> {
  const entriesRef = collection(db, "users", userId, "emotional_entries");
  const docRef = await addDoc(entriesRef, {
    ...entryData,
    timestamp: serverTimestamp() 
  });
  return docRef.id;
}


// --- Notebook Entries ---

export async function fetchNotebookEntries(userId: string): Promise<NotebookEntry[]> {
  const entriesRef = collection(db, "users", userId, "notebook_entries");
  const q = query(entriesRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NotebookEntry));
}

export async function addNotebookEntryToFirestore(userId: string, entryData: Omit<NotebookEntry, 'id' | 'timestamp'>): Promise<string> {
  const entriesRef = collection(db, "users", userId, "notebook_entries");
  const docRef = await addDoc(entriesRef, {
    ...entryData,
    timestamp: serverTimestamp()
  });
  return docRef.id;
}


// --- Assessments ---
// Definimos el tipo para los datos de evaluación, similar a como se hacía antes.
import { type InitialAssessmentOutput } from '@/ai/flows/initial-assessment';
export interface AssessmentRecord {
  id: string;
  timestamp: string; // ISO string
  data: InitialAssessmentOutput & { respuestas: Record<string, number> };
}

export async function saveAssessmentToFirestore(userId: string, assessmentData: AssessmentRecord['data']): Promise<string> {
    const assessmentsRef = collection(db, "users", userId, "assessments");
    const docRef = await addDoc(assessmentsRef, {
      ...assessmentData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
}

export async function fetchAssessmentHistory(userId: string): Promise<AssessmentRecord[]> {
  const assessmentsRef = collection(db, "users", userId, "assessments");
  const q = query(assessmentsRef, orderBy("timestamp", "desc"), limit(20));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(docSnapshot => {
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      // Firebase Timestamps need to be converted to ISO strings on the client.
      // We will send them as is and convert them where they are used.
      timestamp: data.timestamp?.toDate?.().toISOString() || new Date().toISOString(),
      data: {
        emotionalProfile: data.emotionalProfile,
        priorityAreas: data.priorityAreas,
        feedback: data.feedback,
        respuestas: data.respuestas,
      }
    };
  });
}
