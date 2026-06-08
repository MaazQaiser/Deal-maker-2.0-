import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Vehicle Lookup",
};

export default function VehicleLookupPage() {
  return (
    <DealFlowPlaceholder
      stepId="vehicle-lookup"
      path={routes.deals.new.vehicleLookup}
    />
  );
}
