import { dealCreationSteps } from "@/constants/deal-creation-steps";
import { cn } from "@/lib/cn";

type DealCreationStepperProps = {
  currentStep: number;
  className?: string;
};

export function DealCreationStepper({
  currentStep,
  className,
}: DealCreationStepperProps) {
  const step = dealCreationSteps.find((item) => item.step === currentStep);
  const totalSteps = dealCreationSteps.length;

  if (!step) return null;

  return (
    <div
      className={cn("flex items-center gap-2 pt-2", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}: ${step.title}`}
    >
      {dealCreationSteps.map((item) => {
        const isComplete = item.step < currentStep;
        const isCurrent = item.step === currentStep;

        return (
          <div
            key={item.step}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              isComplete && "bg-foreground",
              isCurrent && "bg-primary",
              !isComplete && !isCurrent && "bg-border",
            )}
          />
        );
      })}
    </div>
  );
}
