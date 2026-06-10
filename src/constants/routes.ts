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
    presentation: (id: string) =>
      `/deal-builder/${id}/presentation` as const,
    financeFit: (id: string) => `/deal-builder/${id}/finance-fit` as const,
    complete: (id: string) => `/deal-builder/${id}/complete` as const,
    /** @deprecated Use complete */
    review: (id: string) => `/deal-builder/${id}/complete` as const,
    /** @deprecated Use complete */
    signature: (id: string) => `/deal-builder/${id}/complete` as const,
  },

  deals: {
    index: "/deals",
    new: {
      index: "/deals/new",
      step2: "/deals/new/step-2",
      step3: "/deals/new/step-3",
      step4: "/deals/new/step-4",
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
    description: "Overview of your deal pipeline, activity, and all deals.",
  },

  [routes.deals.index]: {
    title: "Dashboard",
    description: "Redirected to dashboard.",
  },
  [routes.deals.new.index]: {
    title: "Arrival & intake",
    description: "Capture customer, part exchange, and vehicle of interest.",
  },
  [routes.deals.new.step2]: {
    title: "Pre-test-drive checklist",
    description: "Complete compliance items before the test drive.",
  },
  [routes.deals.new.step3]: {
    title: "Test drive notes",
    description: "Capture buying motivations during the test drive.",
  },
  [routes.deals.new.step4]: {
    title: "Trial close",
    description: "Score the vehicle before presentation.",
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
