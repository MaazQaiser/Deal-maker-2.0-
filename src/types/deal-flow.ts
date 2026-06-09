export type DealFlowPhase = "auth" | "app" | "wizard" | "post-save";

export type FinanceOptionType = "0" | "hp" | "pcp";

export type DealFlowStepId =
  | "login"
  | "dashboard"
  | "new-deal"
  | "deal-creation-step-2"
  | "vehicle-lookup"
  | "vehicle-found"
  | "part-exchange"
  | "products"
  | "finance-options"
  | "finance-option-detail"
  | "select-finance"
  | "review"
  | "save-deal"
  | "print-proposal"
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
