# CLAUDE.md

Сайт компании-интегратора (Битрикс24, 1С, слаботочные системы). Цель — заявки.
Next.js 16 (App Router, Cache Components) + TypeScript strict + Tailwind 4. Правила Next — в @AGENTS.md.

- Проверки перед коммитом: `npm run lint && npm run typecheck && npm test && npm run build`.
- Контент только в `src/content/*`, формула цены — `src/lib/estimate.ts`; меняешь формулу — обнови тесты.
- Цвета направлений: Битрикс24 `b24`, 1С `onec`, слаботочка `low` (токены в `globals.css`). Текст на светлом — `*-ink`.
- Форма: любая новая проверка — на сервере в `leadSchema`; секреты только без `NEXT_PUBLIC_`.
- Анимации — только `transform`/`opacity`, с учётом `prefers-reduced-motion`.
