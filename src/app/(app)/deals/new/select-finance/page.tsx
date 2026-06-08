import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Select Finance Option",
};

export default function SelectFinancePage() {
  return (
    <DealFlowPlaceholder
      stepId="select-finance"
      path={routes.deals.new.selectFinance}
    />
  );
}
