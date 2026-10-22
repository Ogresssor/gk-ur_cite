"use client";

import { useState } from "react";
import { cases } from "@/content/proof";
import { directionMeta, type Direction } from "@/content/services";

const filters: { id: Direction | "all"; label: string }[] = [
  { id: "all", label: "Все проекты" },
  { id: "b24", label: "Битрикс24" },
  { id: "onec", label: "1С" },
  { id: "low", label: "Слаботочка" },
];

export function Cases() {
  const [filter, setFilter] = useState<Direction | "all">("all");
  const shown = filter === "all" ? cases : cases.filter((c) => c.directions.includes(filter));

  return (
    <div>
      <div role="group" aria-label="Фильтр кейсов" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm transition-colors hover:border-steel aria-pressed:border-graphite aria-pressed:bg-graphite aria-pressed:text-white"
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {shown.map((c) => (
          <li key={c.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {c.directions.map((d) => (
                <span key={d} className={`inline-flex items-center gap-1.5 font-mono text-xs ${directionMeta[d].ink}`}>
                  <span className={`size-1.5 rounded-full ${directionMeta[d].bg}`} aria-hidden="true" />
                  {directionMeta[d].label}
                </span>
              ))}
              <span className="ml-auto font-mono text-xs text-steel">{c.duration}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{c.client}</h3>
            <p className="text-sm text-steel">{c.industry}</p>
            <dl className="mt-5 mb-6 grid gap-3 text-[15px]">
              <div>
                <dt className="font-medium">Было</dt>
                <dd className="text-steel">{c.task}</dd>
              </div>
              <div>
                <dt className="font-medium">Сделали</dt>
                <dd className="text-steel">{c.solution}</dd>
              </div>
            </dl>
            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5">
              {c.metrics.map((m) => (
                <p key={m.label}>
                  <span className="block text-2xl font-semibold tracking-tight tabular-nums">{m.value}</span>
                  <span className="block text-sm text-steel">{m.label}</span>
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
