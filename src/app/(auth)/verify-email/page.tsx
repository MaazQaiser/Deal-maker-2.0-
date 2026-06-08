import type { Metadata } from "next";
import {
  VerifyEmailStatus,
  type VerifyEmailStatus as VerifyStatus,
} from "@/components/auth/verify-email-status";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for Deal Builder",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string; status?: string }>;
};

function parseStatus(status?: string): VerifyStatus | undefined {
  if (status === "success" || status === "failed" || status === "verifying") {
    return status;
  }
  return undefined;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token, status } = await searchParams;
  const initialStatus = parseStatus(status) ?? "verifying";

  return (
    <VerifyEmailStatus token={token} initialStatus={initialStatus} />
  );
}
