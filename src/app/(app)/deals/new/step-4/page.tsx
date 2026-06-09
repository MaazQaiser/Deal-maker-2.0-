import type { Metadata } from "next";
import { TrialCloseScreen } from "@/components/deals/trial-close-screen";

export const metadata: Metadata = {
  title: "Trial Close",
};

export default function NewDealStep4Page() {
  return <TrialCloseScreen />;
}
