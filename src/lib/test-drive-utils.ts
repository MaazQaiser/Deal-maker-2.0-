import type { DealCreationFormValues } from "@/lib/validations/deal";

export function getSalesManagerNotes(
  draft: DealCreationFormValues,
): string[] {
  const notes: string[] = [];

  if (draft.hasPartExchange && draft.pxValuation != null && draft.pxValuation > 0) {
    notes.push("PX Valuation Completed");
  }

  if (
    draft.hasPartExchange &&
    draft.pxExistingFinance === "yes" &&
    draft.pxSettlementFigure != null &&
    draft.pxSettlementFigure > 0
  ) {
    notes.push("Settlement Confirmed");
  }

  const totalDepositContribution = draft.hasPartExchange
    ? Math.max(
        0,
        (draft.pxValuation ?? 0) - (draft.pxSettlementFigure ?? 0),
      )
    : 0;

  if (totalDepositContribution >= 7824) {
    notes.push("0% Finance Available");
  }

  return notes;
}

export function getPreviewDealId(nextDealNumber: number): string {
  return `DB-${nextDealNumber}`;
}
