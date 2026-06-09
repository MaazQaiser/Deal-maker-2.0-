"use client";

import {
  Car,
  FileText,
  Handshake,
  Landmark,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { ActivityItem } from "@/types/dashboard";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/cn";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";

const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  deal: Handshake,
  customer: UserPlus,
  finance: Landmark,
  vehicle: Car,
  proposal: FileText,
};

const activityColors: Record<ActivityItem["type"], string> = {
  deal: "bg-primary/10 text-primary",
  customer: "bg-info/10 text-info",
  finance: "bg-success/10 text-success",
  vehicle: "bg-warning/10 text-warning",
  proposal: "bg-muted text-muted-foreground",
};

type DealDetailActivityTimelineProps = {
  activities: ActivityItem[];
};

export function DealDetailActivityTimeline({
  activities,
}: DealDetailActivityTimelineProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((item, index) => {
              const Icon = activityIcons[item.type];
              return (
                <li key={item.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        activityColors[item.type],
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </div>
                    {index < activities.length - 1 ? (
                      <div
                        className="mt-1 w-px flex-1 bg-border"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 pb-4">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium">{item.title}</p>
                      <time
                        className="text-caption shrink-0 text-muted-foreground"
                        dateTime={item.timestamp.toISOString()}
                      >
                        {formatDate(item.timestamp, {
                          locale: "en-GB",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                    <p className="mt-0.5 text-caption text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
