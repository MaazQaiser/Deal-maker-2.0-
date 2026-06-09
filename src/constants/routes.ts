import type { FinanceOptionType } from "@/types/deal-flow";

export const routes = {
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },

  dashboard: "/dashboard",

  dealBuilder: {
    index: "/deal-builder",
    new: "/deal-builder/new",
    detail: (id: string) => `/deal-builder/${id}` as const,
    review: (id: string) => `/deal-builder/${id}/review` as const,
    signature: (id: string) => `/deal-builder/${id}/signature` as const,
  },

  deals: {
    index: "/deals",
    new: {
      index: "/deals/new",
      step2: "/deals/new/step-2",
      step3: "/deals/new/step-3",
      step4: "/deals/new/step-4",
      vehicleLookup: "/deals/new/vehicle-lookup",
      vehicleFound: "/deals/new/vehicle-found",
      partExchange: "/deals/new/part-exchange",
      products: "/deals/new/products",
      financeOptions: "/deals/new/finance-options",
      financeOption: (type: FinanceOptionType) =>
        `/deals/new/finance-options/${type}` as const,
      selectFinance: "/deals/new/select-finance",
      review: "/deals/new/review",
    },
    detail: (id: string) => `/deals/${id}` as const,
    proposal: (id: string) => `/deals/${id}/proposal` as const,
  },

  customers: {
    index: "/customers",
    detail: (id: string) => `/customers/${id}` as const,
  },

  reports: "/reports",

  settings: {
    index: "/settings",
    products: "/settings/products",
    finance: "/settings/finance",
    users: "/settings/users",
  },
} as const;

export const routeMeta: Record<
  string,
  { title: string; description?: string }
> = {
  [routes.dashboard]: {
    title: "Dashboard",
    description: "Overview of your deal pipeline and activity.",
  },

  [routes.deals.index]: {
    title: "Deal History",
    description: "View all saved deals and their status.",
  },
  [routes.deals.new.index]: {
    title: "Create New Deal",
    description: "Share the customer and vehicle details for this deal.",
  },
  [routes.deals.new.step2]: {
    title: "Create New Deal",
    description: "Complete the on-site process checklist before continuing.",
  },
  [routes.deals.new.step3]: {
    title: "Test Drive Notes",
    description: "Capture buying motivations during the test drive.",
  },
  [routes.deals.new.step4]: {
    title: "Trial Close",
    description: "Score the vehicle before presentation.",
  },
  [routes.deals.new.vehicleLookup]: {
    title: "Vehicle Lookup",
    description: "Search for a vehicle by registration or stock number.",
  },
  [routes.deals.new.vehicleFound]: {
    title: "Vehicle Found",
    description: "Confirm the selected vehicle details.",
  },
  [routes.deals.new.partExchange]: {
    title: "Part Exchange Entry",
    description: "Enter part exchange vehicle details.",
  },
  [routes.deals.new.products]: {
    title: "Products Included",
    description: "Select products and add-ons for the deal.",
  },
  [routes.deals.new.financeOptions]: {
    title: "Finance Options Generated",
    description: "Review generated finance options: 0%, HP, and PCP.",
  },
  [routes.deals.new.selectFinance]: {
    title: "Select Finance Option",
    description: "Choose the customer's preferred finance option.",
  },
  [routes.deals.new.review]: {
    title: "Review Deal",
    description: "Review all deal details before saving.",
  },

  [routes.dealBuilder.index]: {
    title: "Deal Builder",
    description: "Manage deal templates and configurations.",
  },
  [routes.dealBuilder.new]: {
    title: "New Deal Builder",
    description: "Create a new deal builder template.",
  },
  [routes.customers.index]: {
    title: "Customers",
    description: "Manage customer relationships.",
  },
  [routes.reports]: {
    title: "Reports",
    description: "Analytics and reporting.",
  },
  [routes.settings.index]: {
    title: "Settings",
    description: "Application settings and configuration.",
  },
  [routes.settings.products]: {
    title: "Products",
    description: "Manage product catalog and pricing.",
  },
  [routes.settings.finance]: {
    title: "Finance",
    description: "Financial settings and integrations.",
  },
  [routes.settings.users]: {
    title: "Users",
    description: "Manage team members and permissions.",
  },
};

export function getFinanceOptionMeta(type: FinanceOptionType) {
  const labels: Record<FinanceOptionType, string> = {
    "0": "0% Finance",
    hp: "HP",
    pcp: "PCP",
  };
  return {
    title: labels[type],
    description: `View ${labels[type]} finance option details.`,
    path: routes.deals.new.financeOption(type),
  };
}

export function getDealDetailMeta(id: string) {
  return {
    title: "Deal Saved",
    description: `Deal reference: ${id}`,
    path: routes.deals.detail(id),
  };
}

export function getDealProposalMeta(id: string) {
  return {
    title: "Print Proposal",
    description: `Generate proposal for deal ${id}.`,
    path: routes.deals.proposal(id),
  };
}
