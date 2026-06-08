"use client";

import { Check, X } from "lucide-react";
import { financeProducts } from "@/constants/finance-products";
import { formatGbp } from "@/lib/formatGbp";
import {
  DEPOSIT_MAX,
  DEFAULT_HP_APR,
  FinanceOption,
  ZERO_TERM,
  balloonFromGfvPercent,
  getDealHealthStatus,
  getTermsForFinance,
  gfvPercentFromBalloon,
  type DealFinanceContext,
} from "@/lib/deal-builder/finance";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

const INCLUDED_PRODUCTS = [
  "Warranty",
  "Service Plan",
  "Lifetime MOT",
  "Supagard",
] as const;

export type SalespersonControlsPanelProps = {
  onClose?: () => void;
  deposit: number;
  onDepositChange: (value: number) => void;
  pxValue: number;
  onPxValueChange: (value: number) => void;
  settlementFigure: number;
  onSettlementChange: (value: number) => void;
  pxEquity: number;
  term: number;
  onTermChange: (value: number) => void;
  apr: number;
  onAprChange: (value: number) => void;
  selectedFinance: FinanceOption;
  onSelectFinance: (option: FinanceOption) => void;
  zeroEligible: boolean;
  gfvPercent: number;
  balloonValue: number;
  onGfvPercentChange: (percent: number) => void;
  onBalloonValueChange: (value: number) => void;
  retailPrice: number;
  financeContext: DealFinanceContext;
  vehicleCost: number;
  vehicleMargin: number;
  pxMargin: number;
  productMargin: number;
  hasPartExchange: boolean;
};

function CurrencyField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          £
        </span>
        <Input
          id={id}
          type="number"
          min={0}
          step={100}
          className="pl-7"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        />
      </div>
      {hint ? (
        <p className="text-caption text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-border" />;
}

export function SalespersonControlsPanel({
  onClose,
  deposit,
  onDepositChange,
  pxValue,
  onPxValueChange,
  settlementFigure,
  onSettlementChange,
  pxEquity,
  term,
  onTermChange,
  apr,
  onAprChange,
  selectedFinance,
  onSelectFinance,
  zeroEligible,
  gfvPercent,
  balloonValue,
  onGfvPercentChange,
  onBalloonValueChange,
  retailPrice,
  financeContext,
  vehicleCost,
  vehicleMargin,
  pxMargin,
  productMargin,
  hasPartExchange,
}: SalespersonControlsPanelProps) {
  const availableTerms = getTermsForFinance(selectedFinance);
  const totalMargin = vehicleMargin + pxMargin + productMargin;
  const dealHealth = getDealHealthStatus(totalMargin);

  const handleBalloonChange = (value: number) => {
    onBalloonValueChange(value);
    onGfvPercentChange(gfvPercentFromBalloon(value, retailPrice));
  };

  const handleGfvChange = (percent: number) => {
    onGfvPercentChange(percent);
    onBalloonValueChange(balloonFromGfvPercent(percent, retailPrice));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-heading-4">Adjust Plan</h2>
          <p className="text-caption text-muted-foreground">
            Finance options update live as you change these values
          </p>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close adjust plan"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto py-6 scrollbar-thin">
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Customer deposit</h3>
            <p className="text-caption text-muted-foreground">
              Upfront payment from the customer
            </p>
          </div>
          <CurrencyField
            id="deposit-amount"
            label="Deposit amount"
            value={deposit}
            onChange={(value) => onDepositChange(Math.min(DEPOSIT_MAX, value))}
          />
          <input
            type="range"
            min={0}
            max={DEPOSIT_MAX}
            step={250}
            value={deposit}
            onChange={(e) => onDepositChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
            aria-label="Deposit slider"
          />
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>£0</span>
            <span>{formatGbp(DEPOSIT_MAX)}</span>
          </div>
          {!zeroEligible ? (
            <p className="text-caption text-muted-foreground">
              0% finance requires{" "}
              {formatGbp(financeContext.zeroPercentMinDeposit ?? 0)} deposit + PX
              equity
            </p>
          ) : null}
        </section>

        {hasPartExchange ? (
          <>
            <SectionDivider />
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Part exchange</h3>
                <p className="text-caption text-muted-foreground">
                  Trade-in value and settlement
                </p>
              </div>
              <CurrencyField
                id="px-value"
                label="Part exchange value"
                value={pxValue}
                onChange={onPxValueChange}
              />
              <CurrencyField
                id="settlement"
                label="Settlement figure"
                value={settlementFigure}
                onChange={onSettlementChange}
              />
              <div className="rounded-[16px] bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Equity</span>
                  <span className="text-heading-4 text-success">
                    {formatGbp(pxEquity)}
                  </span>
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  PX value − settlement = {formatGbp(pxValue)} −{" "}
                  {formatGbp(settlementFigure)}
                </p>
              </div>
            </section>
          </>
        ) : null}

        <SectionDivider />
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Finance term</h3>
            <p className="text-caption text-muted-foreground">
              {selectedFinance === "zero"
                ? "0% finance is fixed at 18 months"
                : selectedFinance === "hp"
                  ? "HP up to 72 months"
                  : "PCP up to 60 months"}
            </p>
          </div>
          {selectedFinance === "zero" ? (
            <div className="rounded-[16px] bg-muted/50 p-4 text-sm font-medium">
              {ZERO_TERM} months (fixed)
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTerms.map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={term === t ? "primary" : "outline"}
                  onClick={() => onTermChange(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          )}
        </section>

        <SectionDivider />
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">APR</h3>
            <p className="text-caption text-muted-foreground">
              Affects HP monthly payment only
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apr">APR (%)</Label>
            <Input
              id="apr"
              type="number"
              min={0}
              max={30}
              step={0.1}
              value={apr}
              onChange={(e) =>
                onAprChange(Math.max(0, Number(e.target.value) || DEFAULT_HP_APR))
              }
            />
          </div>
        </section>

        <SectionDivider />
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">PCP settings</h3>
            <p className="text-caption text-muted-foreground">
              GFV balloon or residual percentage
            </p>
          </div>
          <CurrencyField
            id="balloon"
            label="Balloon value (GFV)"
            value={balloonValue}
            onChange={handleBalloonChange}
          />
          <div className="space-y-2">
            <Label htmlFor="residual">Residual %</Label>
            <Input
              id="residual"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={gfvPercent}
              onChange={(e) =>
                handleGfvChange(Math.max(0, Number(e.target.value) || 0))
              }
            />
            <p className="text-caption text-muted-foreground">
              {formatGbp(retailPrice)} × {gfvPercent}% ={" "}
              {formatGbp(balloonFromGfvPercent(gfvPercent, retailPrice))}
            </p>
          </div>
        </section>

        <SectionDivider />
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Finance option</h3>
            <p className="text-caption text-muted-foreground">
              Customer&apos;s preferred outcome
            </p>
          </div>
          <div className="space-y-2">
            {(Object.keys(financeProducts) as FinanceOption[]).map((option) => {
              const product = financeProducts[option];
              const disabled = option === "zero" && !zeroEligible;

              return (
                <label
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[16px] border border-border p-3 transition-colors",
                    selectedFinance === option && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    name="finance-option"
                    className="mt-1 accent-primary"
                    checked={selectedFinance === option}
                    disabled={disabled}
                    onChange={() => onSelectFinance(option)}
                  />
                  <div>
                    <p className="text-sm font-medium">{product.outcome}</p>
                    <p className="text-caption text-muted-foreground">
                      {product.headline}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <SectionDivider />
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Included products</h3>
            <p className="text-caption text-muted-foreground">
              Always included in Phase 1 — read only
            </p>
          </div>
          {INCLUDED_PRODUCTS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
          <div className="rounded-[16px] bg-muted/50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total product value</span>
              <span className="font-semibold">
                {formatGbp(financeContext.productValue ?? 1649)}
              </span>
            </div>
          </div>
        </section>

        <SectionDivider />
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Deal health</h3>
              <p className="text-caption text-muted-foreground">
                Internal only — customer cannot see
              </p>
            </div>
            <Badge variant="neutral" className="text-[10px] uppercase">
              Internal
            </Badge>
          </div>
          <KeyValueList
            items={[
              { key: "Vehicle cost", value: formatGbp(vehicleCost) },
              { key: "Vehicle margin", value: formatGbp(vehicleMargin) },
              { key: "PX margin", value: formatGbp(pxMargin) },
              { key: "Product margin", value: formatGbp(productMargin) },
            ]}
          />
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium">Total margin</span>
            <span className="text-heading-4">{formatGbp(totalMargin)}</span>
          </div>
          <Badge
            variant={
              dealHealth.status === "healthy"
                ? "success"
                : dealHealth.status === "low"
                  ? "warning"
                  : "danger"
            }
            className="w-full justify-center py-2"
          >
            {dealHealth.label}
          </Badge>
        </section>
      </div>
    </div>
  );
}
