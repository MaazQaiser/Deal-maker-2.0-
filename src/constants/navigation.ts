import {
  BarChart3,
  CreditCard,
  Handshake,
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
    title: "Deals",
    href: routes.deals.index,
    icon: Handshake,
    badge: "12",
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

  [routes.deals.index]: "Deals",
  [routes.deals.new.index]: "New Deal",
  [routes.deals.new.step2]: "Step 2",
  [routes.deals.new.vehicleLookup]: "Vehicle Lookup",
  [routes.deals.new.vehicleFound]: "Vehicle Found",
  [routes.deals.new.partExchange]: "Part Exchange",
  [routes.deals.new.products]: "Products",
  [routes.deals.new.financeOptions]: "Finance Options",
  [routes.deals.new.selectFinance]: "Select Finance",
  [routes.deals.new.review]: "Review Deal",

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
  new: "New Deal",
  "step-2": "Step 2",
  "vehicle-lookup": "Vehicle Lookup",
  "vehicle-found": "Vehicle Found",
  "part-exchange": "Part Exchange",
  products: "Products",
  "finance-options": "Finance Options",
  "select-finance": "Select Finance",
  review: "Review Deal",
  proposal: "Print Proposal",
  "0": "0% Finance",
  hp: "HP",
  pcp: "PCP",
};

/** Dynamic segment labels keyed by parent path */
export const dynamicBreadcrumbLabels: Record<string, string> = {
  [routes.dealBuilder.index]: "Builder Details",
  [routes.deals.index]: "Deal Details",
  [routes.customers.index]: "Customer Details",
};
