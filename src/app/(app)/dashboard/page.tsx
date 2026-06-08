import type { Metadata } from "next";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dealership activity overview",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
