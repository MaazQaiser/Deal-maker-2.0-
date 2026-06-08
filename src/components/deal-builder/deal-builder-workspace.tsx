"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Car,
  Gauge,
  Palette,
  Printer,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { PX_MARGIN, PRODUCT_MARGIN } from "@/constants/deal-builder";
import { dealBuilderStages } from "@/constants/deal-stages";
import {
  getStockVehicleImage,
} from "@/constants/deal-mock-data";
import { financeProducts } from "@/constants/finance-products";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { suggestFinanceOption } from "@/constants/finance-products";
import { formatGbp } from "@/lib/formatGbp";
import {
  FinanceOption,
  DEFAULT_HP_APR,
  balloonFromGfvPercent,
  calculatePxEquity,
  clampTermForFinance,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import { useDealStore } from "@/store/dealStore";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import { DealStageStepper } from "@/components/deals/deal-stage-stepper";
import { FinanceComparisonPanel } from "@/components/deal-builder/finance-comparison-panel";
import { SalespersonControlsPanel } from "@/components/deal-builder/salesperson-controls-panel";
import { routes } from "@/constants/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

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

  const [controlsOpen, setControlsOpen] = useState(false);
  const [deposit, setDeposit] = useState(4000);
  const [pxValue, setPxValue] = useState(deal.partExchange?.valuation ?? 0);
  const [settlementFigure, setSettlementFigure] = useState(
    deal.partExchange?.outstandingFinance ?? 0,
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
    [deposit, term, selectedFinance, hpVariant, balloonValue, apr, financeContext],
  );

  const effectiveSelected: FinanceOption =
    selectedFinance === "zero" && !summary.zeroEligible ? "hp" : selectedFinance;

  const stageMeta = dealBuilderStages[1];
  const vehicleMargin =
    deal.vehicle.retailPrice - deal.vehicle.vehicleCost;

  const suggestedOption = useMemo(
    () =>
      suggestFinanceOption({
        notes,
        customerBudget: deal.customerBudget,
        pcpMonthly: summary.pcpMonthly,
      }),
    [notes, deal.customerBudget, summary.pcpMonthly],
  );

  const monthlyPayment =
    effectiveSelected === "zero"
      ? summary.zeroMonthly
      : effectiveSelected === "hp"
        ? summary.hpMonthly
        : summary.pcpMonthly;

  const financeBadgeLabel = `${financeProducts[effectiveSelected].productCode} Selected · ${formatGbp(monthlyPayment)}/mo`;

  const customerInitials =
    `${deal.customer.firstName[0] ?? ""}${deal.customer.lastName[0] ?? ""}`.toUpperCase();

  const handleContinue = () => {
    saveFinancePlan(dealId, {
      deposit,
      term,
      selectedFinance: effectiveSelected,
      hpVariant,
      balloon: balloonValue,
      apr,
      pxValue,
      settlementFigure,
      gfvPercent,
    });
    router.push(routes.dealBuilder.review(dealId));
  };

  return (
    <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title={stageMeta.title}
        titleClassName="text-[36px] font-light leading-tight tracking-tight"
        description={`${stageMeta.subtitle} · ${dealId}`}
        footer={
          <div className="space-y-3 pt-1">
            <DealStageStepper currentStage={2} />
            <Badge variant="info" className="text-xs">
              {financeBadgeLabel}
            </Badge>
          </div>
        }
        actions={
          <>
            <Button type="button" variant="outline" asChild>
              <Link href={routes.deals.new.index} aria-label="Back to create deal">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button type="button" variant="outline" aria-label="Print deal">
              <Printer className="size-4" />
            </Button>
            <Button
              type="button"
              variant={controlsOpen ? "primary" : "outline"}
              onClick={() => setControlsOpen((open) => !open)}
            >
              <SlidersHorizontal className="size-4" />
              Adjust Plan
            </Button>
            <Button type="button" onClick={handleContinue}>
              Continue With Selected Finance Option
            </Button>
          </>
        }
      />

      {/* Vehicle + Customer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <div className="flex items-center justify-center self-stretch py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getStockVehicleImage(deal.vehicle.make, deal.vehicle.model)}
              alt={`${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant}`}
              className="h-auto max-h-[130px] w-auto max-w-full object-contain object-center md:max-h-[160px]"
              decoding="async"
            />
          </div>

          <Card className="w-full min-w-[280px] max-w-[360px] justify-self-end md:shrink-0">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Car className="size-5 text-primary" />
                Vehicle
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CarBrandLogo make={deal.vehicle.make} />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {deal.vehicle.make} {deal.vehicle.model} {deal.vehicle.variant}
                    </p>
                    <Badge variant="neutral" className="mt-1 font-mono">
                      {deal.vehicle.registration}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="size-4 shrink-0 text-primary/70" aria-hidden />
                    <span>{deal.vehicle.year}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Gauge className="size-4 shrink-0 text-primary/70" aria-hidden />
                    <span>{deal.vehicle.mileage.toLocaleString("en-GB")} miles</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Palette className="size-4 shrink-0 text-primary/70" aria-hidden />
                    <span>{deal.vehicle.colour}</span>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-caption text-muted-foreground">Retail Price</p>
                <p className="text-heading-3">{formatGbp(deal.vehicle.retailPrice)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-base font-semibold">
              <User className="size-5 text-primary" />
              Customer
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">
                  {customerInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {deal.customer.firstName} {deal.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{deal.customer.mobile}</p>
                  {deal.customer.email && (
                    <p className="truncate text-sm text-muted-foreground">
                      {deal.customer.email}
                    </p>
                  )}
                </div>
              </div>
              {deal.customerBudget != null && (
                <div className="shrink-0 text-right">
                  <p className="text-caption text-muted-foreground">Target Monthly Budget</p>
                  <p className="text-heading-4">{formatGbp(deal.customerBudget)}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`deal-notes-${dealId}`} className="text-caption text-muted-foreground">
                Notes
              </Label>
              <Textarea
                id={`deal-notes-${dealId}`}
                value={notes}
                onChange={(e) => updateDealNotes(dealId, e.target.value)}
                placeholder="Add customer notes, preferences, or objections..."
                className="min-h-[72px] resize-y"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finance comparison + adjust plan + part exchange */}
      <div className="space-y-6">
        <div
          className={cn(
            "flex overflow-hidden",
            controlsOpen
              ? "flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-6"
              : "flex-col",
          )}
        >
          <div
            className={cn(
              "min-w-0 transition-all duration-500 ease-in-out motion-reduce:transition-none",
              controlsOpen ? "w-full lg:flex-[1_1_0%]" : "w-full",
            )}
          >
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

          <div
            className={cn(
              "shrink-0 overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none",
              controlsOpen
                ? "w-full translate-y-0 opacity-100 lg:w-[min(400px,38%)] lg:translate-x-0 lg:translate-y-0"
                : "pointer-events-none max-h-0 w-full opacity-0 lg:max-h-none lg:w-0 lg:translate-x-8",
            )}
            aria-hidden={!controlsOpen}
          >
            <Card className="flex h-full max-h-[min(80vh,920px)] flex-col overflow-hidden p-6">
              <SalespersonControlsPanel
                onClose={() => setControlsOpen(false)}
                deposit={deposit}
                onDepositChange={setDeposit}
                pxValue={pxValue}
                onPxValueChange={setPxValue}
                settlementFigure={settlementFigure}
                onSettlementChange={setSettlementFigure}
                pxEquity={pxEquity}
                term={term}
                onTermChange={handleTermChange}
                apr={apr}
                onAprChange={setApr}
                selectedFinance={selectedFinance}
                onSelectFinance={handleSelectFinance}
                zeroEligible={summary.zeroEligible}
                gfvPercent={gfvPercent}
                balloonValue={balloonValue}
                onGfvPercentChange={handleGfvPercentChange}
                onBalloonValueChange={handleBalloonValueChange}
                retailPrice={deal.vehicle.retailPrice}
                financeContext={financeContext}
                vehicleCost={deal.vehicle.vehicleCost}
                vehicleMargin={vehicleMargin}
                pxMargin={PX_MARGIN}
                productMargin={PRODUCT_MARGIN}
                hasPartExchange={Boolean(deal.partExchange)}
              />
            </Card>
          </div>
        </div>

        {deal.partExchange && (
          <div
            className={cn(
              "transition-all duration-500 ease-in-out motion-reduce:transition-none",
              controlsOpen ? "xl:max-w-[62%]" : "w-full",
            )}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Part Exchange</CardTitle>
                <CardDescription>Customer trade-in value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={dealNestedPanelClass}>
                  <p className="text-sm font-medium">
                    {deal.partExchange.make} {deal.partExchange.model}
                  </p>
                  <Badge variant="neutral" className="mt-2 font-mono">
                    {deal.partExchange.registration}
                  </Badge>
                  <KeyValueList
                    className="mt-4"
                    items={[
                      {
                        key: "PX Value",
                        value: formatGbp(pxValue),
                      },
                      {
                        key: "Settlement",
                        value: formatGbp(settlementFigure),
                      },
                    ]}
                  />
                </div>
                <div className={cn(dealNestedPanelClass, "space-y-3")}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Available Equity</span>
                    <span className="text-heading-4 text-success">
                      {formatGbp(pxEquity)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </PageContainer>
  );
}
