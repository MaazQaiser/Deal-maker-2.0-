"use client";

import { Car, TrendingDown } from "lucide-react";
import { financeProducts } from "@/constants/finance-products";
import { formatGbp } from "@/lib/formatGbp";
import {
  FinanceOption,
  getFinanceSummary,
  type DealFinanceContext,
} from "@/lib/deal-builder/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { ZeroFinanceCard } from "@/components/deal-builder/zero-finance-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

type FinanceComparisonPanelProps = {
  effectiveSelected: FinanceOption;
  onSelectFinance: (option: FinanceOption) => void;
  deposit: number;
  term: number;
  hpVariant: "a" | "b";
  balloonValue: number;
  apr: number;
  financeContext: DealFinanceContext;
  summary: ReturnType<typeof getFinanceSummary>;
  suggestedOption?: FinanceOption;
  onSelectHpVariant: (variant: "a" | "b") => void;
  showZeroCard?: boolean;
  showSuggestedBadges?: boolean;
  showOptionCtas?: boolean;
  heading?: string;
};

export function FinanceComparisonPanel({
  effectiveSelected,
  onSelectFinance,
  deposit,
  term,
  hpVariant,
  balloonValue,
  apr,
  financeContext,
  summary,
  suggestedOption,
  onSelectHpVariant,
  showZeroCard = true,
  showSuggestedBadges = true,
  showOptionCtas = true,
  heading = "Finance Comparison",
}: FinanceComparisonPanelProps) {
  const hpProduct = financeProducts.hp;
  const pcpProduct = financeProducts.pcp;

  return (
    <div className="space-y-4">
      <h2 className="text-heading-4">{heading}</h2>

      {showZeroCard ? (
        <ZeroFinanceCard
          deposit={deposit}
          financeContext={financeContext}
          summary={summary}
          suggestedOption={showSuggestedBadges ? suggestedOption : undefined}
          selected={effectiveSelected === "zero"}
          onSelectFinance={onSelectFinance}
          showCta={showOptionCtas}
        />
      ) : null}

      <Card
        className={cn(
          effectiveSelected === "hp" && "border-primary ring-1 ring-primary/20",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{hpProduct.outcome}</Badge>
            {showSuggestedBadges && suggestedOption === "hp" && (
              <Badge variant="info">Suggested for this customer</Badge>
            )}
          </div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="size-4 text-primary" />
            {hpProduct.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-caption text-muted-foreground">
            Price → deposit → monthly payments → you own the car. No balloon.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: "a" as const, title: "PX + £500 deposit" },
                { id: "b" as const, title: "PX + £1,000 deposit" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectHpVariant(opt.id);
                  onSelectFinance("hp");
                }}
                className={cn(
                  dealNestedPanelClass,
                  "text-left transition-colors hover:bg-muted",
                  hpVariant === opt.id &&
                    effectiveSelected === "hp" &&
                    "ring-2 ring-primary/30",
                )}
              >
                <p className="text-caption text-muted-foreground">{opt.title}</p>
                <p className="mt-2 text-heading-4">
                  {formatGbp(
                    getFinanceSummary(
                      {
                        deposit,
                        term,
                        selectedFinance: "hp",
                        hpVariant: opt.id,
                        balloon: balloonValue,
                        apr,
                      },
                      financeContext,
                    ).hpMonthly,
                  )}
                  /month
                </p>
                <p className="text-caption text-muted-foreground">
                  {term} months · {hpProduct.endOutcome}
                </p>
              </button>
            ))}
          </div>

          {showOptionCtas ? (
            <Button
              type="button"
              variant={effectiveSelected === "hp" ? "primary" : "outline"}
              className="w-full"
              onClick={() => onSelectFinance("hp")}
            >
              {hpProduct.cta}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card
        className={cn(
          effectiveSelected === "pcp" &&
            "border-primary ring-1 ring-primary/20",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{pcpProduct.outcome}</Badge>
            {showSuggestedBadges && suggestedOption === "pcp" && (
              <Badge variant="info">Suggested for this customer</Badge>
            )}
          </div>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingDown className="size-4 text-primary" />
            {pcpProduct.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-caption text-muted-foreground">
            Finance car price minus GFV (guaranteed future value) — that is why
            monthly payments stay lower.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Monthly payment",
                value: `${formatGbp(summary.pcpMonthly)}/month`,
              },
              {
                label: "GFV balloon",
                value: formatGbp(balloonValue),
              },
              { label: "Term", value: `${term} months` },
              {
                label: "Total payable",
                value: formatGbp(summary.pcpTotal),
              },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-caption text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className={dealNestedPanelClass}>
            <p className="text-caption font-medium text-muted-foreground">
              At end of term, customer chooses
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>Pay {formatGbp(balloonValue)} GFV and own the car</li>
              <li>Return the car</li>
              <li>Trade in for a new car</li>
            </ul>
          </div>

          {showOptionCtas ? (
            <Button
              type="button"
              variant={effectiveSelected === "pcp" ? "primary" : "outline"}
              className="w-full"
              onClick={() => onSelectFinance("pcp")}
            >
              {pcpProduct.cta}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
