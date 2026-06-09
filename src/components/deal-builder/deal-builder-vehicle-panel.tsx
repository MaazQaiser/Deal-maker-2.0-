"use client";

import { Calendar, Gauge, Palette } from "lucide-react";
import { getStockVehicleImage } from "@/constants/deal-mock-data";
import { formatGbp } from "@/lib/formatGbp";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import { Card, CardContent } from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";

type DealBuilderVehiclePanelProps = {
  make: string;
  model: string;
  variant: string;
  registration: string;
  year: number;
  mileage: number;
  colour: string;
  retailPrice: number;
  partExchangeValue: number | null;
  customerBudget: number | null;
  showInternalMargin?: boolean;
  vehicleMargin?: number;
};

export function DealBuilderVehiclePanel({
  make,
  model,
  variant,
  registration,
  year,
  mileage,
  colour,
  retailPrice,
  partExchangeValue,
  customerBudget,
  showInternalMargin = false,
  vehicleMargin,
}: DealBuilderVehiclePanelProps) {
  const vehicleName = `${make} ${model} ${variant}`;

  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-0">
        <div className="flex items-center justify-center bg-muted/40 px-4 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getStockVehicleImage(make, model)}
            alt={vehicleName}
            className="h-auto max-h-[140px] w-full max-w-[240px] object-contain"
            decoding="async"
          />
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <CarBrandLogo make={make} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{vehicleName}</p>
              <Badge variant="neutral" className="mt-2 font-mono">
                {registration}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4 shrink-0 text-primary/70" aria-hidden />
              {year}
            </span>
            <span className="inline-flex items-center gap-2">
              <Gauge className="size-4 shrink-0 text-primary/70" aria-hidden />
              {mileage.toLocaleString("en-GB")} miles
            </span>
            <span className="inline-flex items-center gap-2">
              <Palette className="size-4 shrink-0 text-primary/70" aria-hidden />
              {colour}
            </span>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption">Retail Price</span>
              <span className="text-base font-semibold">
                {formatGbp(retailPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption">Part Exchange Value</span>
              <span className="text-sm font-medium">
                {partExchangeValue != null ? formatGbp(partExchangeValue) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption">Customer Budget</span>
              <span className="text-sm font-medium">
                {customerBudget != null ? `${formatGbp(customerBudget)}/mo` : "—"}
              </span>
            </div>
          </div>

          {showInternalMargin && vehicleMargin != null ? (
            <div className="rounded-lg border border-dashed border-warning/40 bg-warning/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-caption">Vehicle Margin (internal)</span>
                <span className="text-sm font-semibold">
                  {formatGbp(vehicleMargin)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
