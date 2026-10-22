"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Schematic } from "./schematic";

const chapters = [
  {
    node: "sks",
    tag: "Слаботочка",
    color: "var(--low)",
    title: "Всё начинается с кабеля",
    text: "Проектируем и прокладываем СКС, собираем серверный шкаф, настраиваем Wi-Fi. Каждый порт подписан и есть в журнале.",
    href: "/uslugi/slabotochnye-sistemy",
  },
  {
    node: "cam",
    tag: "Видеонаблюдение",
    color: "var(--low)",
    title: "Объект под присмотром",
    text: "IP-камеры с аналитикой и архивом до 90 дней. Руководитель смотрит склад и цех с телефона.",
    href: "/uslugi/slabotochnye-sistemy",
  },
  {
    node: "skud",
    tag: "СКУД → 1С",
    color: "var(--onec)",
    title: "Проход превращается в табель",
    text: "Турникет с Face ID отмечает сотрудника, а 1С:ЗУП сама заполняет табель. Кадровик больше не сверяет журналы.",
    href: "/uslugi/1c",
  },
  {
    node: "ats",
    tag: "Телефония → Битрикс24",
    color: "var(--b24)",
    title: "Звонок не теряется",
    text: "IP-АТС передаёт каждый вызов в CRM: карточка клиента, запись разговора, задача перезвонить по пропущенному.",
    href: "/uslugi/bitrix24",
  },
  {
    node: "boss",
    tag: "Отчёты",
    color: "var(--fg)",
    title: "Руководитель видит всю картину",
    text: "Продажи из Битрикс24, склад и деньги из 1С, посещаемость из СКУД — на одном экране, каждое утро.",
    href: "/kalkulyator",
  },
];

export function ScrollStory() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-chapter")));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* На телефоне схема прилипает сверху, главы прокручиваются под ней */}
      <div className="sticky top-3 z-10 -mx-4 bg-bg/90 px-4 pt-1 pb-3 backdrop-blur-md sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none lg:top-28 lg:h-fit">
        <div className="glass rounded-3xl p-3 sm:p-5">
          <Schematic activeId={chapters[active].node} compact />
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[7px] w-px bg-line" aria-hidden="true" />
        <motion.div
          className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-linear-to-b from-low via-onec to-b24"
          style={{ scaleY: progress }}
          aria-hidden="true"
        />
        <ol ref={listRef} className="grid gap-[45vh] py-[10vh] lg:gap-[28vh] lg:py-[18vh]">
          {chapters.map((c, i) => (
            <li key={c.title} data-chapter={i} className="relative pl-10">
              <span
                className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 bg-bg transition-transform duration-500"
                style={{ borderColor: c.color, transform: `scale(${active === i ? 1.3 : 1})` }}
                aria-hidden="true"
              />
              <p className="font-mono text-xs" style={{ color: c.color }}>
                {String(i + 1).padStart(2, "0")} — {c.tag}
              </p>
              <h3
                className={`mt-3 text-3xl font-semibold tracking-tight transition-colors duration-500 sm:text-4xl ${active === i ? "text-fg" : "text-fg/55"}`}
              >
                {c.title}
              </h3>
              <p className={`mt-4 max-w-md text-lg transition-colors duration-500 ${active === i ? "text-fg/85" : "text-muted"}`}>
                {c.text}
              </p>
              <Link href={c.href} className="mt-5 inline-block text-sm font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Подробнее
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
