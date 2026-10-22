"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Step = { title: string; text: string; time?: string };

// Линия процесса «прорисовывается» скроллом, шаги загораются, когда линия до них дошла.
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
      });
      tl.fromTo(el.querySelector("[data-line]"), { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none" }, 0);
      el.querySelectorAll("[data-step]").forEach((step, i, all) => {
        // Только сдвиг: текст всегда полностью контрастный, даже до прокрутки
        tl.fromTo(step, { y: 28 }, { y: 0, ease: "power2.out", duration: 0.3 }, (i / all.length) * 0.9);
        tl.fromTo(step.querySelector("[data-dot]"), { scale: 0.6 }, { scale: 1, duration: 0.2 }, (i / all.length) * 0.9);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <ol ref={root} className="relative grid gap-8 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-6" style={{ ["--n" as string]: steps.length }}>
      <span className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:top-[11px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto" aria-hidden="true" />
      <span
        data-line
        className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-linear-to-b from-b24 via-onec to-low md:top-[11px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left md:bg-linear-to-r"
        aria-hidden="true"
      />
      {steps.map((s, i) => (
        <li key={s.title} data-step className="relative pl-10 md:pt-12 md:pl-0">
          <span data-dot className="absolute top-0 left-0 grid size-[23px] place-items-center rounded-full border border-white/20 bg-bg font-mono text-[10px]">
            {i + 1}
          </span>
          <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
          <p className="mt-2 text-muted">{s.text}</p>
          {s.time ? <p className="mt-3 font-mono text-xs text-b24">{s.time}</p> : null}
        </li>
      ))}
    </ol>
  );
}
