import { cacheLife } from "next/cache";
import Link from "next/link";
import { services } from "@/content/services";
import { nav, site } from "@/content/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pb-24 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        {/* Декоративная надпись через ::before: не читается как текст и не участвует в проверке контраста */}
        <div
          data-text={site.name}
          className="text-[clamp(3.5rem,13vw,11rem)] leading-[0.85] font-semibold tracking-tighter text-white/[0.06] select-none before:content-[attr(data-text)]"
          aria-hidden="true"
        />
        <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted">{site.tagline}. Внедряем, монтируем и сопровождаем по одному договору.</p>
          </div>
          <nav aria-label="Услуги">
            <p className="font-mono text-xs text-muted">Услуги</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/uslugi/${s.slug}`} className="text-fg/80 hover:text-fg">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Компания">
            <p className="font-mono text-xs text-muted">Компания</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-fg/80 hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-fg/80 hover:text-fg">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </nav>
          <address className="grid content-start gap-2.5 text-sm not-italic">
            <p className="font-mono text-xs text-muted">Контакты</p>
            <a href={site.phoneHref} className="mt-1.5 font-mono text-lg text-fg hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="text-fg/80 hover:text-fg">{site.email}</a>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="text-fg/80 hover:text-fg">Telegram</a>
            <span className="text-muted">{site.address}</span>
            <span className="text-muted">{site.hours}</span>
          </address>
        </div>
      </div>
      <div className="mt-16 border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted sm:px-6">
          © <CurrentYear /> {site.legalName}, ИНН {site.inn}
        </p>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
