import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Finance",
};

export default function SettingsFinancePage() {
  return <RoutePlaceholder path={routes.settings.finance} />;
}
