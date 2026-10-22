"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Плавный скролл Lenis, синхронизированный с GSAP ScrollTrigger.
// При prefers-reduced-motion остаётся обычный скролл браузера.
// Остановить скролл (например, под открытым меню): window.dispatchEvent(new Event("lenis-stop")).
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ allowNestedScroll: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Якоря на той же странице: плавно к цели; отступ под шапку Lenis берёт из scroll-padding-top
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      // Фокус переносим сразу, как при обычном переходе по якорю (важно для «Перейти к содержанию»)
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      lenis.scrollTo(target, { onComplete: () => history.replaceState(null, "", `#${id}`) });
    };
    document.addEventListener("click", onClick);
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("lenis-stop", stop);
    window.addEventListener("lenis-start", start);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("lenis-stop", stop);
      window.removeEventListener("lenis-start", start);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
