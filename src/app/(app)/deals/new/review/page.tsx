import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Review Deal",
};

export default function ReviewDealPage() {
  return (
    <DealFlowPlaceholder
      stepId="review"
      path={routes.deals.new.review}
    />
  );
}
