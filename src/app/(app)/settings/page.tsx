import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsIndexPage() {
  return <RoutePlaceholder path={routes.settings.index} />;
}
