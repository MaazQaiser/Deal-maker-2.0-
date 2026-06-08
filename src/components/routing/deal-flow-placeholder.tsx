import type { DealFlowStepId } from "@/types/deal-flow";
import { getDealFlowStepById, wizardSteps } from "@/constants/deal-flow";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { cn } from "@/lib/cn";

type DealFlowPlaceholderProps = {
  stepId: DealFlowStepId;
  path: string;
  title?: string;
  description?: string;
  className?: string;
};

export function DealFlowPlaceholder({
  stepId,
  path,
  title,
  description,
  className,
}: DealFlowPlaceholderProps) {
  const step = getDealFlowStepById(stepId);
  const wizardIndex = wizardSteps.findIndex((s) => s.id === stepId);
  const isWizardStep = step?.phase === "wizard" && wizardIndex >= 0;

  return (
    <div className={cn("space-y-4", className)}>
      {isWizardStep && (
        <p className="text-caption text-muted-foreground px-6 sm:px-8 pt-6 sm:pt-8">
          Step {wizardIndex + 1} of{" "}
          {wizardSteps.filter((s) => s.id !== "finance-option-detail").length}
          {" · "}
          Deal Wizard
        </p>
      )}
      <RoutePlaceholder
        path={path}
        title={title ?? step?.title}
        description={description ?? step?.description}
        className={isWizardStep ? "pt-0" : undefined}
      />
    </div>
  );
}
