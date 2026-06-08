import type { DealFlowStep, FinanceOptionType } from "@/types/deal-flow";
import { routes } from "@/constants/routes";

/**
 * Deal creation user journey:
 *
 * Login → Dashboard → New Deal → Vehicle Lookup → Vehicle Found
 * → Part Exchange → Products → Finance Options (0% / HP / PCP)
 * → Select Finance → Review → Save → Print Proposal → Deal History
 */

export const financeOptionTypes: {
  type: FinanceOptionType;
  label: string;
  description: string;
}[] = [
  { type: "0", label: "0% Finance", description: "Interest-free finance option" },
  { type: "hp", label: "HP", description: "Hire Purchase agreement" },
  { type: "pcp", label: "PCP", description: "Personal Contract Purchase" },
];

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
    title: "New Deal",
    description: "Begin the deal creation wizard.",
    path: routes.deals.new.index,
    phase: "wizard",
    order: 3,
    previous: "dashboard",
    next: "vehicle-lookup",
  },
  {
    id: "vehicle-lookup",
    title: "Vehicle Lookup",
    description: "Search for a vehicle by registration or stock number.",
    path: routes.deals.new.vehicleLookup,
    phase: "wizard",
    order: 4,
    previous: "new-deal",
    next: "vehicle-found",
  },
  {
    id: "vehicle-found",
    title: "Vehicle Found",
    description: "Confirm the selected vehicle details.",
    path: routes.deals.new.vehicleFound,
    phase: "wizard",
    order: 5,
    previous: "vehicle-lookup",
    next: "part-exchange",
  },
  {
    id: "part-exchange",
    title: "Part Exchange Entry",
    description: "Enter part exchange vehicle details.",
    path: routes.deals.new.partExchange,
    phase: "wizard",
    order: 6,
    previous: "vehicle-found",
    next: "products",
  },
  {
    id: "products",
    title: "Products Included",
    description: "Select products and add-ons for the deal.",
    path: routes.deals.new.products,
    phase: "wizard",
    order: 7,
    previous: "part-exchange",
    next: "finance-options",
  },
  {
    id: "finance-options",
    title: "Finance Options Generated",
    description: "Review generated finance options: 0%, HP, and PCP.",
    path: routes.deals.new.financeOptions,
    phase: "wizard",
    order: 8,
    previous: "products",
    next: "select-finance",
  },
  {
    id: "finance-option-detail",
    title: "Finance Option Detail",
    description: "View details for a specific finance option.",
    path: routes.deals.new.financeOption("0"),
    phase: "wizard",
    order: 8,
    previous: "finance-options",
    next: "select-finance",
  },
  {
    id: "select-finance",
    title: "Select Finance Option",
    description: "Choose the customer's preferred finance option.",
    path: routes.deals.new.selectFinance,
    phase: "wizard",
    order: 9,
    previous: "finance-options",
    next: "review",
  },
  {
    id: "review",
    title: "Review Deal",
    description: "Review all deal details before saving.",
    path: routes.deals.new.review,
    phase: "wizard",
    order: 10,
    previous: "select-finance",
    next: "save-deal",
  },
  {
    id: "save-deal",
    title: "Save Deal",
    description: "Save the deal and generate a deal reference.",
    path: routes.deals.detail(":id"),
    phase: "post-save",
    order: 11,
    previous: "review",
    next: "print-proposal",
  },
  {
    id: "print-proposal",
    title: "Print Proposal",
    description: "Generate and print the customer proposal.",
    path: routes.deals.proposal(":id"),
    phase: "post-save",
    order: 12,
    previous: "save-deal",
    next: "deal-history",
  },
  {
    id: "deal-history",
    title: "Deal History",
    description: "View all saved deals and their status.",
    path: routes.deals.index,
    phase: "post-save",
    order: 13,
    previous: "print-proposal",
  },
];

export const dealFlowStartStep = dealFlowSteps.find((step) => step.order === 1)!;

export const wizardSteps = dealFlowSteps.filter((s) => s.phase === "wizard");

export function getDealFlowStepById(
  id: DealFlowStep["id"]
): DealFlowStep | undefined {
  return dealFlowSteps.find((step) => step.id === id);
}

export function getDealFlowStepByPath(
  pathname: string
): DealFlowStep | undefined {
  const exact = dealFlowSteps.find((step) => step.path === pathname);
  if (exact) return exact;

  if (pathname.startsWith("/deals/new/finance-options/")) {
    return getDealFlowStepById("finance-option-detail");
  }

  if (pathname.match(/^\/deals\/[^/]+\/proposal$/)) {
    return getDealFlowStepById("print-proposal");
  }

  if (pathname.match(/^\/deals\/[^/]+$/) && pathname !== "/deals/new") {
    return getDealFlowStepById("save-deal");
  }

  return undefined;
}
