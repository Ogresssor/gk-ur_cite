import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Quote } from "lucide-react";
import { CaseCard, DirectionTags } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { cases, getCase } from "@/content/proof";
import { directionMeta } from "@/content/services";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/kejsy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.client}: ${item.task}`,
    alternates: { canonical: `/kejsy/${item.id}` },
  };
}

export default async function CasePage({ params }: PageProps<"/kejsy/[slug]">) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();
  const others = cases.filter((c) => c.id !== item.id).slice(0, 2);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { href: "/kejsy", label: "Кейсы" }, { label: item.client }]}
        title={item.title}
        color={directionMeta[item.directions[0]].color}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <DirectionTags directions={item.directions} />
          <span className="font-mono text-sm text-muted">
            {item.client} · {item.industry} · {item.duration}
          </span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="group overflow-hidden rounded-3xl border border-line">
          <Photo {...item.cover} sizes="100vw" priority className="aspect-[16/9] sm:aspect-[21/9]" />
        </Reveal>

        <Reveal as="section" className="glass mt-6 grid grid-cols-2 gap-6 rounded-3xl p-6 sm:p-8 md:grid-cols-4">
          {item.metrics.map((m) => (
            <p key={m.label}>
              <span className="block text-4xl font-semibold tracking-tight sm:text-5xl">{m.value}</span>
              <span className="mt-1 block text-muted">{m.label}</span>
            </p>
          ))}
          <p>
            <span className="block text-4xl font-semibold tracking-tight sm:text-5xl">{item.duration}</span>
            <span className="mt-1 block text-muted">от старта до сдачи</span>
          </p>
        </Reveal>

        <div className="grid gap-12 py-24 lg:grid-cols-[1fr_320px] lg:gap-20">
          <article className="grid gap-12">
            {[
              { h: "Задача", p: [item.task, item.story[0]] },
              { h: "Решение", p: [item.solution, item.story[1]] },
              { h: "Результат", p: [item.story[2]] },
            ].map((block) => (
              <Reveal as="section" key={block.h}>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{block.h}</h2>
                {block.p.filter(Boolean).map((t) => (
                  <p key={t} className="mt-4 text-lg leading-relaxed text-fg/85">
                    {t}
                  </p>
                ))}
              </Reveal>
            ))}
            {item.quote ? (
              <Reveal as="section">
                <figure className="glass rounded-3xl p-8">
                  <Quote className="size-7 text-onec" aria-hidden="true" />
                  <blockquote className="mt-4 text-2xl leading-snug font-medium">{item.quote.text}</blockquote>
                  <figcaption className="mt-4 text-muted">— {item.quote.author}, {item.client}</figcaption>
                </figure>
              </Reveal>
            ) : null}
          </article>
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="font-mono text-xs text-muted">Технологии</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/kejsy" className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Все кейсы
            </Link>
          </aside>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {item.gallery.map((g, i) => (
            <Reveal as="li" key={g.src} delay={i * 0.06} className="group overflow-hidden rounded-3xl border border-line">
              <Photo {...g} sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />
            </Reveal>
          ))}
        </ul>

        <section aria-labelledby="more-title" className="py-24">
          <h2 id="more-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Другие проекты</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {others.map((c) => (
              <CaseCard key={c.id} item={c} />
            ))}
          </div>
        </section>
      </div>

      <CtaBand title="Обсудим похожий проект?" />
    </>
  );
}
