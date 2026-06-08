"use client";

import { useEffect, useMemo, useState } from "react";
import type { TableColumn } from "@/types";
import {
  getPageRange,
  getPageSlice,
  getTotalPages,
  getVisiblePages,
} from "@/lib/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/data-display/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/cn";

type DataTableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  keyField?: keyof T;
  emptyMessage?: string;
  className?: string;
  paginated?: boolean;
  pageSize?: number;
  borderless?: boolean;
};

export function DataTable<T>({
  data,
  columns,
  keyField = "id" as keyof T,
  emptyMessage = "No data available",
  className,
  paginated = false,
  pageSize = 5,
  borderless = false,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = getTotalPages(data.length, pageSize);
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [data.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedData = useMemo(
    () =>
      paginated ? getPageSlice(data, currentPage, pageSize) : data,
    [data, paginated, currentPage, pageSize]
  );

  const pageRange = getPageRange(currentPage, pageSize, data.length);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        className={cn(
          className,
          borderless &&
            "[&_tr]:border-0 [&_thead_tr]:border-0 [&_tr:hover]:bg-transparent"
        )}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow key={String(row[keyField] ?? index)}>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={column.className}
                >
                  {column.cell
                    ? column.cell(row)
                    : String(row[column.key as keyof T] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {paginated && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted-foreground">
            Showing {pageRange.start}-{pageRange.end} of {data.length} results
          </p>

          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {visiblePages.map((pageNumber, index) => (
                  <PaginationItem
                    key={
                      pageNumber === "ellipsis"
                        ? `ellipsis-${index}`
                        : pageNumber
                    }
                  >
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((value) => Math.min(totalPages, value + 1))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
