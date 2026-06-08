import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Part Exchange Entry",
};

export default function PartExchangePage() {
  return (
    <DealFlowPlaceholder
      stepId="part-exchange"
      path={routes.deals.new.partExchange}
    />
  );
}
