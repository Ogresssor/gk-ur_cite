import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Repeat } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { directionMeta, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description: "Внедрение Битрикс24 и 1С, монтаж видеонаблюдения, СКУД, СКС и Wi-Fi. Цены на все услуги и пакеты.",
  alternates: { canonical: "/uslugi" },
};

const links = [
  { from: "Телефония", to: "Битрикс24", text: "Звонок открывает карточку клиента с записью разговора." },
  { from: "1С", to: "Битрикс24", text: "Остатки, цены, счета и оплаты синхронно в обе стороны." },
  { from: "СКУД", to: "1С:ЗУП", text: "Проходы сотрудников автоматически заполняют табель." },
  { from: "Сайт", to: "Битрикс24", text: "Заявка становится сделкой и задачей менеджеру за секунду." },
  { from: "Камеры", to: "Телефон", text: "Руководитель смотрит объект из любой точки." },
  { from: "1С", to: "Отчёты", text: "Деньги, склад и продажи — в одном дашборде каждое утро." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { label: "Услуги" }]}
        title="Услуги и цены"
        lead="Три направления, одна команда и один договор. Ниже — что входит в работу и сколько это стоит."
      />

      <div className="mx-auto grid max-w-7xl gap-24 px-4 pb-24 sm:px-6 sm:pb-32">
        {services.map((s, i) => {
          const meta = directionMeta[s.direction];
          return (
            <section key={s.slug} aria-labelledby={`${s.slug}-title`} className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={`group overflow-hidden rounded-3xl border border-line lg:sticky lg:top-28 ${i % 2 ? "lg:order-2" : ""}`}>
                <Photo {...s.cover} sizes="(min-width: 1024px) 50vw, 100vw" priority={i === 0} className="aspect-[4/3]" />
              </Reveal>
              <div>
                <Reveal>
                  <p className={`font-mono text-xs ${meta.ink}`}>
                    {String(i + 1).padStart(2, "0")} — {meta.label}
                  </p>
                  <h2 id={`${s.slug}-title`} className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-lg text-muted">{s.lead}</p>
                </Reveal>
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {s.items.map((item, k) => (
                    <Reveal as="li" key={item.title} delay={k * 0.04} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <span>
                        <span className="block text-lg font-medium">{item.title}</span>
                        <span className="block text-sm text-muted">{item.text}</span>
                      </span>
                      <span className="shrink-0 font-mono text-sm">{item.price}</span>
                    </Reveal>
                  ))}
                </ul>
                <Link
                  href={`/uslugi/${s.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-fg px-6 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5"
                >
                  Пакеты и подробности: {s.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          );
        })}

        <section aria-labelledby="links-title">
          <SectionHead id="links-title" eyebrow="Связки" title="Интеграции между системами" lead="То, что обычно делят три подрядчика. Мы отвечаем за всю цепочку." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l, i) => (
              <Reveal as="li" key={l.text} delay={(i % 3) * 0.06} className="glass rounded-3xl p-6">
                <Repeat className="size-6 text-onec" aria-hidden="true" />
                <p className="mt-5 font-mono">
                  {l.from} <span className="text-onec">⇄</span> {l.to}
                </p>
                <p className="mt-2 text-muted">{l.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      <CtaBand />
    </>
  );
}
