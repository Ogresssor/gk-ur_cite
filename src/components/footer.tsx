import { cacheLife } from "next/cache";
import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-graphite pb-24 text-white/75 sm:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="text-white" />
          <p className="mt-4 max-w-sm text-sm">{site.tagline}. Внедряем, монтируем и сопровождаем по одному договору.</p>
        </div>
        <nav aria-label="Услуги">
          <p className="font-mono text-xs text-white/60">Услуги</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/uslugi/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="hover:text-white">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </nav>
        <address className="grid content-start gap-2 text-sm not-italic">
          <p className="font-mono text-xs text-white/60">Контакты</p>
          <a href={site.phoneHref} className="font-mono text-white hover:underline">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a>
          <span>{site.address}</span>
          <span>{site.hours}</span>
        </address>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60 sm:px-6">
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
