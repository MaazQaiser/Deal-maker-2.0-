import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return <RoutePlaceholder path={routes.reports} />;
}
