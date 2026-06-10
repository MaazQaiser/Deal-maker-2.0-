export const pxServiceHistoryTypes = [
  { value: "fsh", label: "FSH" },
  { value: "psh", label: "PSH" },
  { value: "none", label: "None" },
] as const;

export const pxServicedWhereOptions = [
  { value: "main-dealer", label: "Main dealer" },
  { value: "independent", label: "Independent" },
  { value: "mixed", label: "Mixed" },
] as const;

export const pxKeyCountOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3plus", label: "3+" },
] as const;

export const pxValueDrivers = [
  { value: "panoramic-roof", label: "Panoramic roof" },
  { value: "sunroof", label: "Sunroof" },
  { value: "parking-sensors", label: "Parking sensors" },
  { value: "reversing-camera", label: "Reversing camera" },
  { value: "sat-nav", label: "Sat nav" },
  { value: "virtual-cockpit", label: "Virtual cockpit" },
  { value: "leather-seats", label: "Leather seats" },
  { value: "heated-seats", label: "Heated seats" },
  { value: "apple-carplay", label: "Apple CarPlay" },
  { value: "adaptive-cruise", label: "Adaptive cruise" },
  { value: "tow-bar", label: "Tow bar" },
  { value: "upgraded-alloys", label: "Upgraded alloys" },
] as const;

export type PxServiceHistoryType =
  (typeof pxServiceHistoryTypes)[number]["value"];
export type PxServicedWhere = (typeof pxServicedWhereOptions)[number]["value"];
export type PxKeyCount = (typeof pxKeyCountOptions)[number]["value"];
export type PxValueDriver = (typeof pxValueDrivers)[number]["value"];
export type PxYesNo = "yes" | "no";

export function getPxValueDriverLabel(value: string): string {
  return pxValueDrivers.find((item) => item.value === value)?.label ?? value;
}

export function getPxServiceHistoryLabel(value: string | undefined): string {
  return (
    pxServiceHistoryTypes.find((item) => item.value === value)?.label ??
    value ??
    ""
  );
}

export function getPxServicedWhereLabel(value: string | undefined): string {
  return (
    pxServicedWhereOptions.find((item) => item.value === value)?.label ??
    value ??
    ""
  );
}
