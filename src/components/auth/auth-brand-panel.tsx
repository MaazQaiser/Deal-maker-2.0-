import { Layers } from "lucide-react";
import { authConfig } from "@/constants/auth";
import { cn } from "@/lib/cn";

type AuthBrandPanelProps = {
  className?: string;
};

export function AuthBrandPanel({ className }: AuthBrandPanelProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground lg:p-12",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
            <Layers className="size-6" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            {authConfig.productName}
          </span>
        </div>

        <div className="mt-12 max-w-md space-y-4">
          <h1 className="text-display-l text-primary-foreground">
            Build better deals, faster.
          </h1>
          <p className="text-body-lg text-primary-foreground/80">
            {authConfig.productDescription}
          </p>
        </div>
      </div>

      {/* Illustration placeholder */}
      <div
        className="relative z-10 mt-8 hidden lg:block"
        aria-hidden="true"
      >
        <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-8 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-primary-foreground/10"
              />
            ))}
          </div>
          <div className="mt-4 h-3 w-2/3 rounded-full bg-primary-foreground/15" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-primary-foreground/10" />
        </div>
      </div>

      {/* Decorative background elements */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary-foreground/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-primary-foreground/5"
        aria-hidden="true"
      />
    </div>
  );
}
