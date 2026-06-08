import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Vehicle Found",
};

export default function VehicleFoundPage() {
  return (
    <DealFlowPlaceholder
      stepId="vehicle-found"
      path={routes.deals.new.vehicleFound}
    />
  );
}
