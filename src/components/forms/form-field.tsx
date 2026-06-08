"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p id={hintId} className="text-caption">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-caption text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
