"use client";

import { useState } from "react";
import { Check, Info, Sparkles } from "lucide-react";
import { financeProducts } from "@/constants/finance-products";
import {
  INCLUDED_PRODUCT_DETAILS,
  type IncludedProductId,
  type IncludedProductMeta,
} from "@/constants/presentation-content";
import { formatGbp } from "@/lib/formatGbp";
import {
  FinanceOption,
  getFinanceSummary,
  type DealFinanceContext,
} from "@/lib/deal-builder/finance";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/data-display/card";
import { ProductTrainingDrawer } from "@/components/deal-builder/product-training-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const zeroHighlightProducts: Partial<Record<string, IncludedProductId>> = {
  "Warranty included": "warranty",
  "Service plan included": "service-plan",
  "Lifetime MOT included": "lifetime-mot",
  "Supagard included": "supaguard",
};

export type ZeroFinanceCardProps = {
  deposit: number;
  financeContext: DealFinanceContext;
  summary: ReturnType<typeof getFinanceSummary>;
  suggestedOption?: FinanceOption;
  selected?: boolean;
  onSelectFinance?: (option: FinanceOption) => void;
  showCta?: boolean;
  hideDepositMessage?: boolean;
  className?: string;
};

export function ZeroFinanceCard({
  deposit,
  financeContext,
  summary,
  suggestedOption,
  selected = false,
  onSelectFinance,
  showCta = false,
  hideDepositMessage = false,
  className,
}: ZeroFinanceCardProps) {
  const [trainingProduct, setTrainingProduct] =
    useState<IncludedProductMeta | null>(null);
  const [trainingOpen, setTrainingOpen] = useState(false);

  const zeroProduct = financeProducts.zero;
  const depositShortfall = Math.max(
    0,
    summary.zeroDepositRequired - deposit - financeContext.pxEquity,
  );

  const openProductTraining = (productId: IncludedProductId) => {
    setTrainingProduct(INCLUDED_PRODUCT_DETAILS[productId]);
    setTrainingOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden",
          selected && summary.zeroEligible
            ? "border-primary ring-1 ring-primary/20"
            : undefined,
          !summary.zeroEligible && "opacity-95",
          className,
        )}
      >
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/85 to-primary px-5 py-3.5 text-primary-foreground">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/80">
                The best value deal
              </p>
              {suggestedOption === "zero" && (
                <Badge variant="neutral" className="border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground">
                  Suggested for this customer
                </Badge>
              )}
            </div>
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-primary-foreground">
              <Sparkles className="size-5 text-primary-foreground/90" aria-hidden />
              {zeroProduct.headline}
            </CardTitle>
          </div>
        </div>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly payment
              </p>
              <p className="text-lg font-normal">
                {formatGbp(summary.zeroMonthly)}/month
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Deposit required
              </p>
              <p className="text-lg font-normal">
                {formatGbp(summary.zeroDepositRequired)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="text-lg font-normal">18 months</p>
            </div>
          </div>

          {summary.zeroEligible ? (
            <div className="rounded-[16px] bg-success/10 px-4 py-3">
              <p className="text-sm font-semibold text-success">
                You save {formatGbp(summary.productValue)} vs financed products
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                {zeroProduct.endOutcome}
              </p>
            </div>
          ) : hideDepositMessage ? null : (
            <div className="rounded-[16px] bg-muted px-4 py-3">
              <p className="text-sm font-medium">
                Increase deposit by {formatGbp(depositShortfall)} to unlock 0%
                finance
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                Current deposit + PX equity:{" "}
                {formatGbp(deposit + financeContext.pxEquity)} · Required:{" "}
                {formatGbp(summary.zeroDepositRequired)}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {zeroProduct.highlights.map((item) => {
              const productId = zeroHighlightProducts[item];

              return (
                <Badge
                  key={item}
                  variant="neutral"
                  className="gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium normal-case tracking-normal"
                >
                  <Check className="size-3.5 shrink-0 text-success" aria-hidden />
                  {item}
                  {productId ? (
                    <button
                      type="button"
                      className="inline-flex rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      aria-label={`Learn more about ${item}`}
                      onClick={() => openProductTraining(productId)}
                    >
                      <Info className="size-3.5" />
                    </button>
                  ) : (
                    <Info
                      className="size-3.5 shrink-0 opacity-60"
                      aria-hidden
                    />
                  )}
                </Badge>
              );
            })}
          </div>

          {showCta && onSelectFinance ? (
            <Button
              type="button"
              variant={selected ? "primary" : "outline"}
              className="w-full"
              disabled={!summary.zeroEligible}
              onClick={() => onSelectFinance("zero")}
            >
              {zeroProduct.cta}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <ProductTrainingDrawer
        product={trainingProduct}
        open={trainingOpen}
        onOpenChange={setTrainingOpen}
      />
    </>
  );
}
