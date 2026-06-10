import type { Metadata } from "next";
import { DealFinanceFitScreen } from "@/components/deal-builder/deal-finance-fit-screen";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Finance fit · ${id}` };
}

export default async function DealFinanceFitPage({ params }: PageProps) {
  const { id } = await params;
  return <DealFinanceFitScreen dealId={id} />;
}
