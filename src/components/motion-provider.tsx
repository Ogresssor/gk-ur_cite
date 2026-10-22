"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

// При «Уменьшить движение» Motion отключает сдвиги и масштаб, оставляя только прозрачность.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
