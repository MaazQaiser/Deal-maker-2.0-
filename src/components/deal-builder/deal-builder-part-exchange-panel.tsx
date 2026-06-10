"use client";

import { getStockVehicleImage } from "@/constants/deal-mock-data";
import {
  getPxServiceHistoryLabel,
  getPxServicedWhereLabel,
  getPxValueDriverLabel,
} from "@/constants/part-exchange-options";
import { formatGbp } from "@/lib/formatGbp";
import type { PartExchangeRecord } from "@/types/deal";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import { KeyValueList } from "@/components/data-display/key-value-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const nestedPanelClass = "rounded-[16px] bg-muted/50 p-4";

function formatDisplayDate(value: string | undefined) {
  if (!value) return undefined;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type DealBuilderPartExchangePanelProps = {
  partExchange: PartExchangeRecord;
  pxValue: number;
  settlementFigure: number;
  pxEquity: number;
  className?: string;
};

export function DealBuilderPartExchangePanel({
  partExchange,
  pxValue,
  settlementFigure,
  pxEquity,
  className,
}: DealBuilderPartExchangePanelProps) {
  const vehicleName = `${partExchange.make} ${partExchange.model}`;

  const appraisalItems = [
    ...(partExchange.colour
      ? [{ key: "Colour", value: partExchange.colour }]
      : []),
    ...(partExchange.fuel ? [{ key: "Fuel", value: partExchange.fuel }] : []),
    ...(partExchange.motExpires
      ? [{ key: "MOT expires", value: formatDisplayDate(partExchange.motExpires) ?? "" }]
      : []),
    { key: "Mileage", value: `${partExchange.mileage.toLocaleString("en-GB")} miles` },
    ...(partExchange.serviceHistoryType
      ? [
          {
            key: "Service history",
            value: getPxServiceHistoryLabel(partExchange.serviceHistoryType),
          },
        ]
      : []),
    ...(partExchange.servicedWhere
      ? [
          {
            key: "Serviced where",
            value: getPxServicedWhereLabel(partExchange.servicedWhere),
          },
        ]
      : []),
    ...(partExchange.valueDrivers?.length
      ? [
          {
            key: "Value drivers",
            value: partExchange.valueDrivers
              .map((driver) => getPxValueDriverLabel(driver))
              .join(", "),
          },
        ]
      : []),
    ...(partExchange.conditionNotes
      ? [{ key: "Condition notes", value: partExchange.conditionNotes }]
      : []),
  ];

  return (
    <Card className={cn("overflow-hidden rounded-xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Part Exchange</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div className="overflow-hidden rounded-[16px] bg-muted/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getStockVehicleImage(partExchange.make, partExchange.model)}
            alt={vehicleName}
            className="h-32 w-full object-cover"
            decoding="async"
          />
        </div>

        <div className="flex items-start gap-3">
          <CarBrandLogo make={partExchange.make} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{vehicleName}</p>
            <Badge variant="neutral" className="mt-2 font-mono">
              {partExchange.registration}
            </Badge>
          </div>
        </div>

        {appraisalItems.length > 0 && (
          <div className={nestedPanelClass}>
            <KeyValueList items={appraisalItems} />
          </div>
        )}

        <div className={nestedPanelClass}>
          <KeyValueList
            items={[
              {
                key: "Estimated Value",
                value: formatGbp(pxValue),
              },
              ...(partExchange.existingFinance
                ? [
                    {
                      key: "Monthly Payment",
                      value: formatGbp(partExchange.monthlyPayment),
                    },
                    {
                      key: "Settlement Figure",
                      value: formatGbp(settlementFigure),
                    },
                    ...(partExchange.lender
                      ? [
                          {
                            key: "Lender",
                            value: partExchange.lender,
                          },
                        ]
                      : []),
                    ...(partExchange.agreementNumber
                      ? [
                          {
                            key: "Agreement Number",
                            value: partExchange.agreementNumber,
                          },
                        ]
                      : []),
                    ...(partExchange.settlementQuoteDate
                      ? [
                          {
                            key: "Settlement Quote Date",
                            value:
                              formatDisplayDate(partExchange.settlementQuoteDate) ??
                              partExchange.settlementQuoteDate,
                          },
                        ]
                      : []),
                  ]
                : []),
            ]}
          />
        </div>

        <div className={cn(nestedPanelClass, "flex items-center justify-between")}>
          <span className="text-sm font-medium">Available Equity</span>
          <span className="text-heading-4 text-success">
            {formatGbp(pxEquity)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
