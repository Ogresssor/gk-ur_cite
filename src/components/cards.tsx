import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import type { Case, Review } from "@/content/proof";
import { directionMeta, type Service } from "@/content/services";
import { Photo } from "./photo";
import { SpotlightCard } from "./spotlight-card";

export function DirectionTags({ directions }: { directions: Case["directions"] }) {
  return (
    <span className="flex flex-wrap gap-2">
      {directions.map((d) => (
        <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[11px] text-fg backdrop-blur">
          <span className={`size-1.5 rounded-full ${directionMeta[d].bg}`} aria-hidden="true" />
          {directionMeta[d].label}
        </span>
      ))}
    </span>
  );
}

export function CaseCard({ item, priority }: { item: Case; priority?: boolean }) {
  return (
    <Link href={`/kejsy/${item.id}`} className="group block overflow-hidden rounded-3xl border border-line bg-card transition-colors hover:border-white/25">
      <div className="relative">
        <Photo {...item.cover} sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} className="aspect-[16/10]" />
        <div className="absolute inset-x-0 top-0 flex justify-between p-4">
          <DirectionTags directions={item.directions} />
          <span className="grid size-10 place-items-center rounded-full bg-black/40 backdrop-blur transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="font-mono text-xs text-muted">
          {item.client} · {item.duration}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{item.title}</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
          {item.metrics.map((m) => (
            <p key={m.label}>
              <span className="block text-3xl font-semibold tracking-tight tabular-nums">{m.value}</span>
              <span className="block text-sm text-muted">{m.label}</span>
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ServiceCard({ s, large }: { s: Service; large?: boolean }) {
  const meta = directionMeta[s.direction];
  return (
    <SpotlightCard className={`group h-full overflow-hidden rounded-3xl border border-line bg-card transition-colors hover:border-white/25 ${large ? "lg:row-span-2" : ""}`}>
      <Link href={`/uslugi/${s.slug}`} className="flex h-full flex-col">
        <Photo {...s.cover} sizes="(min-width: 1024px) 40vw, 100vw" className={large ? "aspect-[4/3] lg:aspect-auto lg:min-h-[340px] lg:flex-1" : "aspect-[16/9]"} />
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className={`font-mono text-xs ${meta.ink}`}>{meta.label}</span>
            <ArrowUpRight className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">{s.title}</h3>
          <p className="mt-2 text-muted">{s.short}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {s.items.slice(0, large ? 6 : 3).map((i) => (
              <li key={i.title} className="rounded-full border border-line px-3 py-1 text-xs text-fg/80">
                {i.title}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-6 font-mono text-sm">
            <span className="text-muted">стоимость </span>
            {s.priceFrom}
          </p>
        </div>
      </Link>
    </SpotlightCard>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="glass flex w-[min(86vw,420px)] shrink-0 flex-col rounded-3xl p-7">
      <Quote className={`size-6 ${directionMeta[r.direction].ink}`} aria-hidden="true" />
      <blockquote className="mt-5 text-lg leading-relaxed">{r.text}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        <span className="grid size-10 place-items-center rounded-full bg-white/10 font-semibold" aria-hidden="true">
          {r.name[0]}
        </span>
        <span>
          <span className="block font-semibold">{r.name}</span>
          <span className="block text-sm text-muted">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
