import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { LeadForm } from "./lead-form";
import { Reveal } from "./reveal";

export function CtaBand({
  title = "Расскажите о задаче — предложим решение за 2 дня",
  lead = "Аудит бесплатный и ни к чему не обязывает. Даже если не начнём работу, у вас останется список рисков и рекомендаций.",
  source = "contact",
  submitLabel,
}: {
  title?: string;
  lead?: string;
  source?: "contact" | "service";
  submitLabel?: string;
}) {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative overflow-hidden py-24 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_30%,rgb(91_140_255/0.22),transparent),radial-gradient(50%_50%_at_90%_80%,rgb(245_180_0/0.14),transparent)]" aria-hidden="true" />
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <h2 id="cta-title" className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">{lead}</p>
          <ul className="mt-10 grid gap-4 text-fg/85">
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
        </Reveal>
        <Reveal delay={0.1} className="glass rounded-3xl p-5 sm:p-8">
          <LeadForm source={source} submitLabel={submitLabel} />
        </Reveal>
      </div>
    </section>
  );
}
