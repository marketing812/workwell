import type { ReactNode } from 'react';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActivePathProvider } from '@/contexts/ActivePathContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <UserProvider>
              <ActivePathProvider>
                <FeatureFlagProvider>
                  {children}
                  <Toaster />
                </FeatureFlagProvider>
              </ActivePathProvider>
            </UserProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
