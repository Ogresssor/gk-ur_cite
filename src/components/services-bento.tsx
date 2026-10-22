import Link from "next/link";
import { ArrowUpRight, Cable, Database, Repeat, Workflow } from "lucide-react";
import { directionMeta, services } from "@/content/services";

const icons = { b24: Workflow, onec: Database, low: Cable } as const;

const links = [
  { from: "Телефония", to: "Битрикс24", text: "звонок → карточка клиента с записью" },
  { from: "1С", to: "Битрикс24", text: "остатки, цены, счета и оплаты" },
  { from: "СКУД", to: "1С:ЗУП", text: "проходы → табель без ручного ввода" },
  { from: "Сайт", to: "Битрикс24", text: "заявка → сделка и задача менеджеру" },
];

export function ServicesBento() {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      {services.map((s, i) => {
        const Icon = icons[s.direction];
        const meta = directionMeta[s.direction];
        return (
          <Link
            key={s.slug}
            href={`/uslugi/${s.slug}`}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-graphite/40 sm:p-8 ${
              i === 0 ? "md:col-span-3 md:row-span-2" : "md:col-span-3"
            }`}
          >
            <span className="absolute inset-x-0 top-0 h-1" style={{ background: meta.color }} aria-hidden="true" />
            <div className="flex items-start justify-between">
              <Icon className={`size-7 ${meta.ink}`} aria-hidden="true" />
              <ArrowUpRight className="size-5 text-steel transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
            <p className="mt-2 text-steel">{s.short}</p>
            {i === 0 ? (
              <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                {s.items.map((item) => (
                  <li key={item.title} className="flex items-baseline justify-between gap-4">
                    <span>{item.title}</span>
                    <span className="shrink-0 font-mono text-sm text-steel">{item.price}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-auto pt-6 font-mono text-sm">
              <span className="text-steel">стоимость </span>
              {s.priceFrom}
            </p>
          </Link>
        );
      })}

      <div className="relative overflow-hidden rounded-2xl bg-graphite p-6 text-white md:col-span-6 sm:p-8">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <Repeat className="size-7 text-onec" aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Связки между системами</h3>
            <p className="mt-2 max-w-md text-white/75">
              То, что обычно делят три подрядчика. Мы отвечаем за всю цепочку — от кабеля до отчёта.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {links.map((l) => (
              <li key={l.text} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-mono text-sm">
                  {l.from} <span className="text-onec" aria-label="связано с">⇄</span> {l.to}
                </p>
                <p className="mt-1 text-sm text-white/70">{l.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
