"use client";

import { formatGbp } from "@/lib/formatGbp";
import { getDealHealthStatus } from "@/lib/deal-builder/finance";
import { KeyValueList } from "@/components/data-display/key-value-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type DealHealthPanelProps = {
  vehicleCost: number;
  vehicleMargin: number;
  pxMargin: number;
  productMargin: number;
  className?: string;
};

export function DealHealthPanel({
  vehicleCost,
  vehicleMargin,
  pxMargin,
  productMargin,
  className,
}: DealHealthPanelProps) {
  const totalMargin = vehicleMargin + pxMargin + productMargin;
  const dealHealth = getDealHealthStatus(totalMargin);

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Deal health</CardTitle>
          <Badge variant="neutral" className="text-[10px] uppercase">
            Internal
          </Badge>
        </div>
        <p className="text-caption text-muted-foreground">
          Internal only — customer cannot see
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <KeyValueList
          items={[
            { key: "Vehicle cost", value: formatGbp(vehicleCost) },
            { key: "Vehicle margin", value: formatGbp(vehicleMargin) },
            { key: "PX margin", value: formatGbp(pxMargin) },
            { key: "Product margin", value: formatGbp(productMargin) },
          ]}
        />
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium">Total margin</span>
          <span className="text-heading-4">{formatGbp(totalMargin)}</span>
        </div>
        <Badge
          variant={
            dealHealth.status === "healthy"
              ? "success"
              : dealHealth.status === "low"
                ? "warning"
                : "danger"
          }
          className="w-full justify-center py-2"
        >
          {dealHealth.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
