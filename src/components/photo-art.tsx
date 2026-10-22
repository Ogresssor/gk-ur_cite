import type { ReactNode } from "react";
import type { PhotoKind } from "@/content/photos";

// Иллюстрации-интерфейсы на месте фото: показывают предмет услуги, пока нет снимков.
// Анимации только transform/opacity, при reduced-motion замирают (глобальное правило в CSS).

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-[min(88%,440px)] rounded-xl border border-white/10 bg-bg/80 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[10px] text-white/50">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Crm() {
  const cols = [
    { t: "Новые", n: 3, c: "bg-white/40" },
    { t: "Переговоры", n: 2, c: "bg-b24" },
    { t: "Счёт", n: 2, c: "bg-onec" },
  ];
  return (
    <Window title="Битрикс24 · Сделки">
      <div className="grid grid-cols-3 gap-2">
        {cols.map((col, i) => (
          <div key={col.t} className="grid content-start gap-1.5">
            <p className="flex items-center gap-1 font-mono text-[9px] text-white/60">
              <span className={`size-1.5 rounded-full ${col.c}`} />
              {col.t}
            </p>
            {Array.from({ length: col.n }, (_, k) => (
              <div
                key={k}
                className={`rounded-md border border-white/10 bg-white/[0.05] p-1.5 ${i === 1 && k === 0 ? "animate-[float_3s_ease-in-out_infinite]" : ""}`}
              >
                <span className="block h-1.5 w-4/5 rounded bg-white/30" />
                <span className="mt-1 block h-1 w-1/2 rounded bg-white/15" />
                <span className="mt-1.5 block font-mono text-[8px] text-white/50">{(k + 2) * 37} 000 ₽</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
}

function Accounting() {
  const bars = [40, 62, 48, 75, 58, 88, 70];
  return (
    <Window title="1С · Продажи за неделю">
      <div className="flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 origin-bottom animate-[grow_1.2s_ease-out_both] rounded-t bg-linear-to-t from-onec/40 to-onec"
            style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-1 font-mono text-[9px] text-white/60">
        {["Выручка  1 284 000 ₽", "Маржа  31,4%", "Остатки  3 012 поз."].map((r) => (
          <p key={r} className="flex justify-between border-t border-white/5 pt-1">
            <span>{r.split("  ")[0]}</span>
            <span className="text-white/85">{r.split("  ")[1]}</span>
          </p>
        ))}
      </div>
    </Window>
  );
}

function Cameras() {
  return (
    <Window title="Видеонаблюдение · 4 камеры">
      <div className="grid grid-cols-2 gap-1.5">
        {["Склад", "Вход", "Цех", "Парковка"].map((t, i) => (
          <div key={t} className="relative aspect-video overflow-hidden rounded bg-[linear-gradient(135deg,#1b2633,#0e141b)]">
            <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,transparent_0_2px,rgb(255_255_255/0.06)_2px_3px)]" />
            <span
              className="absolute inset-x-0 h-6 animate-[scan_3s_linear_infinite] bg-linear-to-b from-transparent via-low/25 to-transparent"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
            <span className="absolute top-1 left-1 font-mono text-[8px] text-white/70">{t}</span>
            <span className="absolute top-1 right-1 flex items-center gap-1 font-mono text-[8px] text-red-400">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              REC
            </span>
          </div>
        ))}
      </div>
    </Window>
  );
}

function Access() {
  return (
    <div className="relative grid size-44 place-items-center">
      {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
        <span key={c} className={`absolute size-8 rounded-sm border-low ${c}`} />
      ))}
      <svg viewBox="0 0 100 100" className="size-28 text-white/50" aria-hidden="true">
        <circle cx="50" cy="38" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 92c4-18 18-28 32-28s28 10 32 28" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="absolute inset-x-3 top-3 h-0.5 animate-[scan-y_2.4s_ease-in-out_infinite_alternate] bg-low shadow-[0_0_16px_var(--low)]" />
      <span className="absolute -bottom-10 rounded-full bg-low/15 px-3 py-1 font-mono text-[10px] text-low">Доступ разрешён</span>
    </div>
  );
}

function Rack() {
  return (
    <div className="w-[min(70%,260px)] rounded-lg border border-white/15 bg-bg/80 p-2.5 shadow-2xl">
      {Array.from({ length: 5 }, (_, r) => (
        <div key={r} className="mb-1.5 flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2 py-1.5 last:mb-0">
          <span className="mr-1 font-mono text-[8px] text-white/40">U{r + 1}</span>
          {Array.from({ length: 12 }, (_, p) => (
            <span
              key={p}
              className={`h-1.5 flex-1 rounded-sm ${(p + r) % 3 === 0 ? "animate-[blink_1.6s_steps(2)_infinite] bg-low" : (p + r) % 5 === 0 ? "bg-onec/80" : "bg-white/15"}`}
              style={{ animationDelay: `${(p * 7 + r * 3) % 10}00ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const tiles = [
    { t: "Продажи", v: "+18%", c: "text-b24" },
    { t: "Склад", v: "3 012", c: "text-onec" },
    { t: "На смене", v: "126", c: "text-low" },
  ];
  return (
    <Window title="Отчёт руководителя · сегодня">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((x) => (
          <div key={x.t} className="rounded-md border border-white/10 bg-white/[0.04] p-2">
            <p className="font-mono text-[8px] text-white/50">{x.t}</p>
            <p className={`mt-1 text-sm font-semibold ${x.c}`}>{x.v}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 200 50" className="mt-3 h-12 w-full" aria-hidden="true">
        <path d="M0 40 C30 35 40 20 70 24 S120 10 140 16 S180 4 200 8" fill="none" stroke="var(--b24)" strokeWidth="2" />
        <path d="M0 45 C40 42 60 34 90 36 S150 26 200 28" fill="none" stroke="var(--onec)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </Window>
  );
}

function Waves({ color }: { color: string }) {
  return (
    <div className="relative grid size-40 place-items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 animate-pulse-ring rounded-full border-2"
          style={{ borderColor: color, animationDelay: `${i * 0.8}s` }}
        />
      ))}
      <span className="size-4 rounded-full" style={{ background: color, boxShadow: `0 0 24px ${color}` }} />
    </div>
  );
}

function Call() {
  return (
    <Window title="Входящий звонок">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 place-items-center rounded-full bg-b24/20">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-b24" />
          <span className="size-3 rounded-full bg-b24" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-white/85">+7 (9••) •••-12-48</p>
          <p className="font-mono text-[9px] text-white/50">Клиент найден · 3 сделки</p>
        </div>
      </div>
      <div className="mt-3 grid gap-1">
        {["Создана задача: перезвонить", "Запись разговора сохранена"].map((t) => (
          <p key={t} className="rounded bg-white/[0.05] px-2 py-1 font-mono text-[9px] text-white/70">
            ✓ {t}
          </p>
        ))}
      </div>
    </Window>
  );
}

const withArt = new Set<PhotoKind>(["crm", "accounting", "warehouse", "camera", "factory", "access", "rack", "cable", "phone", "wifi", "office"]);

export function hasPhotoArt(kind: PhotoKind) {
  return withArt.has(kind);
}

export function PhotoArt({ kind, color }: { kind: PhotoKind; color: string }) {
  switch (kind) {
    case "crm":
      return <Crm />;
    case "accounting":
    case "warehouse":
      return <Accounting />;
    case "camera":
    case "factory":
      return <Cameras />;
    case "access":
      return <Access />;
    case "rack":
    case "cable":
      return <Rack />;
    case "phone":
      return <Call />;
    case "wifi":
      return <Waves color={color} />;
    case "office":
      return <Dashboard />;
    default:
      return null;
  }
}
