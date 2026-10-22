import assert from "node:assert/strict";
import { test } from "node:test";
import { leadSchema } from "../src/lib/lead-schema.ts";

const base = { name: "Анна", phone: "+7 (900) 123-45-67", consent: "on" };

test("валидная заявка нормализует телефон", () => {
  const r = leadSchema.parse(base);
  assert.equal(r.phone, "+79001234567");
  assert.equal(r.contactWay, "call");
  assert.equal(r.source, "contact");
});

test("без согласия заявка не проходит", () => {
  const r = leadSchema.safeParse({ ...base, consent: undefined });
  assert.equal(r.success, false);
});

test("короткий телефон отклоняется", () => {
  const r = leadSchema.safeParse({ ...base, phone: "12345" });
  assert.equal(r.success, false);
});

test("ответы калькулятора разбираются и проверяются", () => {
  const ok = leadSchema.parse({ ...base, quiz: JSON.stringify({ directions: ["b24"], tiers: { b24: 2 }, urgent: true }) });
  assert.deepEqual(ok.quiz, { directions: ["b24"], tiers: { b24: 2 }, urgent: true });

  for (const quiz of ["{not json", JSON.stringify({ directions: ["crm"], tiers: {}, urgent: false }), JSON.stringify({ directions: ["b24"], tiers: { b24: 7 }, urgent: false })]) {
    assert.equal(leadSchema.safeParse({ ...base, quiz }).success, false, quiz);
  }
});

test("неизвестный способ связи отклоняется", () => {
  assert.equal(leadSchema.safeParse({ ...base, contactWay: "pigeon" }).success, false);
});

test("переносы строк не создают поддельных полей в заявке", () => {
  const r = leadSchema.parse({ ...base, name: "Анна\nТелефон: +79990000000", comment: "Нужна CRM\nТелефон: +79990000000" });
  assert.equal(r.name, "Анна Телефон: +79990000000");
  assert.equal(r.comment, "Нужна CRM\n  Телефон: +79990000000");
});
