import type {
  Branch,
  CustomerRecord,
  DealSource,
  PurchaseTimeline,
  VehicleRecord,
} from "@/types/deal";

export const currentSalesperson = {
  id: "sp-001",
  name: "Emma Wilson",
} as const;

export const branches: { value: Branch; label: string }[] = [
  { value: "manchester", label: "Manchester" },
  { value: "leeds", label: "Leeds" },
  { value: "birmingham", label: "Birmingham" },
];

export const dealSources: { value: DealSource; label: string }[] = [
  { value: "walk-in", label: "Walk-In" },
  { value: "phone-enquiry", label: "Phone Enquiry" },
  { value: "website-lead", label: "Website Lead" },
  { value: "referral", label: "Referral" },
  { value: "returning-customer", label: "Returning Customer" },
];

export const purchaseTimelines: { value: PurchaseTimeline; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "within-7-days", label: "Within 7 Days" },
  { value: "within-30-days", label: "Within 30 Days" },
  { value: "researching", label: "Researching" },
];

export const existingCustomers: CustomerRecord[] = [
  {
    id: "cust-001",
    firstName: "Sarah",
    lastName: "Johnson",
    mobile: "07700900123",
    email: "sarah.johnson@email.com",
    address: "14 Oak Lane, Didsbury",
    postcode: "M20 3JB",
  },
  {
    id: "cust-002",
    firstName: "Michael",
    lastName: "Carter",
    mobile: "07700900456",
    email: "michael.carter@email.com",
    address: "8 Station Road, Headingley",
    postcode: "LS6 2AB",
  },
  {
    id: "cust-003",
    firstName: "David",
    lastName: "Smith",
    mobile: "07700900789",
    email: "david.smith@email.com",
    address: "22 High Street, Edgbaston",
    postcode: "B15 2TT",
  },
];

export const stockVehicles: VehicleRecord[] = [
  {
    id: "veh-001",
    make: "BMW",
    model: "X3",
    variant: "M Sport",
    registration: "AB12 XYZ",
    year: 2022,
    mileage: 18400,
    colour: "Alpine White",
    retailPrice: 18995,
    vehicleCost: 16200,
  },
  {
    id: "veh-002",
    make: "Audi",
    model: "A4",
    variant: "S Line",
    registration: "CD34 EFG",
    year: 2021,
    mileage: 24600,
    colour: "Mythos Black",
    retailPrice: 22495,
    vehicleCost: 19100,
  },
  {
    id: "veh-003",
    make: "Volkswagen",
    model: "Golf",
    variant: "R-Line",
    registration: "EF56 HIJ",
    year: 2023,
    mileage: 8200,
    colour: "Pure White",
    retailPrice: 16995,
    vehicleCost: 14800,
  },
  {
    id: "veh-004",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "AMG Line",
    registration: "GH78 KLM",
    year: 2022,
    mileage: 15200,
    colour: "Obsidian Black",
    retailPrice: 27995,
    vehicleCost: 24100,
  },
];

export const partExchangeVehicles: Record<
  string,
  Omit<VehicleRecord, "retailPrice" | "vehicleCost" | "id">
> = {
  XY22ABC: {
    make: "Ford",
    model: "Focus",
    variant: "Titanium",
    registration: "XY22 ABC",
    year: 2022,
    mileage: 32100,
    colour: "Magnetic Grey",
  },
  MN19DEF: {
    make: "Vauxhall",
    model: "Corsa",
    variant: "Elite",
    registration: "MN19 DEF",
    year: 2019,
    mileage: 45800,
    colour: "Summit White",
  },
};

export function normalizeRegistration(reg: string): string {
  return reg.replace(/\s+/g, "").toUpperCase();
}

export function lookupVehicleByRegistration(
  registration: string
): VehicleRecord | null {
  const normalized = normalizeRegistration(registration);
  return (
    stockVehicles.find(
      (v) => normalizeRegistration(v.registration) === normalized
    ) ?? null
  );
}

export function searchStockVehicles(query: string): VehicleRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return stockVehicles;

  return stockVehicles.filter((v) => {
    const label = `${v.make} ${v.model} ${v.variant}`.toLowerCase();
    return label.includes(q) || v.registration.toLowerCase().includes(q);
  });
}

export function lookupPartExchange(
  registration: string
): Omit<VehicleRecord, "retailPrice" | "vehicleCost" | "id"> | null {
  const normalized = normalizeRegistration(registration);
  return partExchangeVehicles[normalized] ?? null;
}

const stockVehicleImageParams = "auto=format&fit=crop&w=1200&q=80";

export const stockVehicleImages: Record<string, string> = {
  BMW: `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?${stockVehicleImageParams}`,
  Audi: `https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?${stockVehicleImageParams}`,
  "Mercedes-Benz": `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?${stockVehicleImageParams}`,
  Ford: `https://images.unsplash.com/photo-1494976688709-1e5c793e17fa?${stockVehicleImageParams}`,
  Volkswagen: `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?${stockVehicleImageParams}`,
  Vauxhall: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?${stockVehicleImageParams}`,
};

export function getStockVehicleImage(make: string, model?: string): string {
  if (make === "BMW" && model === "X3") {
    return "/vehicles/bmw-x3-white.png?v=4";
  }

  return (
    stockVehicleImages[make] ??
    stockVehicleImages.BMW ??
    `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?${stockVehicleImageParams}`
  );
}

export function searchCustomers(query: string): CustomerRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return existingCustomers;

  return existingCustomers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      c.mobile.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });
}
