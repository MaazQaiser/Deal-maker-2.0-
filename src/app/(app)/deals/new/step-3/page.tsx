import type { Metadata } from "next";
import { TestDriveNotesScreen } from "@/components/deals/test-drive-notes-screen";

export const metadata: Metadata = {
  title: "Test Drive Notes",
};

export default function NewDealStep3Page() {
  return <TestDriveNotesScreen />;
}
