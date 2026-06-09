"use client";

import { Car, Check, TrendingDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

type AlternativeFinancePanelProps = {
  selectedFinance: FinanceOption;
  onSelectFinance: (option: FinanceOption) => void;
  deposit: number;
  term: number;
  hpVariant: "a" | "b";
  balloonValue: number;
  apr: number;
  financeContext: DealFinanceContext;
  summary: ReturnType<typeof getFinanceSummary>;
  onSelectHpVariant: (variant: "a" | "b") => void;
  highlightOption?: FinanceOption;
};

export function AlternativeFinancePanel({
  selectedFinance,
  onSelectFinance,
  deposit,
  term,
  hpVariant,
  balloonValue,
  apr,
  financeContext,
  summary,
  onSelectHpVariant,
  highlightOption,
}: AlternativeFinancePanelProps) {
  const hpProduct = financeProducts.hp;
  const pcpProduct = financeProducts.pcp;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-heading-3">Alternative Finance Options</h2>
        <p className="text-sm text-muted-foreground">
          Only show these after the 0% presentation — when the customer needs a
          different deposit or monthly payment.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          className={cn(
            selectedFinance === "hp" && "border-primary ring-1 ring-primary/20",
            highlightOption === "hp" && "ring-2 ring-warning/40",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{hpProduct.outcome}</Badge>
              {highlightOption === "hp" && (
                <Badge variant="warning">Recommended</Badge>
              )}
            </div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="size-5 text-primary" />
              HP Option
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {hpProduct.headline} — lower deposit, own the car at the end.
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
                      selectedFinance === "hp" &&
                      "ring-2 ring-primary/30",
                  )}
                >
                  <p className="text-caption text-muted-foreground">
                    {opt.title}
                  </p>
                  <p className="mt-2 text-heading-3">
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
                    <span className="text-base font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                </button>
              ))}
            </div>

            <ul className="space-y-1.5">
              {hpProduct.highlights.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-3.5 text-success" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={selectedFinance === "hp" ? "primary" : "outline"}
              className="w-full"
              onClick={() => onSelectFinance("hp")}
            >
              Select HP
            </Button>
          </CardContent>
        </Card>

        <Card
          className={cn(
            selectedFinance === "pcp" &&
              "border-primary ring-1 ring-primary/20",
            highlightOption === "pcp" && "ring-2 ring-warning/40",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{pcpProduct.outcome}</Badge>
              {highlightOption === "pcp" && (
                <Badge variant="warning">Recommended</Badge>
              )}
            </div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="size-5 text-primary" />
              PCP Option
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {pcpProduct.headline} — finance minus guaranteed future value.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-caption text-muted-foreground">
                  Monthly payment
                </p>
                <p className="text-heading-3">
                  {formatGbp(summary.pcpMonthly)}
                  <span className="text-base font-normal text-muted-foreground">
                    /mo
                  </span>
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">
                  GFV balloon
                </p>
                <p className="text-heading-4">{formatGbp(balloonValue)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Term</p>
                <p className="text-sm font-semibold">{term} months</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Deposit</p>
                <p className="text-sm font-semibold">{formatGbp(deposit)}</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              {pcpProduct.highlights.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-3.5 text-success" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={selectedFinance === "pcp" ? "primary" : "outline"}
              className="w-full"
              onClick={() => onSelectFinance("pcp")}
            >
              Select PCP
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
