"use client";

import { pxValueDrivers } from "@/constants/part-exchange-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type PxValueDriversGridProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function PxValueDriversGrid({ value, onChange }: PxValueDriversGridProps) {
  const toggle = (driverValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, driverValue]);
      return;
    }
    onChange(value.filter((item) => item !== driverValue));
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pxValueDrivers.map((driver) => {
        const checked = value.includes(driver.value);
        const inputId = `px-driver-${driver.value}`;

        return (
          <label
            key={driver.value}
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-[16px] border bg-background px-4 py-3 transition-colors",
              checked
                ? "border-primary/40 bg-primary/5"
                : "border-border hover:bg-muted/40",
            )}
          >
            <Checkbox
              id={inputId}
              checked={checked}
              onCheckedChange={(next) =>
                toggle(driver.value, next === true)
              }
            />
            <span className="text-sm font-medium">{driver.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function PxValueDriversGridLegend() {
  return (
    <Label className="text-sm font-medium text-muted-foreground">
      Tick everything the car has — value drivers
    </Label>
  );
}
