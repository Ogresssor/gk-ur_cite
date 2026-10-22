import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { CaseCard, ReviewCard, ServiceCard } from "@/components/cards";
import { Counter } from "@/components/counter";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq-list";
import { HeroVisual } from "@/components/hero-visual";
import { Magnetic } from "@/components/magnetic";
import { Marquee } from "@/components/marquee";
import { ProcessTimeline } from "@/components/process-timeline";
import { Quiz } from "@/components/quiz";
import { Reveal } from "@/components/reveal";
import { ScrollStory } from "@/components/scroll-story";
import { SectionHead } from "@/components/section-head";
import { WordRotator } from "@/components/word-rotator";
import { cases, faq, reviews } from "@/content/proof";
import { services } from "@/content/services";
import { facts, site, stack } from "@/content/site";

const process = [
  { title: "Заявка", text: "Перезваниваем за 15 минут, задаём 5–7 вопросов.", time: "в день заявки" },
  { title: "Аудит", text: "Смотрим процессы, базы 1С и объект. Бесплатно.", time: "1–2 дня" },
  { title: "Смета и договор", text: "Фиксируем объём, цену, сроки и гарантию.", time: "2–3 дня" },
  { title: "Внедрение", text: "Работаем этапами, каждую неделю показываем результат.", time: "от 1 недели" },
  { title: "Сопровождение", text: "Обучаем, передаём документацию, остаёмся на связи 24/7.", time: "постоянно" },
];

function jsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: site.city, streetAddress: site.address },
    areaServed: "RU",
    knowsAbout: ["Битрикс24", "1С", "Видеонаблюдение", "СКУД", "СКС"],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />

      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <HeroVisual />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          <Reveal y={20}>
            <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs text-fg/85">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-low" />
                <span className="relative size-2 rounded-full bg-low" />
              </span>
              Бесплатный аудит за 2 рабочих дня
            </p>
          </Reveal>
          <h1 className="rise mt-7 max-w-4xl text-[2.9rem] leading-[0.98] font-semibold tracking-tight sm:text-7xl lg:text-[5.6rem]">
            От кабеля до CRM —<br className="hidden sm:block" /> одной командой
          </h1>
          <p className="rise mt-7 max-w-xl [animation-delay:80ms] text-lg text-muted sm:text-2xl">
            Внедряем <WordRotator words={["Битрикс24", "1С", "видеонаблюдение", "СКУД", "сети и Wi-Fi"]} />
            <br />
            и связываем всё в одну систему по одному договору.
          </p>
          <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <Link
                href="/kalkulyator"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-onec px-8 py-4.5 text-base font-semibold text-bg shadow-[0_10px_50px_-10px_rgb(245_180_0/0.7)] sm:w-auto"
              >
                Рассчитать стоимость
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="glass flex w-full items-center justify-center rounded-2xl px-8 py-4.5 text-base font-semibold sm:w-auto">
                Получить бесплатный аудит
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6">
          <Reveal delay={0.3}>
            <dl className="glass grid grid-cols-2 divide-white/10 rounded-3xl md:grid-cols-4 md:divide-x">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col px-5 py-5 sm:px-7">
                  <dt className="order-2 text-sm text-muted">{f.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    <Counter value={f.value} suffix={f.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Технологии */}
      <section aria-label="С чем работаем" className="py-14">
        <p className="mb-6 text-center font-mono text-xs text-muted">Платформы и оборудование, с которыми работаем</p>
        <div className="grid gap-4">
          <Marquee label="Платформы, часть 1" duration={45}>
            {stack.slice(0, 8).map((t) => (
              <span key={t} className="rounded-full border border-line px-6 py-3 text-lg whitespace-nowrap text-fg/70">
                {t}
              </span>
            ))}
          </Marquee>
          <Marquee label="Платформы, часть 2" duration={50} reverse>
            {stack.slice(8).map((t) => (
              <span key={t} className="rounded-full border border-line px-6 py-3 text-lg whitespace-nowrap text-fg/70">
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Услуги */}
      <section aria-labelledby="services-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              id="services-title"
              eyebrow="Услуги"
              title="Три направления, которые работают как одна система"
              lead="Можно заказать одно — например, только CRM. Но больше всего пользы там, где системы связаны."
            />
            <Link href="/uslugi" className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10">
              Все услуги и цены
            </Link>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08} className={i === 0 ? "lg:row-span-2" : ""}>
                <ServiceCard s={s} large={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Скролл-история */}
      <section aria-labelledby="story-title" className="relative py-24 sm:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            id="story-title"
            eyebrow="Как всё связано"
            title="Один подрядчик на всю цепочку"
            lead="Прокрутите вниз: на схеме загорается то, что мы делаем на каждом шаге."
          />
          <div className="mt-14">
            <ScrollStory />
          </div>
        </div>
      </section>

      {/* Кейсы */}
      <section aria-labelledby="cases-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="cases-title" eyebrow="Кейсы" title="Результаты в цифрах" lead="Что было до нас, что сделали и что изменилось для бизнеса." />
            <Link href="/kejsy" className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10">
              Все кейсы
            </Link>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {cases.slice(0, 4).map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 0.08}>
                <CaseCard item={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Процесс */}
      <section aria-labelledby="process-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead id="process-title" eyebrow="Процесс" title="Как мы работаем" lead="Без сюрпризов в смете: цена и сроки фиксируются в договоре до старта." />
          <div className="mt-16">
            <ProcessTimeline steps={process} />
          </div>
          <Reveal className="glass mt-16 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
            <ShieldCheck className="size-10 shrink-0 text-low" aria-hidden="true" />
            <p className="text-lg">
              <span className="font-semibold">Гарантия 24 месяца на монтаж</span>
              <span className="text-muted"> и 3 месяца бесплатного исправления ошибок после сдачи доработок 1С и Битрикс24.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Калькулятор */}
      <section id="calculator" aria-labelledby="calc-title" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgb(91_140_255/0.15),transparent)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            id="calc-title"
            eyebrow="Калькулятор"
            title="Узнайте цену до звонка"
            lead="Четыре коротких шага — и вы видите вилку стоимости и срок. Точный расчёт пришлём после бесплатного аудита."
          />
          <div className="mt-14">
            <Quiz />
          </div>
        </div>
      </section>

      {/* Отзывы */}
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

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead id="faq-title" eyebrow="Вопросы" title="Частые вопросы" lead="Не нашли ответ — позвоните, объясним за пять минут." />
          <Reveal>
            <FaqList items={faq} />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
