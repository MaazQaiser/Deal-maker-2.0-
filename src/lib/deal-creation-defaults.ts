import { currentSalesperson } from "@/constants/deal-mock-data";
import type { DealCreationFormValues } from "@/lib/validations/deal";

export const dealCreationDefaultValues: DealCreationFormValues = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  address: "",
  postcode: "",
  isExistingCustomer: false,
  vehicleId: "",
  hasPartExchange: false,
  pxRegistration: "",
  pxValuation: undefined,
  pxExistingFinance: undefined,
  pxFinanceCompany: undefined,
  pxOutstandingFinance: undefined,
  pxSettlementFigure: undefined,
  pxFinanceEndDate: undefined,
  salesperson: currentSalesperson.name,
  branch: "manchester",
  dealSource: "walk-in",
  purchaseTimeline: "today",
  maximumDeposit: undefined,
  customerBudget: undefined,
  notes: "",
};
