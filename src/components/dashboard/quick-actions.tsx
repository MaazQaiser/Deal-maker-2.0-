import Link from "next/link";
import {
  BarChart3,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";

type ActionItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const actions: ActionItem[] = [
  {
    title: "New Deal",
    description: "Create a new finance deal",
    href: routes.deals.new.index,
    icon: Plus,
  },
  {
    title: "Customers",
    description: "Manage customer records",
    href: routes.customers.index,
    icon: Users,
  },
  {
    title: "Reports",
    description: "View sales analytics",
    href: routes.reports,
    icon: BarChart3,
  },
];

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
              "hover:bg-muted hover:border-border-light"
            )}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <action.icon className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{action.title}</p>
              <p className="text-caption truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
