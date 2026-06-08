import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Products Included",
};

export default function ProductsPage() {
  return (
    <DealFlowPlaceholder
      stepId="products"
      path={routes.deals.new.products}
    />
  );
}
