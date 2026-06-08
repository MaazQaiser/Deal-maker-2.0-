import type { Metadata } from "next";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { getDealDetailMeta } from "@/constants/routes";

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
  const meta = getDealDetailMeta(id);

  return (
    <DealFlowPlaceholder
      stepId="save-deal"
      path={meta.path}
      title={meta.title}
      description={meta.description}
    />
  );
}
