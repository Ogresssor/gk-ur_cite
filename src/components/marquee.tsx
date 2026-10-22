import type { ReactNode } from "react";
import { Pause } from "lucide-react";

// Бесконечная бегущая строка на CSS: контент дублируется, лента сдвигается на половину.
// Пауза — при наведении, фокусе внутри или переключателем (без JS).
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  label,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  label: string;
}) {
  return (
    <div className="marquee relative min-w-0 overflow-hidden" role="region" aria-label={label}>
      <label className="absolute top-1/2 right-3 z-10 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-bg/80 text-muted backdrop-blur hover:text-fg has-[:checked]:text-onec has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-b24">
        <input type="checkbox" className="marquee-pause sr-only" />
        <Pause className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Остановить прокрутку: {label}</span>
      </label>
      <div className="marquee-mask overflow-hidden">
        <div
          className="marquee-track flex w-max animate-marquee gap-4"
          style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
        >
          <div className="flex shrink-0 gap-4">{children}</div>
          <div className="flex shrink-0 gap-4" aria-hidden="true" inert>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
