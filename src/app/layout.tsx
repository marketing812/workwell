import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActivePathProvider } from '@/contexts/ActivePathContext';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AppAnalyticsTracker } from '@/components/analytics/AppAnalyticsTracker';
import DisableLegacySw from './DisableLegacySw';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`antialiased`}>
        <DisableLegacySw />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <UserProvider>
              <ActivePathProvider>
                <AppAnalyticsTracker />
                {children}
                <Toaster />
              </ActivePathProvider>
            </UserProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
