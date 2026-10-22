import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { CaseCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { Magnetic } from "@/components/magnetic";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { ProcessTimeline } from "@/components/process-timeline";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { SpotlightCard } from "@/components/spotlight-card";
import { cases } from "@/content/proof";
import { directionMeta, getService, services } from "@/content/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/uslugi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/uslugi/${service.slug}` },
    openGraph: { title: service.title, description: service.metaDescription },
  };
}

// params читаем внутри <Suspense>: так Next отдаёт статичную оболочку и для адресов вне generateStaticParams
export default function ServicePage({ params }: PageProps<"/uslugi/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: Pick<PageProps<"/uslugi/[slug]">, "params">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const meta = directionMeta[service.direction];
  const related = cases.filter((c) => c.directions.includes(service.direction));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { href: "/uslugi", label: "Услуги" }, { label: service.title }]}
        title={service.title}
        lead={service.lead}
        color={meta.color}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <a href="#contact" className="w-full rounded-2xl bg-onec px-8 py-4 text-center font-semibold text-bg sm:w-auto">
              Обсудить задачу
            </a>
          </Magnetic>
          <Magnetic>
            <Link href="/kalkulyator" className="glass w-full rounded-2xl px-8 py-4 text-center font-semibold sm:w-auto">
              Рассчитать стоимость
            </Link>
          </Magnetic>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="group overflow-hidden rounded-3xl border border-line">
          <Photo {...service.cover} sizes="100vw" priority className="aspect-[16/9] sm:aspect-[21/9]" />
        </Reveal>
      </div>

      <section aria-labelledby="items-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="items-title" eyebrow="Что делаем" title="Работы и цены" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 0.06}>
                <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-card p-7">
                  <span className="h-1 w-10 rounded-full" style={{ background: meta.color }} aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.text}</p>
                  <p className="mt-auto pt-6 font-mono">{item.price}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="packages-title" className="relative py-24 sm:py-32">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(50% 40% at 50% 10%, ${meta.color}, transparent)` }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="packages-title" eyebrow="Пакеты" title="Готовые решения с фиксированной ценой" />
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {service.packages.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-7 sm:p-8 ${p.featured ? "border-2 border-onec bg-card shadow-[0_30px_80px_-30px_rgb(245_180_0/0.45)]" : "glass"}`}
                >
                  {p.featured ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-onec px-3 py-1 text-xs font-semibold text-bg">Выбирают чаще</span>
                  ) : null}
                  <h3 className="text-2xl font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted">{p.forWhom}</p>
                  <p className="mt-6 text-4xl font-semibold tracking-tight">{p.price}</p>
                  <p className="mt-1 font-mono text-xs text-muted">срок: {p.term}</p>
                  <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                    {p.includes.map((inc) => (
                      <li key={inc} className="flex gap-3">
                        <Check className={`mt-0.5 size-5 shrink-0 ${meta.ink}`} aria-hidden="true" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 rounded-2xl px-6 py-3.5 text-center font-semibold ${p.featured ? "bg-onec text-bg" : "bg-white/10 hover:bg-white/15"}`}
                  >
                    Выбрать «{p.name}»
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="steps-title" eyebrow="Этапы" title="Как проходит проект" />
          <div className="mt-16">
            <ProcessTimeline steps={service.steps} />
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="gallery-title" eyebrow="Работы" title="Как это выглядит" />
          <ul className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-3">
            {service.gallery.map((g, i) => (
              <Reveal as="li" key={g.src} delay={i * 0.06} className={`group overflow-hidden rounded-3xl border border-line ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""} ${i === 3 ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                <Photo {...g} sizes="(min-width: 1024px) 33vw, 100vw" className="h-full" />
              </Reveal>
            ))}
          </ul>
          <Reveal className="glass mt-12 rounded-3xl p-7 sm:p-10">
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Что изменится после внедрения</h3>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {service.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-lg">
                  <Check className={`mt-1 size-5 shrink-0 ${meta.ink}`} aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHead id="related-title" eyebrow="Кейсы" title="Похожие проекты" />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {related.slice(0, 2).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <CaseCard item={c} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="faq-title" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead id="faq-title" eyebrow="Вопросы" title={`Вопросы про ${service.title}`} />
          <Reveal>
            <FaqList items={service.faq} />
          </Reveal>
        </div>
      </section>

      <CtaBand title={`Обсудим ваш проект: ${service.title}`} source="service" submitLabel="Заказать бесплатный аудит" />
    </>
  );
}
