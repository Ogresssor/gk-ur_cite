"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { Logo } from "./logo";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <a
        href="#main"
        className="sr-only rounded-md bg-onec px-4 py-2 font-semibold text-graphite focus:not-sr-only focus:absolute focus:top-0 focus:left-4"
      >
        Перейти к содержанию
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-graphite/75 px-4 text-white shadow-[0_8px_30px_rgb(0_0_0/0.25)] backdrop-blur-xl sm:px-5">
        <Logo />
        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="flex gap-1 text-sm text-white/80">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.phoneHref} className="hidden items-center gap-2 font-mono text-sm text-white/90 hover:text-white md:flex">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
          <Link
            href="/#calculator"
            className="hidden rounded-lg bg-onec px-4 py-2 text-sm font-semibold text-graphite transition-transform hover:-translate-y-0.5 sm:block"
          >
            Рассчитать
          </Link>
          <button
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
        <nav
          id="mobile-menu"
          aria-label="Мобильное меню"
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-graphite/95 p-3 text-white backdrop-blur-xl lg:hidden"
        >
          <ul className="grid">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-lg hover:bg-white/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 font-mono text-white/90">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
