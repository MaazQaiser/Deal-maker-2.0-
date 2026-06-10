import type { Metadata } from "next";
import { DealPresentationScreen } from "@/components/deal-builder/deal-presentation-screen";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `0% Presentation · ${id}` };
}

export default async function DealPresentationPage({ params }: PageProps) {
  const { id } = await params;
  return <DealPresentationScreen dealId={id} />;
}
