import type { Branch } from "@/types/deal";

export type DealStatus =
  | "draft"
  | "presented"
  | "won"
  | "lost"
  | "finance-pending";

export type FinanceType = "HP" | "PCP" | "0% Finance" | "Cash";

export type RecentDeal = {
  id: string;
  customer: string;
  vehicle: string;
  financeType: FinanceType;
  monthlyPayment: number | null;
  deposit: string;
  salesperson: string;
  branch: Branch;
  status: DealStatus;
  lastUpdated: Date;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: "deal" | "customer" | "finance" | "vehicle" | "proposal";
};
