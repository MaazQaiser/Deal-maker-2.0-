"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Printer } from "lucide-react";
import { toast } from "sonner";
import { branches, getStockVehicleImage } from "@/constants/deal-mock-data";
import { financeProducts } from "@/constants/finance-products";
import {
  SAVINGS_BREAKDOWN,
  TOTAL_SAVINGS,
  DEFAULT_INCLUDED_PRODUCTS,
  sumIncludedProductValues,
} from "@/constants/presentation-content";
import { routes } from "@/constants/routes";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import { formatGbp } from "@/lib/formatGbp";
import {
  calculatePxEquity,
  getFinanceSummary,
  ZERO_TERM,
} from "@/lib/deal-builder/finance";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { getBuyingMotiveLabel } from "@/lib/test-drive-display";
import { useDealStore } from "@/store/dealStore";
import type { DealRecord } from "@/types/deal";
import { PageContainer } from "@/components/layouts/page-container";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import { SceneSetterCard } from "@/components/deals/scene-setter-card";
import { FcaDisclaimerFooter } from "@/components/deal-builder/fca-disclaimer-footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  { id: "cosmetic", label: "Cosmetic Cover", included: true },
  { id: "tyre", label: "Tyre & Alloy Cover", included: true },
] as const;

type DealCompleteScreenProps = {
  dealId: string;
};

function getCustomerInitials(deal: DealRecord) {
  return `${deal.customer.firstName[0] ?? ""}${deal.customer.lastName[0] ?? ""}`.toUpperCase();
}

export function DealCompleteScreen({ dealId }: DealCompleteScreenProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const financePlan = useDealStore((s) => s.getFinancePlan(dealId));
  const updateDealStatus = useDealStore((s) => s.updateDealStatus);
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);

  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [signature, setSignature] = useState("");
  const [depositAmount, setDepositAmount] = useState(financePlan?.deposit ?? 4000);
  const [acknowledged, setAcknowledged] = useState(false);
  const [completed, setCompleted] = useState(false);

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
        comfortableMonthly: 550,
        includedProducts: [...DEFAULT_INCLUDED_PRODUCTS],
      },
    [financePlan, deal.partExchange?.valuation, deal.partExchange?.settlementFigure],
  );

  const productValue = sumIncludedProductValues(
    plan.includedProducts ?? DEFAULT_INCLUDED_PRODUCTS,
  );

  const pxEquity = useMemo(
    () => calculatePxEquity(plan.pxValue, plan.settlementFigure),
    [plan.pxValue, plan.settlementFigure],
  );

  const financeContext = useMemo(
    () => ({
      retailPrice: deal.vehicle.retailPrice,
      pxEquity,
      productValue,
      zeroPercentMinDeposit: 7824,
    }),
    [deal.vehicle.retailPrice, pxEquity, productValue],
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
    effectiveSelected === "zero" ? "0%" : effectiveSelected === "hp" ? "HP" : "PCP";

  const aprDisplay =
    effectiveSelected === "zero" ? "0% APR" : effectiveSelected === "hp" ? `${plan.apr}% APR` : "8.9% APR";

  const totalPayable = useMemo(() => {
    if (effectiveSelected === "zero") {
      return plan.deposit + pxEquity + summary.zeroMonthly * ZERO_TERM;
    }
    if (effectiveSelected === "hp") {
      return plan.deposit + pxEquity + summary.hpMonthly * plan.term;
    }
    return summary.pcpTotal;
  }, [effectiveSelected, plan, pxEquity, summary]);

  const totalCredit = Math.max(
    0,
    deal.vehicle.retailPrice + productValue - plan.deposit - pxEquity,
  );

  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;
  const branchLabel =
    branches.find((b) => b.value === deal.branch)?.label ?? deal.branch;
  const signedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const canComplete =
    signature.trim().length > 0 && depositAmount > 0 && acknowledged;

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
    toast.message("Generate PDF", {
      description: "PDF generation will be available when backend is connected.",
    });
  };

  const handleSendToFinance = () => {
    toast.message("Send to finance for approval", {
      description: "Proposal will be sent when backend is connected.",
    });
  };

  const handleComplete = () => {
    if (!canComplete) return;
    updateDealStatus(dealId, "finance-pending");
    setCompleted(true);
  };

  if (completed) {
    return (
      <PageContainer size="sm" className="flex min-h-[70vh] items-center py-12">
        <Card className="w-full border-primary/30 p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/15">
            <Check className="size-7 text-success" />
          </div>
          <h1 className="text-heading-2">Signature captured</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Deposit of {formatGbp(depositAmount)} recorded for {customerName}.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button type="button" className="w-full" onClick={() => router.push(routes.dashboard)}>
              Return to dashboard
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--topbar-height))] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
          <SceneSetterCard scene="complete" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-page-title">Deal summary & signature</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review the agreed vehicle, finance, and products — then sign to confirm.
              </p>
            </div>
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
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
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
                      <p className="text-lg font-semibold">{customerName}</p>
                      <p className="text-sm text-muted-foreground">{deal.customer.mobile}</p>
                    </div>
                  </div>
                  <KeyValueList
                    items={[
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
                    </div>
                  </div>
                  <div className={dealNestedPanelClass}>
                    <p className="text-caption text-muted-foreground">Retail Price</p>
                    <p className="text-heading-3">{formatGbp(deal.vehicle.retailPrice)}</p>
                  </div>
                  {deal.partExchange ? (
                    <div className="space-y-3 border-t border-border pt-4">
                      <p className="text-sm font-semibold">Part exchange</p>
                      <KeyValueList
                        items={[
                          {
                            key: "Vehicle",
                            value: `${deal.partExchange.make} ${deal.partExchange.model}`,
                          },
                          { key: "Registration", value: deal.partExchange.registration },
                          { key: "Estimated Value", value: formatGbp(plan.pxValue) },
                          { key: "Available Equity", value: formatGbp(pxEquity) },
                        ]}
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Agreed finance</CardTitle>
                    <Badge variant="info">{financeBadge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm font-medium text-primary">{financeMeta.headline}</p>
                  <KeyValueList
                    items={[
                      { key: "Deposit", value: formatGbp(plan.deposit) },
                      { key: "Monthly Payment", value: `${formatGbp(monthlyPayment)}/mo` },
                      { key: "Term", value: `${plan.term} months` },
                      { key: "APR", value: aprDisplay.replace(" APR", "") },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Products included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {INCLUDED_BENEFITS.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="flex items-center gap-2 rounded-[16px] bg-success/10 px-3 py-2.5 text-sm"
                      >
                        <Check className="size-4 shrink-0 text-success" />
                        {benefit.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Your package value</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {SAVINGS_BREAKDOWN.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {PACKAGE_SAVINGS_LABELS[item.id] ?? item.label}
                      </span>
                      <span className="font-medium">{formatGbp(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold">Total package value</span>
                    <span className="text-heading-4 text-primary">{formatGbp(TOTAL_SAVINGS)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <button
                type="button"
                onClick={() => setRequirementsOpen((open) => !open)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-medium">Customer requirements</p>
                  <p className="text-xs text-muted-foreground">
                    Rating, motivations, and notes from the test drive
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
                    <p className="text-lg font-semibold">{deal.trialClose.rating}/10</p>
                  )}
                  {buyingMotives.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {buyingMotives.map((motive) => (
                        <Badge key={motive} variant="neutral">
                          {motive}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {requirementNotes && (
                    <p className="whitespace-pre-line text-sm">{requirementNotes}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Deposit</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="deposit-amount">Deposit amount</Label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="deposit-amount"
                    type="number"
                    min={0}
                    step={100}
                    className="pl-7"
                    value={depositAmount}
                    onChange={(e) =>
                      setDepositAmount(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder={customerName}
                  className="font-serif text-lg italic"
                />
                <div className="rounded-[16px] border border-dashed border-border bg-muted/30 px-6 py-8 text-center">
                  <p className="font-serif text-2xl italic text-foreground/80">
                    {signature.trim() || "Signature preview"}
                  </p>
                </div>
                <p className="text-caption text-muted-foreground">
                  Signed {signedDate} · {branchLabel}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="flex items-start gap-3 p-6">
              <Checkbox
                id="deposit-ack"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
              />
              <Label htmlFor="deposit-ack" className="cursor-pointer text-sm leading-relaxed">
                I acknowledge that the deposit is non-refundable.
              </Label>
            </CardContent>
          </Card>

          <FcaDisclaimerFooter
            apr={aprDisplay}
            totalCredit={totalCredit}
            totalPayable={totalPayable}
            monthlyPayment={monthlyPayment}
            termMonths={effectiveSelected === "zero" ? ZERO_TERM : plan.term}
            finalPayment={effectiveSelected === "pcp" ? summary.balloon : undefined}
          />
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer size="full" className="flex flex-wrap items-center gap-4 py-4">
          <div className="flex min-w-[180px] flex-col sm:mr-auto">
            <span className="text-xs text-muted-foreground">Estimated monthly payment</span>
            <span className="text-xl font-semibold">
              {formatGbp(monthlyPayment)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </span>
          </div>
          {draftSaved && <span className="text-sm text-success">Draft saved</span>}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => router.push(routes.dealBuilder.financeFit(dealId))}>
              Back
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              Save draft
            </Button>
            <Button type="button" variant="outline" onClick={handleGeneratePdf}>
              <Printer className="size-4" />
              Generate PDF
            </Button>
            <Button type="button" variant="outline" onClick={handleSendToFinance}>
              Send to finance
            </Button>
            <Button type="button" disabled={!canComplete} onClick={handleComplete}>
              Complete signature
            </Button>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
