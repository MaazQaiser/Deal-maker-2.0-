import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";

type InfoCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function InfoCard({
  title,
  description,
  icon: Icon,
  children,
  action,
  className,
}: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="size-5 text-primary" aria-hidden="true" />
            </div>
          )}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        {action}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
