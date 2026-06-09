"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { dealCreationSteps } from "@/constants/deal-creation-steps";
import { wrongVehicleReasonOptions } from "@/constants/test-drive-options";
import { routes } from "@/constants/routes";
import { useDealStore } from "@/store/dealStore";
import type {
  TrialCloseConcernType,
  TrialCloseData,
  WrongVehicleReasonKey,
} from "@/types/test-drive";
import { emptyTrialCloseData } from "@/types/test-drive";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { DealCreationStepper } from "@/components/deals/deal-creation-stepper";
import { VehicleSummaryCard } from "@/components/deals/vehicle-summary-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

function toggleMultiSelect<T extends string>(
  current: T[],
  value: T,
  checked: boolean,
): T[] {
  if (checked) {
    return current.includes(value) ? current : [...current, value];
  }
  return current.filter((item) => item !== value);
}

type TrialCloseScenario = "strong" | "objection" | "wrong" | "none";

function getScenario(rating: number | null): TrialCloseScenario {
  if (rating == null) return "none";
  if (rating >= 9) return "strong";
  if (rating === 8) return "objection";
  return "wrong";
}

export function TrialCloseScreen() {
  const router = useRouter();
  const creationDraft = useDealStore((s) => s.creationDraft);
  const creationChecklist = useDealStore((s) => s.creationChecklist);
  const creationTestDriveNotes = useDealStore((s) => s.creationTestDriveNotes);
  const savedTrialClose = useDealStore((s) => s.creationTrialClose);
  const createDeal = useDealStore((s) => s.createDeal);
  const saveCreationTrialClose = useDealStore((s) => s.saveCreationTrialClose);
  const clearCreationDraft = useDealStore((s) => s.clearCreationDraft);

  const [data, setData] = useState<TrialCloseData>(
    savedTrialClose ?? emptyTrialCloseData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skipDraftRedirectRef = useRef(false);

  useEffect(() => {
    if (!creationDraft && !skipDraftRedirectRef.current) {
      router.replace(routes.deals.new.index);
    }
  }, [creationDraft, router]);

  useEffect(() => {
    saveCreationTrialClose(data);
  }, [data, saveCreationTrialClose]);

  const scenario = useMemo(() => getScenario(data.rating), [data.rating]);

  if (!creationDraft) {
    if (skipDraftRedirectRef.current) {
      return (
        <PageContainer size="md" className="py-12">
          <p className="text-center text-muted-foreground">
            Opening Deal Builder…
          </p>
        </PageContainer>
      );
    }
    return null;
  }

  const stepMeta = dealCreationSteps[3];

  const finalizeDeal = async () => {
    if (!creationDraft) return;

    setIsSubmitting(true);
    skipDraftRedirectRef.current = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const deal = createDeal(
        creationDraft,
        creationChecklist ?? undefined,
        creationTestDriveNotes ?? undefined,
        data,
      );
      toast.success("Ready for presentation", {
        description: `${deal.customer.firstName} ${deal.customer.lastName} · ${deal.vehicle.make} ${deal.vehicle.model}`,
      });
      router.replace(routes.dealBuilder.detail(deal.id));
    } catch {
      skipDraftRedirectRef.current = false;
      toast.error("Could not continue to Deal Builder", {
        description: "Check the deal details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinueToDealBuilder =
    data.rating != null &&
    (scenario === "strong" ||
      (scenario === "objection" &&
        data.concernType === "minor" &&
        data.makeItTen.trim().length > 0));

  const showDealBuilderActions = canContinueToDealBuilder;

  const handleContinueToDealBuilder = () => {
    void finalizeDeal();
  };

  const canReviewMajor =
    scenario === "objection" &&
    data.concernType === "major" &&
    data.makeItTen.trim().length > 0;

  const handleReviewWithManager = () => {
    toast.message("Review with sales manager", {
      description: "Major objection recorded — do not continue to presentation yet.",
    });
  };

  const handleFindAlternative = () => {
    toast.message("Find alternative vehicle", {
      description: "Return to vehicle selection to choose a different car.",
    });
    router.push(routes.deals.new.index);
  };

  const handleEndDeal = () => {
    clearCreationDraft();
    toast.message("Deal ended", {
      description: "This vehicle was not right for the customer.",
    });
    router.push(routes.dashboard);
  };

  return (
    <PageContainer size="md" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title="Trial Close"
        titleClassName="text-page-title"
        description={stepMeta.subtitle}
        footer={<DealCreationStepper currentStep={4} />}
        actions={
          <>
            <Button type="button" variant="outline" asChild>
              <Link href={routes.deals.new.step3}>Back</Link>
            </Button>
            {showDealBuilderActions ? (
              <Button
                type="button"
                loading={isSubmitting}
                onClick={handleContinueToDealBuilder}
              >
                Continue to Deal Builder
              </Button>
            ) : null}
          </>
        }
      />

      <VehicleSummaryCard />

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-heading-3">
            How would the customer rate the vehicle?
          </CardTitle>
          <CardDescription>
            Every customer must score the vehicle before presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 10 }, (_, index) => {
              const value = index + 1;
              const selected = data.rating === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      rating: value,
                      concernType: value === 8 ? current.concernType : null,
                    }))
                  }
                  className={cn(
                    "flex size-12 items-center justify-center rounded-[16px] border text-lg font-semibold transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {scenario === "strong" && (
        <Card className="border-success/30">
          <CardHeader>
            <Badge variant="success">Strong Buyer</Badge>
            <CardTitle className="text-base">
              Customer is ready for presentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loved-most">What did the customer love most?</Label>
              <Textarea
                id="loved-most"
                rows={3}
                value={data.lovedMost}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    lovedMost: e.target.value,
                  }))
                }
                placeholder="Ride quality, space, fuel economy..."
              />
            </div>
            <Button
              type="button"
              className="w-full"
              loading={isSubmitting}
              onClick={handleContinueToDealBuilder}
            >
              Continue to Deal Builder
            </Button>
          </CardContent>
        </Card>
      )}

      {scenario === "objection" && (
        <Card className="border-warning/30">
          <CardHeader>
            <Badge variant="warning">Potential Objection</Badge>
            <CardTitle className="text-base">
              Ask: &ldquo;What would make it a 10?&rdquo;
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="make-it-ten">What would make it a 10?</Label>
              <Textarea
                id="make-it-ten"
                rows={3}
                value={data.makeItTen}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    makeItTen: e.target.value,
                  }))
                }
                placeholder="Heated seats, different colour, lower payment..."
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Classification</p>
              <RadioGroup
                value={data.concernType ?? ""}
                onValueChange={(value) =>
                  setData((current) => ({
                    ...current,
                    concernType: value as TrialCloseConcernType,
                  }))
                }
                className="space-y-3"
              >
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[16px] border p-4",
                    data.concernType === "minor" && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem value="minor" className="mt-1" />
                  <div>
                    <p className="text-sm font-medium">Minor Preference</p>
                    <p className="text-caption text-muted-foreground">
                      Different wheels, different colour
                    </p>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[16px] border p-4",
                    data.concernType === "major" && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem value="major" className="mt-1" />
                  <div>
                    <p className="text-sm font-medium">Significant Objection</p>
                    <p className="text-caption text-muted-foreground">
                      Monthly payment, wrong specification, missing feature
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {data.concernType === "minor" ? (
              <Button
                type="button"
                className="w-full"
                loading={isSubmitting}
                disabled={!canContinueToDealBuilder}
                onClick={handleContinueToDealBuilder}
              >
                Continue to Deal Builder
              </Button>
            ) : null}

            {data.concernType === "major" && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={!canReviewMajor}
                onClick={handleReviewWithManager}
              >
                Review With Sales Manager
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {scenario === "wrong" && (
        <Card className="border-danger/30">
          <CardHeader>
            <Badge variant="danger">Wrong Vehicle</Badge>
            <CardTitle className="text-base">
              Customer is not convinced by this vehicle
            </CardTitle>
            <CardDescription>
              Do not continue to presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wasnt-right">What wasn&apos;t right?</Label>
              <Textarea
                id="wasnt-right"
                rows={3}
                value={data.whatWasntRight}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    whatWasntRight: e.target.value,
                  }))
                }
                placeholder="Describe what did not work for the customer..."
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Common reasons</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {wrongVehicleReasonOptions.map((option) => {
                  const id = `reason-${option.key}`;
                  const checked = data.wrongVehicleReasons.includes(option.key);

                  return (
                    <div
                      key={option.key}
                      className={cn(
                        "flex items-center gap-3 rounded-[16px] border bg-background px-4 py-3",
                        checked && "border-primary/30 bg-primary/5",
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(value) =>
                          setData((current) => ({
                            ...current,
                            wrongVehicleReasons:
                              toggleMultiSelect<WrongVehicleReasonKey>(
                                current.wrongVehicleReasons,
                                option.key,
                                value === true,
                              ),
                          }))
                        }
                      />
                      <Label
                        htmlFor={id}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                onClick={handleFindAlternative}
              >
                Find Alternative Vehicle
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleEndDeal}
              >
                End Deal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
