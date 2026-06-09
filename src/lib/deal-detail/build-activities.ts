import type { ActivityItem } from "@/types/dashboard";
import type { DealRecord } from "@/types/deal";
import type { DealFinancePlan } from "@/store/dealStore";
import type { DealLifecycleStage } from "@/types/deal-detail";
import { isProcessChecklistComplete } from "@/constants/process-checklist";

function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60_000);
}

type BuildActivitiesInput = {
  deal: DealRecord;
  financePlan?: DealFinancePlan;
  lastUpdated: Date;
  lifecycleStage: DealLifecycleStage;
};

export function buildDealActivities({
  deal,
  financePlan,
  lastUpdated,
  lifecycleStage,
}: BuildActivitiesInput): ActivityItem[] {
  const activities: ActivityItem[] = [];
  const hasPx = Boolean(deal.partExchange);
  const checklistComplete =
    deal.processChecklist &&
    isProcessChecklistComplete(deal.processChecklist, hasPx);
  const hasTestDrive = Boolean(
    deal.testDriveNotes &&
      (deal.testDriveNotes.buyingMotives.length > 0 ||
        deal.testDriveNotes.freeNotes.trim() ||
        deal.testDriveNotes.likesCurrentVehicle.trim()),
  );
  const hasTrialClose = deal.trialClose?.rating != null;

  let offset = 120;

  activities.push({
    id: `${deal.id}-created`,
    title: "Deal Created",
    description: `${deal.customer.firstName} ${deal.customer.lastName} — ${deal.vehicle.make} ${deal.vehicle.model}`,
    timestamp: subtractMinutes(lastUpdated, offset),
    type: "deal",
  });

  if (checklistComplete) {
    offset -= 15;
    activities.push({
      id: `${deal.id}-checklist`,
      title: "Process Checklist Completed",
      description: "On-site welcome and pre-test drive steps recorded",
      timestamp: subtractMinutes(lastUpdated, offset),
      type: "customer",
    });
  }

  if (hasTestDrive) {
    offset -= 20;
    activities.push({
      id: `${deal.id}-test-drive`,
      title: "Test Drive Completed",
      description: "Buying motives and test drive notes captured",
      timestamp: subtractMinutes(lastUpdated, offset),
      type: "vehicle",
    });
  }

  if (hasTrialClose) {
    offset -= 10;
    activities.push({
      id: `${deal.id}-trial-close`,
      title: "Trial Close Recorded",
      description: `Customer rating: ${deal.trialClose?.rating}/10`,
      timestamp: subtractMinutes(lastUpdated, offset),
      type: "deal",
    });
  }

  if (financePlan) {
    offset -= 15;
    const financeLabel =
      financePlan.selectedFinance === "zero"
        ? "0% Finance"
        : financePlan.selectedFinance === "hp"
          ? "HP"
          : "PCP";
    activities.push({
      id: `${deal.id}-finance`,
      title: "Finance Option Selected",
      description: `${financeLabel} — ${financePlan.term} month term`,
      timestamp: subtractMinutes(lastUpdated, offset),
      type: "finance",
    });
  }

  if (
    lifecycleStage === "presented" ||
    lifecycleStage === "outcome" ||
    deal.status === "presented"
  ) {
    offset -= 10;
    activities.push({
      id: `${deal.id}-presented`,
      title: "Presented to Customer",
      description: "Deal summary shared with customer",
      timestamp: subtractMinutes(lastUpdated, offset),
      type: "proposal",
    });
  }

  if (deal.status === "won") {
    activities.push({
      id: `${deal.id}-won`,
      title: "Deal Won",
      description: "Customer agreed to proceed",
      timestamp: lastUpdated,
      type: "deal",
    });
  } else if (deal.status === "lost") {
    activities.push({
      id: `${deal.id}-lost`,
      title: "Deal Lost",
      description: "Customer did not proceed",
      timestamp: lastUpdated,
      type: "deal",
    });
  } else if (deal.status === "finance-pending") {
    activities.push({
      id: `${deal.id}-finance-pending`,
      title: "Finance Application Submitted",
      description: "Awaiting lender decision",
      timestamp: lastUpdated,
      type: "finance",
    });
  }

  return activities.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
}

export function deriveLifecycleStage(
  deal: DealRecord,
  financePlan?: DealFinancePlan,
): DealLifecycleStage {
  if (
    deal.status === "won" ||
    deal.status === "lost" ||
    deal.status === "finance-pending"
  ) {
    return "outcome";
  }

  if (deal.status === "presented") {
    return "presented";
  }

  if (financePlan) {
    return "finance-configured";
  }

  if (deal.trialClose?.rating != null) {
    return "trial-close-complete";
  }

  const hasTestDrive = Boolean(
    deal.testDriveNotes &&
      (deal.testDriveNotes.buyingMotives.length > 0 ||
        deal.testDriveNotes.freeNotes.trim()),
  );
  if (hasTestDrive) {
    return "test-drive-complete";
  }

  const hasPx = Boolean(deal.partExchange);
  if (
    deal.processChecklist &&
    isProcessChecklistComplete(deal.processChecklist, hasPx)
  ) {
    return "checklist-complete";
  }

  return "created";
}
