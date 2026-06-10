import type { Metadata } from "next";
import { DealCompleteScreen } from "@/components/deal-builder/deal-complete-screen";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Deal summary · ${id}` };
}

export default async function DealCompletePage({ params }: PageProps) {
  const { id } = await params;
  return <DealCompleteScreen dealId={id} />;
}
