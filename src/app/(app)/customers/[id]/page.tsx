import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CustomerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Customer ${id}` };
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      path={routes.customers.detail(id)}
      title="Customer Details"
      description={`Customer ID: ${id}`}
    />
  );
}
