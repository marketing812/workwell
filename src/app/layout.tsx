
"use client";

import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActivePathProvider } from '@/contexts/ActivePathContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { FirebaseProvider } from '@/firebase/provider'; // Importar el nuevo provider

const geistSans = GeistSans;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseProvider>
            <UserProvider>
              <AuthInitializer>
                <ActivePathProvider>
                  <FeatureFlagProvider>
                    {children}
                    <Toaster />
                  </FeatureFlagProvider>
                </ActivePathProvider>
              </AuthInitializer>
            </UserProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
