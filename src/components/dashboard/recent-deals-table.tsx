"use client";

import { useMemo, useState } from "react";
import type { RecentDeal } from "@/types/dashboard";
import type { TableColumn } from "@/types";
import { dealHistoryRecords } from "@/constants/deal-history-mock-data";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import {
  defaultDealHistoryFilters,
  filterDealHistory,
} from "@/lib/filterDealHistory";
import {
  DealHistoryCompactFilters,
  DealHistorySearch,
} from "@/components/deals/deal-history-filters";
import { DataTable } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";

const columns: TableColumn<RecentDeal>[] = [
  {
    key: "id",
    header: "Deal ID",
    className: "hidden sm:table-cell",
    cell: (row) => (
      <span className="font-medium text-muted-foreground">{row.id}</span>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (row) => (
      <span className="font-medium">{row.customer}</span>
    ),
  },
  {
    key: "vehicle",
    header: "Vehicle",
    className: "min-w-[200px]",
    cell: (row) => (
      <span className="text-muted-foreground">{row.vehicle}</span>
    ),
  },
  {
    key: "financeType",
    header: "Finance Option",
    className: "hidden md:table-cell",
  },
  {
    key: "monthlyPayment",
    header: "Monthly",
    className: "hidden sm:table-cell",
    cell: (row) =>
      row.monthlyPayment !== null
        ? `${formatCurrency(row.monthlyPayment, {
            currency: "GBP",
            locale: "en-GB",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}/mo`
        : "—",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant={dealStatusVariant[row.status]}>
        {dealStatusLabel[row.status]}
      </Badge>
    ),
  },
  {
    key: "lastUpdated",
    header: "Last Updated",
    className: "hidden lg:table-cell",
    cell: (row) =>
      formatDate(row.lastUpdated, { locale: "en-GB", dateStyle: "medium" }),
  },
];

export function RecentDealsTable() {
  const [filters, setFilters] = useState(defaultDealHistoryFilters);

  const salespeople = useMemo(
    () =>
      [...new Set(dealHistoryRecords.map((record) => record.salesperson))].sort(),
    []
  );

  const filteredDeals = useMemo(
    () => filterDealHistory(dealHistoryRecords, filters),
    [filters]
  );

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Recent Deals</CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <DealHistorySearch
            filters={filters}
            onFiltersChange={setFilters}
            variant="plain"
            inline
          />
          <DealHistoryCompactFilters
            filters={filters}
            onFiltersChange={setFilters}
            salespeople={salespeople}
            variant="plain"
            className="shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <DataTable
          data={filteredDeals}
          columns={columns}
          keyField="id"
          emptyMessage="No deals match your filters"
          paginated
          pageSize={10}
        />
      </CardContent>
    </Card>
  );
}
