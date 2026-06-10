"use client";

import { useCallback, useMemo, useState } from "react";
import {
  FinanceOption,
  DEFAULT_HP_APR,
  DEPOSIT_MAX,
  FINANCE_FIT_DEPOSIT_MAX,
  FINANCE_FIT_DEPOSIT_MIN,
  balloonFromGfvPercent,
  calculatePxEquity,
  clampTermForFinance,
  getFinanceFit,
  getFinanceSummary,
} from "@/lib/deal-builder/finance";
import {
  DEFAULT_INCLUDED_PRODUCTS,
  sumIncludedProductValues,
  type IncludedProductId,
} from "@/constants/presentation-content";
import type { DealFinancePlan } from "@/store/dealStore";
import type { DealRecord } from "@/types/deal";
import { useDealStore } from "@/store/dealStore";

const DEFAULT_COMFORTABLE_MONTHLY = 550;
const DEFAULT_DEPOSIT = 1000;

function buildDefaultPlan(deal: DealRecord): DealFinancePlan {
  return {
    deposit: DEFAULT_DEPOSIT,
    term: 48,
    selectedFinance: "zero",
    hpVariant: "b",
    balloon: balloonFromGfvPercent(43, deal.vehicle.retailPrice),
    apr: DEFAULT_HP_APR,
    pxValue: deal.partExchange?.valuation ?? 0,
    settlementFigure: deal.partExchange?.settlementFigure ?? 0,
    gfvPercent: 43,
    comfortableMonthly: DEFAULT_COMFORTABLE_MONTHLY,
    includedProducts: [...DEFAULT_INCLUDED_PRODUCTS],
  };
}

export function useDealBuilderFinance(dealId: string, deal: DealRecord) {
  const storedPlan = useDealStore((s) => s.getFinancePlan(dealId));
  const saveFinancePlan = useDealStore((s) => s.saveFinancePlan);
  const notes = useDealStore((s) => s.getDealNotes(dealId, deal.notes ?? ""));

  const initial = storedPlan ?? buildDefaultPlan(deal);

  const [deposit, setDepositState] = useState(initial.deposit);
  const [pxValue, setPxValue] = useState(initial.pxValue);
  const [settlementFigure, setSettlementFigure] = useState(
    initial.settlementFigure,
  );
  const [term, setTerm] = useState(initial.term);
  const [selectedFinance, setSelectedFinance] = useState<FinanceOption>(
    initial.selectedFinance,
  );
  const [hpVariant, setHpVariant] = useState<"a" | "b">(initial.hpVariant);
  const [apr, setApr] = useState(initial.apr);
  const [gfvPercent, setGfvPercent] = useState(initial.gfvPercent);
  const [balloonValue, setBalloonValue] = useState(initial.balloon);
  const [comfortableMonthly, setComfortableMonthly] = useState(
    initial.comfortableMonthly ?? DEFAULT_COMFORTABLE_MONTHLY,
  );
  const [includedProducts, setIncludedProducts] = useState<IncludedProductId[]>(
    initial.includedProducts ?? [...DEFAULT_INCLUDED_PRODUCTS],
  );

  const setDeposit = useCallback((value: number) => {
    setDepositState(Math.max(0, Math.min(DEPOSIT_MAX, value)));
  }, []);

  const pxEquity = useMemo(
    () => calculatePxEquity(pxValue, settlementFigure),
    [pxValue, settlementFigure],
  );

  const productValue = useMemo(
    () => sumIncludedProductValues(includedProducts),
    [includedProducts],
  );

  const financeContext = useMemo(
    () => ({
      retailPrice: deal.vehicle.retailPrice,
      pxEquity,
      productValue,
      zeroPercentMinDeposit: 7824,
    }),
    [deal.vehicle.retailPrice, pxEquity, productValue],
  );

  const handleSelectFinance = useCallback((option: FinanceOption) => {
    setSelectedFinance(option);
    setTerm((current) => clampTermForFinance(current, option));
  }, []);

  const handleTermChange = useCallback(
    (value: number) => {
      setTerm(clampTermForFinance(value, selectedFinance));
    },
    [selectedFinance],
  );

  const handleGfvPercentChange = useCallback(
    (percent: number) => {
      setGfvPercent(percent);
      setBalloonValue(
        balloonFromGfvPercent(percent, deal.vehicle.retailPrice),
      );
    },
    [deal.vehicle.retailPrice],
  );

  const handleBalloonValueChange = useCallback(
    (value: number) => {
      setBalloonValue(value);
      setGfvPercent(
        Math.round((value / deal.vehicle.retailPrice) * 1000) / 10,
      );
    },
    [deal.vehicle.retailPrice],
  );

  const toggleIncludedProduct = useCallback((productId: IncludedProductId) => {
    setIncludedProducts((current) => {
      if (current.includes(productId)) {
        if (current.length <= 1) return current;
        return current.filter((id) => id !== productId);
      }
      return [...current, productId];
    });
  }, []);

  const summary = useMemo(
    () =>
      getFinanceSummary(
        {
          deposit,
          term,
          selectedFinance,
          hpVariant,
          balloon: balloonValue,
          apr,
        },
        financeContext,
      ),
    [
      deposit,
      term,
      selectedFinance,
      hpVariant,
      balloonValue,
      apr,
      financeContext,
    ],
  );

  const effectiveSelected: FinanceOption =
    selectedFinance === "zero" && !summary.zeroEligible
      ? "hp"
      : selectedFinance;

  const financeFit = useMemo(
    () =>
      getFinanceFit({
        summary,
        comfortableMonthly,
      }),
    [summary, comfortableMonthly],
  );

  const persistPlan = useCallback(
    (overrides?: Partial<DealFinancePlan>) => {
      const plan: DealFinancePlan = {
        deposit,
        term,
        selectedFinance,
        hpVariant,
        balloon: balloonValue,
        apr,
        pxValue,
        settlementFigure,
        gfvPercent,
        comfortableMonthly,
        includedProducts,
        ...overrides,
      };
      saveFinancePlan(dealId, plan);
      return plan;
    },
    [
      dealId,
      deposit,
      term,
      selectedFinance,
      hpVariant,
      balloonValue,
      apr,
      pxValue,
      settlementFigure,
      gfvPercent,
      comfortableMonthly,
      includedProducts,
      saveFinancePlan,
    ],
  );

  const vehicleMargin = deal.vehicle.retailPrice - deal.vehicle.vehicleCost;

  return {
    notes,
    deposit,
    setDeposit,
    pxValue,
    setPxValue,
    settlementFigure,
    setSettlementFigure,
    pxEquity,
    term,
    handleTermChange,
    selectedFinance,
    handleSelectFinance,
    hpVariant,
    setHpVariant,
    apr,
    setApr,
    gfvPercent,
    balloonValue,
    handleGfvPercentChange,
    handleBalloonValueChange,
    comfortableMonthly,
    setComfortableMonthly,
    depositMin: FINANCE_FIT_DEPOSIT_MIN,
    depositMax: FINANCE_FIT_DEPOSIT_MAX,
    includedProducts,
    toggleIncludedProduct,
    financeContext,
    summary,
    effectiveSelected,
    financeFit,
    vehicleMargin,
    persistPlan,
  };
}
