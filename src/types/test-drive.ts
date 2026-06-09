export type BuyingMotiveKey =
  | "growingFamily"
  | "safety"
  | "betterFuelEconomy"
  | "moreSpace"
  | "commuting"
  | "businessUse"
  | "towing"
  | "upgradeCurrentVehicle"
  | "performance"
  | "other";

export type ImportantFeatureKey =
  | "reliability"
  | "lowRunningCosts"
  | "monthlyPayment"
  | "technology"
  | "comfort"
  | "bootSpace"
  | "fuelEconomy"
  | "safety"
  | "performance"
  | "appearance";

export type WrongVehicleReasonKey =
  | "wrongColour"
  | "wrongSpecification"
  | "wrongSize"
  | "tooExpensive"
  | "monthlyPaymentsTooHigh"
  | "doesntDriveAsExpected"
  | "missingFeatures"
  | "other";

export type TrialCloseConcernType = "minor" | "major";

export type TestDriveNotes = {
  buyingMotives: BuyingMotiveKey[];
  likesCurrentVehicle: string;
  dislikesCurrentVehicle: string;
  importantFeatures: ImportantFeatureKey[];
  freeNotes: string;
};

export type TrialCloseData = {
  rating: number | null;
  lovedMost: string;
  makeItTen: string;
  concernType: TrialCloseConcernType | null;
  whatWasntRight: string;
  wrongVehicleReasons: WrongVehicleReasonKey[];
};

export const emptyTestDriveNotes: TestDriveNotes = {
  buyingMotives: [],
  likesCurrentVehicle: "",
  dislikesCurrentVehicle: "",
  importantFeatures: [],
  freeNotes: "",
};

export const emptyTrialCloseData: TrialCloseData = {
  rating: null,
  lovedMost: "",
  makeItTen: "",
  concernType: null,
  whatWasntRight: "",
  wrongVehicleReasons: [],
};
