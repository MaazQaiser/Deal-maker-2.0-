"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastWrapper } from "@/components/feedback/toast-wrapper";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={300}>
      {children}
      <ToastWrapper />
    </TooltipProvider>
  );
}
