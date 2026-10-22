# CLAUDE.md

Сайт компании-интегратора (Битрикс24, 1С, слаботочные системы). Цель — заявки.
Next.js 16 (App Router, Cache Components) + TypeScript strict + Tailwind 4. Правила Next — в @AGENTS.md.

- Проверки перед коммитом: `npm run lint && npm run typecheck && npm test && npm run build`.
- Контент только в `src/content/*`, формула цены — `src/lib/estimate.ts`; меняешь формулу — обнови тесты.
- Фото — через `<Photo>` и файлы в `public/photos/`; без файла показывается иллюстрация из `photo-art.tsx`.
- Тёмная тема. Цвета направлений: Битрикс24 `b24`, 1С `onec`, слаботочка `low`; текст `fg`/`muted` (токены в `globals.css`). Свои CSS-классы — в `@layer components`.
- Форма: любая новая проверка — на сервере в `leadSchema`; секреты только без `NEXT_PUBLIC_`.
- Анимации — только `transform`/`opacity`, с учётом `prefers-reduced-motion`; у бесконечных — пауза. Текст не приглушать через opacity (контраст).
