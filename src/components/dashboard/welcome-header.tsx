"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { dashboardUser } from "@/constants/dashboard-mock-data";
import { routes } from "@/constants/routes";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
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
  const today = formatDate(new Date(), {
    locale: "en-GB",
    dateStyle: "full",
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-heading-1">
          {greeting}, {dashboardUser.firstName}
        </h1>
        <p className="text-body text-muted-foreground">{today}</p>
      </div>

      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link href={routes.deals.new.index}>
          <Plus className="size-4" aria-hidden="true" />
          Start New Deal
        </Link>
      </Button>
    </div>
  );
}
