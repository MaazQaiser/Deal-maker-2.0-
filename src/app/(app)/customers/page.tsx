import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersIndexPage() {
  return <RoutePlaceholder path={routes.customers.index} />;
}
