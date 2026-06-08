"use client";

import { Car, Check, Sparkles, TrendingDown } from "lucide-react";
import { financeComparisonRows, financeProducts } from "@/constants/finance-products";
import { formatGbp } from "@/lib/formatGbp";
import {
  FinanceOption,
  getFinanceSummary,
  type DealFinanceContext,
} from "@/lib/deal-builder/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

const financeIcons = {
  zero: Sparkles,
  hp: Car,
  pcp: TrendingDown,
} as const;

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
}: FinanceComparisonPanelProps) {
  const zeroProduct = financeProducts.zero;
  const hpProduct = financeProducts.hp;
  const pcpProduct = financeProducts.pcp;

  const depositShortfall = Math.max(
    0,
    summary.zeroDepositRequired - deposit - financeContext.pxEquity,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-heading-4">Finance Comparison</h2>

      <Card
        className={cn(
          effectiveSelected === "zero" && summary.zeroEligible
            ? "border-primary ring-1 ring-primary/20"
            : undefined,
          !summary.zeroEligible && "opacity-95",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning">{zeroProduct.outcome}</Badge>
            {suggestedOption === "zero" && (
              <Badge variant="info">Suggested for this customer</Badge>
            )}
            {!summary.zeroEligible && (
              <Badge variant="neutral">Deposit too low</Badge>
            )}
          </div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            {zeroProduct.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-caption text-muted-foreground">
                Monthly payment
              </p>
              <p className="text-sm font-semibold">
                {formatGbp(summary.zeroMonthly)}/month
              </p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">
                Deposit required
              </p>
              <p className="text-sm font-semibold">
                {formatGbp(summary.zeroDepositRequired)}
              </p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">Term</p>
              <p className="text-sm font-semibold">18 months</p>
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
          ) : (
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

          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {zeroProduct.highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-caption text-muted-foreground"
              >
                <Check className="size-3.5 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant={effectiveSelected === "zero" ? "primary" : "outline"}
            className="w-full"
            disabled={!summary.zeroEligible}
            onClick={() => onSelectFinance("zero")}
          >
            {zeroProduct.cta}
          </Button>
        </CardContent>
      </Card>

      <Card
        className={cn(
          effectiveSelected === "hp" && "border-primary ring-1 ring-primary/20",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{hpProduct.outcome}</Badge>
            {suggestedOption === "hp" && (
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

          <Button
            type="button"
            variant={effectiveSelected === "hp" ? "primary" : "outline"}
            className="w-full"
            onClick={() => onSelectFinance("hp")}
          >
            {hpProduct.cta}
          </Button>
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
            {suggestedOption === "pcp" && (
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

          <Button
            type="button"
            variant={effectiveSelected === "pcp" ? "primary" : "outline"}
            className="w-full"
            onClick={() => onSelectFinance("pcp")}
          >
            {pcpProduct.cta}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick comparison</CardTitle>
          <CardDescription>
            Use outcome language in the showroom — not product codes
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-caption text-muted-foreground">
                <th className="pb-2 pr-3 font-medium" />
                {(Object.keys(financeProducts) as FinanceOption[]).map(
                  (option) => {
                    const Icon = financeIcons[option];
                    const product = financeProducts[option];
                    return (
                      <th key={option} className="pb-2 pr-3 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon className="size-3.5" />
                          {product.outcome}
                        </span>
                      </th>
                    );
                  },
                )}
              </tr>
            </thead>
            <tbody>
              {financeComparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <td className="py-2 pr-3 text-caption text-muted-foreground">
                    {row.label}
                  </td>
                  <td className="py-2 pr-3">{row.zero}</td>
                  <td className="py-2 pr-3">{row.hp}</td>
                  <td className="py-2 pr-3">{row.pcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
