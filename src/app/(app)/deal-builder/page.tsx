import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Deal Builder",
};

export default function DealBuilderIndexPage() {
  return <RoutePlaceholder path={routes.dealBuilder.index} />;
}
