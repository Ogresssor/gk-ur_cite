"use client";

import type { ComponentProps } from "react";

// Карточка с мягкой подсветкой под курсором: двигаем только CSS-переменные.
export function SpotlightCard({ className = "", onPointerMove, ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        onPointerMove?.(e);
      }}
    />
  );
}
