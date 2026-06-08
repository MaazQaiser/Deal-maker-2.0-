"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { FormField } from "@/components/forms/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/feedback/alert";
import { SuccessState } from "@/components/feedback/success-state";
import { ArrowLeft } from "lucide-react";

type ResetPasswordFormProps = {
  token?: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (_data: ResetPasswordFormValues) => {
    setServerError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (token === "invalid") {
        throw new Error("This reset link has expired. Please request a new one.");
      }

      setIsSuccess(true);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-heading-1">Invalid reset link</h1>
        <p className="text-body text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Button asChild>
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <SuccessState
        title="Password updated"
        description="Your password has been reset successfully. You can now sign in with your new password."
        actionLabel="Go to login"
        onAction={() => router.push("/login")}
        className="py-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>
        <h1 className="text-heading-1">Reset password</h1>
        <p className="text-body text-muted-foreground">
          Enter your new password below. Must be at least 8 characters.
        </p>
      </div>

      {serverError && (
        <Alert variant="danger" title="Reset failed" onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="New password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <PasswordInput
            id="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <PasswordStrengthIndicator password={password} />

        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          Reset password
        </Button>
      </form>
    </div>
  );
}
