"use client";

import { Check } from "lucide-react";
import type { DealLifecycleStage } from "@/types/deal-detail";
import { cn } from "@/lib/cn";

const LIFECYCLE_STEPS: { id: DealLifecycleStage; label: string }[] = [
  { id: "created", label: "Created" },
  { id: "checklist-complete", label: "Checklist" },
  { id: "test-drive-complete", label: "Test Drive" },
  { id: "trial-close-complete", label: "Trial Close" },
  { id: "finance-configured", label: "Finance" },
  { id: "presented", label: "Presented" },
  { id: "outcome", label: "Outcome" },
];

const STAGE_ORDER: DealLifecycleStage[] = LIFECYCLE_STEPS.map((s) => s.id);

function getStageIndex(stage: DealLifecycleStage): number {
  return STAGE_ORDER.indexOf(stage);
}

type DealLifecycleStepperProps = {
  currentStage: DealLifecycleStage;
};

export function DealLifecycleStepper({
  currentStage,
}: DealLifecycleStepperProps) {
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="overflow-x-auto rounded-[24px] border border-border bg-card p-4">
      <ol className="flex min-w-[640px] items-center gap-2">
        {LIFECYCLE_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isComplete && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    isUpcoming && "bg-muted text-muted-foreground",
                  )}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-center text-[11px] font-medium leading-tight",
                    isCurrent && "text-primary",
                    isUpcoming && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < LIFECYCLE_STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mb-5 h-px flex-1",
                    index < currentIndex ? "bg-success" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
