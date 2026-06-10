"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PX_MARGIN, PRODUCT_MARGIN } from "@/constants/deal-builder";
import { financeProducts } from "@/constants/finance-products";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { usePresentationTimer } from "@/hooks/use-presentation-timer";
import { useDealBuilderFinance } from "@/hooks/use-deal-builder-finance";
import { useDealStore } from "@/store/dealStore";
import { DealBuilderHeader } from "@/components/deal-builder/deal-builder-header";
import { DealBuilderVehiclePanel } from "@/components/deal-builder/deal-builder-vehicle-panel";
import { DealBuilderPartExchangePanel } from "@/components/deal-builder/deal-builder-part-exchange-panel";
import { DealHealthPanel } from "@/components/deal-builder/deal-health-panel";
import {
  FinancePresentationScreen,
  type PresentationPhase,
} from "@/components/deal-builder/finance-presentation-screen";
import { PresentationGuidePanel } from "@/components/deal-builder/presentation-guide-panel";
import { FcaDisclaimerFooter } from "@/components/deal-builder/fca-disclaimer-footer";
import { SceneSetterCard } from "@/components/deals/scene-setter-card";
import { PageContainer } from "@/components/layouts/page-container";
import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ViewMode } from "@/components/deal-builder/deal-builder-header";
import { ZERO_TERM } from "@/lib/deal-builder/finance";

type DealPresentationScreenProps = {
  dealId: string;
};

export function DealPresentationScreen({ dealId }: DealPresentationScreenProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);

  const finance = useDealBuilderFinance(dealId, deal);
  const [viewMode, setViewMode] = useState<ViewMode>("presentation");
  const [presentationPhase, setPresentationPhase] =
    useState<PresentationPhase>("zero");

  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;
  const vehicleTitle = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant} ${deal.vehicle.year}`;
  const vehicleLabel = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant}`;

  const timerScreen =
    viewMode === "presentation"
      ? presentationPhase === "alternatives"
        ? finance.effectiveSelected === "hp" ||
          finance.effectiveSelected === "pcp"
          ? finance.effectiveSelected
          : "hp"
        : "zero"
      : finance.effectiveSelected;

  const { formattedTotal: presentationTimer } = usePresentationTimer(timerScreen);

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

  const handleContinueToFinanceFit = () => {
    finance.persistPlan();
    router.push(routes.dealBuilder.financeFit(dealId));
  };

  const handleClientAgreedZero = () => {
    finance.handleSelectFinance("zero");
    finance.persistPlan({ selectedFinance: "zero" });
    toast.success("0% finance selected", {
      description: "Continue to finance fit to confirm payment details.",
    });
    router.push(routes.dealBuilder.financeFit(dealId));
  };

  const handleClientWantsOtherOptions = () => {
    setViewMode("presentation");
    setPresentationPhase("alternatives");
    if (finance.selectedFinance === "zero") {
      finance.handleSelectFinance("hp");
    }
  };

  return (
    <div className="flex h-[calc(100dvh-var(--topbar-height))] min-h-0 flex-col overflow-hidden">
      <DealBuilderHeader
        title={viewMode === "presentation" ? "Your 0% package" : "Deal Builder"}
        backHref={routes.deals.new.step4}
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
        showViewToggle
      />

      <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
        <PageContainer
          size="full"
          className={cn(
            "space-y-6 py-6 sm:space-y-8",
            "lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-0 lg:py-6",
          )}
        >
          <SceneSetterCard scene="presentation" />

          <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 lg:overflow-hidden">
            {viewMode === "sales" ? (
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
                  partExchangeValue={deal.partExchange ? finance.pxValue : null}
                  showInternalMargin
                  vehicleMargin={finance.vehicleMargin}
                />
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
                viewMode === "sales" ? "col-span-12 lg:col-span-9" : "col-span-12",
                "lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain scrollbar-thin",
              )}
            >
              {viewMode === "presentation" ? (
                <FinancePresentationScreen
                  deposit={finance.deposit}
                  summary={finance.summary}
                  effectiveSelected={finance.effectiveSelected}
                  selectedFinance={finance.selectedFinance}
                  phase={presentationPhase}
                  onPhaseChange={setPresentationPhase}
                  onSelectFinance={finance.handleSelectFinance}
                  term={finance.term}
                  hpVariant={finance.hpVariant}
                  balloonValue={finance.balloonValue}
                  apr={finance.apr}
                  financeContext={finance.financeContext}
                  onSelectHpVariant={finance.setHpVariant}
                />
              ) : (
                <PresentationGuidePanel
                  customerName={customerName}
                  vehicleTitle={vehicleTitle}
                  presentationTimer={presentationTimer}
                />
              )}

              <div className="mt-6">
                <FcaDisclaimerFooter
                  apr={aprDisplay}
                  totalCredit={totalCredit}
                  totalPayable={totalPayable}
                  monthlyPayment={monthlyPayment}
                  termMonths={
                    finance.effectiveSelected === "zero"
                      ? ZERO_TERM
                      : finance.term
                  }
                  finalPayment={
                    finance.effectiveSelected === "pcp"
                      ? finance.summary.balloon
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer
          size="full"
          className="flex flex-wrap items-center justify-end gap-2 py-4"
        >
          {viewMode === "presentation" &&
          presentationPhase === "alternatives" ? (
            <Button type="button" onClick={handleContinueToFinanceFit}>
              Continue With {financeProducts[finance.effectiveSelected].outcome}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClientWantsOtherOptions}
              >
                Customer wants other options
              </Button>
              <Button type="button" onClick={handleClientAgreedZero}>
                Customer agreed on 0% finance
              </Button>
            </>
          )}
        </PageContainer>
      </footer>
    </div>
  );
}
