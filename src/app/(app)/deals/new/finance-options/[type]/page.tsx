import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealFlowPlaceholder } from "@/components/routing/deal-flow-placeholder";
import { getFinanceOptionMeta, routes } from "@/constants/routes";
import type { FinanceOptionType } from "@/types/deal-flow";

const validTypes: FinanceOptionType[] = ["0", "hp", "pcp"];

type FinanceOptionDetailPageProps = {
  params: Promise<{ type: string }>;
};

function parseFinanceType(type: string): FinanceOptionType | null {
  return validTypes.includes(type as FinanceOptionType)
    ? (type as FinanceOptionType)
    : null;
}

export async function generateMetadata({
  params,
}: FinanceOptionDetailPageProps): Promise<Metadata> {
  const { type } = await params;
  const financeType = parseFinanceType(type);
  if (!financeType) return { title: "Finance Option" };
  return { title: getFinanceOptionMeta(financeType).title };
}

export default async function FinanceOptionDetailPage({
  params,
}: FinanceOptionDetailPageProps) {
  const { type } = await params;
  const financeType = parseFinanceType(type);

  if (!financeType) {
    notFound();
  }

  const meta = getFinanceOptionMeta(financeType);

  return (
    <DealFlowPlaceholder
      stepId="finance-option-detail"
      path={meta.path}
      title={meta.title}
      description={meta.description}
    />
  );
}
