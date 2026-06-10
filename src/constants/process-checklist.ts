import type {
  ProcessChecklist,
  ProcessChecklistGroup,
  ProcessChecklistKey,
} from "@/types/process-checklist";

export const emptyProcessChecklist: ProcessChecklist = {
  customerWelcomed: false,
  teaCoffeeOffered: false,
  customerSeated: false,
  drivingLicenceReceived: false,
  drivingLicencePhotographed: false,
  insuranceConfirmed: false,
  routeBriefed: false,
  pxKeysReceived: false,
  salesManagerIntroductionCompleted: false,
};

export const processChecklistGroups: ProcessChecklistGroup[] = [
  {
    id: "customer-arrival",
    title: "Customer Arrival",
    items: [
      { key: "customerWelcomed", label: "Customer welcomed" },
      { key: "teaCoffeeOffered", label: "Tea / Coffee offered" },
      { key: "customerSeated", label: "Customer seated" },
    ],
  },
  {
    id: "pre-test-drive",
    title: "Pre-Test Drive",
    items: [
      { key: "drivingLicenceReceived", label: "Driving licence shown" },
      {
        key: "drivingLicencePhotographed",
        label: "Licence photographed",
      },
      { key: "insuranceConfirmed", label: "Insurance confirmed" },
      { key: "routeBriefed", label: "Route briefed" },
      {
        key: "pxKeysReceived",
        label: "PX keys received",
        requiredWhenPartExchange: true,
      },
      {
        key: "salesManagerIntroductionCompleted",
        label: "Sales manager introduction completed",
      },
    ],
  },
];

export function isChecklistItemRequired(
  key: ProcessChecklistKey,
  hasPartExchange: boolean,
): boolean {
  if (key === "pxKeysReceived") {
    return hasPartExchange;
  }
  return true;
}

export function isProcessChecklistComplete(
  checklist: ProcessChecklist,
  hasPartExchange: boolean,
): boolean {
  return (Object.keys(emptyProcessChecklist) as ProcessChecklistKey[]).every(
    (key) =>
      !isChecklistItemRequired(key, hasPartExchange) || checklist[key],
  );
}

export function getIncompleteChecklistCount(
  checklist: ProcessChecklist,
  hasPartExchange: boolean,
): number {
  return (Object.keys(emptyProcessChecklist) as ProcessChecklistKey[]).filter(
    (key) =>
      isChecklistItemRequired(key, hasPartExchange) && !checklist[key],
  ).length;
}
