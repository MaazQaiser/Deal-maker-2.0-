"use client";

import type { DealCreationFormValues } from "@/lib/validations/deal";
import {
  getStockVehicleImage,
  stockVehicles,
} from "@/constants/deal-mock-data";
import { getPreviewDealId } from "@/lib/test-drive-utils";
import { useDealStore } from "@/store/dealStore";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import {
  Card,
  CardContent,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type VehicleSummaryCardProps = {
  className?: string;
};

export function VehicleSummaryCard({ className }: VehicleSummaryCardProps) {
  const creationDraft = useDealStore((s) => s.creationDraft);
  const nextDealNumber = useDealStore((s) => s.nextDealNumber);

  if (!creationDraft) {
    return null;
  }

  const vehicle = stockVehicles.find((v) => v.id === creationDraft.vehicleId);

  if (!vehicle) {
    return null;
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-t-[24px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getStockVehicleImage(vehicle.make)}
            alt={`${vehicle.make} ${vehicle.model} ${vehicle.variant}`}
            className="h-40 w-full object-cover"
            decoding="async"
          />
        </div>
        <div className="flex items-start gap-3 p-6 pt-4">
          <CarBrandLogo make={vehicle.make} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {vehicle.make} {vehicle.model} {vehicle.variant}
            </p>
            <Badge variant="neutral" className="mt-2 font-mono">
              Deal #{getPreviewDealId(nextDealNumber)}
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground">
              Customer: {creationDraft.firstName} {creationDraft.lastName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function useCreationVehicle() {
  const creationDraft = useDealStore((s) => s.creationDraft);
  if (!creationDraft) return null;
  return stockVehicles.find((v) => v.id === creationDraft.vehicleId) ?? null;
}

export function useCreationDraft(): DealCreationFormValues | null {
  return useDealStore((s) => s.creationDraft);
}
