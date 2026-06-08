import type { Metadata } from "next";
import { DealHistoryScreen } from "@/components/deals/deal-history-screen";

export const metadata: Metadata = {
  title: "Deal History",
};

export default function DealsIndexPage() {
  return <DealHistoryScreen />;
}
