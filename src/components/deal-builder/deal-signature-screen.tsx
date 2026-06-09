"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { branches } from "@/constants/deal-mock-data";
import { routes } from "@/constants/routes";
import { getDemoDeal } from "@/lib/deal-builder/demo-deal";
import { formatGbp } from "@/lib/formatGbp";
import { useDealStore } from "@/store/dealStore";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DealSignatureScreenProps = {
  dealId: string;
};

export function DealSignatureScreen({ dealId }: DealSignatureScreenProps) {
  const router = useRouter();
  const getDeal = useDealStore((s) => s.getDeal);
  const getFinancePlan = useDealStore((s) => s.getFinancePlan);
  const updateDealStatus = useDealStore((s) => s.updateDealStatus);
  const deal = getDeal(dealId) ?? getDemoDeal(dealId);
  const financePlan = getFinancePlan(dealId);

  const [signature, setSignature] = useState("");
  const [depositAmount, setDepositAmount] = useState(
    financePlan?.deposit ?? 4000,
  );
  const [acknowledged, setAcknowledged] = useState(false);
  const [completed, setCompleted] = useState(false);

  const customerName = `${deal.customer.firstName} ${deal.customer.lastName}`;
  const branchLabel =
    branches.find((b) => b.value === deal.branch)?.label ?? deal.branch;
  const signedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const canComplete =
    signature.trim().length > 0 && depositAmount > 0 && acknowledged;

  const handleComplete = () => {
    if (!canComplete) return;
    updateDealStatus(dealId, "finance-pending");
    setCompleted(true);
  };

  if (completed) {
    return (
      <PageContainer size="sm" className="flex min-h-[70vh] items-center py-12">
        <Card className="w-full border-primary/30 p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/15">
            <Check className="size-7 text-success" />
          </div>
          <h1 className="text-heading-2">Signature Captured</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Deposit of {formatGbp(depositAmount)} recorded for {customerName}.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button type="button" className="w-full" asChild>
              <Link href={routes.deals.index}>Return To Deal List</Link>
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={routes.dealBuilder.review(dealId)}>Back To Summary</Link>
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--topbar-height))] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer size="full" className="space-y-6 py-6 sm:space-y-8">
          <PageHeader
            title="Signature & Deposit"
            description="Capture the customer signature and deposit before completing the deal."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Deal Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Deal ID</span>
                  <span className="font-medium">{dealId}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium">{branchLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{signedDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Deposit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit amount</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="deposit-amount"
                    type="number"
                    min={0}
                    step={100}
                    className="pl-7"
                    value={depositAmount}
                    onChange={(e) =>
                      setDepositAmount(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer Signature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Sign full name</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder={customerName}
                  className="font-serif text-lg italic"
                />
              </div>
              <div className="rounded-[16px] border border-dashed border-border bg-muted/30 px-6 py-8 text-center">
                <p className="font-serif text-2xl italic text-foreground/80">
                  {signature.trim() || "Signature preview"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 p-6">
              <Checkbox
                id="deposit-ack"
                checked={acknowledged}
                onCheckedChange={(checked) =>
                  setAcknowledged(checked === true)
                }
              />
              <Label
                htmlFor="deposit-ack"
                className="cursor-pointer text-sm leading-relaxed"
              >
                I acknowledge that the deposit is non-refundable.
              </Label>
            </CardContent>
          </Card>
        </PageContainer>
      </div>

      <footer className="shrink-0 border-t border-border bg-background">
        <PageContainer
          size="full"
          className="flex flex-wrap items-center justify-between gap-3 py-4"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(routes.dealBuilder.review(dealId))}
          >
            Back
          </Button>
          <Button type="button" disabled={!canComplete} onClick={handleComplete}>
            Complete Signature
          </Button>
        </PageContainer>
      </footer>
    </div>
  );
}
