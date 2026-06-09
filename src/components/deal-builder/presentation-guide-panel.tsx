"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { PRESENTATION_GUIDE_STEPS } from "@/constants/presentation-content";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PresentationGuidePanelProps = {
  customerName: string;
  vehicleTitle: string;
  presentationTimer: string;
  className?: string;
};

export function PresentationGuidePanel({
  customerName,
  vehicleTitle,
  presentationTimer,
  className,
}: PresentationGuidePanelProps) {
  const [guideStep, setGuideStep] = useState(0);
  const currentGuide = PRESENTATION_GUIDE_STEPS[guideStep];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Presentation Guide</CardTitle>
          <Badge variant="neutral" className="font-mono text-xs">
            <Clock className="mr-1 size-3" />
            {presentationTimer}
          </Badge>
        </div>
        <p className="text-caption text-muted-foreground">
          Step {guideStep + 1} of {PRESENTATION_GUIDE_STEPS.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[20px] bg-primary/5 p-5">
          <p className="text-sm font-semibold text-primary">
            {currentGuide.title}
          </p>
          {currentGuide.ask ? (
            <div className="mt-3">
              <p className="text-caption font-medium text-muted-foreground">
                Ask:
              </p>
              <p className="mt-1 text-base leading-relaxed">
                &ldquo;{currentGuide.ask}&rdquo;
              </p>
            </div>
          ) : null}
          {currentGuide.discuss ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {currentGuide.discuss}
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={guideStep === 0}
            onClick={() => setGuideStep((step) => Math.max(0, step - 1))}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={guideStep >= PRESENTATION_GUIDE_STEPS.length - 1}
            onClick={() =>
              setGuideStep((step) =>
                Math.min(PRESENTATION_GUIDE_STEPS.length - 1, step + 1),
              )
            }
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-caption text-muted-foreground">Presenting to</p>
          <p className="text-sm font-medium">{customerName}</p>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {vehicleTitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
