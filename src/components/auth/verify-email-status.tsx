"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { SuccessState } from "@/components/feedback/success-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";

export type VerifyEmailStatus = "verifying" | "success" | "failed";

type VerifyEmailStatusProps = {
  token?: string;
  initialStatus?: VerifyEmailStatus;
};

export function VerifyEmailStatus({
  token,
  initialStatus = "verifying",
}: VerifyEmailStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState<VerifyEmailStatus>(initialStatus);

  useEffect(() => {
    if (initialStatus !== "verifying") return;

    const timer = setTimeout(() => {
      if (!token || token === "invalid" || token === "expired") {
        setStatus("failed");
      } else {
        setStatus("success");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [token, initialStatus]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <LoadingSpinner size="lg" label="Verifying your email" />
        <div className="space-y-1">
          <h1 className="text-heading-2">Verifying your email</h1>
          <p className="text-body text-muted-foreground max-w-sm">
            Please wait while we confirm your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <SuccessState
        title="Email verified"
        description="Your email has been successfully verified. You can now access all features of your account."
        actionLabel="Continue to dashboard"
        onAction={() => router.push("/dashboard")}
        className="py-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <ErrorState
        title="Verification failed"
        description={
          !token
            ? "No verification token was provided. Please check your email for the correct link."
            : token === "expired"
              ? "This verification link has expired. Please request a new one."
              : "We couldn't verify your email address. The link may be invalid or already used."
        }
        onRetry={() => setStatus("verifying")}
        className="py-6"
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
        <Button asChild>
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    </div>
  );
}
