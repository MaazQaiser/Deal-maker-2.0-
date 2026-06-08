import { create } from "zustand";
import type { DealCreationFormValues } from "@/lib/validations/deal";
import {
  lookupPartExchange,
  stockVehicles,
} from "@/constants/deal-mock-data";
import type { FinanceOption } from "@/lib/deal-builder/finance";
import type { Branch, DealRecord, DealSource, PurchaseTimeline } from "@/types/deal";
import type { DealStatus } from "@/types/dashboard";

export type DealFinancePlan = {
  deposit: number;
  term: number;
  selectedFinance: FinanceOption;
  hpVariant: "a" | "b";
  balloon: number;
  apr: number;
  pxValue: number;
  settlementFigure: number;
  gfvPercent: number;
};

type DealStore = {
  deals: DealRecord[];
  financePlans: Record<string, DealFinancePlan>;
  notesByDealId: Record<string, string>;
  nextDealNumber: number;
  createDeal: (form: DealCreationFormValues) => DealRecord;
  getDeal: (id: string) => DealRecord | undefined;
  getDealNotes: (id: string, fallback?: string) => string;
  saveFinancePlan: (dealId: string, plan: DealFinancePlan) => void;
  getFinancePlan: (dealId: string) => DealFinancePlan | undefined;
  updateDealStatus: (dealId: string, status: DealStatus) => void;
  updateDealNotes: (dealId: string, notes: string) => void;
};

function generateDealId(sequence: number): string {
  return `DB-${sequence}`;
}

export const useDealStore = create<DealStore>((set, get) => ({
  deals: [],
  financePlans: {},
  notesByDealId: {},
  nextDealNumber: 1054,

  createDeal: (form) => {
    const vehicle = stockVehicles.find((v) => v.id === form.vehicleId);
    if (!vehicle) {
      throw new Error("Selected vehicle not found");
    }

    const id = generateDealId(get().nextDealNumber);

    let partExchange: DealRecord["partExchange"];
    if (form.hasPartExchange && form.pxRegistration) {
      const pxVehicle = lookupPartExchange(form.pxRegistration);
      const valuation = form.pxValuation ?? 0;
      const outstandingFinance = form.pxOutstandingFinance ?? 0;

      partExchange = {
        registration: pxVehicle?.registration ?? form.pxRegistration,
        make: pxVehicle?.make ?? "",
        model: pxVehicle?.model ?? "",
        year: pxVehicle?.year ?? 0,
        mileage: pxVehicle?.mileage ?? 0,
        valuation,
        outstandingFinance,
        settlementRequired: form.pxSettlementRequired === "yes",
        equity: valuation - outstandingFinance,
      };
    }

    const deal: DealRecord = {
      id,
      status: "draft",
      createdAt: new Date(),
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        mobile: form.mobile,
        email: form.email || undefined,
        address: form.address || undefined,
        postcode: form.postcode || undefined,
      },
      vehicle,
      partExchange,
      salesperson: form.salesperson,
      branch: form.branch as Branch,
      dealSource: form.dealSource as DealSource,
      purchaseTimeline: form.purchaseTimeline as PurchaseTimeline,
      customerBudget: form.customerBudget,
      notes: form.notes || undefined,
    };

    set((state) => ({
      deals: [deal, ...state.deals],
      nextDealNumber: state.nextDealNumber + 1,
    }));

    return deal;
  },

  getDeal: (id) => get().deals.find((d) => d.id === id),

  getDealNotes: (id, fallback = "") => {
    const state = get();
    if (id in state.notesByDealId) {
      return state.notesByDealId[id];
    }
    return state.deals.find((d) => d.id === id)?.notes ?? fallback;
  },

  saveFinancePlan: (dealId, plan) =>
    set((state) => ({
      financePlans: { ...state.financePlans, [dealId]: plan },
    })),

  getFinancePlan: (dealId) => get().financePlans[dealId],

  updateDealStatus: (dealId, status) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === dealId ? { ...deal, status } : deal,
      ),
    })),

  updateDealNotes: (dealId, notes) =>
    set((state) => ({
      notesByDealId: { ...state.notesByDealId, [dealId]: notes },
      deals: state.deals.map((deal) =>
        deal.id === dealId
          ? { ...deal, notes: notes.trim() || undefined }
          : deal,
      ),
    })),
}));
