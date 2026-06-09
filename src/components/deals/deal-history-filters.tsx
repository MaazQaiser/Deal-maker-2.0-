"use client";

import { Search, X } from "lucide-react";
import type { DealStatus, FinanceType } from "@/types/dashboard";
import type { Branch } from "@/types/deal";
import { branches } from "@/constants/deal-mock-data";
import { dealStatusLabel } from "@/lib/dealStatus";
import {
  defaultDealHistoryFilters,
  hasActiveDealHistoryFilters,
  type DealDateRangeFilter,
  type DealHistoryFilters,
} from "@/lib/filterDealHistory";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions: Array<DealStatus | "all"> = [
  "all",
  "draft",
  "presented",
  "finance-pending",
  "won",
  "lost",
];

const financeTypeOptions: Array<FinanceType | "all"> = [
  "all",
  "0% Finance",
  "HP",
  "PCP",
];

const dateRangeOptions: Array<{ value: DealDateRangeFilter; label: string }> = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "custom", label: "Custom" },
];

const plainControlClass =
  "border-0 bg-transparent shadow-none focus-visible:ring-0 focus:ring-0";

type DealHistoryFiltersProps = {
  filters: DealHistoryFilters;
  onFiltersChange: (filters: DealHistoryFilters) => void;
  salespeople: string[];
  className?: string;
  variant?: "default" | "plain";
  inline?: boolean;
};

type DealHistorySearchProps = {
  filters: DealHistoryFilters;
  onFiltersChange: (filters: DealHistoryFilters) => void;
  className?: string;
  variant?: "default" | "plain";
  inline?: boolean;
};

export function DealHistorySearch({
  filters,
  onFiltersChange,
  className,
  variant = "default",
  inline = false,
}: DealHistorySearchProps) {
  const showClear = hasActiveDealHistoryFilters(filters);

  const searchInput = (
    <div className={cn("relative", inline ? "w-full" : "flex-1")}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="deal-search"
        type="search"
        placeholder="Search by deal ID, customer, vehicle, or salesperson..."
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value })
        }
        className={cn(
          "pl-9",
          variant === "plain" ? "h-8" : inline ? "h-10" : "h-11",
          variant === "plain" &&
            "border-0 bg-slate-100 shadow-none focus-visible:ring-0 focus:ring-0"
        )}
        aria-label="Search deals"
      />
    </div>
  );

  if (inline) {
    return (
      <div className={cn("min-w-[200px] flex-1 space-y-2", className)}>
        {variant !== "plain" && (
          <Label htmlFor="deal-search" className="text-sm font-medium">
            Search
          </Label>
        )}
        {searchInput}
      </div>
    );
  }

  return (
    <div className={cn(variant === "plain" ? "space-y-0" : "space-y-2", className)}>
      {variant !== "plain" && (
        <Label htmlFor="deal-search" className="text-sm font-medium">
          Search
        </Label>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {searchInput}
        {showClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => onFiltersChange(defaultDealHistoryFilters)}
          >
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

export function DealHistoryCompactFilters({
  filters,
  onFiltersChange,
  salespeople,
  className,
  variant = "default",
}: DealHistoryFiltersProps) {
  const update = (patch: Partial<DealHistoryFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const triggerClass = cn(
    "h-10 w-[140px] text-sm",
    variant === "plain" && "h-8 w-[130px] text-xs",
    variant === "plain" && plainControlClass
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select
        value={filters.status}
        onValueChange={(value) => update({ status: value as DealStatus | "all" })}
      >
        <SelectTrigger className={triggerClass} aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status === "all" ? "All Statuses" : dealStatusLabel[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.financeType}
        onValueChange={(value) =>
          update({ financeType: value as FinanceType | "all" })
        }
      >
        <SelectTrigger className={triggerClass} aria-label="Filter by finance type">
          <SelectValue placeholder="Finance" />
        </SelectTrigger>
        <SelectContent>
          {financeTypeOptions.map((financeType) => (
            <SelectItem key={financeType} value={financeType}>
              {financeType === "all" ? "All Finance" : financeType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.salesperson}
        onValueChange={(value) => update({ salesperson: value })}
      >
        <SelectTrigger
          className={cn(triggerClass, "w-[150px]")}
          aria-label="Filter by salesperson"
        >
          <SelectValue placeholder="Salesperson" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Salespeople</SelectItem>
          {salespeople.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={(value) =>
          update({ dateRange: value as DealDateRangeFilter })
        }
      >
        <SelectTrigger className={triggerClass} aria-label="Filter by date range">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveDealHistoryFilters(filters) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => onFiltersChange(defaultDealHistoryFilters)}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

export function DealHistoryFilters({
  filters,
  onFiltersChange,
  salespeople,
  className,
  inline = false,
}: DealHistoryFiltersProps) {
  const update = (patch: Partial<DealHistoryFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const containerClass = inline
    ? "flex flex-wrap items-end gap-3"
    : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const fieldClass = inline ? "w-[140px] shrink-0 space-y-2" : "space-y-2";
  const salespersonFieldClass = inline
    ? "w-[160px] shrink-0 space-y-2"
    : "space-y-2";
  const selectTriggerClass = inline ? "h-10 w-full" : undefined;

  return (
    <div className={cn(containerClass, className)}>
      <div className={fieldClass}>
        <Label htmlFor="status-filter" className="text-sm font-medium">
          Status
        </Label>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            update({ status: value as DealStatus | "all" })
          }
        >
          <SelectTrigger id="status-filter" className={selectTriggerClass}>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All" : dealStatusLabel[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={fieldClass}>
        <Label htmlFor="finance-type-filter" className="text-sm font-medium">
          Finance Type
        </Label>
        <Select
          value={filters.financeType}
          onValueChange={(value) =>
            update({ financeType: value as FinanceType | "all" })
          }
        >
          <SelectTrigger id="finance-type-filter" className={selectTriggerClass}>
            <SelectValue placeholder="All finance types" />
          </SelectTrigger>
          <SelectContent>
            {financeTypeOptions.map((financeType) => (
              <SelectItem key={financeType} value={financeType}>
                {financeType === "all" ? "All" : financeType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={salespersonFieldClass}>
        <Label htmlFor="salesperson-filter" className="text-sm font-medium">
          Salesperson
        </Label>
        <Select
          value={filters.salesperson}
          onValueChange={(value) => update({ salesperson: value })}
        >
          <SelectTrigger id="salesperson-filter" className={selectTriggerClass}>
            <SelectValue placeholder="All salespeople" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {salespeople.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={fieldClass}>
        <Label htmlFor="branch-filter" className="text-sm font-medium">
          Branch
        </Label>
        <Select
          value={filters.branch}
          onValueChange={(value) =>
            update({ branch: value as Branch | "all" })
          }
        >
          <SelectTrigger id="branch-filter" className={selectTriggerClass}>
            <SelectValue placeholder="All branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.value} value={branch.value}>
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
