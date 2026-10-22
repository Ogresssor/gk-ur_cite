import type { Metadata } from "next";
import { CaseCard } from "@/components/cards";
import { CaseFilter } from "@/components/case-filter";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { cases } from "@/content/proof";

export const metadata: Metadata = {
  title: "Кейсы",
  description: "Проекты по Битрикс24, 1С и слаботочным системам: задача, решение и результат в цифрах.",
  alternates: { canonical: "/kejsy" },
};

export default function CasesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { label: "Кейсы" }]}
        title="Проекты, которые работают"
        lead="Что было до нас, что сделали и что изменилось для бизнеса — с цифрами."
        color="var(--onec)"
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 className="sr-only">Список проектов</h2>
        <CaseFilter>
          <ul className="grid gap-5 md:grid-cols-2">
            {cases.map((c, i) => (
              <li key={c.id} data-dirs={c.directions.join(" ")}>
                <Reveal delay={(i % 2) * 0.08}>
                  <CaseCard item={c} priority={i < 2} />
                </Reveal>
              </li>
            ))}
          </ul>
        </CaseFilter>
      </div>
      <CtaBand title="Хотите такой же результат?" />
    </>
  );
}
