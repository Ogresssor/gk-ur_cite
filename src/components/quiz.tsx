"use client";

import { useEffect, useRef, useState } from "react";
import { Cable, Calculator, Check, Database, Workflow } from "lucide-react";
import { estimate, formatRub, formatWeeks, tierLabels, type Dir, type Tier } from "@/lib/estimate";
import { LeadForm } from "./lead-form";

const dirCards: { id: Dir; title: string; text: string; icon: typeof Cable; ring: string }[] = [
  { id: "b24", title: "Битрикс24", text: "CRM, телефония, автоматизация", icon: Workflow, ring: "has-[:checked]:border-b24 has-[:checked]:bg-b24/10" },
  { id: "onec", title: "1С", text: "Учёт, склад, зарплата, обмены", icon: Database, ring: "has-[:checked]:border-onec has-[:checked]:bg-onec/10" },
  { id: "low", title: "Слаботочка", text: "Камеры, СКУД, СКС, Wi-Fi", icon: Cable, ring: "has-[:checked]:border-low has-[:checked]:bg-low/10" },
];

const steps = ["Направления", "Масштаб", "Сроки", "Контакты"] as const;

export function Quiz() {
  const [step, setStep] = useState(0);
  const [directions, setDirections] = useState<Dir[]>([]);
  const [tiers, setTiers] = useState<Partial<Record<Dir, Tier>>>({});
  const [urgent, setUrgent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const result = estimate({ directions, tiers, urgent });
  const canNext = step === 0 ? directions.length > 0 : true;
  const quizJson = JSON.stringify({ directions, tiers, urgent });

  const toggle = (d: Dir) =>
    setDirections((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glass rounded-3xl p-5 sm:p-8">
        <ol className="mb-6 flex gap-2" aria-label="Шаги калькулятора">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <span className="block h-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full origin-left bg-linear-to-r from-b24 to-onec transition-transform duration-500"
                  style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
                />
              </span>
              <span className={`mt-2 block font-mono text-[11px] ${i === step ? "text-fg" : "text-muted"}`}>
                {s}
                {i === step ? <span className="sr-only"> — текущий шаг</span> : null}
              </span>
            </li>
          ))}
        </ol>

        <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl">
          {step === 0 && "Что нужно сделать?"}
          {step === 1 && "Оцените масштаб"}
          {step === 2 && "Когда нужно запуститься?"}
          {step === 3 && "Куда прислать расчёт?"}
        </h3>

        <div className="mt-6">
          {step === 0 ? (
            <fieldset>
              <legend className="mb-4 text-muted">Можно выбрать несколько — посчитаем и связку между системами.</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {dirCards.map(({ id, title, text, icon: Icon, ring }) => (
                  <label
                    key={id}
                    className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/30 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-b24 ${ring}`}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={directions.includes(id)}
                      onChange={() => toggle(id)}
                    />
                    <Icon className="size-6" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                    <Check
                      className="absolute top-4 right-4 size-5 opacity-0 transition-opacity peer-checked:opacity-100"
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6">
              {directions.map((d) => (
                <fieldset key={d}>
                  <legend className="mb-3 font-medium">{tierLabels[d].question}</legend>
                  <div className="flex flex-wrap gap-2">
                    {tierLabels[d].options.map((opt, i) => (
                      <label
                        key={opt}
                        className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-white/40 has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-b24"
                      >
                        <input
                          type="radio"
                          name={`tier-${d}`}
                          className="sr-only"
                          checked={(tiers[d] ?? 0) === i}
                          onChange={() => setTiers((t) => ({ ...t, [d]: i as Tier }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="sr-only">Срочность</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { v: false, t: "В обычном режиме", d: "Планируем этапы без спешки" },
                  { v: true, t: "Срочно", d: "Выделенная команда, срок короче на 30%, цена +20%" },
                ].map((o) => (
                  <label
                    key={o.t}
                    className="cursor-pointer rounded-2xl border border-white/10 p-5 transition-colors hover:border-white/30 has-[:checked]:border-onec has-[:checked]:bg-onec/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-b24"
                  >
                    <input type="radio" name="urgent" className="sr-only" checked={urgent === o.v} onChange={() => setUrgent(o.v)} />
                    <span className="block font-semibold">{o.t}</span>
                    <span className="block text-sm text-muted">{o.d}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 3 ? (
            <LeadForm source="quiz" quiz={quizJson} submitLabel="Получить точный расчёт" withComment={false} />
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(step - 1)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-fg ${step === 0 ? "invisible" : ""}`}
          >
            Назад
          </button>
          {step < 3 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => go(step + 1)}
              className="rounded-xl bg-fg px-6 py-3 text-sm font-semibold text-bg transition-opacity disabled:opacity-40"
            >
              {step === 2 ? "Перейти к расчёту" : "Дальше"}
            </button>
          ) : null}
        </div>
      </div>

      <aside
        aria-label="Предварительная оценка"
        className="relative h-fit overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-b24/25 via-card to-onec/15 p-6 lg:sticky lg:top-28"
      >
        <p className="flex items-center gap-2 font-mono text-xs text-fg/70">
          <Calculator className="size-4" aria-hidden="true" />
          Предварительная оценка
        </p>
        {result ? (
          <div aria-live="polite">
            <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums">
              {formatRub(result.priceMin)}
              <span className="block text-lg font-normal text-fg/70">до {formatRub(result.priceMax)}</span>
            </p>
            <dl className="mt-6 grid gap-3 border-t border-white/15 pt-4 font-mono text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg/70">Срок</dt>
                <dd>{formatWeeks(result.weeksMin, result.weeksMax)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg/70">Связки систем</dt>
                <dd>{result.integrations || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg/70">Аудит</dt>
                <dd className="text-low">бесплатно</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="mt-4 text-fg/75">Выберите направление — цена и срок появятся здесь сразу.</p>
        )}
        <p className="mt-6 text-sm text-fg/60">
          Точность ±20%. Окончательную цену фиксируем в договоре после аудита.
        </p>
      </aside>
    </div>
  );
}
