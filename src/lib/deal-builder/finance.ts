export type FinanceOption = "zero" | "hp" | "pcp";

export interface DealBuilderState {
  deposit: number;
  term: number;
  selectedFinance: FinanceOption;
  hpVariant: "a" | "b";
  balloon: number;
  apr: number;
}

export interface DealFinanceContext {
  retailPrice: number;
  pxEquity: number;
  productValue?: number;
  zeroPercentMinDeposit?: number;
}

export const DEFAULT_FINANCE_CONTEXT: DealFinanceContext = {
  retailPrice: 18995,
  pxEquity: 2500,
  productValue: 1649,
  zeroPercentMinDeposit: 7824,
};

export const TERMS = [18, 24, 36, 48, 60, 72] as const;
export const HP_TERMS = TERMS;
export const PCP_TERMS = [18, 24, 36, 48, 60] as const;
export const ZERO_TERM = 18;
export const DEFAULT_HP_APR = 14.9;
export const DEPOSIT_MAX = 15000;
export const FINANCE_FIT_DEPOSIT_MIN = 500;
export const FINANCE_FIT_DEPOSIT_MAX = 10000;
export const FINANCE_FIT_MONTHLY_MIN = 150;
export const FINANCE_FIT_MONTHLY_MAX = 1200;

export type FinanceFitResult = {
  matches: FinanceOption[];
  recommended: FinanceOption | null;
  allAboveBudget: boolean;
  cheapestMonthly: number;
};

export type DealHealthStatus = "healthy" | "low" | "review";

export function getTermsForFinance(option: FinanceOption): readonly number[] {
  switch (option) {
    case "zero":
      return [ZERO_TERM];
    case "hp":
      return HP_TERMS;
    case "pcp":
      return PCP_TERMS;
  }
}

export function clampTermForFinance(
  term: number,
  option: FinanceOption,
): number {
  const allowed = getTermsForFinance(option);
  if (allowed.includes(term as (typeof allowed)[number])) {
    return term;
  }
  return allowed[allowed.length - 1];
}

export function calculatePxEquity(
  pxValue: number,
  settlement: number,
): number {
  return Math.max(0, pxValue - settlement);
}

export function calculateZeroPercentMonthly(
  deposit: number,
  term: number,
  context: DealFinanceContext,
): number {
  const productValue = context.productValue ?? 1649;
  const financed =
    context.retailPrice - deposit - context.pxEquity + productValue;
  return Math.round(financed / term);
}

export function calculateHPMonthly(
  deposit: number,
  term: number,
  extraDeposit: number,
  retailPrice: number,
  pxEquity: number,
  aprPercent: number = DEFAULT_HP_APR,
  productValue: number = 0,
): number {
  const totalDeposit = deposit + pxEquity + extraDeposit;
  const principal = retailPrice + productValue - totalDeposit;
  if (principal <= 0) return 0;
  const monthlyRate = aprPercent / 100 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
    (Math.pow(1 + monthlyRate, term) - 1);
  return Math.round(payment);
}

export function calculatePCPMonthly(
  deposit: number,
  term: number,
  balloon: number,
  retailPrice: number,
  pxEquity: number,
  productValue: number = 0,
): number {
  const principal = retailPrice + productValue - deposit - pxEquity - balloon;
  if (principal <= 0) return 0;
  const monthlyRate = 0.089 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
    (Math.pow(1 + monthlyRate, term) - 1);
  return Math.round(payment);
}

export function balloonFromGfvPercent(
  gfvPercent: number,
  retailPrice: number,
): number {
  return Math.round((retailPrice * gfvPercent) / 100);
}

export function gfvPercentFromBalloon(
  balloon: number,
  retailPrice: number,
): number {
  if (retailPrice <= 0) return 0;
  return Math.round((balloon / retailPrice) * 1000) / 10;
}

export function getDealHealthStatus(totalMargin: number): {
  status: DealHealthStatus;
  label: string;
} {
  if (totalMargin >= 5000) {
    return { status: "healthy", label: "Healthy Deal" };
  }
  if (totalMargin >= 3000) {
    return { status: "low", label: "Low Margin" };
  }
  return { status: "review", label: "Review Required" };
}

export function getFinanceSummary(
  state: DealBuilderState,
  context: DealFinanceContext = DEFAULT_FINANCE_CONTEXT,
) {
  const { deposit, term, hpVariant, balloon, apr } = state;
  const productValue = context.productValue ?? 1649;
  const zeroPercentMinDeposit = context.zeroPercentMinDeposit ?? 7824;
  const zeroEligible = deposit + context.pxEquity >= zeroPercentMinDeposit;

  const zeroMonthly = calculateZeroPercentMonthly(deposit, ZERO_TERM, context);
  const hpExtra = hpVariant === "a" ? 500 : 1000;
  const hpMonthly = calculateHPMonthly(
    deposit,
    term,
    hpExtra,
    context.retailPrice,
    context.pxEquity,
    apr,
    productValue,
  );
  const pcpMonthly = calculatePCPMonthly(
    deposit,
    term,
    balloon,
    context.retailPrice,
    context.pxEquity,
    productValue,
  );
  const pcpTotal =
    pcpMonthly * term + balloon + deposit + context.pxEquity;

  return {
    zeroEligible,
    zeroMonthly,
    hpMonthly,
    pcpMonthly,
    pcpTotal,
    balloon,
    zeroDepositRequired: zeroPercentMinDeposit,
    productValue,
  };
}

const FINANCE_FIT_PRIORITY: FinanceOption[] = ["zero", "hp", "pcp"];

export function getFinanceFit(params: {
  summary: ReturnType<typeof getFinanceSummary>;
  comfortableMonthly: number;
}): FinanceFitResult {
  const { summary, comfortableMonthly } = params;

  const candidates: { id: FinanceOption; monthly: number; eligible: boolean }[] =
    [
      {
        id: "zero",
        monthly: summary.zeroMonthly,
        eligible: summary.zeroEligible,
      },
      { id: "hp", monthly: summary.hpMonthly, eligible: true },
      { id: "pcp", monthly: summary.pcpMonthly, eligible: true },
    ];

  const matches = candidates
    .filter((option) => option.eligible && option.monthly <= comfortableMonthly)
    .map((option) => option.id);

  const recommended =
    FINANCE_FIT_PRIORITY.find((id) => matches.includes(id)) ?? null;

  const eligibleMonthlies = candidates
    .filter((option) => option.eligible)
    .map((option) => option.monthly);

  const cheapestMonthly =
    eligibleMonthlies.length > 0
      ? Math.min(...eligibleMonthlies)
      : Math.min(summary.hpMonthly, summary.pcpMonthly);

  return {
    matches,
    recommended,
    allAboveBudget: matches.length === 0,
    cheapestMonthly,
  };
}
