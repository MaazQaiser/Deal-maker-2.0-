import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealReviewRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(routes.dealBuilder.complete(id));
}
