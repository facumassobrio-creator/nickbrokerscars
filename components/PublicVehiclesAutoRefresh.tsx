"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_REFRESH_INTERVAL_MS = 20_000;
const DEFAULT_MIN_REFRESH_GAP_MS = 5_000;

interface PublicVehiclesAutoRefreshProps {
  intervalMs?: number;
  refreshOnFocus?: boolean;
  refreshOnVisibility?: boolean;
  minRefreshGapMs?: number;
}

export function PublicVehiclesAutoRefresh({
  intervalMs = DEFAULT_REFRESH_INTERVAL_MS,
  refreshOnFocus = true,
  refreshOnVisibility = true,
  minRefreshGapMs = DEFAULT_MIN_REFRESH_GAP_MS,
}: PublicVehiclesAutoRefreshProps) {
  const router = useRouter();
  const lastRefreshAtRef = useRef<number>(0);

  useEffect(() => {
    const refresh = () => {
      const now = Date.now();
      if (now - lastRefreshAtRef.current < minRefreshGapMs) {
        return;
      }

      lastRefreshAtRef.current = now;
      router.refresh();
    };

    const onVisibilityChange = () => {
      if (refreshOnVisibility && document.visibilityState === "visible") {
        refresh();
      }
    };

    const onWindowFocus = () => {
      if (refreshOnFocus && document.visibilityState === "visible") {
        refresh();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, intervalMs);

    if (refreshOnVisibility) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    if (refreshOnFocus) {
      window.addEventListener("focus", onWindowFocus);
    }

    return () => {
      window.clearInterval(intervalId);
      if (refreshOnVisibility) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (refreshOnFocus) {
        window.removeEventListener("focus", onWindowFocus);
      }
    };
  }, [intervalMs, minRefreshGapMs, refreshOnFocus, refreshOnVisibility, router]);

  return null;
}
