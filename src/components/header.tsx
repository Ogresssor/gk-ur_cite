"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Cable, ChevronDown, Database, Menu, Phone, Workflow, X } from "lucide-react";
import { directionMeta, services } from "@/content/services";
import { nav, site } from "@/content/site";
import { Logo } from "./logo";

const icons = { b24: Workflow, onec: Database, low: Cable } as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLLIElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  // Шапка прячется при скролле вниз и возвращается при скролле вверх.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev && !open && !mega);
  });

  // При переходе на другую страницу закрываем меню (сброс состояния во время рендера).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    if (!open && !mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Возвращаем фокус на кнопку, которая открыла меню, а не теряем его на <body>
        if (mega) megaButtonRef.current?.focus();
        if (open) menuButtonRef.current?.focus();
        setOpen(false);
        setMega(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (mega && megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    // Lenis скроллит программно, поэтому кроме overflow останавливаем и его
    if (open) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new Event("lenis-stop"));
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      if (open) {
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("lenis-start"));
      }
    };
  }, [open, mega]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6"
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-onec px-4 py-2 font-semibold text-bg focus:not-sr-only focus:absolute focus:top-0 focus:left-4"
      >
        Перейти к содержанию
      </a>
      <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl bg-bg/60 px-4 sm:px-5">
        <Logo />
        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm text-fg/80">
            <li
              ref={megaRef}
              className="relative"
              onBlur={(e) => {
                // Фокус ушёл Tab'ом за пределы меню — закрываем
                if (mega && !e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(false);
              }}
            >
              <button
                ref={megaButtonRef}
                type="button"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onClick={() => setMega((v) => !v)}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-fg ${isActive("/uslugi") ? "text-fg" : ""}`}
              >
                Услуги
                <ChevronDown className={`size-4 transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {mega ? (
                <motion.div
                  id="mega-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass absolute top-full left-0 mt-3 w-[560px] rounded-2xl bg-bg/95 p-3"
                >
                  <ul className="grid gap-1">
                    {services.map((s) => {
                      const Icon = icons[s.direction];
                      return (
                        <li key={s.slug}>
                          <Link href={`/uslugi/${s.slug}`} className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-white/5">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5">
                              <Icon className={`size-5 ${directionMeta[s.direction].ink}`} aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block font-semibold text-fg">{s.title}</span>
                              <span className="block text-sm text-muted">{s.short}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href="/uslugi" className="mt-2 block rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-fg hover:bg-white/10">
                    Все услуги и цены
                  </Link>
                </motion.div>
              ) : null}
            </li>
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-fg aria-[current=page]:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.phoneHref} className="hidden items-center gap-2 font-mono text-sm text-fg/90 hover:text-fg xl:flex">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
          <Link
            href="/kalkulyator"
            className="hidden rounded-xl bg-onec px-4 py-2.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 sm:block"
          >
            Рассчитать цену
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <motion.nav
          id="mobile-menu"
          aria-label="Мобильное меню"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-7xl overflow-y-auto rounded-2xl bg-bg/95 p-3 lg:hidden"
        >
          <p className="px-4 pt-2 font-mono text-xs text-muted">Услуги</p>
          <ul className="grid">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/uslugi/${s.slug}`} className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg hover:bg-white/10">
                  <span className={`size-2 rounded-full ${directionMeta[s.direction].bg}`} aria-hidden="true" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-2 grid border-t border-line pt-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-4 py-3 text-lg hover:bg-white/10">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 font-mono text-fg/90">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
        </motion.nav>
      ) : null}
    </motion.header>
  );
}
