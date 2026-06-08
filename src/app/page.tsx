import { redirect } from "next/navigation";
import { dealFlowStartStep } from "@/constants/deal-flow";

export default function RootPage() {
  redirect(dealFlowStartStep.path);
}
