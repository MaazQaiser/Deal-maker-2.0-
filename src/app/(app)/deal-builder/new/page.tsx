import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "New Deal Builder",
};

export default function DealBuilderNewPage() {
  return <RoutePlaceholder path={routes.dealBuilder.new} />;
}
