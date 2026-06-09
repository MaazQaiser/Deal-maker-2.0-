export type ProcessChecklistKey =
  | "customerWelcomed"
  | "teaCoffeeOffered"
  | "customerSeated"
  | "drivingLicenceReceived"
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
