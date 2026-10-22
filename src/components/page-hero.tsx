import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

// Шапка внутренней страницы: хлебные крошки, крупный заголовок, свечение.
export function PageHero({
  crumbs,
  title,
  lead,
  color = "var(--b24)",
  children,
}: {
  crumbs: { href?: string; label: string }[];
  title: string;
  lead?: string;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: color }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Хлебные крошки" className="font-mono text-xs text-muted">
          <ol className="flex flex-wrap gap-2">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex gap-2">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href ? (
                  <Link href={c.href} className="hover:text-fg">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-fg/85">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="rise mt-8 max-w-5xl text-5xl leading-[1.02] font-semibold tracking-tight text-balance hyphens-auto sm:text-7xl lg:text-8xl">{title}</h1>
        {lead ? (
          <p className="rise mt-6 max-w-2xl text-lg text-muted [animation-delay:80ms] sm:text-xl">{lead}</p>
        ) : null}
        {children ? <Reveal delay={0.2}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
