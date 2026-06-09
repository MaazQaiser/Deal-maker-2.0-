import type { Metadata } from "next";
import { DealCreationStep2Screen } from "@/components/deals/deal-creation-step-2-screen";

export const metadata: Metadata = {
  title: "Create New Deal — Step 2",
};

export default function NewDealStep2Page() {
  return <DealCreationStep2Screen />;
}
