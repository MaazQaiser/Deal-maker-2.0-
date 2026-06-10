"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  Info,
} from "lucide-react";
import {
  INCLUDED_PRODUCT_DETAILS,
  SAVINGS_BREAKDOWN,
  TOTAL_SAVINGS,
  type IncludedProductId,
  type IncludedProductMeta,
} from "@/constants/presentation-content";
import {
  type DealFinanceContext,
  type FinanceOption,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import { formatGbp } from "@/lib/formatGbp";
import { FinanceComparisonPanel } from "@/components/deal-builder/finance-comparison-panel";
import { ProductTrainingDrawer } from "@/components/deal-builder/product-training-drawer";
import { ZeroFinanceCard } from "@/components/deal-builder/zero-finance-card";
import { Card, CardContent } from "@/components/data-display/card";
import { Button } from "@/components/ui/button";

export type PresentationPhase = "zero" | "response" | "alternatives";

type FinancePresentationScreenProps = {
  deposit: number;
  summary: ReturnType<typeof getFinanceSummary>;
  effectiveSelected: FinanceOption;
  phase: PresentationPhase;
  onPhaseChange: (phase: PresentationPhase) => void;
  selectedFinance: FinanceOption;
  onSelectFinance: (option: FinanceOption) => void;
  term: number;
  hpVariant: "a" | "b";
  balloonValue: number;
  apr: number;
  financeContext: DealFinanceContext;
  onSelectHpVariant: (variant: "a" | "b") => void;
};

const PRODUCT_ORDER: IncludedProductId[] = [
  "warranty",
  "service-plan",
  "lifetime-mot",
  "supaguard",
  "cosmetic-cover",
  "tyre-alloy-cover",
];

export function FinancePresentationScreen({
  deposit,
  phase,
  onPhaseChange,
  effectiveSelected,
  onSelectFinance,
  term,
  hpVariant,
  balloonValue,
  apr,
  financeContext,
  onSelectHpVariant,
  summary,
}: FinancePresentationScreenProps) {
  const [trainingProduct, setTrainingProduct] =
    useState<IncludedProductMeta | null>(null);
  const [trainingOpen, setTrainingOpen] = useState(false);

  const openProductTraining = (productId: IncludedProductId) => {
    setTrainingProduct(INCLUDED_PRODUCT_DETAILS[productId]);
    setTrainingOpen(true);
  };

  return (
    <div className="space-y-6">
        <ZeroFinanceCard
          deposit={deposit}
          financeContext={financeContext}
          summary={summary}
          hideDepositMessage
        />

        {/* Savings story */}
        <section className="space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-3 text-left text-sm font-medium">Saving</th>
                <th className="pb-3 text-right text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...SAVINGS_BREAKDOWN]
                .sort((a, b) => b.amount - a.amount)
                .map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-3 font-medium">{item.label}</td>
                    <td className="py-3 text-right font-semibold">
                      {formatGbp(item.amount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="border-t border-border pt-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cost vs savings</p>
                <h3 className="text-heading-2">Total Savings</h3>
              </div>
              <p className="text-display-l font-semibold text-success">
                {formatGbp(TOTAL_SAVINGS)}
              </p>
            </div>
          </div>
        </section>

        {/* Included products */}
        <section className="space-y-4">
          <h3 className="text-heading-3">Included with your purchase</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PRODUCT_ORDER.map((productId) => {
              const product = INCLUDED_PRODUCT_DETAILS[productId];
              return (
                <Card
                  key={productId}
                  className="border-border/80 transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-success"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs leading-snug text-muted-foreground">
                            {product.tagline}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        aria-label={`Learn more about ${product.name}`}
                        onClick={() => openProductTraining(productId)}
                      >
                        <Info className="size-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {phase === "alternatives" ? (
          <>
            <FinanceComparisonPanel
              effectiveSelected={effectiveSelected}
              onSelectFinance={onSelectFinance}
              deposit={deposit}
              term={term}
              hpVariant={hpVariant}
              balloonValue={balloonValue}
              apr={apr}
              financeContext={financeContext}
              summary={summary}
              onSelectHpVariant={onSelectHpVariant}
              showZeroCard={false}
              heading="Other finance options"
            />
            <div className="flex justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => onPhaseChange("zero")}
              >
                <ChevronLeft className="size-4" />
                Back to 0% presentation
              </Button>
            </div>
          </>
        ) : null}

      <ProductTrainingDrawer
        product={trainingProduct}
        open={trainingOpen}
        onOpenChange={setTrainingOpen}
      />
    </div>
  );
}
