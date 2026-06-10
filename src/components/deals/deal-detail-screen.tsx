"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Printer, Wrench } from "lucide-react";
import {
  PRODUCT_MARGIN,
  PRODUCT_VALUE,
  PX_MARGIN,
} from "@/constants/deal-builder";
import {
  branches,
  getLeadSourceLabel,
  purchaseTimelines,
} from "@/constants/deal-mock-data";
import { routes } from "@/constants/routes";
import { useDealDetail } from "@/lib/deal-detail/get-deal-detail";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import { formatGbp } from "@/lib/formatGbp";
import { formatDate } from "@/lib/formatDate";
import {
  calculatePxEquity,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import { DealBuilderCustomerPanel } from "@/components/deal-builder/deal-builder-customer-panel";
import { DealBuilderPartExchangePanel } from "@/components/deal-builder/deal-builder-part-exchange-panel";
import { DealBuilderVehiclePanel } from "@/components/deal-builder/deal-builder-vehicle-panel";
import { DealFinanceSummarySection } from "@/components/deal-builder/deal-finance-summary-section";
import { DealHealthPanel } from "@/components/deal-builder/deal-health-panel";
import { DealDetailActivityTimeline } from "@/components/deals/deal-detail-activity-timeline";
import { DealDetailChecklistSection } from "@/components/deals/deal-detail-checklist-section";
import { DealDetailTestDriveSection } from "@/components/deals/deal-detail-test-drive-section";
import { DealDetailTrialCloseSection } from "@/components/deals/deal-detail-trial-close-section";
import { DealLifecycleStepper } from "@/components/deals/deal-lifecycle-stepper";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DealDetailScreenProps = {
  dealId: string;
};

function getCustomerInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function StatusBanner({ status }: { status: string }) {
  if (status === "won") {
    return (
      <div className="rounded-[24px] border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
        Deal won — customer agreed to proceed.
      </div>
    );
  }

  if (status === "lost") {
    return (
      <div className="rounded-[24px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
        Deal lost — customer did not proceed.
      </div>
    );
  }

  if (status === "finance-pending") {
    return (
      <div className="rounded-[24px] border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
        Finance application pending — awaiting lender decision.
      </div>
    );
  }

  return null;
}

export function DealDetailScreen({ dealId }: DealDetailScreenProps) {
  const bundle = useDealDetail(dealId);
  const deal = bundle?.deal;
  const financePlan = bundle?.financePlan;

  const pxEquity = useMemo(() => {
    if (!deal) return 0;
    if (!financePlan) {
      return deal.partExchange
        ? calculatePxEquity(
            deal.partExchange.valuation,
            deal.partExchange.settlementFigure,
          )
        : 0;
    }
    return calculatePxEquity(
      financePlan.pxValue,
      financePlan.settlementFigure,
    );
  }, [deal, financePlan]);

  const monthlyPayment = useMemo(() => {
    if (!deal || !financePlan) return null;

    const summary = getFinanceSummary(
      {
        deposit: financePlan.deposit,
        term: financePlan.term,
        selectedFinance: financePlan.selectedFinance,
        hpVariant: financePlan.hpVariant,
        balloon: financePlan.balloon,
        apr: financePlan.apr,
      },
      {
        retailPrice: deal.vehicle.retailPrice,
        pxEquity,
        productValue: PRODUCT_VALUE,
        zeroPercentMinDeposit: 7824,
      },
    );

    const effectiveSelected =
      financePlan.selectedFinance === "zero" && !summary.zeroEligible
        ? "hp"
        : financePlan.selectedFinance;

    return effectiveSelected === "zero"
      ? summary.zeroMonthly
      : effectiveSelected === "hp"
        ? summary.hpMonthly
        : summary.pcpMonthly;
  }, [deal, financePlan, pxEquity]);

  if (!bundle || !deal) {
    return (
      <PageContainer size="sm" className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
        <h1 className="text-heading-2">Deal not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No deal exists with ID {dealId}.
        </p>
        <Button type="button" className="mt-6" asChild>
          <Link href={routes.dashboard}>
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </PageContainer>
    );
  }

  const { activities, lastUpdated, lifecycleStage } = bundle;
  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;
  const vehicleLabel = `${deal.vehicle.make} ${deal.vehicle.model} ${deal.vehicle.variant}`;
  const branchLabel =
    branches.find((b) => b.value === deal.branch)?.label ?? deal.branch;
  const purchaseTimelineLabel =
    purchaseTimelines.find((item) => item.value === deal.purchaseTimeline)
      ?.label ?? deal.purchaseTimeline;

  const vehicleMargin = deal.vehicle.retailPrice - deal.vehicle.vehicleCost;
  const notes = deal.notes ?? "";

  return (
    <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title={dealId}
        description={`${customerName} · ${vehicleLabel}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={dealStatusVariant[deal.status]}>
              {dealStatusLabel[deal.status]}
            </Badge>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={routes.dashboard}>
                <ArrowLeft className="size-4" />
                Dashboard
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={routes.dealBuilder.presentation(dealId)}>
                <Wrench className="size-4" />
                Open in Deal Builder
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={routes.deals.proposal(dealId)}>
                <Printer className="size-4" />
                Print Proposal
              </Link>
            </Button>
          </div>
        }
      />

      <StatusBanner status={deal.status} />

      <DealLifecycleStepper currentStage={lifecycleStage} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Deal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  { key: "Salesperson", value: deal.salesperson },
                  { key: "Branch", value: branchLabel },
                  { key: "Lead Source", value: getLeadSourceLabel(deal.dealSource) },
                  { key: "Purchase Timeline", value: purchaseTimelineLabel },
                  {
                    key: "Created",
                    value: formatDate(deal.createdAt, {
                      locale: "en-GB",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                  ...(deal.customer.address
                    ? [{ key: "Address", value: deal.customer.address }]
                    : []),
                  ...(deal.customer.postcode
                    ? [{ key: "Postcode", value: deal.customer.postcode }]
                    : []),
                ]}
              />
            </CardContent>
          </Card>

          <DealBuilderCustomerPanel
            dealId={dealId}
            customerName={customerName}
            customerInitials={getCustomerInitials(
              deal.customer.firstName,
              deal.customer.lastName,
            )}
            mobile={deal.customer.mobile}
            email={deal.customer.email}
            testDriveNotes={deal.testDriveNotes}
            notes={notes}
            readOnly
          />

          <DealBuilderVehiclePanel
            make={deal.vehicle.make}
            model={deal.vehicle.model}
            variant={deal.vehicle.variant}
            registration={deal.vehicle.registration}
            year={deal.vehicle.year}
            mileage={deal.vehicle.mileage}
            colour={deal.vehicle.colour}
            retailPrice={deal.vehicle.retailPrice}
            partExchangeValue={deal.partExchange?.valuation ?? null}
          />

          {deal.partExchange && financePlan ? (
            <DealBuilderPartExchangePanel
              partExchange={deal.partExchange}
              pxValue={financePlan.pxValue}
              settlementFigure={financePlan.settlementFigure}
              pxEquity={pxEquity}
            />
          ) : null}

          <DealFinanceSummarySection deal={deal} financePlan={financePlan} />

          <DealDetailChecklistSection
            checklist={deal.processChecklist}
            hasPartExchange={Boolean(deal.partExchange)}
          />

          <DealDetailTestDriveSection testDriveNotes={deal.testDriveNotes} />

          <DealDetailTrialCloseSection
            trialClose={deal.trialClose}
            highlight={deal.status === "lost"}
          />
        </div>

        <div className="space-y-6">
          <DealDetailActivityTimeline activities={activities} />

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Finance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {monthlyPayment != null && financePlan ? (
                <>
                  <div>
                    <p className="text-caption text-muted-foreground">
                      Monthly Payment
                    </p>
                    <p className="text-heading-3">
                      {formatGbp(monthlyPayment)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Deposit</p>
                    <p className="text-lg font-semibold">
                      {formatGbp(financePlan.deposit)}
                      {pxEquity > 0 ? " + PX" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Term</p>
                    <p className="text-lg font-semibold">
                      {financePlan.term} months
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Finance not yet configured.
                </p>
              )}
            </CardContent>
          </Card>

          <DealHealthPanel
            vehicleCost={deal.vehicle.vehicleCost}
            vehicleMargin={vehicleMargin}
            pxMargin={deal.partExchange ? PX_MARGIN : 0}
            productMargin={financePlan ? PRODUCT_MARGIN : 0}
          />

          <Card>
            <CardContent className="p-4">
              <p className="text-caption text-muted-foreground">Last updated</p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(lastUpdated, {
                  locale: "en-GB",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
