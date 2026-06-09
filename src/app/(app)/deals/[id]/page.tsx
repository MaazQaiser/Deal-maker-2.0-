import type { Metadata } from "next";
import { DealDetailScreen } from "@/components/deals/deal-detail-screen";

type DealDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DealDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Deal ${id}` };
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  return <DealDetailScreen dealId={id} />;
}
