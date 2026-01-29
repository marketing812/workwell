
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DailyCheckInProvider, useDailyCheckIn } from '@/hooks/use-daily-check-in';
import { DailyCheckInPopup } from '@/components/daily-check-in/DailyCheckInPopup';
import * as React from 'react';
import { MoodCheckInProvider, useMoodCheckIn } from '@/hooks/use-mood-check-in';
import { MoodCheckInPopup } from '@/components/mood-check-in/MoodCheckInPopup';

// Wrapper component to manage the daily check-in popup logic
function DailyCheckInManager({ children }: { children: ReactNode }) {
  const { showPopup, closePopup } = useDailyCheckIn();
  return (
    <>
      {children}
      <DailyCheckInPopup isOpen={showPopup} onClose={closePopup} />
    </>
  );
}

// New manager for Mood Check-in
function MoodCheckInManager({ children }: { children: ReactNode }) {
    const { showPopup, closePopup } = useMoodCheckIn();
    return (
        <>
            {children}
            <MoodCheckInPopup isOpen={showPopup} onClose={closePopup} />
        </>
    );
}

// This is the main client layout component
export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Return null or a loader while redirecting to avoid flashing content
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <TooltipProvider>
      <DailyCheckInProvider>
        <MoodCheckInProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
              <AppSidebar />
              <AppHeader />
              <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <DailyCheckInManager>
                  <MoodCheckInManager>{children}</MoodCheckInManager>
                </DailyCheckInManager>
              </main>
            </div>
          </SidebarProvider>
        </MoodCheckInProvider>
      </DailyCheckInProvider>
    </TooltipProvider>
  );
}
