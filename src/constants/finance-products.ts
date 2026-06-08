import type { FinanceOption } from "@/lib/deal-builder/finance";

export type FinanceProductMeta = {
  id: FinanceOption;
  outcome: string;
  headline: string;
  productCode: string;
  customerMindset: string;
  objection: string;
  objectionPrompt: string;
  cta: string;
  endOutcome: string;
  highlights: string[];
};

export const financeProducts: Record<FinanceOption, FinanceProductMeta> = {
  zero: {
    id: "zero",
    outcome: "Best Value",
    headline: "0% Finance",
    productCode: "0% Finance",
    customerMindset: "I want the best overall value.",
    objection: "I want the best overall value.",
    objectionPrompt: "Customer says: \"I want the best overall value.\"",
    cta: "Choose Best Value",
    endOutcome: "Own the car with no interest — products included",
    highlights: [
      "Interest free",
      "Warranty included",
      "Service plan included",
      "Lifetime MOT included",
      "Supagard included",
    ],
  },
  hp: {
    id: "hp",
    outcome: "Own The Car",
    headline: "Put Less In Today",
    productCode: "Hire Purchase",
    customerMindset:
      "I can't afford a big deposit, but I want to own the car.",
    objection: "I can't afford a big deposit.",
    objectionPrompt: "Customer says: \"I can't afford a big deposit.\"",
    cta: "Choose Own The Car",
    endOutcome: "You own the car — no balloon payment",
    highlights: [
      "Lower deposit",
      "Simple monthly payments",
      "No final balloon",
      "Full ownership at the end",
    ],
  },
  pcp: {
    id: "pcp",
    outcome: "Lowest Monthly",
    headline: "Keep Your Monthly Low",
    productCode: "Personal Contract Purchase",
    customerMindset: "I want the lowest monthly payment possible.",
    objection: "I only care about monthly payments.",
    objectionPrompt: "Customer says: \"I only care about monthly payments.\"",
    cta: "Choose Lowest Monthly",
    endOutcome: "Pay GFV to own, return, or trade in",
    highlights: [
      "Lowest monthly cost",
      "Finance price minus future value",
      "GFV balloon at end of term",
      "Return, trade in, or pay to own",
    ],
  },
};

export const financeComparisonRows = [
  { label: "Deposit", zero: "Higher", hp: "Low", pcp: "Low" },
  { label: "Monthly payment", zero: "Medium", hp: "Medium", pcp: "Lowest" },
  { label: "Final balloon", zero: "No", hp: "No", pcp: "Yes (GFV)" },
  { label: "Own car automatically", zero: "Yes", hp: "Yes", pcp: "No" },
  {
    label: "Best for",
    zero: "Best value",
    hp: "Ownership",
    pcp: "Lowest monthly",
  },
] as const;

export function suggestFinanceOption(signals: {
  notes?: string;
  customerBudget?: number;
  pcpMonthly: number;
}): FinanceOption {
  const notes = signals.notes?.toLowerCase() ?? "";

  if (
    notes.includes("deposit") ||
    notes.includes("own") ||
    notes.includes("ownership")
  ) {
    return "hp";
  }

  if (
    notes.includes("monthly") ||
    notes.includes("payment") ||
    notes.includes("budget") ||
    (signals.customerBudget != null &&
      signals.customerBudget <= signals.pcpMonthly)
  ) {
    return "pcp";
  }

  if (
    notes.includes("value") ||
    notes.includes("0%") ||
    notes.includes("interest")
  ) {
    return "zero";
  }

  return "pcp";
}

export function getFinanceProductLabel(option: FinanceOption): string {
  return financeProducts[option].outcome;
}
