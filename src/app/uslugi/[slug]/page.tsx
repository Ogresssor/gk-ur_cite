import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { LeadForm } from "@/components/lead-form";
import { cases, faq } from "@/content/proof";
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

export default async function ServicePage({ params }: PageProps<"/uslugi/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const meta = directionMeta[service.direction];
  const related = cases.filter((c) => c.directions.includes(service.direction));

  return (
    <>
      <section className="relative overflow-hidden bg-graphite pt-32 pb-20 text-white sm:pt-40">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <nav aria-label="Хлебные крошки" className="font-mono text-xs text-white/60">
            <Link href="/" className="hover:text-white">Главная</Link> / <Link href="/#services" className="hover:text-white">Услуги</Link> /{" "}
            <span className="text-white/85">{service.title}</span>
          </nav>
          <span className="mt-8 block h-1 w-16" style={{ background: meta.color }} aria-hidden="true" />
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">{service.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75 sm:text-xl">{service.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#order" className="rounded-xl bg-onec px-7 py-4 text-center font-semibold text-graphite transition-transform hover:-translate-y-0.5">
              Обсудить задачу
            </Link>
            <Link href="/#calculator" className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-center font-semibold hover:bg-white/10">
              Рассчитать стоимость
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="price-title" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="price-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">Что входит и сколько стоит</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {service.items.map((item) => (
              <li key={item.title} className="flex flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-steel">{item.text}</p>
                <p className="mt-auto pt-6 font-mono">{item.price}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-2xl bg-surface p-6 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Что изменится после внедрения</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {service.outcomes.map((o) => (
                <li key={o} className="flex gap-3">
                  <Check className={`mt-1 size-5 shrink-0 ${meta.ink}`} aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="border-t border-line py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="related-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">Похожие проекты</h2>
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {related.map((c) => (
                <li key={c.id} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-xl font-semibold tracking-tight">{c.client}</h3>
                  <p className="mt-2 text-steel">{c.solution}</p>
                  <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                    {c.metrics.map((m) => (
                      <span key={m.label}>
                        <span className="block text-2xl font-semibold tabular-nums">{m.value}</span>
                        <span className="text-sm text-steel">{m.label}</span>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="faq-title" className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="faq-title" className="mb-10 text-4xl font-semibold tracking-tight sm:text-5xl">Вопросы</h2>
          <FaqList items={faq.slice(0, 4)} />
        </div>
      </section>

      <section id="order" aria-labelledby="order-title" className="bg-graphite py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 id="order-title" className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Обсудим ваш проект: {service.title}
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/75">
              Перезвоним за 15 минут в рабочее время, проведём бесплатный аудит и пришлём смету.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
            <LeadForm source="service" tone="dark" submitLabel="Заказать бесплатный аудит" />
          </div>
        </div>
      </section>
    </>
  );
}
