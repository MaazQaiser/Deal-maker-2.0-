import { create } from "zustand";
import type { DealCreationFormValues } from "@/lib/validations/deal";
import {
  lookupPartExchange,
  stockVehicles,
} from "@/constants/deal-mock-data";
import type { FinanceOption } from "@/lib/deal-builder/finance";
import type { IncludedProductId } from "@/constants/presentation-content";
import type { Branch, DealRecord, DealSource, PurchaseTimeline } from "@/types/deal";
import type { DealStatus } from "@/types/dashboard";
import type { ProcessChecklist } from "@/types/process-checklist";
import type { TestDriveNotes, TrialCloseData } from "@/types/test-drive";

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
  comfortableMonthly?: number;
  includedProducts?: IncludedProductId[];
};

type DealStore = {
  deals: DealRecord[];
  financePlans: Record<string, DealFinancePlan>;
  notesByDealId: Record<string, string>;
  creationDraft: DealCreationFormValues | null;
  creationChecklist: ProcessChecklist | null;
  creationTestDriveNotes: TestDriveNotes | null;
  creationTrialClose: TrialCloseData | null;
  nextDealNumber: number;
  saveCreationDraft: (form: DealCreationFormValues) => void;
  getCreationDraft: () => DealCreationFormValues | null;
  saveCreationChecklist: (checklist: ProcessChecklist) => void;
  saveCreationTestDriveNotes: (notes: TestDriveNotes) => void;
  saveCreationTrialClose: (data: TrialCloseData) => void;
  clearCreationDraft: () => void;
  createDeal: (
    form: DealCreationFormValues,
    checklist?: ProcessChecklist,
    testDriveNotes?: TestDriveNotes,
    trialClose?: TrialCloseData,
  ) => DealRecord;
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
  creationDraft: null,
  creationChecklist: null,
  creationTestDriveNotes: null,
  creationTrialClose: null,
  nextDealNumber: 1054,

  saveCreationDraft: (form) => set({ creationDraft: form }),

  getCreationDraft: () => get().creationDraft,

  saveCreationChecklist: (checklist) => set({ creationChecklist: checklist }),

  saveCreationTestDriveNotes: (notes) =>
    set({ creationTestDriveNotes: notes }),

  saveCreationTrialClose: (data) => set({ creationTrialClose: data }),

  clearCreationDraft: () =>
    set({
      creationDraft: null,
      creationChecklist: null,
      creationTestDriveNotes: null,
      creationTrialClose: null,
    }),

  createDeal: (form, checklist, testDriveNotes, trialClose) => {
    const vehicle = stockVehicles.find((v) => v.id === form.vehicleId);
    if (!vehicle) {
      throw new Error("Selected vehicle not found");
    }

    const id = generateDealId(get().nextDealNumber);

    let partExchange: DealRecord["partExchange"];
    if (form.hasPartExchange && form.pxRegistration) {
      const pxVehicle = lookupPartExchange(form.pxRegistration);
      const valuation = form.pxValuation ?? 0;
      const hasExistingFinance = form.pxExistingFinance === "yes";
      const monthlyPayment = hasExistingFinance
        ? (form.pxMonthlyPayment ?? 0)
        : 0;
      const settlementFigure = hasExistingFinance
        ? (form.pxSettlementFigure ?? 0)
        : 0;

      partExchange = {
        registration: pxVehicle?.registration ?? form.pxRegistration,
        make: pxVehicle?.make ?? "",
        model: pxVehicle?.model ?? "",
        year: pxVehicle?.year ?? 0,
        mileage: form.pxCurrentMileage ?? pxVehicle?.mileage ?? 0,
        colour: pxVehicle?.colour,
        fuel: pxVehicle?.fuel,
        motExpires: pxVehicle?.motExpires,
        valuation,
        existingFinance: hasExistingFinance,
        monthlyPayment,
        settlementFigure,
        lender: hasExistingFinance ? form.pxLender : undefined,
        agreementNumber: hasExistingFinance
          ? form.pxAgreementNumber
          : undefined,
        settlementQuoteDate: hasExistingFinance
          ? form.pxSettlementQuoteDate || undefined
          : undefined,
        equity: valuation - settlementFigure,
        serviceHistoryType: form.pxServiceHistoryType,
        servicedWhere: form.pxServicedWhere,
        v5InSellersName: form.pxV5InSellersName,
        keyCount: form.pxKeyCount,
        insuranceWriteOff: form.pxInsuranceWriteOff,
        accidentHistory: form.pxAccidentHistory,
        accidentDescription: form.pxAccidentDescription || undefined,
        valueDrivers: form.pxValueDrivers,
        featuresNotes: form.pxFeaturesNotes || undefined,
        conditionNotes: form.pxConditionNotes || undefined,
        photoDataUrls: form.pxPhotos,
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
      notes: form.notes || undefined,
      processChecklist: checklist,
      testDriveNotes,
      trialClose,
    };

    set((state) => ({
      deals: [deal, ...state.deals],
      nextDealNumber: state.nextDealNumber + 1,
      creationDraft: null,
      creationChecklist: null,
      creationTestDriveNotes: null,
      creationTrialClose: null,
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
