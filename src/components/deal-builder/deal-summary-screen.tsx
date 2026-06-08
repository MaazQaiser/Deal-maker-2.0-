"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Mail, Printer } from "lucide-react";
import {
  CUSTOMER_BENEFITS,
  INCLUDED_PRODUCTS,
  PRODUCT_MARGIN,
  PRODUCT_VALUE,
  PX_MARGIN,
} from "@/constants/deal-builder";
import { financeProducts } from "@/constants/finance-products";
import { getStockVehicleImage } from "@/constants/deal-mock-data";
import { purchaseTimelines } from "@/constants/deal-mock-data";
import { routes } from "@/constants/routes";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import { formatGbp } from "@/lib/formatGbp";
import {
  calculatePxEquity,
  getDealHealthStatus,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { useDealStore } from "@/store/dealStore";
import type { DealRecord } from "@/types/deal";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

const TIMELINE = [
  { label: "Deal Created", time: "09:15 AM" },
  { label: "Finance Selected", time: "09:32 AM" },
  { label: "Ready For Presentation", time: null },
] as const;

type DealSummaryScreenProps = {
  dealId: string;
};

function getCustomerInitials(deal: DealRecord) {
  return `${deal.customer.firstName[0] ?? ""}${deal.customer.lastName[0] ?? ""}`.toUpperCase();
}

export function DealSummaryScreen({ dealId }: DealSummaryScreenProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const notesByDealId = useDealStore((s) => s.notesByDealId);
  const storedDeal = useDealStore((s) => s.deals.find((d) => d.id === dealId));
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);
  const notes =
    dealId in notesByDealId
      ? notesByDealId[dealId]
      : storedDeal?.notes ?? deal.notes ?? "";
  const financePlan = useDealStore((s) => s.getFinancePlan(dealId));
  const updateDealStatus = useDealStore((s) => s.updateDealStatus);
  const [dealHealthOpen, setDealHealthOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const plan = financePlan ?? {
    deposit: 4000,
    term: 48,
    selectedFinance: "hp" as const,
    hpVariant: "b" as const,
    balloon: 7800,
    apr: 14.9,
    pxValue: deal.partExchange?.valuation ?? 0,
    settlementFigure: deal.partExchange?.outstandingFinance ?? 0,
    gfvPercent: 43,
  };

  const pxEquity = useMemo(
    () => calculatePxEquity(plan.pxValue, plan.settlementFigure),
    [plan.pxValue, plan.settlementFigure],
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
      getFinanceSummary(
        {
          deposit: plan.deposit,
          term: plan.term,
          selectedFinance: plan.selectedFinance,
          hpVariant: plan.hpVariant,
          balloon: plan.balloon,
          apr: plan.apr,
        },
        financeContext,
      ),
    [plan, financeContext],
  );

  const effectiveSelected =
    plan.selectedFinance === "zero" && !summary.zeroEligible
      ? "hp"
      : plan.selectedFinance;

  const monthlyPayment =
    effectiveSelected === "zero"
      ? summary.zeroMonthly
      : effectiveSelected === "hp"
        ? summary.hpMonthly
        : summary.pcpMonthly;

  const financeLabel = financeProducts[effectiveSelected].productCode;
  const vehicleMargin = deal.vehicle.retailPrice - deal.vehicle.vehicleCost;
  const totalMargin = vehicleMargin + PX_MARGIN + PRODUCT_MARGIN;
  const dealHealth = getDealHealthStatus(totalMargin);
  const purchaseTimelineLabel =
    purchaseTimelines.find((item) => item.value === deal.purchaseTimeline)
      ?.label ?? deal.purchaseTimeline;

  const handleSaveDeal = () => {
    updateDealStatus(dealId, "presented");
    setSaved(true);
  };

  if (saved) {
    return (
      <PageContainer size="sm" className="flex min-h-[70vh] items-center py-12">
        <Card className="w-full border-primary/30 p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/15">
            <Check className="size-7 text-success" />
          </div>
          <h1 className="text-heading-2">Deal Saved Successfully</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your deal is ready for customer presentation.
          </p>

          <div className="mt-8 space-y-4 rounded-[24px] bg-muted/50 p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deal ID</span>
              <span className="font-semibold">{dealId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={dealStatusVariant.presented}>
                {dealStatusLabel.presented}
              </Badge>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button type="button" className="w-full" asChild>
              <Link href={routes.dealBuilder.detail(dealId)}>View Deal</Link>
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={routes.deals.index}>Return To Deal List</Link>
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title="Deal Summary"
        description="Review and confirm the selected finance option"
        actions={
          <div className="text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <span className="text-muted-foreground">Deal ID</span>
              <span className="font-semibold">{dealId}</span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={dealStatusVariant[deal.status]}>
                {dealStatusLabel[deal.status]}
              </Badge>
            </div>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">
                {getCustomerInitials(deal)}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {deal.customer.firstName} {deal.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{deal.customer.mobile}</p>
                {deal.customer.email && (
                  <p className="text-sm text-muted-foreground">{deal.customer.email}</p>
                )}
              </div>
            </div>
            {deal.customerBudget != null && (
              <div className={dealNestedPanelClass}>
                <p className="text-caption text-muted-foreground">Target Monthly Budget</p>
                <p className="text-heading-3">{formatGbp(deal.customerBudget)}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{purchaseTimelineLabel}</Badge>
            </div>
            {notes && (
              <div>
                <p className="text-caption text-muted-foreground">Notes</p>
                <p className="mt-1 text-sm">{notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-[16px] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getStockVehicleImage(deal.vehicle.make, deal.vehicle.model)}
                  alt={`${deal.vehicle.make} ${deal.vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CarBrandLogo make={deal.vehicle.make} />
                  <h2 className="text-lg font-semibold">
                    {deal.vehicle.make} {deal.vehicle.model} {deal.vehicle.variant}
                  </h2>
                </div>
                <Badge variant="neutral" className="mt-2 font-mono">
                  {deal.vehicle.registration}
                </Badge>
                <KeyValueList
                  className="mt-3"
                  items={[
                    { key: "Year", value: String(deal.vehicle.year) },
                    {
                      key: "Mileage",
                      value: `${deal.vehicle.mileage.toLocaleString("en-GB")} miles`,
                    },
                    { key: "Colour", value: deal.vehicle.colour },
                  ]}
                />
              </div>
            </div>
            <div className={dealNestedPanelClass}>
              <p className="text-caption text-muted-foreground">Retail Price</p>
              <p className="text-heading-3">{formatGbp(deal.vehicle.retailPrice)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {deal.partExchange && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Part Exchange</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-caption text-muted-foreground">Vehicle</p>
                <p className="mt-1 font-semibold">
                  {deal.partExchange.make} {deal.partExchange.model}
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Registration</p>
                <Badge variant="neutral" className="mt-1 font-mono">
                  {deal.partExchange.registration}
                </Badge>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">PX Value</p>
                <p className="mt-1 font-semibold">{formatGbp(plan.pxValue)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Settlement</p>
                <p className="mt-1 font-semibold">{formatGbp(plan.settlementFigure)}</p>
              </div>
            </div>
            <div className="rounded-[24px] border border-success/30 bg-success/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available Equity</span>
                <span className="text-heading-3 text-success">{formatGbp(pxEquity)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Badge>Selected Option</Badge>
            <span className="text-lg font-semibold text-primary">{financeLabel}</span>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-5xl font-bold tracking-tight">{formatGbp(monthlyPayment)}</p>
            <p className="text-lg text-muted-foreground">/month</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Monthly Payment", value: formatGbp(monthlyPayment) },
              { label: "Deposit", value: formatGbp(plan.deposit) },
              { label: "Term", value: `${plan.term} Months` },
              {
                label: "APR",
                value:
                  effectiveSelected === "zero"
                    ? "0%"
                    : effectiveSelected === "hp"
                      ? `${plan.apr}%`
                      : "8.9%",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[24px] bg-muted/50 p-4 text-center"
              >
                <p className="text-caption text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-lg font-semibold">{kpi.value}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Deposit: {formatGbp(plan.deposit)}
            {pxEquity > 0 ? " + Part Exchange" : ""}
          </p>
        </CardContent>
      </Card>

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
            <CardTitle className="text-base">Included Customer Benefits</CardTitle>
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
              <span className="text-sm text-muted-foreground">Total Included Value</span>
              <span className="text-heading-4 text-primary">
                {formatGbp(summary.productValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <button
            type="button"
            onClick={() => setDealHealthOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <p className="text-sm font-medium">Deal Health</p>
              <p className="text-xs text-muted-foreground">
                Internal only — salesperson view
              </p>
            </div>
            {dealHealthOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {dealHealthOpen && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Vehicle Margin", value: formatGbp(vehicleMargin) },
                  { label: "PX Margin", value: formatGbp(PX_MARGIN) },
                  { label: "Product Margin", value: formatGbp(PRODUCT_MARGIN) },
                  {
                    label: "Total Margin",
                    value: formatGbp(totalMargin),
                    highlight: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-[16px] bg-muted/50 p-3">
                    <p className="text-caption text-muted-foreground">{item.label}</p>
                    <p
                      className={cn(
                        "mt-1 text-lg font-semibold",
                        item.highlight && "text-success",
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-[16px] bg-success/10 py-2.5">
                <span className="text-sm font-semibold text-success">
                  {dealHealth.label}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Deal Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            {TIMELINE.map((event, index) => (
              <div key={event.label} className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium">{event.label}</p>
                  {event.time && (
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  )}
                </div>
                {index < TIMELINE.length - 1 && (
                  <span className="hidden text-muted-foreground sm:inline">→</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded-[24px] border border-border bg-card p-4 shadow-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(routes.dealBuilder.detail(dealId))}
        >
          Back To Deal Builder
        </Button>
        <div className="flex-1" />
        <div className="flex gap-3">
          <Button type="button" variant="outline">
            <Printer className="size-4" />
            Print Deal
          </Button>
          <Button type="button" variant="outline">
            <Mail className="size-4" />
            Email Deal
          </Button>
        </div>
        <Button type="button" className="px-8" onClick={handleSaveDeal}>
          Save Deal
        </Button>
      </div>
    </PageContainer>
  );
}
