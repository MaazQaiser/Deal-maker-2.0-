"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type PxRegistrationPlateFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  error?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function PxRegistrationPlateField({
  id = "pxRegLookup",
  value,
  onChange,
  onLookup,
  error,
  onKeyDown,
}: PxRegistrationPlateFieldProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <div
        className={cn(
          "flex min-h-11 flex-1 items-stretch overflow-hidden rounded-md border-2 border-[#1a1a1a] bg-[#f5c518] shadow-sm",
          error && "border-danger ring-1 ring-danger/30",
        )}
      >
        <div className="flex w-10 shrink-0 items-center justify-center bg-[#003399] text-[10px] font-bold leading-tight text-white">
          UK
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          onKeyDown={onKeyDown}
          placeholder="XY22 ABC"
          className="min-w-0 flex-1 bg-transparent px-3 text-center font-mono text-lg font-bold uppercase tracking-[0.2em] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40"
          aria-invalid={error}
        />
      </div>
      <Button type="button" variant="outline" onClick={onLookup} className="shrink-0">
        Look up vehicle
      </Button>
    </div>
  );
}
