"use client";

import { financeProducts, type FinanceProductMeta } from "@/constants/finance-products";
import type { FinanceOption } from "@/lib/deal-builder/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type CustomerObjectionGuideProps = {
  suggestedOption: FinanceOption;
  onSelectFinance: (option: FinanceOption) => void;
};

export function CustomerObjectionGuide({
  suggestedOption,
  onSelectFinance,
}: CustomerObjectionGuideProps) {
  const products = Object.values(financeProducts) as FinanceProductMeta[];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer objection guide</CardTitle>
        <CardDescription>
          Match what the customer says to the right outcome
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              "rounded-[16px] border border-border p-3",
              suggestedOption === product.id && "border-primary bg-primary/5",
            )}
          >
            <p className="text-caption text-muted-foreground">
              {product.objectionPrompt}
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{product.outcome}</p>
                <p className="text-caption text-muted-foreground">
                  {product.headline}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {suggestedOption === product.id && (
                  <Badge variant="info">Suggested</Badge>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectFinance(product.id)}
                >
                  Show
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
