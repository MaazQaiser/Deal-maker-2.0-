"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appConfig } from "@/constants/navigation";
import { useShellLayout } from "@/hooks/useShellLayout";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarContent } from "@/components/layouts/sidebar-content";

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, isTablet } = useShellLayout();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-card transition-all duration-300",
          sidebarCollapsed
            ? "w-[var(--sidebar-width-collapsed)]"
            : "w-[var(--sidebar-width)]"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center justify-between px-3">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  DB
                </div>
                <span className="truncate text-sm font-semibold">
                  {appConfig.name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            className={cn("size-8 shrink-0 p-0", sidebarCollapsed && "mx-auto")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        {isTablet && !sidebarCollapsed && (
          <div className="px-3 pb-2">
            <p className="text-caption text-muted-foreground">
              Tap the icon to collapse
            </p>
          </div>
        )}

        <Separator />

        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>
    </TooltipProvider>
  );
}
