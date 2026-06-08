"use client";

import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appConfig } from "@/constants/navigation";
import { useShellLayout } from "@/hooks/useShellLayout";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarContent } from "@/components/layouts/sidebar-content";

export function MobileNavTrigger() {
  const { setMobileNavOpen } = useShellLayout();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="size-9 shrink-0 p-0"
      onClick={() => setMobileNavOpen(true)}
      aria-label="Open navigation menu"
    >
      <Menu className="size-5" />
    </Button>
  );
}

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useShellLayout();

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col",
              "border-r border-border bg-card shadow-xl md:hidden"
            )}
            aria-label="Mobile navigation"
          >
            <div className="flex h-[var(--topbar-height)] items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  DB
                </div>
                <span className="text-sm font-semibold">{appConfig.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            <Separator />

            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
