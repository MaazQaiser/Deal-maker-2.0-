import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { getDealProposalMeta } from "@/constants/routes";

type DealProposalPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DealProposalPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Proposal — Deal ${id}` };
}

export default async function DealProposalPage({
  params,
}: DealProposalPageProps) {
  const { id } = await params;
  const meta = getDealProposalMeta(id);

  return (
    <DealFlowPlaceholder
      stepId="print-proposal"
      path={meta.path}
      title={meta.title}
      description={meta.description}
    />
  );
}
