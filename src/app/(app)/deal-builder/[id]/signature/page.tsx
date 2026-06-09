import type { Metadata } from "next";
import { DealSignatureScreen } from "@/components/deal-builder/deal-signature-screen";

type DealSignaturePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DealSignaturePageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Signature — Deal ${id}` };
}

export default async function DealSignaturePage({
  params,
}: DealSignaturePageProps) {
  const { id } = await params;
  return <DealSignatureScreen dealId={id} />;
}
