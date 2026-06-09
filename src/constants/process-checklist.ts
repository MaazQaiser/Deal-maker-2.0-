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
      { key: "drivingLicenceReceived", label: "Driving Licence Received" },
      {
        key: "pxKeysReceived",
        label: "PX Keys Received",
        requiredWhenPartExchange: true,
      },
      {
        key: "salesManagerIntroductionCompleted",
        label: "Sales Manager Introduction Completed",
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
