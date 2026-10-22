"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

// Three.js грузится отдельным чанком после первого экрана; до этого и без WebGL виден постер.
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

export function HeroVisual() {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Сцена стартует по первому действию человека и только на достаточно мощных устройствах:
  // первый экран и LCP не ждут three.js, а слабые телефоны и режим экономии остаются с постером.
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const weak =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      nav.connection?.saveData === true ||
      (nav.deviceMemory ?? 8) < 4 ||
      (nav.hardwareConcurrency ?? 8) < 4;
    if (weak) return;
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
    const enable = () => {
      setEnabled(true);
      events.forEach((e) => window.removeEventListener(e, enable));
    };
    events.forEach((e) => window.addEventListener(e, enable, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, enable));
  }, []);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className={`absolute top-1/2 left-1/2 aspect-square w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-1000 lg:left-[68%] ${ready ? "opacity-0" : "opacity-100"}`}
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgb(91 140 255 / 0.35), transparent 55%), radial-gradient(circle at 70% 60%, rgb(245 180 0 / 0.22), transparent 50%), radial-gradient(circle at 40% 75%, rgb(34 197 139 / 0.25), transparent 50%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 lg:left-[30%] ${ready ? "opacity-100" : "opacity-0"}`}
        >
          {enabled ? <HeroScene onReady={onReady} paused={paused} /> : null}
        </div>
        {/* Затемнение под текстом, чтобы заголовок читался поверх сцены */}
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/70 to-transparent max-lg:bg-linear-to-b max-lg:via-bg/50" />
      </div>
      <button
        type="button"
        onClick={() => {
          const next = !paused;
          setPaused(next);
          window.dispatchEvent(new CustomEvent("hero-pause", { detail: next }));
        }}
        aria-pressed={paused}
        aria-label="Пауза анимаций первого экрана"
        className="absolute top-24 right-4 z-10 rounded-full border border-white/15 bg-bg/60 p-2 text-white/70 backdrop-blur hover:text-white sm:right-6 md:top-auto md:bottom-36"
      >
        {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
      </button>
    </>
  );
}
