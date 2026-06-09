"use client";

import {
  getBuyingMotiveLabel,
  getImportantFeatureLabel,
} from "@/lib/test-drive-display";
import type { TestDriveNotes } from "@/types/test-drive";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { Badge } from "@/components/ui/badge";

type DealDetailTestDriveSectionProps = {
  testDriveNotes?: TestDriveNotes;
};

function NoteBlock({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;

  return (
    <div className="space-y-1">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export function DealDetailTestDriveSection({
  testDriveNotes,
}: DealDetailTestDriveSectionProps) {
  if (!testDriveNotes) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Test Drive Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Test drive notes not yet recorded for this deal.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasContent =
    testDriveNotes.buyingMotives.length > 0 ||
    testDriveNotes.importantFeatures.length > 0 ||
    testDriveNotes.likesCurrentVehicle.trim() ||
    testDriveNotes.dislikesCurrentVehicle.trim() ||
    testDriveNotes.freeNotes.trim();

  if (!hasContent) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Test Drive Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Test drive notes not yet recorded for this deal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Test Drive Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <NoteBlock label="Test drive notes" value={testDriveNotes.freeNotes} />
      </CardContent>
    </Card>
  );
}
