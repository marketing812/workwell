
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActivePathProvider } from '@/contexts/ActivePathContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'EMOTIVA',
  description: 'Tu app de acompañamiento emocional',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EMOTIVA',
  },
 
};

export const viewport: Viewport = {
  themeColor: '#64B5F6',
  initialScale: 1,
  width: 'device-width',
};

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
            <UserProvider>
              <ActivePathProvider>
                <FeatureFlagProvider>
                  {children}
                  <Toaster />
                </FeatureFlagProvider>
              </ActivePathProvider>
            </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

