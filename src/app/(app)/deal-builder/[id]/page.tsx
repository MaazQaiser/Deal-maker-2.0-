import type { Metadata } from "next";
import { DealBuilderWorkspace } from "@/components/deal-builder/deal-builder-workspace";

type DealBuilderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DealBuilderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Deal Builder ${id}` };
}

export default async function DealBuilderDetailPage({
  params,
}: DealBuilderDetailPageProps) {
  const { id } = await params;

  return <DealBuilderWorkspace dealId={id} />;
}
