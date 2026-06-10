import {
  BarChart3,
  CreditCard,
  Home,
  Layers,
  Package,
  Settings,
  Users,
} from "lucide-react";
import type { NavItem } from "@/types";
import { routes } from "@/constants/routes";

export const appConfig = {
  name: "Deal Builder",
  description: "Modern SaaS application foundation",
} as const;

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: routes.dashboard,
    icon: Home,
  },
  {
    title: "Deal Builder",
    href: routes.dealBuilder.index,
    icon: Layers,
  },
  {
    title: "Customers",
    href: routes.customers.index,
    icon: Users,
  },
  {
    title: "Reports",
    href: routes.reports,
    icon: BarChart3,
  },
];

export const settingsNavItems: NavItem[] = [
  {
    title: "Products",
    href: routes.settings.products,
    icon: Package,
  },
  {
    title: "Finance",
    href: routes.settings.finance,
    icon: CreditCard,
  },
  {
    title: "Users",
    href: routes.settings.users,
    icon: Users,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    title: "Settings",
    href: routes.settings.index,
    icon: Settings,
    children: settingsNavItems,
  },
];

export const allNavItems: NavItem[] = [
  ...mainNavItems,
  ...secondaryNavItems,
];

/** Static route → breadcrumb label */
export const routeLabels: Record<string, string> = {
  [routes.dashboard]: "Dashboard",

  [routes.deals.new.index]: "Arrival & intake",
  [routes.deals.new.step2]: "Pre-test-drive checklist",
  [routes.deals.new.step3]: "Test drive notes",
  [routes.deals.new.step4]: "Trial close",

  [routes.dealBuilder.index]: "Deal Builder",
  [routes.dealBuilder.new]: "New",
  [routes.customers.index]: "Customers",
  [routes.reports]: "Reports",
  [routes.settings.index]: "Settings",
  [routes.settings.products]: "Products",
  [routes.settings.finance]: "Finance",
  [routes.settings.users]: "Users",
};

/** Segment-level label overrides */
export const segmentLabels: Record<string, string> = {
  new: "New deal",
  "step-2": "Checklist",
  "step-3": "Test drive",
  "step-4": "Trial close",
  presentation: "0% presentation",
  "finance-fit": "Finance fit",
  complete: "Summary & signature",
  proposal: "Print proposal",
};

/** Dynamic segment labels keyed by parent path */
export const dynamicBreadcrumbLabels: Record<string, string> = {
  [routes.dealBuilder.index]: "Deal builder",
  [routes.dashboard]: "Deal details",
  [routes.customers.index]: "Customer details",
};
