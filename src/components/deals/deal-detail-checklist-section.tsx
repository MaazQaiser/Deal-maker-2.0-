"use client";

import { Check, X } from "lucide-react";
import {
  isChecklistItemRequired,
  processChecklistGroups,
} from "@/constants/process-checklist";
import type { ProcessChecklist } from "@/types/process-checklist";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { cn } from "@/lib/cn";

type DealDetailChecklistSectionProps = {
  checklist?: ProcessChecklist;
  hasPartExchange: boolean;
};

export function DealDetailChecklistSection({
  checklist,
  hasPartExchange,
}: DealDetailChecklistSectionProps) {
  if (!checklist) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Process Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Process checklist not yet completed for this deal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Process Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {processChecklistGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-3 text-sm font-semibold">{group.title}</p>
            <ul className="space-y-2">
              {group.items.map((item) => {
                const required = isChecklistItemRequired(
                  item.key,
                  hasPartExchange,
                );
                if (!required) return null;

                const completed = checklist[item.key];

                return (
                  <li
                    key={item.key}
                    className="flex items-center gap-3 rounded-[16px] bg-muted/50 px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full",
                        completed
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {completed ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <X className="size-3.5" aria-hidden />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        !completed && "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
