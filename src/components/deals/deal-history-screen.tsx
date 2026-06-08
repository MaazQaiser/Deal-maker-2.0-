"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RecentDeal } from "@/types/dashboard";
import type { TableColumn } from "@/types";
import { dealHistoryRecords } from "@/constants/deal-history-mock-data";
import { routes } from "@/constants/routes";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { dealStatusLabel, dealStatusVariant } from "@/lib/dealStatus";
import {
  defaultDealHistoryFilters,
  filterDealHistory,
} from "@/lib/filterDealHistory";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import {
  DealHistoryFilters,
  DealHistorySearch,
} from "@/components/deals/deal-history-filters";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-display/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";

const columns: TableColumn<RecentDeal>[] = [
  {
    key: "id",
    header: "Deal ID",
    cell: (row) => (
      <Link
        href={routes.deals.detail(row.id)}
        className="font-medium text-primary hover:underline"
      >
        {row.id}
      </Link>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (row) => <span className="font-medium">{row.customer}</span>,
  },
  {
    key: "vehicle",
    header: "Vehicle",
    className: "min-w-[220px]",
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
    key: "deposit",
    header: "Deposit",
    className: "hidden lg:table-cell",
  },
  {
    key: "salesperson",
    header: "Salesperson",
    className: "hidden xl:table-cell",
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

export function DealHistoryScreen() {
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
    <PageContainer className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title="Deal History"
        description="View and manage all dealership deals"
        actions={
          <Button asChild>
            <Link href={routes.deals.new.index}>Create Deal</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>
            Showing {filteredDeals.length} of {dealHistoryRecords.length} deals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DealHistorySearch
            filters={filters}
            onFiltersChange={setFilters}
          />

          <Separator />

          <DealHistoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            salespeople={salespeople}
          />

          <Separator />

          <div className="overflow-x-auto">
            <DataTable
              data={filteredDeals}
              columns={columns}
              keyField="id"
              emptyMessage="No deals match your filters"
              paginated
              pageSize={5}
            />
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
