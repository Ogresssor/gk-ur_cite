"use client";

import { type ReactNode, useState } from "react";

const filters = [
  { id: "all", label: "Все проекты" },
  { id: "b24", label: "Битрикс24" },
  { id: "onec", label: "1С" },
  { id: "low", label: "Слаботочка" },
] as const;

// Карточки рендерятся на сервере; фильтр только переключает атрибут, CSS прячет лишнее.
export function CaseFilter({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  return (
    <div data-filter={filter} className="case-filter">
      <div role="group" aria-label="Фильтр кейсов" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors hover:border-white/40 aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
