
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="safe-area-x safe-area-bottom flex min-h-screen flex-col items-center justify-center bg-primary text-primary-foreground p-4 sm:p-6 lg:p-8">
      <div
        className="absolute left-6"
        style={{ top: "calc(var(--safe-area-top) + 1.5rem)" }}
      >
        <Logo className="text-primary-foreground" white />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
