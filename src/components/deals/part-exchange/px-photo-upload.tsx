"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PxPhotoUploadProps = {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PxPhotoUpload({ value, onChange, className }: PxPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const dataUrls = await Promise.all(
      Array.from(files).map((file) => readFileAsDataUrl(file)),
    );
    onChange([...value, ...dataUrls]);
  };

  const removePhoto = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50"
      >
        <Camera className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">
          Tap to add photos (recommended for any visible damage)
        </span>
      </button>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((photo, index) => (
            <div
              key={`${photo.slice(0, 32)}-${index}`}
              className="group relative overflow-hidden rounded-[12px] border border-border bg-muted/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`Part exchange photo ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute right-2 top-2 size-7 p-0 opacity-90"
                onClick={() => removePhoto(index)}
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
