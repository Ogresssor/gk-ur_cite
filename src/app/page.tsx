import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Quote } from "lucide-react";
import { Cases } from "@/components/cases";
import { FaqList } from "@/components/faq-list";
import { HeroSchematic } from "@/components/hero-schematic";
import { LeadForm } from "@/components/lead-form";
import { Quiz } from "@/components/quiz";
import { Section } from "@/components/section";
import { ServicesBento } from "@/components/services-bento";
import { faq, reviews } from "@/content/proof";
import { directionMeta } from "@/content/services";
import { facts, site } from "@/content/site";

const process = [
  { title: "Заявка и звонок", text: "Перезваниваем за 15 минут, задаём 5–7 вопросов о задаче.", time: "в день заявки" },
  { title: "Бесплатный аудит", text: "Смотрим процессы, базы 1С и объект. Выезжаем, если нужен монтаж.", time: "1–2 дня" },
  { title: "Смета и договор", text: "Фиксируем объём, цену, сроки и гарантию. Без доплат по ходу.", time: "2–3 дня" },
  { title: "Внедрение и монтаж", text: "Работаем этапами, каждую неделю показываем результат.", time: "от 1 недели" },
  { title: "Сдача и сопровождение", text: "Обучаем сотрудников, передаём документацию, остаёмся на связи.", time: "постоянно" },
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

      <section className="relative overflow-hidden bg-graphite pt-32 pb-20 text-white sm:pt-36 sm:pb-24">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <div
          className="absolute top-1/3 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-b24/20 blur-[120px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/80">
              <span className="size-1.5 rounded-full bg-low" aria-hidden="true" />
              Бесплатный аудит за 2 рабочих дня
            </p>
            <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl xl:text-7xl">
              Соединяем ваш бизнес — от кабеля до CRM
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/75 sm:text-xl lg:mx-0">
              Внедряем Битрикс24 и 1С, монтируем видеонаблюдение, СКУД и сети. Один подрядчик, один договор и
              одна ответственность за то, чтобы всё работало вместе.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="#calculator"
                className="rounded-xl bg-onec px-7 py-4 text-base font-semibold text-graphite transition-transform hover:-translate-y-0.5"
              >
                Рассчитать стоимость
              </Link>
              <Link
                href="#contact"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Бесплатный аудит
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-graphite-2/60 p-3 shadow-[0_40px_120px_-40px_rgb(46_107_255/0.45)] backdrop-blur sm:p-5">
            <p className="mb-2 px-1 font-mono text-[11px] text-white/60">
              Схема типового клиента. Наведите на узел или перейдите по нему клавишей Tab
            </p>
            <HeroSchematic />
          </div>
        </div>
      </section>

      <section aria-label="Компания в цифрах" className="border-b border-line bg-surface">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col bg-surface px-4 py-8 sm:px-6">
              <dt className="order-2 text-sm text-steel">{f.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        id="services"
        title="Три направления, которые работают как одна система"
        intro="Можно заказать одно — например, только CRM. Но больше всего пользы там, где системы связаны."
      >
        <ServicesBento />
      </Section>

      <Section
        id="calculator"
        title="Узнайте цену до звонка"
        intro="Четыре коротких шага — и вы видите вилку стоимости и срок. Точный расчёт пришлём после бесплатного аудита."
        className="grid-paper border-y border-line"
      >
        <Quiz />
      </Section>

      <Section id="how" title="Как мы работаем" intro="Без сюрпризов в смете: цена и сроки фиксируются в договоре до старта.">
        <ol className="grid gap-4 md:grid-cols-5">
          {process.map((p, i) => (
            <li key={p.title} className="relative rounded-2xl border border-line bg-surface p-5">
              <span className="font-mono text-sm text-steel">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-steel">{p.text}</p>
              <p className="mt-4 font-mono text-xs text-b24-ink">{p.time}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="cases"
        title="Кейсы с цифрами"
        intro="Что было до нас, что сделали и что изменилось для бизнеса."
        className="border-t border-line"
      >
        <Cases />
      </Section>

      <Section id="reviews" title="Что говорят клиенты" className="bg-surface">
        <ul className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.name} className="flex flex-col rounded-2xl border border-line p-6">
              <Quote className={`size-6 ${directionMeta[r.direction].ink}`} aria-hidden="true" />
              <blockquote className="mt-4 text-[17px] leading-relaxed">{r.text}</blockquote>
              <p className="mt-auto pt-6">
                <span className="block font-semibold">{r.name}</span>
                <span className="block text-sm text-steel">{r.role}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Частые вопросы">
        <FaqList items={faq} />
      </Section>

      <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-graphite py-24 text-white sm:py-32">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="contact-title" className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Расскажите о задаче — предложим решение за 2 дня
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/75">
              Аудит бесплатный и ни к чему не обязывает. Даже если не начнём работу, у вас останется список рисков и
              рекомендаций.
            </p>
            <ul className="mt-10 grid gap-4 text-white/85">
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-onec" aria-hidden="true" />
                <a href={site.phoneHref} className="font-mono text-lg hover:underline">{site.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-onec" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-5 text-onec" aria-hidden="true" />
                {site.address}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-5 text-onec" aria-hidden="true" />
                {site.hours}
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-8">
            <LeadForm source="contact" tone="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
