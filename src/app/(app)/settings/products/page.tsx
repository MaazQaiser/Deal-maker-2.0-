import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Products",
};

export default function SettingsProductsPage() {
  return <RoutePlaceholder path={routes.settings.products} />;
}
