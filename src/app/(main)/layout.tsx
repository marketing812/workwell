"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DailyCheckInProvider, useDailyCheckIn } from '@/hooks/use-daily-check-in';
import { DailyCheckInPopup } from '@/components/daily-check-in/DailyCheckInPopup';
import { MoodCheckInProvider, useMoodCheckIn } from '@/hooks/use-mood-check-in';
import { MoodCheckInPopup } from '@/components/mood-check-in/MoodCheckInPopup';

// Componente para gestionar los pop-ups
function PopupManager() {
  const pathname = usePathname();
  const { unansweredQuestions, closePopup, showPopup, dismissPopup, markPopupShownToday } = useDailyCheckIn();
  const { showPopup: showMoodPopup, closePopup: closeMoodPopup } = useMoodCheckIn();
  const shouldSuppressPopups = pathname.startsWith('/assessment') || pathname === '/bienvenida';
  const shouldShowDailyPopup = !shouldSuppressPopups && showPopup;

  useEffect(() => {
    if (shouldShowDailyPopup) {
      markPopupShownToday();
    }
  }, [markPopupShownToday, shouldShowDailyPopup]);

  return (
    <>
      <DailyCheckInPopup 
        isOpen={shouldShowDailyPopup} 
        questions={unansweredQuestions}
        onClose={closePopup}
        onDismiss={dismissPopup}
      />
      <MoodCheckInPopup isOpen={!shouldSuppressPopups && showMoodPopup} onClose={closeMoodPopup} />
    </>
  );
}

// Layout principal del cliente
export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isImmersiveRoute = pathname === '/bienvenida';

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
            <div className="safe-area-bottom flex min-h-screen w-full flex-col">
              {!isImmersiveRoute && <AppSidebar />}
              {!isImmersiveRoute && <AppHeader />}
              <main
                className={
                  isImmersiveRoute
                    ? 'flex flex-1 flex-col'
                    : 'safe-area-x flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'
                }
              >
                 {children}
              </main>
              <PopupManager />
            </div>
          </SidebarProvider>
        </MoodCheckInProvider>
      </DailyCheckInProvider>
    </TooltipProvider>
  );
}
