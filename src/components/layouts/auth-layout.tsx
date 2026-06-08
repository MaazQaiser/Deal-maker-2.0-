import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthSupportLink } from "@/components/auth/auth-support-link";
import { authConfig } from "@/constants/auth";
import { cn } from "@/lib/cn";

type AuthLayoutProps = {
  children: React.ReactNode;
  showSupport?: boolean;
  className?: string;
};

export function AuthLayout({
  children,
  showSupport = true,
  className,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — desktop only */}
      <AuthBrandPanel className="hidden w-1/2 lg:flex" />

      {/* Right form panel */}
      <div
        className={cn(
          "flex w-full flex-col justify-center bg-background lg:w-1/2",
          className
        )}
      >
        {/* Mobile brand header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            DB
          </div>
          <span className="text-sm font-semibold">{authConfig.productName}</span>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-12 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-md">{children}</div>
          {showSupport && <AuthSupportLink className="mt-8" />}
        </div>
      </div>
    </div>
  );
}
