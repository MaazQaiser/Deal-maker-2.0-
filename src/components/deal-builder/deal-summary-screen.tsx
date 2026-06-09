"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Printer,
  X,
} from "lucide-react";
import { PRODUCT_VALUE } from "@/constants/deal-builder";
import { branches, getStockVehicleImage } from "@/constants/deal-mock-data";
import { financeProducts } from "@/constants/finance-products";
import {
  SAVINGS_BREAKDOWN,
  TOTAL_SAVINGS,
} from "@/constants/presentation-content";
import { routes } from "@/constants/routes";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import { formatGbp } from "@/lib/formatGbp";
import {
  calculatePxEquity,
  getFinanceSummary,
  ZERO_TERM,
} from "@/lib/deal-builder/finance";
import { getPxFinanceCompanyLabel } from "@/constants/px-finance-companies";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { getBuyingMotiveLabel } from "@/lib/test-drive-display";
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

const PACKAGE_SAVINGS_LABELS: Record<string, string> = {
  interest: "Interest Saving",
  service: "Service Plan Value",
  mot: "MOT Value",
  warranty: "Warranty Value",
};

const INCLUDED_BENEFITS = [
  { id: "warranty", label: "Warranty", included: true },
  { id: "service", label: "Service Plan", included: true },
  { id: "mot", label: "Lifetime MOT", included: true },
  { id: "supaguard", label: "Supaguard", included: true },
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
  const financePlan = useDealStore((s) => s.getFinancePlan(dealId));
  const updateDealStatus = useDealStore((s) => s.updateDealStatus);
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const plan = useMemo(
    () =>
      financePlan ?? {
        deposit: 4000,
        term: 48,
        selectedFinance: "hp" as const,
        hpVariant: "b" as const,
        balloon: 7800,
        apr: 14.9,
        pxValue: deal.partExchange?.valuation ?? 0,
        settlementFigure: deal.partExchange?.settlementFigure ?? 0,
        gfvPercent: 43,
      },
    [financePlan, deal.partExchange?.valuation, deal.partExchange?.settlementFigure],
  );

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

  const financeMeta = financeProducts[effectiveSelected];
  const financeBadge =
    effectiveSelected === "zero"
      ? "0%"
      : effectiveSelected === "hp"
        ? "HP"
        : "PCP";

  const aprDisplay =
    effectiveSelected === "zero"
      ? "0%"
      : effectiveSelected === "hp"
        ? `${plan.apr}%`
        : "8.9%";

  const totalPayable = useMemo(() => {
    if (effectiveSelected === "zero") {
      return plan.deposit + pxEquity + summary.zeroMonthly * ZERO_TERM;
    }
    if (effectiveSelected === "hp") {
      return plan.deposit + pxEquity + summary.hpMonthly * plan.term;
    }
    return summary.pcpTotal;
  }, [
    effectiveSelected,
    plan.deposit,
    plan.term,
    pxEquity,
    summary.zeroMonthly,
    summary.hpMonthly,
    summary.pcpTotal,
  ]);

  const branchLabel =
    branches.find((b) => b.value === deal.branch)?.label ?? deal.branch;

  const buyingMotives =
    deal.testDriveNotes?.buyingMotives?.map(getBuyingMotiveLabel) ?? [];

  const requirementNotes = [
    deal.testDriveNotes?.freeNotes,
    deal.trialClose?.lovedMost,
    deal.trialClose?.makeItTen,
    deal.trialClose?.whatWasntRight,
  ]
    .filter(Boolean)
    .join("\n\n");

  const handleSaveDraft = () => {
    updateDealStatus(dealId, "draft");
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleGeneratePdf = () => {
    window.print();
  };

  return (
    <div className="flex min-h-[calc(100dvh-var(--topbar-height))] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            onClick={() => router.push(routes.dealBuilder.detail(dealId))}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <PageHeader
            title="Deal Summary"
            description="Review the agreed vehicle, finance option, and included package before proceeding."
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
            {/* Left column — Customer & Vehicle */}
            <div className="space-y-6">
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
                      <p className="text-sm text-muted-foreground">
                        {deal.customer.mobile}
                      </p>
                      {deal.customer.email && (
                        <p className="text-sm text-muted-foreground">
                          {deal.customer.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <KeyValueList
                    items={[
                      { key: "Deal ID", value: dealId },
                      { key: "Sales Executive", value: deal.salesperson },
                      { key: "Branch", value: branchLabel },
                    ]}
                  />
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
                        src={getStockVehicleImage(
                          deal.vehicle.make,
                          deal.vehicle.model,
                        )}
                        alt={`${deal.vehicle.make} ${deal.vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CarBrandLogo make={deal.vehicle.make} />
                        <h2 className="text-lg font-semibold">
                          {deal.vehicle.make} {deal.vehicle.model}{" "}
                          {deal.vehicle.variant}
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
                    <p className="text-caption text-muted-foreground">
                      Retail Price
                    </p>
                    <p className="text-heading-3">
                      {formatGbp(deal.vehicle.retailPrice)}
                    </p>
                  </div>

                  {deal.partExchange && (
                    <div className="space-y-3 border-t border-border pt-4">
                      <p className="text-sm font-semibold">Part Exchange</p>
                      <KeyValueList
                        items={[
                          {
                            key: "Vehicle",
                            value: `${deal.partExchange.make} ${deal.partExchange.model}`,
                          },
                          {
                            key: "Registration",
                            value: deal.partExchange.registration,
                          },
                          {
                            key: "Estimated Value",
                            value: formatGbp(plan.pxValue),
                          },
                          ...(deal.partExchange.existingFinance
                            ? [
                                {
                                  key: "Settlement Figure",
                                  value: formatGbp(plan.settlementFigure),
                                },
                                ...(deal.partExchange.financeCompany
                                  ? [
                                      {
                                        key: "Finance Company",
                                        value:
                                          getPxFinanceCompanyLabel(
                                            deal.partExchange.financeCompany,
                                          ) ?? deal.partExchange.financeCompany,
                                      },
                                    ]
                                  : []),
                              ]
                            : []),
                          {
                            key: "Available Equity",
                            value: formatGbp(pxEquity),
                          },
                        ]}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column — Finance & Package */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Agreed Finance</CardTitle>
                    <Badge variant="info">{financeBadge}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium text-primary">
                    {financeMeta.headline}
                  </p>
                  <KeyValueList
                    items={[
                      { key: "Deposit", value: formatGbp(plan.deposit) },
                      {
                        key: "Monthly Payment",
                        value: `${formatGbp(monthlyPayment)}/mo`,
                      },
                      { key: "Term", value: `${plan.term} months` },
                      { key: "APR", value: aprDisplay },
                      ...(effectiveSelected === "pcp"
                        ? [
                            {
                              key: "Balloon (GFV)",
                              value: formatGbp(summary.balloon),
                            },
                          ]
                        : []),
                      {
                        key: "Total Payable",
                        value: (
                          <span className="font-bold">
                            {formatGbp(totalPayable)}
                          </span>
                        ),
                      },
                    ]}
                  />
                  {pxEquity > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Includes part exchange equity of {formatGbp(pxEquity)}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Included Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {INCLUDED_BENEFITS.map((benefit) => (
                      <div
                        key={benefit.id}
                        className={cn(
                          "flex items-center gap-2 rounded-[16px] px-3 py-2.5 text-sm",
                          benefit.included
                            ? "bg-success/10 text-foreground"
                            : "bg-muted/50 text-muted-foreground line-through",
                        )}
                      >
                        {benefit.included ? (
                          <Check className="size-4 shrink-0 text-success" />
                        ) : (
                          <X className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        {benefit.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Your Package Value</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {SAVINGS_BREAKDOWN.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {PACKAGE_SAVINGS_LABELS[item.id] ?? item.label}
                      </span>
                      <span className="font-medium">{formatGbp(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold">Total Package Value</span>
                    <span className="text-heading-4 text-primary">
                      {formatGbp(TOTAL_SAVINGS)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full-width sections */}
          <Card>
            <CardContent className="p-6">
              <button
                type="button"
                onClick={() => setRequirementsOpen((open) => !open)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-medium">Customer Requirements</p>
                  <p className="text-xs text-muted-foreground">
                    Vehicle rating, buying motivations, and notes from test drive
                  </p>
                </div>
                {requirementsOpen ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>

              {requirementsOpen && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  {deal.trialClose?.rating != null && (
                    <div>
                      <p className="text-caption text-muted-foreground">
                        Vehicle Rating
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {deal.trialClose.rating}/10
                      </p>
                    </div>
                  )}
                  {buyingMotives.length > 0 && (
                    <div>
                      <p className="text-caption text-muted-foreground">
                        Buying Motivations
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {buyingMotives.map((motive) => (
                          <Badge key={motive} variant="neutral">
                            {motive}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {requirementNotes && (
                    <div>
                      <p className="text-caption text-muted-foreground">Notes</p>
                      <p className="mt-1 whitespace-pre-line text-sm">
                        {requirementNotes}
                      </p>
                    </div>
                  )}
                  {!deal.trialClose?.rating &&
                    buyingMotives.length === 0 &&
                    !requirementNotes && (
                      <p className="text-sm text-muted-foreground">
                        No customer requirements recorded yet.
                      </p>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer
          size="full"
          className="flex flex-wrap items-center gap-4 py-4"
        >
          <div className="flex min-w-[180px] flex-col sm:mr-auto">
            <span className="text-xs text-muted-foreground">
              Estimated Monthly Payment
            </span>
            <span className="text-xl font-semibold">
              {formatGbp(monthlyPayment)}
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </span>
          </div>

          {draftSaved && (
            <span className="text-sm text-success">Draft saved</span>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button type="button" variant="outline" onClick={handleGeneratePdf}>
              <Printer className="size-4" />
              Generate PDF
            </Button>
            <Button type="button" asChild>
              <Link href={routes.dealBuilder.signature(dealId)}>
                Proceed To Signature
              </Link>
            </Button>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
