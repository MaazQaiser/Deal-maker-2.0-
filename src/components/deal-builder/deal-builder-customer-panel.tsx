"use client";

import { User } from "lucide-react";
import { formatGbp } from "@/lib/formatGbp";
import {
  getBuyingMotiveLabel,
  getImportantFeatureLabel,
} from "@/lib/test-drive-display";
import type { TestDriveNotes } from "@/types/test-drive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/data-display/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

const nestedPanelClass = "rounded-[24px] bg-muted/50 p-4";

type DealBuilderCustomerPanelProps = {
  dealId: string;
  customerName: string;
  customerInitials: string;
  mobile: string;
  email?: string;
  maximumDeposit: number | null | undefined;
  customerBudget: number | null | undefined;
  testDriveNotes?: TestDriveNotes;
  notes: string;
  onNotesChange?: (value: string) => void;
  readOnly?: boolean;
};

function NoteBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value.trim()) return null;

  return (
    <div className="space-y-1">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export function DealBuilderCustomerPanel({
  dealId,
  customerName,
  customerInitials,
  mobile,
  email,
  maximumDeposit,
  customerBudget,
  testDriveNotes,
  notes,
  onNotesChange,
  readOnly = false,
}: DealBuilderCustomerPanelProps) {
  const hasTestDriveNotes =
    testDriveNotes &&
    (testDriveNotes.buyingMotives.length > 0 ||
      testDriveNotes.importantFeatures.length > 0 ||
      testDriveNotes.likesCurrentVehicle.trim() ||
      testDriveNotes.dislikesCurrentVehicle.trim() ||
      testDriveNotes.freeNotes.trim());

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-base font-semibold">
          <User className="size-5 text-primary" />
          Customer
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">
            {customerInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{customerName}</p>
            <p className="text-sm text-muted-foreground">{mobile}</p>
            {email ? (
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            nestedPanelClass,
            "border border-primary/20 bg-primary/5",
          )}
        >
          <p className="mb-4 text-sm font-semibold">Budget Information</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-caption text-muted-foreground">
                Maximum Deposit
              </p>
              <p className="text-heading-4">
                {maximumDeposit != null ? formatGbp(maximumDeposit) : "—"}
              </p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">
                Maximum Monthly Budget
              </p>
              <p className="text-heading-4">
                {customerBudget != null ? formatGbp(customerBudget) : "—"}
              </p>
            </div>
          </div>
        </div>

        {hasTestDriveNotes ? (
          <div className={nestedPanelClass}>
            <p className="mb-4 text-sm font-semibold">Test Drive Notes</p>
            <div className="space-y-4">
              {testDriveNotes.buyingMotives.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">
                    Why changing vehicle
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {testDriveNotes.buyingMotives.map((motive) => (
                      <Badge key={motive} variant="neutral">
                        {getBuyingMotiveLabel(motive)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <NoteBlock
                label="Likes about current vehicle"
                value={testDriveNotes.likesCurrentVehicle}
              />
              <NoteBlock
                label="Dislikes about current vehicle"
                value={testDriveNotes.dislikesCurrentVehicle}
              />

              {testDriveNotes.importantFeatures.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">
                    Important features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {testDriveNotes.importantFeatures.map((feature) => (
                      <Badge key={feature} variant="neutral">
                        {getImportantFeatureLabel(feature)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <NoteBlock
                label="Test drive notes"
                value={testDriveNotes.freeNotes}
              />
            </div>
          </div>
        ) : null}

        {notes.trim() || !readOnly ? (
          <div className={nestedPanelClass}>
            <div className="space-y-2">
              <Label
                htmlFor={readOnly ? undefined : `deal-notes-${dealId}`}
                className="text-caption text-muted-foreground"
              >
                Deal notes
              </Label>
              {readOnly ? (
                <p className="text-sm">
                  {notes.trim() || "No notes recorded."}
                </p>
              ) : (
                <Textarea
                  id={`deal-notes-${dealId}`}
                  value={notes}
                  onChange={(e) => onNotesChange?.(e.target.value)}
                  placeholder="Preferences, objections, or negotiation context..."
                  className="min-h-[72px] resize-y"
                />
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
