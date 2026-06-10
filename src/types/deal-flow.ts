export type DealFlowPhase = "auth" | "app" | "wizard" | "deal-builder" | "post-save";

export type FinanceOptionType = "0" | "hp" | "pcp";

export type DealFlowStepId =
  | "login"
  | "dashboard"
  | "new-deal"
  | "deal-creation-step-2"
  | "deal-creation-step-3"
  | "deal-creation-step-4"
  | "presentation"
  | "finance-fit"
  | "complete"
  | "save-deal"
  | "deal-history";

export type DealFlowStep = {
  id: DealFlowStepId;
  title: string;
  description?: string;
  path: string;
  phase: DealFlowPhase;
  order: number;
  next?: DealFlowStepId;
  previous?: DealFlowStepId;
};
