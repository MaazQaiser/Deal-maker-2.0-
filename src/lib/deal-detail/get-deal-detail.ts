"use client";

import { getMockDealDetail } from "@/constants/deal-detail-mock-data";
import {
  buildDealActivities,
  deriveLifecycleStage,
} from "@/lib/deal-detail/build-activities";
import { useDealStore } from "@/store/dealStore";
import type { DealDetailBundle } from "@/types/deal-detail";

export function resolveDealDetailFromStore(
  id: string,
  state: {
    deals: ReturnType<typeof useDealStore.getState>["deals"];
    financePlans: ReturnType<typeof useDealStore.getState>["financePlans"];
    notesByDealId: ReturnType<typeof useDealStore.getState>["notesByDealId"];
  },
): DealDetailBundle | undefined {
  const deal = state.deals.find((d) => d.id === id);
  if (!deal) return undefined;

  const financePlan = state.financePlans[id];
  const notes =
    id in state.notesByDealId ? state.notesByDealId[id] : deal.notes;
  const dealWithNotes = notes
    ? { ...deal, notes: notes.trim() || undefined }
    : deal;
  const lifecycleStage = deriveLifecycleStage(dealWithNotes, financePlan);
  const lastUpdated = dealWithNotes.createdAt;

  return {
    deal: dealWithNotes,
    financePlan,
    lifecycleStage,
    lastUpdated,
    activities: buildDealActivities({
      deal: dealWithNotes,
      financePlan,
      lastUpdated,
      lifecycleStage,
    }),
  };
}

export function useDealDetail(dealId: string): DealDetailBundle | undefined {
  const deals = useDealStore((s) => s.deals);
  const financePlans = useDealStore((s) => s.financePlans);
  const notesByDealId = useDealStore((s) => s.notesByDealId);

  const fromStore = resolveDealDetailFromStore(dealId, {
    deals,
    financePlans,
    notesByDealId,
  });
  if (fromStore) return fromStore;

  return getMockDealDetail(dealId);
}
