import {
  dealFlowSteps,
  getDealFlowStepById,
  getDealFlowStepByPath,
} from "@/constants/deal-flow";
import type { DealFlowStep, DealFlowStepId } from "@/types/deal-flow";

export function getNextStep(
  currentId: DealFlowStepId
): DealFlowStep | undefined {
  const current = getDealFlowStepById(currentId);
  if (!current?.next) return undefined;
  return getDealFlowStepById(current.next);
}

export function getPreviousStep(
  currentId: DealFlowStepId
): DealFlowStep | undefined {
  const current = getDealFlowStepById(currentId);
  if (!current?.previous) return undefined;
  return getDealFlowStepById(current.previous);
}

export function getWizardProgress(pathname: string): {
  currentStep?: DealFlowStep;
  stepIndex: number;
  totalSteps: number;
} {
  const wizardOnly = dealFlowSteps.filter((s) => s.phase === "wizard");
  const currentStep = getDealFlowStepByPath(pathname);
  const stepIndex = currentStep
    ? wizardOnly.findIndex((s) => s.id === currentStep.id)
    : -1;

  return {
    currentStep,
    stepIndex: stepIndex >= 0 ? stepIndex + 1 : 0,
    totalSteps: wizardOnly.length,
  };
}

export { getDealFlowStepById, getDealFlowStepByPath };
