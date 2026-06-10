"use client";

import Link from "next/link";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "sales" | "presentation";

type DealBuilderHeaderProps = {
  customerName: string;
  vehicleLabel: string;
  presentationTimer?: string;
  title?: string;
  backHref?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
};

const viewModeLabels: Record<ViewMode, string> = {
  sales: "Sales View",
  presentation: "Customer View",
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
  customerName,
  vehicleLabel,
  presentationTimer,
  title = "Deal Builder",
  backHref,
  viewMode,
  onViewModeChange,
  showViewToggle = false,
}: DealBuilderHeaderProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
      {backHref ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-9 shrink-0 p-0"
          asChild
        >
          <Link href={backHref} aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      ) : (
        <div className="size-9 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        <p className="text-caption">
          {customerName} · {vehicleLabel}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {presentationTimer ? (
          <div className="text-right">
            <p className="text-caption">Presentation Time</p>
            <p className="font-mono text-sm font-medium">{presentationTimer}</p>
          </div>
        ) : null}

        {showViewToggle && viewMode && onViewModeChange ? (
          <ViewModeBadge viewMode={viewMode} onViewModeChange={onViewModeChange} />
        ) : null}
      </div>
    </header>
  );
}
