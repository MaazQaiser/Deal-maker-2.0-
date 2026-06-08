import { Mail } from "lucide-react";
import { authConfig } from "@/constants/auth";
import { cn } from "@/lib/cn";

type AuthSupportLinkProps = {
  className?: string;
};

export function AuthSupportLink({ className }: AuthSupportLinkProps) {
  return (
    <p className={cn("text-center text-caption", className)}>
      Need help?{" "}
      <a
        href={`mailto:${authConfig.supportEmail}`}
        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
      >
        <Mail className="size-3.5" aria-hidden="true" />
        {authConfig.supportLabel}
      </a>
    </p>
  );
}
