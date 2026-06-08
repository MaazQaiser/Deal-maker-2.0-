import { dealBuilderStages } from "@/constants/deal-stages";
import { cn } from "@/lib/cn";

type DealStageStepperProps = {
  currentStage: number;
  className?: string;
};

export function DealStageStepper({
  currentStage,
  className,
}: DealStageStepperProps) {
  const stage = dealBuilderStages[currentStage - 1];
  const totalStages = dealBuilderStages.length;

  if (!stage) return null;

  return (
    <div
      className={cn("flex items-center gap-2 pt-2", className)}
      role="progressbar"
      aria-valuenow={currentStage}
      aria-valuemin={1}
      aria-valuemax={totalStages}
      aria-label={`Stage ${currentStage} of ${totalStages}: ${stage.title}`}
    >
      {Array.from({ length: totalStages }, (_, index) => {
        const step = index + 1;
        const isComplete = step < currentStage;
        const isCurrent = step === currentStage;

        return (
          <div
            key={step}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              isComplete && "bg-foreground",
              isCurrent && "bg-primary",
              !isComplete && !isCurrent && "bg-border"
            )}
          />
        );
      })}
    </div>
  );
}
