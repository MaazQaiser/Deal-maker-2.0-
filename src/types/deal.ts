import type { DealStatus } from "@/types/dashboard";

export type Branch = "manchester" | "leeds" | "birmingham";

export type DealSource =
  | "walk-in"
  | "phone-enquiry"
  | "website-lead"
  | "referral"
  | "returning-customer";

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
  outstandingFinance: number;
  settlementRequired: boolean;
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
  customerBudget?: number;
  notes?: string;
};
