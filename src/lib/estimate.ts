// Ориентировочный расчёт для калькулятора. Используется и в браузере, и на сервере,
// чтобы в заявку попадала цена, посчитанная сервером, а не присланная клиентом.

export type Dir = "b24" | "onec" | "low";
export type Tier = 0 | 1 | 2;

export type QuizInput = {
  directions: Dir[];
  tiers: Partial<Record<Dir, Tier>>;
  urgent: boolean;
};

type Range = readonly [number, number];

export const tierLabels: Record<Dir, { question: string; options: readonly [string, string, string] }> = {
  b24: {
    question: "Сколько сотрудников будут работать в Битрикс24?",
    options: ["До 10", "10–50", "Больше 50"],
  },
  onec: {
    question: "Что нужно сделать в 1С?",
    options: ["Доработать или настроить", "Внедрить одну конфигурацию", "Комплексный учёт: торговля, склад, зарплата"],
  },
  low: {
    question: "Какая площадь объекта?",
    options: ["До 300 м²", "300–1 500 м²", "Больше 1 500 м²"],
  },
};

// Тысячи рублей и недели для каждого уровня масштаба.
const price: Record<Dir, readonly [Range, Range, Range]> = {
  b24: [[45, 90], [90, 180], [180, 400]],
  onec: [[30, 70], [70, 160], [160, 380]],
  low: [[35, 90], [90, 300], [300, 900]],
};

const weeks: Record<Dir, readonly [Range, Range, Range]> = {
  b24: [[2, 4], [4, 7], [6, 12]],
  onec: [[2, 3], [3, 6], [6, 12]],
  low: [[1, 2], [2, 4], [4, 8]],
};

const INTEGRATION: Range = [40, 90];
const URGENT_PRICE = 1.2;
const URGENT_TIME = 0.7;

export type Estimate = {
  priceMin: number;
  priceMax: number;
  weeksMin: number;
  weeksMax: number;
  integrations: number;
};

export function estimate(input: QuizInput): Estimate | null {
  const dirs = [...new Set(input.directions)];
  if (dirs.length === 0) return null;

  let pMin = 0;
  let pMax = 0;
  let wMin = 0;
  let wMax = 0;

  for (const d of dirs) {
    const tier = input.tiers[d] ?? 0;
    pMin += price[d][tier][0];
    pMax += price[d][tier][1];
    // Команды по направлениям работают параллельно, поэтому срок — по самому долгому.
    wMin = Math.max(wMin, weeks[d][tier][0]);
    wMax = Math.max(wMax, weeks[d][tier][1]);
  }

  const integrations = dirs.length - 1;
  pMin += integrations * INTEGRATION[0];
  pMax += integrations * INTEGRATION[1];
  if (integrations > 0) {
    wMin += 1;
    wMax += 1;
  }

  if (input.urgent) {
    pMin *= URGENT_PRICE;
    pMax *= URGENT_PRICE;
    wMin = Math.max(1, Math.ceil(wMin * URGENT_TIME));
    wMax = Math.max(1, Math.ceil(wMax * URGENT_TIME));
  }

  return {
    priceMin: Math.round(pMin) * 1000,
    priceMax: Math.round(pMax) * 1000,
    weeksMin: wMin,
    weeksMax: wMax,
    integrations,
  };
}

const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export function formatRub(value: number) {
  return `${rub.format(value)} ₽`;
}

export function formatWeeks(min: number, max: number) {
  const n = max;
  const word = n % 10 === 1 && n % 100 !== 11 ? "неделя" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "недели" : "недель";
  return min === max ? `${max} ${word}` : `${min}–${max} ${word}`;
}
