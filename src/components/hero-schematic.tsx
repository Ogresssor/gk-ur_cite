"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Tone = "b24" | "onec" | "low" | "core";

type NodeDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone: Tone;
  scenario: string;
  chain: string[];
};

type EdgeDef = { id: string; d: string; tone: Exclude<Tone, "core">; both?: boolean };

const W = 640;
const H = 440;

const toneColor: Record<Tone, string> = {
  b24: "#5b8cff",
  onec: "#f5b400",
  low: "#14a06c",
  core: "#c9d2dc",
};

const edges: EdgeDef[] = [
  { id: "cam", d: "M90 80 H205 V205 H320", tone: "low" },
  { id: "skud", d: "M90 180 H190 V215 H320", tone: "low" },
  { id: "sks", d: "M90 280 H190 V225 H320", tone: "low" },
  { id: "ats", d: "M90 380 H205 V235 H320", tone: "b24" },
  { id: "site", d: "M320 50 H470 V250 H550", tone: "b24" },
  { id: "core-onec", d: "M320 220 H430 V110 H550", tone: "onec" },
  { id: "core-b24", d: "M320 230 H440 V250 H550", tone: "b24" },
  { id: "sync", d: "M560 110 V250", tone: "onec", both: true },
  { id: "b24-boss", d: "M540 250 V380", tone: "b24" },
  { id: "onec-boss", d: "M600 110 H620 V380 H550", tone: "onec" },
];

const nodes: NodeDef[] = [
  { id: "site", label: "Сайт", x: 320, y: 50, tone: "b24", scenario: "Заявка с сайта сразу становится сделкой в Битрикс24, менеджер получает задачу.", chain: ["site"] },
  { id: "cam", label: "Камеры", x: 90, y: 80, tone: "low", scenario: "Камеры пишут архив на сервер, руководитель смотрит объект с телефона.", chain: ["cam"] },
  { id: "skud", label: "СКУД", x: 90, y: 180, tone: "low", scenario: "Проход по карте или Face ID — и отметка уже в табеле 1С:ЗУП.", chain: ["skud", "core-onec", "onec-boss"] },
  { id: "sks", label: "СКС/Wi-Fi", x: 90, y: 280, tone: "low", scenario: "Кабель и Wi-Fi — фундамент: камеры, телефония и 1С работают поверх этой сети.", chain: ["sks", "cam", "skud", "ats"] },
  { id: "ats", label: "IP-АТС", x: 90, y: 380, tone: "b24", scenario: "Звонок клиента открывает карточку в Битрикс24 с записью разговора.", chain: ["ats", "core-b24", "b24-boss"] },
  { id: "core", label: "Сервер", x: 320, y: 220, tone: "core", scenario: "Сервер и сеть, которые мы смонтировали, следим за ними и отвечаем за аварии 24/7.", chain: ["cam", "skud", "sks", "ats", "core-onec", "core-b24"] },
  { id: "onec", label: "1С", x: 550, y: 110, tone: "onec", scenario: "Остатки, цены и счета в 1С совпадают с CRM — без ручного переноса.", chain: ["core-onec", "sync", "onec-boss"] },
  { id: "b24", label: "Битрикс24", x: 550, y: 250, tone: "b24", scenario: "Воронка, роботы и задачи: ни одна заявка не теряется между менеджерами.", chain: ["site", "core-b24", "sync", "b24-boss"] },
  { id: "boss", label: "Отчёты", x: 550, y: 380, tone: "core", scenario: "Продажи, склад и посещаемость — на одном экране у руководителя.", chain: ["b24-boss", "onec-boss"] },
];

const SAMPLES = 120;
const SPEED = 70; // единиц viewBox в секунду

export function HeroSchematic() {
  const [active, setActive] = useState(nodes[4]);
  const [pinned, setPinned] = useState(false);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0.6);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const dotRefs = useRef<SVGCircleElement[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Пока человек не трогает схему, она сама перебирает сценарии.
  useEffect(() => {
    if (pinned || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((cur) => nodes[(nodes.indexOf(cur) + 1) % nodes.length]);
    }, 4200);
    return () => window.clearInterval(id);
  }, [pinned, paused]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = rootRef.current;
    if (!root) return;

    // Точки пути считаем один раз, чтобы в кадре не дёргать getPointAtLength.
    const tracks = edges.map((e) => {
      const path = pathRefs.current[e.id];
      if (!path) return { len: 1, pts: [] as [number, number][] };
      const len = path.getTotalLength();
      const pts: [number, number][] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const p = path.getPointAtLength((len * i) / SAMPLES);
        pts.push([p.x, p.y]);
      }
      return { len, pts };
    });

    const place = (t: number) => {
      let k = 0;
      edges.forEach((e, i) => {
        const { len, pts } = tracks[i];
        if (pts.length === 0) return;
        const count = 2;
        for (let j = 0; j < count; j++) {
          const dot = dotRefs.current[k++];
          if (!dot) continue;
          let phase = ((t * SPEED) / len + j / count + i * 0.13) % 1;
          if (e.both && j === 1) phase = 1 - phase;
          const [x, y] = pts[Math.round(phase * SAMPLES)];
          dot.setAttribute("transform", `translate(${x} ${y})`);
        }
      });
    };

    place(elapsed.current);
    if (reduce.matches || paused) return;

    let raf = 0;
    let visible = false;
    let start = 0;
    const loop = (now: number) => {
      elapsed.current = (now - start) / 1000;
      place(elapsed.current);
      raf = requestAnimationFrame(loop);
    };
    const resume = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) {
        start = performance.now() - elapsed.current * 1000;
        raf = requestAnimationFrame(loop);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    io.observe(root);
    const onVis = () => resume();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [paused]);

  const lit = new Set(active.chain);

  return (
    <div ref={rootRef} className="relative">
      <div className="relative mx-auto aspect-[640/440] w-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {edges.map((e) => (
            <g
              key={e.id}
              className="transition-opacity duration-500"
              style={{ opacity: lit.has(e.id) ? 1 : 0.22 }}
            >
              <path d={e.d} fill="none" stroke={toneColor[e.tone]} strokeOpacity="0.25" strokeWidth="6" strokeLinejoin="round" />
              <path
                ref={(el) => {
                  pathRefs.current[e.id] = el;
                }}
                d={e.d}
                fill="none"
                stroke={toneColor[e.tone]}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeDasharray={e.both ? "4 5" : undefined}
              />
            </g>
          ))}
          {edges.flatMap((e, i) =>
            [0, 1].map((j) => (
              <circle
                key={`${e.id}-${j}`}
                ref={(el) => {
                  if (el) dotRefs.current[i * 2 + j] = el;
                }}
                r="3.2"
                fill={toneColor[e.tone]}
                className="transition-opacity duration-500"
                style={{ opacity: lit.has(e.id) ? 1 : 0.15 }}
              />
            )),
          )}
        </svg>

        {nodes.map((n) => {
          const isActive = n.id === active.id;
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => {
                setActive(n);
                setPinned(true);
              }}
              onFocus={() => {
                setActive(n);
                setPinned(true);
              }}
              onClick={() => {
                setActive(n);
                setPinned(true);
              }}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md border bg-graphite px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white transition-transform duration-300 hover:scale-105 sm:px-3 sm:py-1.5 sm:text-xs"
              style={{
                left: `${(n.x / W) * 100}%`,
                top: `${(n.y / H) * 100}%`,
                borderColor: toneColor[n.tone],
                boxShadow: isActive ? `0 0 0 3px ${toneColor[n.tone]}55, 0 0 24px ${toneColor[n.tone]}66` : "none",
              }}
            >
              <span
                className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                style={{ background: toneColor[n.tone] }}
                aria-hidden="true"
              />
              {n.label}
              <span className="sr-only">. {n.scenario}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex min-h-[4.5rem] flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/85 sm:text-base" aria-hidden="true">
          <span className="font-mono text-xs uppercase" style={{ color: toneColor[active.tone] }}>
            {active.label}
          </span>
          <br />
          {active.scenario}
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <ul className="flex gap-4 font-mono text-[11px] text-white/70" aria-label="Обозначения на схеме">
            <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-b24" />Битрикс24</li>
            <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-onec" />1С</li>
            <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-low" />Слаботочка</li>
          </ul>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            aria-label="Пауза анимации схемы"
            className="rounded-md border border-white/15 p-1.5 text-white/80 hover:bg-white/10"
          >
            {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
