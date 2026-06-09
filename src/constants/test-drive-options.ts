import type {
  BuyingMotiveKey,
  ImportantFeatureKey,
  WrongVehicleReasonKey,
} from "@/types/test-drive";

export const buyingMotiveOptions: {
  key: BuyingMotiveKey;
  label: string;
}[] = [
  { key: "growingFamily", label: "Growing Family" },
  { key: "safety", label: "Safety" },
  { key: "betterFuelEconomy", label: "Better Fuel Economy" },
  { key: "moreSpace", label: "More Space" },
  { key: "commuting", label: "Commuting" },
  { key: "businessUse", label: "Business Use" },
  { key: "towing", label: "Towing" },
  { key: "upgradeCurrentVehicle", label: "Upgrade Current Vehicle" },
  { key: "performance", label: "Performance" },
  { key: "other", label: "Other" },
];

export const importantFeatureOptions: {
  key: ImportantFeatureKey;
  label: string;
}[] = [
  { key: "reliability", label: "Reliability" },
  { key: "lowRunningCosts", label: "Low Running Costs" },
  { key: "monthlyPayment", label: "Monthly Payment" },
  { key: "technology", label: "Technology" },
  { key: "comfort", label: "Comfort" },
  { key: "bootSpace", label: "Boot Space" },
  { key: "fuelEconomy", label: "Fuel Economy" },
  { key: "safety", label: "Safety" },
  { key: "performance", label: "Performance" },
  { key: "appearance", label: "Appearance" },
];

export const wrongVehicleReasonOptions: {
  key: WrongVehicleReasonKey;
  label: string;
}[] = [
  { key: "wrongColour", label: "Wrong Colour" },
  { key: "wrongSpecification", label: "Wrong Specification" },
  { key: "wrongSize", label: "Wrong Size" },
  { key: "tooExpensive", label: "Too Expensive" },
  { key: "monthlyPaymentsTooHigh", label: "Monthly Payments Too High" },
  { key: "doesntDriveAsExpected", label: "Doesn't Drive As Expected" },
  { key: "missingFeatures", label: "Missing Features" },
  { key: "other", label: "Other" },
];
