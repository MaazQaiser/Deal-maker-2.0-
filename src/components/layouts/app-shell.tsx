"use client";

import { Topbar } from "@/components/layouts/topbar";
import { cn } from "@/lib/cn";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <Topbar />

      <main className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">{children}</div>
      </main>
    </div>
  );
}
