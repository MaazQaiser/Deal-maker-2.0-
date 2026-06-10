import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealProposalPage({ params }: PageProps) {
  const { id } = await params;
  redirect(routes.deals.detail(id));
}
