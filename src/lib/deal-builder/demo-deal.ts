import {
  existingCustomers,
  stockVehicles,
} from "@/constants/deal-mock-data";
import type { DealRecord } from "@/types/deal";

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
    salesperson: "Emma Wilson",
    branch: "manchester",
    dealSource: "walk-in",
    purchaseTimeline: "today",
    customerBudget: 350,
    notes: "Looking for the lowest monthly payment. Prefers automatic vehicles.",
  };
}
