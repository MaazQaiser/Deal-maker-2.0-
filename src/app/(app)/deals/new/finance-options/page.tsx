import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Finance Options Generated",
};

export default function FinanceOptionsPage() {
  return (
    <DealFlowPlaceholder
      stepId="finance-options"
      path={routes.deals.new.financeOptions}
    />
  );
}
