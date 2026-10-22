import type { ReactNode } from "react";

export function Section({
  id,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id={id ? `${id}-title` : undefined} className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
        {intro ? <p className="mt-4 max-w-2xl text-lg text-steel">{intro}</p> : null}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
