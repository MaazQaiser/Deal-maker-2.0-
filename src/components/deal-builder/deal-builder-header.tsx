"use client";

import Link from "next/link";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";

export type ViewMode = "sales" | "presentation";

type DealBuilderHeaderProps = {
  dealId: string;
  customerName: string;
  vehicleLabel: string;
  presentationTimer: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

const viewModeLabels: Record<ViewMode, string> = {
  sales: "Sales View",
  presentation: "Presentation View",
};

function ViewModeBadge({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const nextMode: ViewMode = viewMode === "sales" ? "presentation" : "sales";

  return (
    <button
      type="button"
      onClick={() => onViewModeChange(nextMode)}
      aria-label={`Switch to ${viewModeLabels[nextMode]}`}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      {viewModeLabels[viewMode]}
      <ArrowLeftRight className="size-4 text-muted-foreground" aria-hidden />
    </button>
  );
}

export function DealBuilderHeader({
  dealId,
  customerName,
  vehicleLabel,
  presentationTimer,
  viewMode,
  onViewModeChange,
}: DealBuilderHeaderProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
      <Button type="button" variant="ghost" size="sm" className="size-9 shrink-0 p-0" asChild>
        <Link href={routes.deals.new.index} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Link>
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight">Deal Builder</h1>
        <p className="text-caption">
          Deal #{dealId} · {customerName} · {vehicleLabel}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <p className="text-caption">Presentation Time</p>
          <p className="font-mono text-sm font-medium">{presentationTimer}</p>
        </div>

        <ViewModeBadge viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </header>
  );
}
