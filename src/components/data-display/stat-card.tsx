import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/data-display/card";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-caption font-medium">{title}</p>
          {Icon && (
            <div className="flex size-8 items-center justify-center rounded-md bg-muted">
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-heading-2">{value}</p>
          {(description || trend) && (
            <div className="mt-1 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "text-caption font-medium",
                    isPositive ? "text-success" : "text-danger"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
              {description && (
                <span className="text-caption">{description}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
