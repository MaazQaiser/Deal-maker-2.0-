"use client";

import { dashboardUser } from "@/constants/dashboard-mock-data";
import { formatTodayHeading } from "@/lib/formatDate";
import { cn } from "@/lib/cn";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type WelcomeHeaderProps = {
  className?: string;
};

export function WelcomeHeader({ className }: WelcomeHeaderProps) {
  const greeting = getGreeting();
  const today = formatTodayHeading(new Date());

  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="text-heading-1">
        {greeting}, {dashboardUser.firstName}
      </h1>
      <p className="text-body text-muted-foreground">{today}</p>
    </div>
  );
}
