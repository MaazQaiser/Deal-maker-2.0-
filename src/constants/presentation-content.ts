export type PresentationGuideStep = {
  id: string;
  title: string;
  ask?: string;
  discuss?: string;
};

export const PRESENTATION_GUIDE_STEPS: PresentationGuideStep[] = [
  {
    id: "service-cost",
    title: "Service Cost",
    ask: "Do you know how much it costs to service this vehicle?",
  },
  {
    id: "warranty",
    title: "Discuss Warranty",
    discuss: "Explain how the AA Warranty protects against major repair bills.",
  },
  {
    id: "mot",
    title: "Discuss MOT",
    discuss: "Walk through Lifetime MOT — no annual MOT fees for as long as they own the car.",
  },
  {
    id: "savings",
    title: "Discuss Total Savings",
    discuss: "Show the total savings story — interest, service, MOT, and warranty protection combined.",
  },
];

export type SavingsLineItem = {
  id: string;
  label: string;
  amount: number;
};

export const SAVINGS_BREAKDOWN: SavingsLineItem[] = [
  { id: "interest", label: "Interest Saved", amount: 1450 },
  { id: "service", label: "Service Savings", amount: 750 },
  { id: "mot", label: "MOT Savings", amount: 300 },
  { id: "warranty", label: "Warranty Protection", amount: 1350 },
];

export const TOTAL_SAVINGS = SAVINGS_BREAKDOWN.reduce(
  (sum, item) => sum + item.amount,
  0,
);

export type IncludedProductId =
  | "warranty"
  | "service-plan"
  | "lifetime-mot"
  | "supaguard"
  | "cosmetic-cover"
  | "tyre-alloy-cover";

/** Per-product values — sum equals PRODUCT_VALUE (1649) */
export const INCLUDED_PRODUCT_VALUES: Record<IncludedProductId, number> = {
  warranty: 450,
  "service-plan": 450,
  "lifetime-mot": 150,
  supaguard: 200,
  "cosmetic-cover": 150,
  "tyre-alloy-cover": 249,
};

export const DEFAULT_INCLUDED_PRODUCTS: IncludedProductId[] = [
  "warranty",
  "service-plan",
  "lifetime-mot",
  "supaguard",
  "cosmetic-cover",
  "tyre-alloy-cover",
];

export function sumIncludedProductValues(
  includedProducts: IncludedProductId[],
): number {
  return includedProducts.reduce(
    (sum, id) => sum + INCLUDED_PRODUCT_VALUES[id],
    0,
  );
}

export type IncludedProductMeta = {
  id: IncludedProductId;
  name: string;
  tagline: string;
  talkingPoints: string[];
  benefits: string[];
  objections: { objection: string; response: string }[];
  leafletLabel: string;
};

export const INCLUDED_PRODUCT_DETAILS: Record<
  IncludedProductId,
  IncludedProductMeta
> = {
  warranty: {
    id: "warranty",
    name: "AA Warranty",
    tagline: "Peace of mind for major repairs",
    talkingPoints: [
      "Covers major mechanical and electrical failures",
      "Nationwide AA repair network",
      "No surprise repair bills on covered components",
    ],
    benefits: [
      "Up to 3 years comprehensive cover",
      "Includes labour and parts on covered items",
      "Transferable if they sell the car privately",
    ],
    objections: [
      {
        objection: "I don't think I'll need it",
        response:
          "Most customers say that — until an unexpected repair bill arrives. This locks in protection from day one.",
      },
      {
        objection: "My last car never broke down",
        response:
          "That's great — this plan is about peace of mind if something does go wrong on a used vehicle.",
      },
    ],
    leafletLabel: "AA Warranty Leaflet (PDF)",
  },
  "service-plan": {
    id: "service-plan",
    name: "Service Plan",
    tagline: "Locks in servicing costs",
    talkingPoints: [
      "Fixed servicing costs for the plan period",
      "Manufacturer-approved parts and fluids",
      "Protects against rising service prices",
    ],
    benefits: [
      "Scheduled services included",
      "No price increases during the plan",
      "Helps maintain resale value",
    ],
    objections: [
      {
        objection: "I service my car elsewhere",
        response:
          "You can — but this plan saves money versus pay-as-you-go servicing at main dealer rates.",
      },
    ],
    leafletLabel: "Service Plan Leaflet (PDF)",
  },
  "lifetime-mot": {
    id: "lifetime-mot",
    name: "Lifetime MOT",
    tagline: "Never pay for an MOT again",
    talkingPoints: [
      "MOT test fees covered for life of ownership",
      "Reminds them when MOT is due",
      "Removes an annual running cost",
    ],
    benefits: [
      "Lifetime MOT tests included",
      "Typical saving of £300+ over ownership",
      "One less thing to remember each year",
    ],
    objections: [
      {
        objection: "MOTs aren't that expensive",
        response:
          "Individually no — but over 5–10 years of ownership it adds up. This removes that cost entirely.",
      },
    ],
    leafletLabel: "Lifetime MOT Leaflet (PDF)",
  },
  supaguard: {
    id: "supaguard",
    name: "Supaguard",
    tagline: "Keeps the car looking new",
    talkingPoints: [
      "Professional paint and interior protection",
      "Guards against stains, fading, and wear",
      "Easier to keep clean day to day",
    ],
    benefits: [
      "Interior and exterior protection applied",
      "Helps preserve condition and value",
      "Professional application included",
    ],
    objections: [
      {
        objection: "I'll just get it valeted",
        response:
          "Valeting cleans — Supaguard protects. It's a one-time treatment that lasts, not a monthly wash.",
      },
    ],
    leafletLabel: "Supaguard Leaflet (PDF)",
  },
  "cosmetic-cover": {
    id: "cosmetic-cover",
    name: "Cosmetic Cover",
    tagline: "Repairs for chips, scuffs, and minor damage",
    talkingPoints: [
      "Covers cosmetic damage from everyday use",
      "Professional smart repair network",
      "Keeps the car looking its best",
    ],
    benefits: [
      "Chip and scratch repair included",
      "Alloy wheel refurbishment cover",
      "No claim excess on covered repairs",
    ],
    objections: [
      {
        objection: "I'll be careful with the car",
        response:
          "Most customers are — but kerbs, car parks, and stone chips happen. This removes the cost when they do.",
      },
    ],
    leafletLabel: "Cosmetic Cover Leaflet (PDF)",
  },
  "tyre-alloy-cover": {
    id: "tyre-alloy-cover",
    name: "Tyre & Alloy Cover",
    tagline: "Protection for tyres and wheels",
    talkingPoints: [
      "Covers accidental tyre and alloy damage",
      "Replacement or repair without large bills",
      "Particularly valuable on larger alloy wheels",
    ],
    benefits: [
      "Tyre replacement cover included",
      "Alloy wheel damage protection",
      "Nationwide claim support",
    ],
    objections: [
      {
        objection: "Tyres are cheap to replace",
        response:
          "Run-flat and low-profile tyres on modern cars can be £200+ each. This plan covers multiple incidents.",
      },
    ],
    leafletLabel: "Tyre & Alloy Cover Leaflet (PDF)",
  },
};

export type CustomerResponseId =
  | "accept-zero"
  | "lower-deposit"
  | "lower-monthly"
  | "cash-buyer"
  | "unsure";

export const CUSTOMER_RESPONSE_OPTIONS: {
  id: CustomerResponseId;
  label: string;
  description: string;
}[] = [
  {
    id: "accept-zero",
    label: "Accept 0%",
    description: "Customer is happy with the 0% finance presentation",
  },
  {
    id: "lower-deposit",
    label: "Need Lower Deposit",
    description: "Move to HP or PCP with a lower upfront payment",
  },
  {
    id: "lower-monthly",
    label: "Need Lower Monthly Payment",
    description: "Focus on lowest monthly — typically PCP",
  },
  {
    id: "cash-buyer",
    label: "Cash Buyer",
    description: "Customer wants to pay without finance",
  },
  {
    id: "unsure",
    label: "Still Unsure",
    description: "Customer needs more time or information",
  },
];
