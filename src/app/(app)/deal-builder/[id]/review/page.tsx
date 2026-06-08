import type { Metadata } from "next";
import { DealSummaryScreen } from "@/components/deal-builder/deal-summary-screen";

type DealBuilderReviewPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DealBuilderReviewPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Deal Summary ${id}` };
}

export default async function DealBuilderReviewPage({
  params,
}: DealBuilderReviewPageProps) {
  const { id } = await params;

  return <DealSummaryScreen dealId={id} />;
}
