import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="size-6 text-danger" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-heading-4">{title}</h3>
        <p className="text-body text-muted-foreground max-w-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
