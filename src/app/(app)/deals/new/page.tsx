import type { Metadata } from "next";
import { DealCreationScreen } from "@/components/deals/deal-creation-screen";

export const metadata: Metadata = {
  title: "Create New Deal",
};

export default function NewDealPage() {
  return <DealCreationScreen />;
}
