"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { dealCreationSteps } from "@/constants/deal-creation-steps";
import {
  buyingMotiveOptions,
  importantFeatureOptions,
} from "@/constants/test-drive-options";
import { routes } from "@/constants/routes";
import { getSalesManagerNotes } from "@/lib/test-drive-utils";
import { useDealStore } from "@/store/dealStore";
import type {
  BuyingMotiveKey,
  ImportantFeatureKey,
  TestDriveNotes,
} from "@/types/test-drive";
import { emptyTestDriveNotes } from "@/types/test-drive";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

export function TestDriveNotesScreen() {
  const router = useRouter();
  const creationDraft = useDealStore((s) => s.creationDraft);
  const savedNotes = useDealStore((s) => s.creationTestDriveNotes);
  const saveCreationTestDriveNotes = useDealStore(
    (s) => s.saveCreationTestDriveNotes,
  );

  const [notes, setNotes] = useState<TestDriveNotes>(
    savedNotes ?? emptyTestDriveNotes,
  );

  useEffect(() => {
    if (!creationDraft) {
      router.replace(routes.deals.new.index);
    }
  }, [creationDraft, router]);

  useEffect(() => {
    saveCreationTestDriveNotes(notes);
  }, [notes, saveCreationTestDriveNotes]);

  if (!creationDraft) {
    return null;
  }

  const stepMeta = dealCreationSteps[2];
  const managerNotes = getSalesManagerNotes(creationDraft);

  const handleContinue = () => {
    router.push(routes.deals.new.step4);
  };

  return (
    <PageContainer size="md" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title="Test Drive Notes"
        titleClassName="text-page-title"
        description={stepMeta.subtitle}
        footer={<DealCreationStepper currentStep={3} />}
        actions={
          <>
            <Button type="button" variant="outline" asChild>
              <Link href={routes.deals.new.step2}>Back</Link>
            </Button>
            <Button type="button" onClick={handleContinue}>
              Complete Test Drive
            </Button>
          </>
        }
      />

      <VehicleSummaryCard />

      <Card>
        <CardHeader>
          <CardTitle>Buying motives</CardTitle>
          <CardDescription>Why is the customer changing vehicle?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {buyingMotiveOptions.map((option) => {
              const id = `motive-${option.key}`;
              const checked = notes.buyingMotives.includes(option.key);

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
                      setNotes((current) => ({
                        ...current,
                        buyingMotives: toggleMultiSelect<BuyingMotiveKey>(
                          current.buyingMotives,
                          option.key,
                          value === true,
                        ),
                      }))
                    }
                  />
                  <Label htmlFor={id} className="flex-1 cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current vehicle feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="likes-current">
              What does the customer like about their current vehicle?
            </Label>
            <Textarea
              id="likes-current"
              rows={3}
              value={notes.likesCurrentVehicle}
              onChange={(e) =>
                setNotes((current) => ({
                  ...current,
                  likesCurrentVehicle: e.target.value,
                }))
              }
              placeholder="Comfortable seats, good boot space..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dislikes-current">
              What does the customer dislike about their current vehicle?
            </Label>
            <Textarea
              id="dislikes-current"
              rows={3}
              value={notes.dislikesCurrentVehicle}
              onChange={(e) =>
                setNotes((current) => ({
                  ...current,
                  dislikesCurrentVehicle: e.target.value,
                }))
              }
              placeholder="High running costs, outdated tech..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important features</CardTitle>
          <CardDescription>What matters most to the customer?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {importantFeatureOptions.map((option) => {
              const id = `feature-${option.key}`;
              const checked = notes.importantFeatures.includes(option.key);

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
                      setNotes((current) => ({
                        ...current,
                        importantFeatures: toggleMultiSelect<ImportantFeatureKey>(
                          current.importantFeatures,
                          option.key,
                          value === true,
                        ),
                      }))
                    }
                  />
                  <Label htmlFor={id} className="flex-1 cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test drive notes</CardTitle>
          <CardDescription>Free notes from the test drive</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={notes.freeNotes}
            onChange={(e) =>
              setNotes((current) => ({
                ...current,
                freeNotes: e.target.value,
              }))
            }
            placeholder="Customer loves the drive quality. Partner prefers white vehicles. Concerned about servicing costs."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales manager notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {managerNotes.length > 0 ? (
            managerNotes.map((note) => (
              <div key={note} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-success" />
                <span>{note}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No manager notes available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
