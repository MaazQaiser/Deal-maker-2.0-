import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type SuccessStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function SuccessState({
  title = "Success",
  description = "Your action was completed successfully.",
  actionLabel,
  onAction,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-heading-4">{title}</h3>
        <p className="text-body text-muted-foreground max-w-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
