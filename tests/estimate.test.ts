import assert from "node:assert/strict";
import { test } from "node:test";
import { estimate, formatWeeks } from "../src/lib/estimate.ts";

test("без направлений расчёта нет", () => {
  assert.equal(estimate({ directions: [], tiers: {}, urgent: false }), null);
});

test("одно направление: базовая вилка без связок", () => {
  assert.deepEqual(estimate({ directions: ["b24"], tiers: {}, urgent: false }), {
    priceMin: 45_000,
    priceMax: 90_000,
    weeksMin: 2,
    weeksMax: 4,
    integrations: 0,
  });
});

test("несколько направлений: сумма, связка и срок по самому долгому", () => {
  const r = estimate({ directions: ["b24", "onec"], tiers: { b24: 1, onec: 2 }, urgent: false });
  assert.deepEqual(r, { priceMin: 290_000, priceMax: 650_000, weeksMin: 7, weeksMax: 13, integrations: 1 });
});

test("дубли направлений не удваивают цену", () => {
  const once = estimate({ directions: ["low"], tiers: {}, urgent: false });
  const twice = estimate({ directions: ["low", "low"], tiers: {}, urgent: false });
  assert.deepEqual(twice, once);
});

test("срочно: дороже на 20% и короче на 30%", () => {
  const r = estimate({ directions: ["onec"], tiers: { onec: 2 }, urgent: true });
  assert.deepEqual(r, { priceMin: 192_000, priceMax: 456_000, weeksMin: 5, weeksMax: 9, integrations: 0 });
});

test("склонение недель", () => {
  assert.equal(formatWeeks(1, 1), "1 неделя");
  assert.equal(formatWeeks(2, 4), "2–4 недели");
  assert.equal(formatWeeks(5, 11), "5–11 недель");
  assert.equal(formatWeeks(13, 21), "13–21 неделя");
});
