"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import {
  CUSTOMER_BENEFITS,
  INCLUDED_PRODUCTS,
  PRODUCT_VALUE,
} from "@/constants/deal-builder";
import { financeProducts } from "@/constants/finance-products";
import { formatGbp } from "@/lib/formatGbp";
import {
  calculatePxEquity,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import type { DealFinancePlan } from "@/store/dealStore";
import type { DealRecord } from "@/types/deal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";

type DealFinanceSummarySectionProps = {
  deal: DealRecord;
  financePlan?: DealFinancePlan;
  showProducts?: boolean;
};

export function DealFinanceSummarySection({
  deal,
  financePlan,
  showProducts = true,
}: DealFinanceSummarySectionProps) {
  const pxEquity = useMemo(
    () =>
      financePlan
        ? calculatePxEquity(financePlan.pxValue, financePlan.settlementFigure)
        : 0,
    [financePlan],
  );

  const financeContext = useMemo(
    () => ({
      retailPrice: deal.vehicle.retailPrice,
      pxEquity,
      productValue: PRODUCT_VALUE,
      zeroPercentMinDeposit: 7824,
    }),
    [deal.vehicle.retailPrice, pxEquity],
  );

  const summary = useMemo(
    () =>
      financePlan
        ? getFinanceSummary(
            {
              deposit: financePlan.deposit,
              term: financePlan.term,
              selectedFinance: financePlan.selectedFinance,
              hpVariant: financePlan.hpVariant,
              balloon: financePlan.balloon,
              apr: financePlan.apr,
            },
            financeContext,
          )
        : null,
    [financePlan, financeContext],
  );

  if (!financePlan || !summary) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Finance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Finance option not yet configured for this deal.
          </p>
        </CardContent>
      </Card>
    );
  }

  const effectiveSelected =
    financePlan.selectedFinance === "zero" && !summary.zeroEligible
      ? "hp"
      : financePlan.selectedFinance;

  const monthlyPayment =
    effectiveSelected === "zero"
      ? summary.zeroMonthly
      : effectiveSelected === "hp"
        ? summary.hpMonthly
        : summary.pcpMonthly;

  const financeLabel = financeProducts[effectiveSelected].productCode;

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Badge>Selected Option</Badge>
            <span className="text-lg font-semibold text-primary">
              {financeLabel}
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-display-l font-bold tracking-tight">
              {formatGbp(monthlyPayment)}
            </p>
            <p className="text-lg text-muted-foreground">/month</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Monthly Payment", value: formatGbp(monthlyPayment) },
              { label: "Deposit", value: formatGbp(financePlan.deposit) },
              { label: "Term", value: `${financePlan.term} Months` },
              {
                label: "APR",
                value:
                  effectiveSelected === "zero"
                    ? "0%"
                    : effectiveSelected === "hp"
                      ? `${financePlan.apr}%`
                      : "8.9%",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[24px] bg-muted/50 p-4 text-center"
              >
                <p className="text-caption text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="mt-1 text-lg font-semibold">{kpi.value}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Deposit: {formatGbp(financePlan.deposit)}
            {pxEquity > 0 ? " + Part Exchange" : ""}
          </p>
        </CardContent>
      </Card>

      {showProducts ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Included Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {INCLUDED_PRODUCTS.map((product) => (
                <div key={product} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-success" />
                  <span>{product}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Included Customer Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {CUSTOMER_BENEFITS.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-[16px] bg-muted/50 px-3 py-2.5 text-sm"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-[16px] bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">
                  Total Included Value
                </span>
                <span className="text-heading-4 text-primary">
                  {formatGbp(summary.productValue)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
