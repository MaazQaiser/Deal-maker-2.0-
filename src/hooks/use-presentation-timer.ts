"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FinanceOption } from "@/lib/deal-builder/finance";

export type PresentationTimerScreen = FinanceOption | "idle";

export type PresentationTimerState = {
  zeroSeconds: number;
  hpSeconds: number;
  pcpSeconds: number;
  totalSeconds: number;
};

function formatTimerSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function usePresentationTimer(activeScreen: PresentationTimerScreen) {
  const [timers, setTimers] = useState<PresentationTimerState>({
    zeroSeconds: 0,
    hpSeconds: 0,
    pcpSeconds: 0,
    totalSeconds: 0,
  });
  const activeScreenRef = useRef(activeScreen);
  activeScreenRef.current = activeScreen;

  useEffect(() => {
    if (activeScreen === "idle") return;

    const interval = window.setInterval(() => {
      setTimers((current) => {
        const next = { ...current, totalSeconds: current.totalSeconds + 1 };
        if (activeScreenRef.current === "zero") {
          next.zeroSeconds += 1;
        } else if (activeScreenRef.current === "hp") {
          next.hpSeconds += 1;
        } else if (activeScreenRef.current === "pcp") {
          next.pcpSeconds += 1;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeScreen]);

  const formattedTotal = formatTimerSeconds(timers.totalSeconds);

  const reset = useCallback(() => {
    setTimers({
      zeroSeconds: 0,
      hpSeconds: 0,
      pcpSeconds: 0,
      totalSeconds: 0,
    });
  }, []);

  return { timers, formattedTotal, reset };
}
