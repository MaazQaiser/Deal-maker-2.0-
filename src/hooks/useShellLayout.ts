"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { breakpoints, useMediaQuery } from "@/hooks/useMediaQuery";

export function useShellLayout() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );
  const isDesktop = useMediaQuery(breakpoints.lg);

  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  useEffect(() => {
    if (isMobile) {
      setMobileNavOpen(false);
    }
  }, [isMobile, setMobileNavOpen]);

  useEffect(() => {
    if (isTablet) {
      setSidebarCollapsed(true);
    } else if (isDesktop) {
      setSidebarCollapsed(false);
    }
  }, [isTablet, isDesktop, setSidebarCollapsed]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileNavOpen,
    setMobileNavOpen,
    showSidebar: !isMobile,
    showMobileNav: isMobile,
  };
}
