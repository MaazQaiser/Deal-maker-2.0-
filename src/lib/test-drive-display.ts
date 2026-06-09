import type { BuyingMotiveKey, ImportantFeatureKey } from "@/types/test-drive";
import {
  buyingMotiveOptions,
  importantFeatureOptions,
} from "@/constants/test-drive-options";

export function getBuyingMotiveLabel(key: BuyingMotiveKey): string {
  return buyingMotiveOptions.find((option) => option.key === key)?.label ?? key;
}

export function getImportantFeatureLabel(key: ImportantFeatureKey): string {
  return (
    importantFeatureOptions.find((option) => option.key === key)?.label ?? key
  );
}

export const demoTestDriveNotes = {
  buyingMotives: [
    "moreSpace",
    "safety",
    "betterFuelEconomy",
  ] as BuyingMotiveKey[],
  likesCurrentVehicle:
    "Reliable day-to-day, comfortable on longer commutes, and cheap to insure.",
  dislikesCurrentVehicle:
    "Boot is too small for the pushchair, rear seats feel tight, and running costs are creeping up.",
  importantFeatures: [
    "monthlyPayment",
    "reliability",
    "bootSpace",
    "fuelEconomy",
  ] as ImportantFeatureKey[],
  freeNotes:
    "Customer loves the drive quality on the test drive. Partner prefers lighter exterior colours. Concerned about servicing costs but likes the included warranty package.",
};
