export type ProcessChecklistKey =
  | "customerWelcomed"
  | "teaCoffeeOffered"
  | "customerSeated"
  | "drivingLicenceReceived"
  | "drivingLicencePhotographed"
  | "insuranceConfirmed"
  | "routeBriefed"
  | "pxKeysReceived"
  | "salesManagerIntroductionCompleted";

export type ProcessChecklist = Record<ProcessChecklistKey, boolean>;

export type ProcessChecklistGroup = {
  id: string;
  title: string;
  items: {
    key: ProcessChecklistKey;
    label: string;
    requiredWhenPartExchange?: boolean;
  }[];
};
