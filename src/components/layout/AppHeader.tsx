
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AppHeader() {
  const { user, logout } = useUser();
  const t = useTranslations();

  return (
    <header
      className="safe-area-x sticky top-0 z-30 border-b bg-background px-4 pb-2 md:px-6"
      style={{
        paddingTop: "calc(var(--safe-area-top) + 0.5rem)",
        minHeight: "calc(4rem + var(--safe-area-top) + 0.5rem)",
      }}
    >
      <div className="grid h-full min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-start gap-2">
          <SidebarTrigger />
        </div>

        <div className="flex items-center justify-center">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name?.[0]?.toUpperCase() || 'U'}`} alt={user.name || "Usuarie"} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>{t.navSettings}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
