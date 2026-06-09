import {
  existingCustomers,
  stockVehicles,
} from "@/constants/deal-mock-data";
import type { DealRecord } from "@/types/deal";
import { demoTestDriveNotes } from "@/lib/test-drive-display";

export function getDemoDeal(dealId: string): DealRecord {
  const vehicle = stockVehicles[0];
  const customer = existingCustomers[0];

  return {
    id: dealId,
    status: "draft",
    createdAt: new Date(),
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      mobile: customer.mobile,
      email: customer.email,
    },
    vehicle,
    partExchange: {
      registration: "AB19 XYZ",
      make: "Audi",
      model: "A3 S Line",
      year: 2019,
      mileage: 42000,
      valuation: 4000,
      existingFinance: true,
      outstandingFinance: 1500,
      settlementFigure: 1500,
      financeCompany: "santander",
      financeEndDate: "2027-06-30",
      equity: 2500,
    },
    salesperson: "Emma Wilson",
    branch: "manchester",
    dealSource: "walk-in",
    purchaseTimeline: "today",
    maximumDeposit: 500,
    customerBudget: 350,
    notes: "Looking for the lowest monthly payment. Prefers automatic vehicles.",
    testDriveNotes: demoTestDriveNotes,
    trialClose: {
      rating: 10,
      lovedMost: "Ride quality, space, and how quiet it is on the motorway.",
      makeItTen: "",
      concernType: null,
      whatWasntRight: "",
      wrongVehicleReasons: [],
    },
  };
}
