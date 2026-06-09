"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { PX_MARGIN, PRODUCT_MARGIN } from "@/constants/deal-builder";
import { financeProducts } from "@/constants/finance-products";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { demoTestDriveNotes } from "@/lib/test-drive-display";
import { suggestFinanceOption } from "@/constants/finance-products";
import {
  FinanceOption,
  DEFAULT_HP_APR,
  balloonFromGfvPercent,
  calculatePxEquity,
  clampTermForFinance,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import { usePresentationTimer } from "@/hooks/use-presentation-timer";
import { useDealStore } from "@/store/dealStore";
import {
  DealBuilderHeader,
  type ViewMode,
} from "@/components/deal-builder/deal-builder-header";
import { PageContainer } from "@/components/layouts/page-container";
import { DealBuilderVehiclePanel } from "@/components/deal-builder/deal-builder-vehicle-panel";
import { DealBuilderCustomerPanel } from "@/components/deal-builder/deal-builder-customer-panel";
import { DealBuilderPartExchangePanel } from "@/components/deal-builder/deal-builder-part-exchange-panel";
import { FinanceComparisonPanel } from "@/components/deal-builder/finance-comparison-panel";
import {
  FinancePresentationScreen,
  type PresentationPhase,
} from "@/components/deal-builder/finance-presentation-screen";
import { PresentationGuidePanel } from "@/components/deal-builder/presentation-guide-panel";
import { DealHealthPanel } from "@/components/deal-builder/deal-health-panel";
import { SalespersonControlsPanel } from "@/components/deal-builder/salesperson-controls-panel";
import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type DealBuilderWorkspaceProps = {
  dealId: string;
};

export function DealBuilderWorkspace({ dealId }: DealBuilderWorkspaceProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const saveFinancePlan = useDealStore((s) => s.saveFinancePlan);
  const updateDealNotes = useDealStore((s) => s.updateDealNotes);
  const notesByDealId = useDealStore((s) => s.notesByDealId);
  const storedDeal = useDealStore((s) => s.deals.find((d) => d.id === dealId));
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);
  const notes =
    dealId in notesByDealId
      ? notesByDealId[dealId]
      : storedDeal?.notes ?? deal.notes ?? "";

  const [viewMode, setViewMode] = useState<ViewMode>("sales");
  const [presentationPhase, setPresentationPhase] =
    useState<PresentationPhase>("zero");
  const [deposit, setDeposit] = useState(4000);
  const [pxValue, setPxValue] = useState(deal.partExchange?.valuation ?? 0);
  const [settlementFigure, setSettlementFigure] = useState(
    deal.partExchange?.settlementFigure ?? 0,
  );
  const pxEquity = useMemo(
    () => calculatePxEquity(pxValue, settlementFigure),
    [pxValue, settlementFigure],
  );
  const [term, setTerm] = useState(48);
  const [selectedFinance, setSelectedFinance] = useState<FinanceOption>("zero");
  const [hpVariant, setHpVariant] = useState<"a" | "b">("b");
  const [apr, setApr] = useState(DEFAULT_HP_APR);
  const [gfvPercent, setGfvPercent] = useState(43);
  const [balloonValue, setBalloonValue] = useState(() =>
    balloonFromGfvPercent(43, deal.vehicle.retailPrice),
  );

  const financeContext = useMemo(
    () => ({
      retailPrice: deal.vehicle.retailPrice,
      pxEquity,
      productValue: 1649,
      zeroPercentMinDeposit: 7824,
    }),
    [deal.vehicle.retailPrice, pxEquity],
  );

  const handleSelectFinance = (option: FinanceOption) => {
    setSelectedFinance(option);
    setTerm((current) => clampTermForFinance(current, option));
  };

  const handleTermChange = (value: number) => {
    setTerm(clampTermForFinance(value, selectedFinance));
  };

  const handleGfvPercentChange = (percent: number) => {
    setGfvPercent(percent);
    setBalloonValue(balloonFromGfvPercent(percent, deal.vehicle.retailPrice));
  };

  const handleBalloonValueChange = (value: number) => {
    setBalloonValue(value);
    setGfvPercent(
      Math.round((value / deal.vehicle.retailPrice) * 1000) / 10,
    );
  };

  const summary = useMemo(
    () =>
      getFinanceSummary(
        {
          deposit,
          term,
          selectedFinance,
          hpVariant,
          balloon: balloonValue,
          apr,
        },
        financeContext,
      ),
    [
      deposit,
      term,
      selectedFinance,
      hpVariant,
      balloonValue,
      apr,
      financeContext,
    ],
  );

  const effectiveSelected: FinanceOption =
    selectedFinance === "zero" && !summary.zeroEligible
      ? "hp"
      : selectedFinance;

  const vehicleMargin = deal.vehicle.retailPrice - deal.vehicle.vehicleCost;
  const vehicleTitle = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant} ${deal.vehicle.year}`;
  const vehicleLabel = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant}`;
  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;

  const suggestedOption = useMemo(
    () =>
      suggestFinanceOption({
        notes,
        maximumDeposit: deal.maximumDeposit,
        customerBudget: deal.customerBudget,
        pcpMonthly: summary.pcpMonthly,
      }),
    [notes, deal.maximumDeposit, deal.customerBudget, summary.pcpMonthly],
  );

  const timerScreen =
    viewMode === "sales"
      ? effectiveSelected
      : presentationPhase === "alternatives"
        ? selectedFinance === "hp" || selectedFinance === "pcp"
          ? selectedFinance
          : "hp"
        : "zero";

  const { formattedTotal: presentationTimer } = usePresentationTimer(timerScreen);

  const customerInitials =
    `${deal.customer.firstName[0] ?? ""}${deal.customer.lastName[0] ?? ""}`.toUpperCase();
  const testDriveNotes = deal.testDriveNotes ?? demoTestDriveNotes;

  const persistAndContinue = (finance: FinanceOption = effectiveSelected) => {
    saveFinancePlan(dealId, {
      deposit,
      term,
      selectedFinance: finance,
      hpVariant,
      balloon: balloonValue,
      apr,
      pxValue,
      settlementFigure,
      gfvPercent,
    });
    router.push(routes.dealBuilder.review(dealId));
  };

  const handleClientAgreedZero = () => {
    handleSelectFinance("zero");
    persistAndContinue("zero");
  };

  const handleClientWantsOtherOptions = () => {
    setViewMode("presentation");
    setPresentationPhase("alternatives");
    if (selectedFinance === "zero") {
      handleSelectFinance("hp");
    }
  };

  const controlsPanelProps = {
    deposit,
    onDepositChange: setDeposit,
    pxValue,
    onPxValueChange: setPxValue,
    settlementFigure,
    onSettlementChange: setSettlementFigure,
    pxEquity,
    term,
    onTermChange: handleTermChange,
    apr,
    onAprChange: setApr,
    selectedFinance,
    zeroEligible: summary.zeroEligible,
    gfvPercent,
    balloonValue,
    onGfvPercentChange: handleGfvPercentChange,
    onBalloonValueChange: handleBalloonValueChange,
    retailPrice: deal.vehicle.retailPrice,
    financeContext,
    hasPartExchange: Boolean(deal.partExchange),
  };

  return (
    <div className="flex h-[calc(100dvh-var(--topbar-height))] min-h-0 flex-col overflow-hidden">
      <DealBuilderHeader
        dealId={dealId}
        customerName={customerName}
        vehicleLabel={vehicleLabel}
        presentationTimer={presentationTimer}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          if (mode === "presentation") {
            setPresentationPhase("zero");
          }
        }}
      />

      <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
        <PageContainer
          size="full"
          className={cn(
            "space-y-6 py-6 sm:space-y-8",
            "lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-0 lg:py-6",
          )}
        >
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 lg:overflow-hidden">
            <aside
              className={cn(
                "col-span-12 space-y-6 lg:col-span-3",
                "lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 scrollbar-thin",
              )}
            >
              <DealBuilderVehiclePanel
                make={deal.vehicle.make}
                model={deal.vehicle.model}
                variant={deal.vehicle.variant}
                registration={deal.vehicle.registration}
                year={deal.vehicle.year}
                mileage={deal.vehicle.mileage}
                colour={deal.vehicle.colour}
                retailPrice={deal.vehicle.retailPrice}
                partExchangeValue={deal.partExchange ? pxValue : null}
                customerBudget={deal.customerBudget ?? null}
                showInternalMargin={viewMode === "sales"}
                vehicleMargin={vehicleMargin}
              />
              {deal.partExchange ? (
                <DealBuilderPartExchangePanel
                  partExchange={deal.partExchange}
                  pxValue={pxValue}
                  settlementFigure={settlementFigure}
                  pxEquity={pxEquity}
                />
              ) : null}
              {viewMode === "sales" ? (
                <DealHealthPanel
                  vehicleCost={deal.vehicle.vehicleCost}
                  vehicleMargin={vehicleMargin}
                  pxMargin={PX_MARGIN}
                  productMargin={PRODUCT_MARGIN}
                />
              ) : null}
            </aside>

            <div
              className={cn(
                "col-span-12 lg:col-span-9",
                "lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain scrollbar-thin",
              )}
            >
              {viewMode === "presentation" ? (
              <FinancePresentationScreen
                deposit={deposit}
                summary={summary}
                effectiveSelected={effectiveSelected}
                selectedFinance={selectedFinance}
                phase={presentationPhase}
                onPhaseChange={setPresentationPhase}
                onSelectFinance={handleSelectFinance}
                term={term}
                hpVariant={hpVariant}
                balloonValue={balloonValue}
                apr={apr}
                financeContext={financeContext}
                onSelectHpVariant={setHpVariant}
              />
              ) : (
                <div className="space-y-6">
                  <DealBuilderCustomerPanel
                    dealId={dealId}
                    customerName={customerName}
                    customerInitials={customerInitials}
                    mobile={deal.customer.mobile}
                    email={deal.customer.email}
                    maximumDeposit={deal.maximumDeposit}
                    customerBudget={deal.customerBudget}
                    testDriveNotes={testDriveNotes}
                    notes={notes}
                    onNotesChange={(value) => updateDealNotes(dealId, value)}
                  />

                  <PresentationGuidePanel
                    customerName={customerName}
                    vehicleTitle={vehicleTitle}
                    presentationTimer={presentationTimer}
                  />

                  <SalespersonControlsPanel
                    {...controlsPanelProps}
                    embedded
                  />

                  <FinanceComparisonPanel
                    effectiveSelected={effectiveSelected}
                    onSelectFinance={handleSelectFinance}
                    deposit={deposit}
                    term={term}
                    hpVariant={hpVariant}
                    balloonValue={balloonValue}
                    apr={apr}
                    financeContext={financeContext}
                    summary={summary}
                    suggestedOption={suggestedOption}
                    onSelectHpVariant={setHpVariant}
                  />
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer
          size="full"
          className="flex flex-wrap items-center justify-end gap-2 py-4"
        >
          <Button type="button" variant="outline" aria-label="Print deal">
            <Printer className="size-4" />
            Print
          </Button>
          {viewMode === "presentation" &&
            presentationPhase === "alternatives" && (
              <Button type="button" onClick={() => persistAndContinue()}>
                Continue With {financeProducts[effectiveSelected].outcome}
              </Button>
            )}
          {(viewMode === "sales" ||
            (viewMode === "presentation" &&
              presentationPhase !== "alternatives")) && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClientWantsOtherOptions}
              >
                Client wants other options
              </Button>
              <Button
                type="button"
                onClick={handleClientAgreedZero}
                disabled={!summary.zeroEligible}
              >
                Client agreed on 0% Finance
              </Button>
            </>
          )}
        </PageContainer>
      </footer>
    </div>
  );
}
