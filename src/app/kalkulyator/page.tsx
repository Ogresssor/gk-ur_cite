import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Quiz } from "@/components/quiz";

export const metadata: Metadata = {
  title: "Калькулятор стоимости",
  description: "Рассчитайте стоимость внедрения Битрикс24, 1С и монтажа слаботочных систем за минуту.",
  alternates: { canonical: "/kalkulyator" },
};

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Главная" }, { label: "Калькулятор" }]}
        title="Сколько стоит ваш проект"
        lead="Четыре шага — и вы видите вилку цены и срок. Точную смету зафиксируем в договоре после бесплатного аудита."
        color="var(--onec)"
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
        <Quiz />
      </div>
    </>
  );
}
