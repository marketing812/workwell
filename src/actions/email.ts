'use server';

import nodemailer from 'nodemailer';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  console.log(`sendEmail: Attempting to send email to ${to}`);
  // Estas variables de entorno deben configurarse en el entorno de despliegue.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log(`sendEmail: transporter.sendMail called for ${to}.`);
    await transporter.sendMail({
      from: `"EMOTIVA" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: body,
    });
    console.log(`sendEmail: Email sent successfully to ${to}.`);
    return { success: true };
  } catch (error) {
    console.error(`sendEmail: Error sending email to ${to}:`, error);
    return { success: false, error: 'Failed to send email.' };
  }
}


export async function sendReminderEmailByUserId(userId: string, body: string): Promise<{ success: boolean; error?: string }> {
  console.log(`sendReminderEmailByUserId: Received request for userId: ${userId}`);
  if (!userId) {
    console.error("sendReminderEmailByUserId: Aborting, no userId provided.");
    return { success: false, error: "No userId provided." };
  }

  try {
    console.log("sendReminderEmailByUserId: Initializing Firestore connection...");
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    const db = getFirestore(app);
    console.log("sendReminderEmailByUserId: Firestore connection initialized.");

    const userDocRef = doc(db, "users", userId);
    console.log(`sendReminderEmailByUserId: Fetching user document from path: users/${userId}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error(`sendReminderEmailByUserId: User with ID ${userId} not found in Firestore.`);
      return { success: false, error: `User not found.` };
    }
    console.log(`sendReminderEmailByUserId: User document found for ID ${userId}.`);

    const userData = userDoc.data();
    const userEmail = userData.email;

    if (!userEmail) {
      console.error(`sendReminderEmailByUserId: User with ID ${userId} does not have an email address in their document.`);
      return { success: false, error: `User email not found.` };
    }
    console.log(`sendReminderEmailByUserId: Found email '${userEmail}' for userId ${userId}. Preparing to send email.`);

    return await sendEmail({
      to: userEmail,
      subject: "Recordatorio de EMOTIVA",
      body: body,
    });

  } catch (error) {
    console.error(`sendReminderEmailByUserId: Error processing reminder for userId ${userId}:`, error);
    return { success: false, error: 'Failed to send reminder email.' };
  }
}
