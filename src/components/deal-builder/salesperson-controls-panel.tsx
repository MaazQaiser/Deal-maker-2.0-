"use client";

import { X } from "lucide-react";
import { formatGbp } from "@/lib/formatGbp";
import {
  DEPOSIT_MAX,
  DEFAULT_HP_APR,
  FINANCE_FIT_DEPOSIT_MIN,
  FinanceOption,
  ZERO_TERM,
  balloonFromGfvPercent,
  getTermsForFinance,
  gfvPercentFromBalloon,
  type DealFinanceContext,
} from "@/lib/deal-builder/finance";
import {
  DEFAULT_INCLUDED_PRODUCTS,
  INCLUDED_PRODUCT_DETAILS,
  INCLUDED_PRODUCT_VALUES,
  type IncludedProductId,
} from "@/constants/presentation-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/data-display/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";

export type SalespersonControlsPanelProps = {
  onClose?: () => void;
  embedded?: boolean;
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
  zeroEligible: boolean;
  gfvPercent: number;
  balloonValue: number;
  onGfvPercentChange: (percent: number) => void;
  onBalloonValueChange: (value: number) => void;
  retailPrice: number;
  financeContext: DealFinanceContext;
  hasPartExchange: boolean;
  includedProducts?: IncludedProductId[];
  onToggleProduct?: (productId: IncludedProductId) => void;
  allAboveBudget?: boolean;
  comfortableMonthly?: number;
  cheapestMonthly?: number;
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
  embedded = false,
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
  zeroEligible,
  gfvPercent,
  balloonValue,
  onGfvPercentChange,
  onBalloonValueChange,
  retailPrice,
  financeContext,
  hasPartExchange,
  includedProducts = DEFAULT_INCLUDED_PRODUCTS,
  onToggleProduct,
  allAboveBudget = false,
  comfortableMonthly,
  cheapestMonthly,
}: SalespersonControlsPanelProps) {
  const availableTerms = getTermsForFinance(selectedFinance);

  const handleBalloonChange = (value: number) => {
    onBalloonValueChange(value);
    onGfvPercentChange(gfvPercentFromBalloon(value, retailPrice));
  };

  const handleGfvChange = (percent: number) => {
    onGfvPercentChange(percent);
    onBalloonValueChange(balloonFromGfvPercent(percent, retailPrice));
  };

  const controlsContent = (
    <div
      className={cn(
        "space-y-6",
        !embedded && onClose && "flex-1 overflow-y-auto py-6 scrollbar-thin",
      )}
    >
        {allAboveBudget && comfortableMonthly != null && cheapestMonthly != null ? (
          <div className="rounded-[16px] border border-warning/30 bg-warning/10 p-4">
            <p className="text-sm font-medium text-warning">
              Cheapest option is {formatGbp(cheapestMonthly)}/mo — above the
              customer&apos;s {formatGbp(comfortableMonthly)}/mo budget
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              Adjust deposit, term, or trade off a product below to bring the
              monthly payment down.
            </p>
          </div>
        ) : null}

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
            min={FINANCE_FIT_DEPOSIT_MIN}
            max={DEPOSIT_MAX}
            step={250}
            value={deposit}
            onChange={(e) => onDepositChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
            aria-label="Deposit slider"
          />
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>{formatGbp(FINANCE_FIT_DEPOSIT_MIN)}</span>
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
            <h3 className="text-sm font-medium">Products in this deal</h3>
            <p className="text-caption text-muted-foreground">
              {allAboveBudget
                ? "Remove products to lower monthly payments"
                : "Included with the 0% package — toggle to trade off"}
            </p>
          </div>
          <div className="space-y-3">
            {DEFAULT_INCLUDED_PRODUCTS.map((productId) => {
              const product = INCLUDED_PRODUCT_DETAILS[productId];
              const included = includedProducts.includes(productId);
              const value = INCLUDED_PRODUCT_VALUES[productId];
              return (
                <label
                  key={productId}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[16px] border p-3 transition-colors",
                    included
                      ? "border-border bg-muted/30"
                      : "border-dashed border-muted-foreground/30 bg-muted/10 opacity-70",
                  )}
                >
                  <Checkbox
                    checked={included}
                    onCheckedChange={() => onToggleProduct?.(productId)}
                    disabled={!onToggleProduct}
                    aria-label={`Include ${product.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-caption text-muted-foreground">
                      {product.tagline}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                    {formatGbp(value)}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <SectionDivider />
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Discounts</h3>
            <p className="text-caption text-muted-foreground">
              Sales codes and manager overrides
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sales-code">Sales Code</Label>
            <Input id="sales-code" placeholder="Enter sales code" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager-override">Manager Override</Label>
            <Input
              id="manager-override"
              type="number"
              min={0}
              step={50}
              placeholder="Optional discount amount"
            />
          </div>
        </section>
    </div>
  );

  if (embedded) {
    return (
      <Card>
        <Accordion type="single" collapsible defaultValue="configure-deal">
          <AccordionItem value="configure-deal" className="border-0">
            <AccordionTrigger className="px-6 py-5 hover:no-underline">
              <div className="text-left">
                <h2 className="text-heading-4">Configure Deal</h2>
                <p className="text-caption font-normal text-muted-foreground">
                  Finance and discounts — hidden from presentation view
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">{controlsContent}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col", onClose && "h-full")}>
      <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-heading-4">Configure Deal</h2>
          <p className="text-caption text-muted-foreground">
            Finance and discounts — hidden from presentation view
          </p>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 shrink-0 p-0"
            onClick={onClose}
            aria-label="Close adjust plan"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      {controlsContent}
    </div>
  );
}
