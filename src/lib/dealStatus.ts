import type { DealStatus } from "@/types/dashboard";

export const dealStatusVariant: Record<
  DealStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  draft: "info",
  presented: "info",
  won: "success",
  lost: "danger",
  "finance-pending": "warning",
};

export const dealStatusLabel: Record<DealStatus, string> = {
  draft: "Draft",
  presented: "Presented",
  won: "Won",
  lost: "Lost",
  "finance-pending": "Finance Pending",
};
