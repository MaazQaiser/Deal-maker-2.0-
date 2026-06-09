import type { ActivityItem } from "@/types/dashboard";
import type { DealRecord } from "@/types/deal";
import type { DealFinancePlan } from "@/store/dealStore";

export type DealLifecycleStage =
  | "created"
  | "checklist-complete"
  | "test-drive-complete"
  | "trial-close-complete"
  | "finance-configured"
  | "presented"
  | "outcome";

export type DealDetailBundle = {
  deal: DealRecord;
  financePlan?: DealFinancePlan;
  activities: ActivityItem[];
  lastUpdated: Date;
  lifecycleStage: DealLifecycleStage;
};
