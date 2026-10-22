import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { Counter } from "@/components/counter";
import { CtaBand } from "@/components/cta-band";
import { Marquee } from "@/components/marquee";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { ReviewCard } from "@/components/cards";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { departments, documents, timeline, values } from "@/content/company";
import { reviews } from "@/content/proof";
import { facts, site } from "@/content/site";

export const metadata: Metadata = {
  title: "О компании",
  description: `${site.name}: команда инженеров, специалистов 1С и Битрикс24. История, принципы работы и документы.`,
  alternates: { canonical: "/o-kompanii" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { label: "О компании" }]}
        title="Мы соединяем то, что обычно делят три подрядчика"
        lead={`${site.name} начиналась с монтажа камер. Клиенты просили связать камеры и проходы с учётом, а потом — с продажами. Так появилась команда полного цикла.`}
        color="var(--low)"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="group overflow-hidden rounded-3xl border border-line">
          <Photo src="/photos/about-office.jpg" kind="office" alt="Офис и команда ГК УР" sizes="100vw" priority className="aspect-[16/9] sm:aspect-[21/9]" />
        </Reveal>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col bg-bg p-6 sm:p-8">
              <dt className="order-2 text-muted">{f.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight sm:text-5xl">
                <Counter value={f.value} suffix={f.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="history-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="history-title" eyebrow="История" title="От камер в магазинах до полного цикла" />
          <ol className="relative mt-14 grid gap-10 border-l border-line pl-8 md:grid-cols-5 md:gap-6 md:border-t md:border-l-0 md:pt-10 md:pl-0">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.08} className="relative">
                <span className="absolute top-2 -left-[37px] size-3 rounded-full bg-onec md:-top-[46px] md:left-0" aria-hidden="true" />
                <p className="font-mono text-3xl font-semibold text-onec">{t.year}</p>
                <h3 className="mt-3 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-muted">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="team-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="team-title" eyebrow="Команда" title="Четыре отдела — одна ответственность" />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Reveal as="li" key={d.title} delay={i * 0.06} className="group overflow-hidden rounded-3xl border border-line bg-card">
                <Photo src={d.src} kind={d.kind} alt={d.title} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/5]" />
                <div className="p-6">
                  <p className="font-mono text-xs text-onec">{d.people}</p>
                  <h3 className="mt-2 text-xl font-semibold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted">{d.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="values-title" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead id="values-title" eyebrow="Принципы" title="Как мы работаем с клиентами" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 2) * 0.06} className="glass rounded-3xl p-7">
                <h3 className="text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-muted">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="docs-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="docs-title" eyebrow="Документы" title="Лицензии и сертификаты" lead="Копии документов отправим по запросу вместе с коммерческим предложением." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documents.map((d, i) => (
              <Reveal as="li" key={d} delay={i * 0.05} className="flex items-start gap-4 rounded-3xl border border-line bg-card p-6">
                <FileCheck2 className="size-6 shrink-0 text-low" aria-hidden="true" />
                <span>{d}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="reviews-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="reviews-title" eyebrow="Отзывы" title="Что говорят клиенты" />
        </div>
        <div className="mt-14">
          <Marquee label="Отзывы клиентов" duration={70}>
            {reviews.map((r) => (
              <ReviewCard key={r.name} r={r} />
            ))}
          </Marquee>
        </div>
      </section>

      <CtaBand title="Познакомимся лично?" lead="Приезжайте в офис или пригласите нас на объект — проведём аудит бесплатно." />
    </>
  );
}
