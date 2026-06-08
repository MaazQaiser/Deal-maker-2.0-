import type { Branch } from "@/types/deal";
import type { DealStatus, FinanceType, RecentDeal } from "@/types/dashboard";

export type DealDateRangeFilter =
  | "all"
  | "today"
  | "this-week"
  | "this-month"
  | "custom";

export type DealHistoryFilters = {
  search: string;
  status: DealStatus | "all";
  financeType: FinanceType | "all";
  salesperson: string;
  dateRange: DealDateRangeFilter;
  customDateFrom: string;
  customDateTo: string;
  branch: Branch | "all";
};

export const defaultDealHistoryFilters: DealHistoryFilters = {
  search: "",
  status: "all",
  financeType: "all",
  salesperson: "all",
  dateRange: "all",
  customDateFrom: "",
  customDateTo: "",
  branch: "all",
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function isWithinDateRange(
  date: Date,
  range: DealDateRangeFilter,
  customDateFrom: string,
  customDateTo: string,
  referenceDate = new Date()
): boolean {
  const target = startOfDay(date);

  if (range === "all") return true;

  if (range === "today") {
    const today = startOfDay(referenceDate);
    return target.getTime() === today.getTime();
  }

  if (range === "this-week") {
    const start = startOfDay(referenceDate);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    const end = endOfDay(new Date(start));
    end.setDate(start.getDate() + 6);

    return date >= start && date <= end;
  }

  if (range === "this-month") {
    const start = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1
    );
    const end = endOfDay(
      new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0)
    );
    return date >= start && date <= end;
  }

  if (range === "custom") {
    if (!customDateFrom && !customDateTo) return true;

    const from = customDateFrom ? startOfDay(new Date(customDateFrom)) : null;
    const to = customDateTo ? endOfDay(new Date(customDateTo)) : null;

    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  }

  return true;
}

export function filterDealHistory(
  records: RecentDeal[],
  filters: DealHistoryFilters
): RecentDeal[] {
  const query = filters.search.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }

    if (
      filters.financeType !== "all" &&
      record.financeType !== filters.financeType
    ) {
      return false;
    }

    if (
      filters.salesperson !== "all" &&
      record.salesperson !== filters.salesperson
    ) {
      return false;
    }

    if (filters.branch !== "all" && record.branch !== filters.branch) {
      return false;
    }

    if (
      !isWithinDateRange(
        record.lastUpdated,
        filters.dateRange,
        filters.customDateFrom,
        filters.customDateTo
      )
    ) {
      return false;
    }

    if (!query) return true;

    const searchable = [
      record.id,
      record.customer,
      record.vehicle,
      record.salesperson,
      record.deposit,
      record.financeType,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

export function hasActiveDealHistoryFilters(
  filters: DealHistoryFilters
): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.financeType !== "all" ||
    filters.salesperson !== "all" ||
    filters.dateRange !== "all" ||
    filters.branch !== "all"
  );
}
