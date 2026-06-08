"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/feedback/alert";
import { SuccessState } from "@/components/feedback/success-state";
import { ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.email === "error@example.com") {
        throw new Error("Unable to send reset link. Please try again later.");
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (isSuccess) {
    return (
      <SuccessState
        title="Check your email"
        description={`We've sent a password reset link to ${submittedEmail}. Please check your inbox and follow the instructions.`}
        actionLabel="Back to login"
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
        <h1 className="text-heading-1">Forgot password?</h1>
        <p className="text-body text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {serverError && (
        <Alert variant="danger" title="Request failed" onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          Send reset link
        </Button>
      </form>
    </div>
  );
}
