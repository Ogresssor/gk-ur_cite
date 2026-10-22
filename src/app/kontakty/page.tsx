import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Телефон, почта и адрес ${site.name}. Аварийная линия 24/7, бесплатный аудит за 2 рабочих дня.`,
  alternates: { canonical: "/kontakty" },
};

const channels = [
  { icon: Phone, title: "Телефон", value: site.phone, href: site.phoneHref, note: "Отвечаем в рабочее время, аварийная линия 24/7" },
  { icon: MessageCircle, title: "Telegram", value: "Написать в Telegram", href: site.telegram, note: "Ответим в течение 15 минут", external: true },
  { icon: Mail, title: "Почта", value: site.email, href: `mailto:${site.email}`, note: "Для ТЗ, документов и коммерческих запросов" },
];

export default function ContactsPage() {
  const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(site.address)}`;
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { label: "Контакты" }]}
        title="Свяжитесь удобным способом"
        lead="Перезвоним за 15 минут в рабочее время. Аудит и выезд на замер в Москве и области — бесплатно."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="grid content-start gap-4">
          {channels.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="glass flex items-start gap-5 rounded-3xl p-6 transition-colors hover:bg-white/10"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                  <c.icon className="size-5 text-onec" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-xs text-muted">{c.title}</span>
                  <span className="mt-1 block text-xl font-semibold">{c.value}</span>
                  <span className="mt-1 block text-sm text-muted">{c.note}</span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="relative overflow-hidden rounded-3xl border border-line bg-card p-6">
            <div className="bg-grid absolute inset-0" aria-hidden="true" />
            <div className="relative flex items-start gap-5">
              <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-b24" aria-hidden="true" />
                <MapPin className="size-5 text-b24" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-xs text-muted">Офис</span>
                <span className="mt-1 block text-xl font-semibold">{site.address}</span>
                <span className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <Clock className="size-4" aria-hidden="true" />
                  {site.hours}
                </span>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
                  Открыть на Яндекс Картах
                </a>
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.25} className="rounded-3xl border border-line p-6 text-sm text-muted">
            <p className="font-mono text-xs">Реквизиты</p>
            <p className="mt-2 text-fg">{site.legalName}</p>
            <p>ИНН {site.inn}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="glass h-fit rounded-3xl p-5 sm:p-8 lg:sticky lg:top-28">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Оставить заявку</h2>
          <LeadForm source="contact" />
        </Reveal>
      </div>
    </>
  );
}
