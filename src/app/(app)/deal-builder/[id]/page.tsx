import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

type DealBuilderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealBuilderDetailPage({
  params,
}: DealBuilderDetailPageProps) {
  const { id } = await params;
  redirect(routes.dealBuilder.presentation(id));
}
