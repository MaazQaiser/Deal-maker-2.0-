import type { DealStatus } from "@/types/dashboard";
import type { ProcessChecklist } from "@/types/process-checklist";
import type { TestDriveNotes, TrialCloseData } from "@/types/test-drive";

export type Branch = "manchester" | "leeds" | "birmingham";

export type DealSource =
  | "autotrader"
  | "oakwood-website"
  | "walk-in"
  | "facebook"
  | "google"
  | "referral"
  | "returning-customer"
  | "other";

export type PurchaseTimeline =
  | "today"
  | "within-7-days"
  | "within-30-days"
  | "researching";

export type CustomerRecord = {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  address?: string;
  postcode?: string;
};

export type VehicleRecord = {
  id: string;
  make: string;
  model: string;
  variant: string;
  registration: string;
  year: number;
  mileage: number;
  colour: string;
  retailPrice: number;
  vehicleCost: number;
};

export type PartExchangeRecord = {
  registration: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  valuation: number;
  existingFinance: boolean;
  outstandingFinance: number;
  settlementFigure: number;
  financeCompany?: string;
  financeEndDate?: string;
  equity: number;
};

export type DealRecord = {
  id: string;
  status: DealStatus;
  createdAt: Date;
  customer: {
    firstName: string;
    lastName: string;
    mobile: string;
    email?: string;
    address?: string;
    postcode?: string;
  };
  vehicle: VehicleRecord;
  partExchange?: PartExchangeRecord;
  salesperson: string;
  branch: Branch;
  dealSource: DealSource;
  purchaseTimeline: PurchaseTimeline;
  maximumDeposit?: number;
  customerBudget?: number;
  notes?: string;
  processChecklist?: ProcessChecklist;
  testDriveNotes?: TestDriveNotes;
  trialClose?: TrialCloseData;
};
