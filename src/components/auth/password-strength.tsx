"use client";

import { getPasswordStrength } from "@/lib/password-strength";
import { cn } from "@/lib/cn";

type PasswordStrengthIndicatorProps = {
  password: string;
  className?: string;
};

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, label, color, checks } = getPasswordStrength(password);

  return (
    <div className={cn("space-y-3", className)} aria-live="polite">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-caption">Password strength</span>
          <span className="text-caption font-medium">{label}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < score ? color : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <ul className="space-y-1">
        <RequirementItem met={checks.minLength} text="At least 8 characters" />
        <RequirementItem met={checks.hasUppercase} text="One uppercase letter" />
        <RequirementItem met={checks.hasLowercase} text="One lowercase letter" />
        <RequirementItem met={checks.hasNumber} text="One number" />
        <RequirementItem met={checks.hasSpecial} text="One special character" />
      </ul>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <li
      className={cn(
        "text-caption flex items-center gap-2",
        met ? "text-success" : "text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          met ? "bg-success" : "bg-muted-foreground/40"
        )}
        aria-hidden="true"
      />
      {text}
    </li>
  );
}
