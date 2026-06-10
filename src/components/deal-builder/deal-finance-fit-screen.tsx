"use client";

import { useRouter } from "next/navigation";
import { PX_MARGIN, PRODUCT_MARGIN } from "@/constants/deal-builder";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { financeProducts } from "@/constants/finance-products";
import { useDealBuilderFinance } from "@/hooks/use-deal-builder-finance";
import { useDealStore } from "@/store/dealStore";
import { DealBuilderHeader } from "@/components/deal-builder/deal-builder-header";
import { DealBuilderVehiclePanel } from "@/components/deal-builder/deal-builder-vehicle-panel";
import { DealBuilderPartExchangePanel } from "@/components/deal-builder/deal-builder-part-exchange-panel";
import { DealBuilderCustomerPanel } from "@/components/deal-builder/deal-builder-customer-panel";
import { DealHealthPanel } from "@/components/deal-builder/deal-health-panel";
import { FinanceComparisonPanel } from "@/components/deal-builder/finance-comparison-panel";
import { SalespersonControlsPanel } from "@/components/deal-builder/salesperson-controls-panel";
import { FcaDisclaimerFooter } from "@/components/deal-builder/fca-disclaimer-footer";
import { SceneSetterCard } from "@/components/deals/scene-setter-card";
import { PageContainer } from "@/components/layouts/page-container";
import { routes } from "@/constants/routes";
import { formatGbp } from "@/lib/formatGbp";
import {
  FINANCE_FIT_MONTHLY_MAX,
  FINANCE_FIT_MONTHLY_MIN,
  ZERO_TERM,
} from "@/lib/deal-builder/finance";
import { demoTestDriveNotes } from "@/lib/test-drive-display";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/data-display/card";
import { cn } from "@/lib/cn";
import type { ViewMode } from "@/components/deal-builder/deal-builder-header";
import { useState } from "react";

type DealFinanceFitScreenProps = {
  dealId: string;
};

function BudgetSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <span className="text-xl font-semibold tracking-tight">
          {formatGbp(value)}
          {suffix ? (
            <span className="text-base font-normal text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>
          {formatGbp(min)}
          {suffix ?? ""}
        </span>
        <span>
          {formatGbp(max)}
          {suffix ?? ""}
        </span>
      </div>
    </div>
  );
}

export function DealFinanceFitScreen({ dealId }: DealFinanceFitScreenProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const updateDealNotes = useDealStore((s) => s.updateDealNotes);
  const notesByDealId = useDealStore((s) => s.notesByDealId);
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);

  const finance = useDealBuilderFinance(dealId, deal);
  const [viewMode, setViewMode] = useState<ViewMode>("sales");

  const notes =
    dealId in notesByDealId
      ? notesByDealId[dealId]
      : deal.notes ?? "";

  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;
  const customerInitials =
    `${deal.customer.firstName[0] ?? ""}${deal.customer.lastName[0] ?? ""}`.toUpperCase();
  const vehicleLabel = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant}`;
  const testDriveNotes = deal.testDriveNotes ?? demoTestDriveNotes;

  const monthlyPayment =
    finance.effectiveSelected === "zero"
      ? finance.summary.zeroMonthly
      : finance.effectiveSelected === "hp"
        ? finance.summary.hpMonthly
        : finance.summary.pcpMonthly;

  const aprDisplay =
    finance.effectiveSelected === "zero"
      ? "0% APR"
      : finance.effectiveSelected === "hp"
        ? `${finance.apr}% APR`
        : "8.9% APR";

  const totalCredit = Math.max(
    0,
    deal.vehicle.retailPrice +
      finance.financeContext.productValue -
      finance.deposit -
      finance.pxEquity,
  );

  const totalPayable =
    finance.effectiveSelected === "zero"
      ? finance.deposit +
        finance.pxEquity +
        finance.summary.zeroMonthly * ZERO_TERM
      : finance.effectiveSelected === "hp"
        ? finance.deposit +
          finance.pxEquity +
          finance.summary.hpMonthly * finance.term
        : finance.summary.pcpTotal;

  const handleContinue = () => {
    finance.persistPlan();
    router.push(routes.dealBuilder.complete(dealId));
  };

  const controlsPanelProps = {
    deposit: finance.deposit,
    onDepositChange: finance.setDeposit,
    pxValue: finance.pxValue,
    onPxValueChange: finance.setPxValue,
    settlementFigure: finance.settlementFigure,
    onSettlementChange: finance.setSettlementFigure,
    pxEquity: finance.pxEquity,
    term: finance.term,
    onTermChange: finance.handleTermChange,
    apr: finance.apr,
    onAprChange: finance.setApr,
    selectedFinance: finance.selectedFinance,
    zeroEligible: finance.summary.zeroEligible,
    gfvPercent: finance.gfvPercent,
    balloonValue: finance.balloonValue,
    onGfvPercentChange: finance.handleGfvPercentChange,
    onBalloonValueChange: finance.handleBalloonValueChange,
    retailPrice: deal.vehicle.retailPrice,
    financeContext: finance.financeContext,
    hasPartExchange: Boolean(deal.partExchange),
    includedProducts: finance.includedProducts,
    onToggleProduct: finance.toggleIncludedProduct,
    allAboveBudget: finance.financeFit.allAboveBudget,
    comfortableMonthly: finance.comfortableMonthly,
    cheapestMonthly: finance.financeFit.cheapestMonthly,
  };

  return (
    <div className="flex h-[calc(100dvh-var(--topbar-height))] min-h-0 flex-col overflow-hidden">
      <DealBuilderHeader
        title="Finance fit"
        backHref={routes.dealBuilder.presentation(dealId)}
        customerName={customerName}
        vehicleLabel={vehicleLabel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer size="full" className="space-y-6 py-6">
          <SceneSetterCard scene="finance-fit" />

          <DealBuilderVehiclePanel
            make={deal.vehicle.make}
            model={deal.vehicle.model}
            variant={deal.vehicle.variant}
            registration={deal.vehicle.registration}
            year={deal.vehicle.year}
            mileage={deal.vehicle.mileage}
            colour={deal.vehicle.colour}
            retailPrice={deal.vehicle.retailPrice}
            partExchangeValue={deal.partExchange ? finance.pxValue : null}
            showInternalMargin={viewMode === "sales"}
            vehicleMargin={finance.vehicleMargin}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {viewMode === "sales" ? (
              <aside className="space-y-6 lg:col-span-3">
                {deal.partExchange ? (
                  <DealBuilderPartExchangePanel
                    partExchange={deal.partExchange}
                    pxValue={finance.pxValue}
                    settlementFigure={finance.settlementFigure}
                    pxEquity={finance.pxEquity}
                  />
                ) : null}
                <DealHealthPanel
                  vehicleCost={deal.vehicle.vehicleCost}
                  vehicleMargin={finance.vehicleMargin}
                  pxMargin={PX_MARGIN}
                  productMargin={PRODUCT_MARGIN}
                />
              </aside>
            ) : null}

            <div
              className={cn(
                viewMode === "sales" ? "lg:col-span-9" : "lg:col-span-12",
                "space-y-6",
              )}
            >
              {viewMode === "sales" ? (
                <DealBuilderCustomerPanel
                  dealId={dealId}
                  customerName={customerName}
                  customerInitials={customerInitials}
                  mobile={deal.customer.mobile}
                  email={deal.customer.email}
                  testDriveNotes={testDriveNotes}
                  notes={notes}
                  onNotesChange={(value) => updateDealNotes(dealId, value)}
                />
              ) : null}

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      What feels comfortable?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0">
                    <BudgetSlider
                      id="comfortable-deposit"
                      label="Comfortable deposit"
                      value={Math.min(finance.deposit, finance.depositMax)}
                      min={finance.depositMin}
                      max={finance.depositMax}
                      step={100}
                      onChange={finance.setDeposit}
                    />
                    <BudgetSlider
                      id="comfortable-monthly"
                      label="Comfortable monthly"
                      value={finance.comfortableMonthly}
                      min={FINANCE_FIT_MONTHLY_MIN}
                      max={FINANCE_FIT_MONTHLY_MAX}
                      step={10}
                      suffix="/mo"
                      onChange={finance.setComfortableMonthly}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {finance.financeFit.allAboveBudget ? (
                    <div className="rounded-[16px] border border-warning/30 bg-warning/10 px-4 py-3">
                      <p className="text-sm font-medium">
                        No option matches{" "}
                        {formatGbp(finance.comfortableMonthly)}/mo yet
                      </p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        Cheapest is {formatGbp(finance.financeFit.cheapestMonthly)}
                        /mo.{" "}
                        {viewMode === "sales"
                          ? "Use Configure Deal to adjust terms or trade off products."
                          : "Your salesperson can adjust the package to find a fit."}
                      </p>
                    </div>
                  ) : finance.financeFit.recommended ? (
                    <div className="rounded-[16px] border border-info/30 bg-info/10 px-4 py-3">
                      <p className="text-sm font-medium">
                        {financeProducts[finance.financeFit.recommended].headline}{" "}
                        matches your budget
                      </p>
                    </div>
                  ) : null}

                  <FinanceComparisonPanel
                    layout="row"
                    effectiveSelected={finance.effectiveSelected}
                    onSelectFinance={finance.handleSelectFinance}
                    deposit={finance.deposit}
                    term={finance.term}
                    hpVariant={finance.hpVariant}
                    balloonValue={finance.balloonValue}
                    apr={finance.apr}
                    financeContext={finance.financeContext}
                    summary={finance.summary}
                    recommended={finance.financeFit.recommended}
                    matches={finance.financeFit.matches}
                    onSelectHpVariant={finance.setHpVariant}
                    heading=""
                  />
                </div>
              </div>

              {viewMode === "sales" ? (
                <SalespersonControlsPanel {...controlsPanelProps} embedded />
              ) : null}

              <FcaDisclaimerFooter
                apr={aprDisplay}
                totalCredit={totalCredit}
                totalPayable={totalPayable}
                monthlyPayment={monthlyPayment}
                termMonths={
                  finance.effectiveSelected === "zero" ? ZERO_TERM : finance.term
                }
                finalPayment={
                  finance.effectiveSelected === "pcp"
                    ? finance.summary.balloon
                    : undefined
                }
              />
            </div>
          </div>
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer
          size="full"
          className="flex flex-wrap items-center justify-end gap-2 py-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              finance.persistPlan({ selectedFinance: "hp" });
              router.push(routes.dealBuilder.complete(dealId));
            }}
          >
            Cash purchase only
          </Button>
          <Button type="button" onClick={handleContinue}>
            Continue to summary
          </Button>
        </PageContainer>
      </footer>
    </div>
  );
}
