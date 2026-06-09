"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { routes } from "@/constants/routes";
import { dealCreationSteps } from "@/constants/deal-creation-steps";
import {
  emptyProcessChecklist,
  getIncompleteChecklistCount,
  isProcessChecklistComplete,
  processChecklistGroups,
} from "@/constants/process-checklist";
import { useDealStore } from "@/store/dealStore";
import type { ProcessChecklist, ProcessChecklistKey } from "@/types/process-checklist";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { DealCreationStepper } from "@/components/deals/deal-creation-stepper";
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
import { cn } from "@/lib/cn";

const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

export function DealCreationStep2Screen() {
  const router = useRouter();
  const creationDraft = useDealStore((s) => s.creationDraft);
  const savedChecklist = useDealStore((s) => s.creationChecklist);
  const saveCreationChecklist = useDealStore((s) => s.saveCreationChecklist);

  const [checklist, setChecklist] = useState<ProcessChecklist>(
    savedChecklist ?? emptyProcessChecklist,
  );

  const hasPartExchange = Boolean(creationDraft?.hasPartExchange);

  useEffect(() => {
    if (!creationDraft) {
      router.replace(routes.deals.new.index);
    }
  }, [creationDraft, router]);

  useEffect(() => {
    saveCreationChecklist(checklist);
  }, [checklist, saveCreationChecklist]);

  const isComplete = useMemo(
    () => isProcessChecklistComplete(checklist, hasPartExchange),
    [checklist, hasPartExchange],
  );

  const incompleteCount = useMemo(
    () => getIncompleteChecklistCount(checklist, hasPartExchange),
    [checklist, hasPartExchange],
  );

  const toggleItem = (key: ProcessChecklistKey, checked: boolean) => {
    setChecklist((current) => ({ ...current, [key]: checked }));
  };

  const handleContinue = () => {
    router.push(routes.deals.new.step3);
  };

  if (!creationDraft) {
    return null;
  }

  const stepMeta = dealCreationSteps[1];

  return (
    <PageContainer size="md" className="space-y-6 py-6 sm:space-y-8">
      <PageHeader
        title="Create New Deal"
        titleClassName="text-page-title"
        description={stepMeta.subtitle}
        footer={<DealCreationStepper currentStep={2} />}
        actions={
          <>
            <Button type="button" variant="outline" asChild>
              <Link href={routes.deals.new.index}>Back</Link>
            </Button>
            <Button
              type="button"
              disabled={!isComplete}
              onClick={handleContinue}
            >
              Continue to Test Drive
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Process Checklist</CardTitle>
          <CardDescription>
            Complete every item before continuing to the test drive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isComplete && (
            <p className="text-sm text-muted-foreground">
              {incompleteCount} item{incompleteCount === 1 ? "" : "s"} remaining
            </p>
          )}

          {processChecklistGroups.map((group) => (
            <div key={group.id} className={dealNestedPanelClass}>
              <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item) => {
                  if (
                    item.requiredWhenPartExchange &&
                    !hasPartExchange
                  ) {
                    return null;
                  }

                  const id = `checklist-${item.key}`;
                  const checked = checklist[item.key];

                  return (
                    <div
                      key={item.key}
                      className={cn(
                        "flex items-center gap-3 rounded-[16px] border bg-background px-4 py-3 transition-colors",
                        checked && "border-primary/30 bg-primary/5",
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleItem(item.key, value === true)
                        }
                      />
                      <Label
                        htmlFor={id}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {item.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasPartExchange ? null : (
            <p className="text-caption text-muted-foreground">
              PX Keys Received is not required when no part exchange is on the deal.
            </p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
