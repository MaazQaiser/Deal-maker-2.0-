"use client";

import { mockNotifications, mockUser } from "@/constants/mock-data";
import { cn } from "@/lib/cn";
import { AppLogo } from "@/components/brand/app-logo";
import { NotificationPanel } from "@/components/navigation/notification-panel";
import { UserMenu } from "@/components/navigation/user-menu";

type TopbarProps = {
  className?: string;
};

export function Topbar({ className }: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[var(--topbar-height)] shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:gap-4 sm:px-6",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <AppLogo />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <NotificationPanel notifications={mockNotifications} />
        <UserMenu user={mockUser} />
      </div>
    </header>
  );
}
