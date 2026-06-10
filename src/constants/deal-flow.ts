import type { DealFlowStep } from "@/types/deal-flow";
import { routes } from "@/constants/routes";

/**
 * On-site deal journey:
 * Dashboard → Arrival → Checklist → Test drive → Trial close
 * → Presentation → Finance fit → Complete
 */

export const dealFlowSteps: DealFlowStep[] = [
  {
    id: "login",
    title: "Login",
    path: routes.auth.login,
    phase: "auth",
    order: 1,
    next: "dashboard",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Start a new deal from the dashboard.",
    path: routes.dashboard,
    phase: "app",
    order: 2,
    previous: "login",
    next: "new-deal",
  },
  {
    id: "new-deal",
    title: "Arrival & intake",
    description: "Capture customer, part exchange, and vehicle.",
    path: routes.deals.new.index,
    phase: "wizard",
    order: 3,
    previous: "dashboard",
    next: "deal-creation-step-2",
  },
  {
    id: "deal-creation-step-2",
    title: "Pre-test-drive checklist",
    path: routes.deals.new.step2,
    phase: "wizard",
    order: 4,
    previous: "new-deal",
    next: "deal-creation-step-3",
  },
  {
    id: "deal-creation-step-3",
    title: "Test drive notes",
    path: routes.deals.new.step3,
    phase: "wizard",
    order: 5,
    previous: "deal-creation-step-2",
    next: "deal-creation-step-4",
  },
  {
    id: "deal-creation-step-4",
    title: "Trial close",
    path: routes.deals.new.step4,
    phase: "wizard",
    order: 6,
    previous: "deal-creation-step-3",
    next: "presentation",
  },
  {
    id: "presentation",
    title: "0% presentation",
    path: routes.dealBuilder.presentation(":id"),
    phase: "deal-builder",
    order: 7,
    previous: "deal-creation-step-4",
    next: "finance-fit",
  },
  {
    id: "finance-fit",
    title: "Finance fit",
    path: routes.dealBuilder.financeFit(":id"),
    phase: "deal-builder",
    order: 8,
    previous: "presentation",
    next: "complete",
  },
  {
    id: "complete",
    title: "Deal summary & signature",
    path: routes.dealBuilder.complete(":id"),
    phase: "deal-builder",
    order: 9,
    previous: "finance-fit",
    next: "save-deal",
  },
  {
    id: "save-deal",
    title: "Deal saved",
    path: routes.deals.detail(":id"),
    phase: "post-save",
    order: 10,
    previous: "complete",
    next: "deal-history",
  },
  {
    id: "deal-history",
    title: "Dashboard",
    path: routes.dashboard,
    phase: "post-save",
    order: 11,
    previous: "save-deal",
  },
];

export const dealFlowStartStep = dealFlowSteps.find((step) => step.order === 1)!;

export const wizardSteps = dealFlowSteps.filter((s) => s.phase === "wizard");

export function getDealFlowStepById(
  id: DealFlowStep["id"],
): DealFlowStep | undefined {
  return dealFlowSteps.find((step) => step.id === id);
}

export function getDealFlowStepByPath(
  pathname: string,
): DealFlowStep | undefined {
  const exact = dealFlowSteps.find((step) => step.path === pathname);
  if (exact) return exact;

  if (pathname.match(/^\/deal-builder\/[^/]+\/presentation$/)) {
    return getDealFlowStepById("presentation");
  }

  if (pathname.match(/^\/deal-builder\/[^/]+\/finance-fit$/)) {
    return getDealFlowStepById("finance-fit");
  }

  if (pathname.match(/^\/deal-builder\/[^/]+\/complete$/)) {
    return getDealFlowStepById("complete");
  }

  if (pathname.match(/^\/deals\/[^/]+$/) && pathname !== "/deals/new") {
    return getDealFlowStepById("save-deal");
  }

  return undefined;
}
