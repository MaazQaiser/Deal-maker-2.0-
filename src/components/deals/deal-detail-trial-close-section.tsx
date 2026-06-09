"use client";

import { wrongVehicleReasonOptions } from "@/constants/test-drive-options";
import type { TrialCloseData } from "@/types/test-drive";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type DealDetailTrialCloseSectionProps = {
  trialClose?: TrialCloseData;
  highlight?: boolean;
};

function getWrongVehicleReasonLabel(key: string): string {
  return (
    wrongVehicleReasonOptions.find((option) => option.key === key)?.label ?? key
  );
}

export function DealDetailTrialCloseSection({
  trialClose,
  highlight = false,
}: DealDetailTrialCloseSectionProps) {
  if (!trialClose || trialClose.rating == null) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Trial Close</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Trial close not yet recorded for this deal.
          </p>
        </CardContent>
      </Card>
    );
  }

  const rating = trialClose.rating;
  const isStrong = rating >= 9;
  const isObjection = rating === 8;
  const isWrongVehicle = rating <= 7;

  return (
    <Card className={cn(highlight && "border-danger/30")}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Trial Close</CardTitle>
          <Badge
            variant={
              isStrong ? "success" : isObjection ? "warning" : "danger"
            }
          >
            {rating}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isStrong && trialClose.lovedMost.trim() ? (
          <div>
            <p className="text-caption text-muted-foreground">
              What they loved most
            </p>
            <p className="mt-1 text-sm">{trialClose.lovedMost}</p>
          </div>
        ) : null}

        {isObjection && trialClose.makeItTen.trim() ? (
          <div>
            <p className="text-caption text-muted-foreground">
              What would make it a 10?
            </p>
            <p className="mt-1 text-sm">{trialClose.makeItTen}</p>
            {trialClose.concernType ? (
              <Badge variant="warning" className="mt-2">
                {trialClose.concernType === "minor"
                  ? "Minor objection"
                  : "Major objection"}
              </Badge>
            ) : null}
          </div>
        ) : null}

        {isWrongVehicle ? (
          <>
            {trialClose.whatWasntRight.trim() ? (
              <div>
                <p className="text-caption text-muted-foreground">
                  What wasn&apos;t right
                </p>
                <p className="mt-1 text-sm">{trialClose.whatWasntRight}</p>
              </div>
            ) : null}
            {trialClose.wrongVehicleReasons.length > 0 ? (
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">Reasons</p>
                <div className="flex flex-wrap gap-2">
                  {trialClose.wrongVehicleReasons.map((reason) => (
                    <Badge key={reason} variant="danger">
                      {getWrongVehicleReasonLabel(reason)}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
