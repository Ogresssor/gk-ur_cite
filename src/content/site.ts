// Все контактные данные и реквизиты — заглушки. Замените на реальные перед запуском.
export const site = {
  name: "ГК ЮР",
  legalName: "ООО «ГК ЮР»",
  inn: "0000000000",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru",
  city: "Москва",
  address: "Москва, ул. Примерная, 1, офис 101",
  phone: "+7 (900) 000-00-00",
  phoneHref: "tel:+79000000000",
  email: "hello@example.ru",
  telegram: "https://t.me/example",
  hours: "Пн–Пт 9:00–19:00, аварийная линия 24/7",
  tagline: "Битрикс24, 1С и слаботочные системы одной командой",
} as const;

export const nav = [
  { href: "/#services", label: "Услуги" },
  { href: "/#calculator", label: "Калькулятор" },
  { href: "/#cases", label: "Кейсы" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#contact", label: "Контакты" },
] as const;

// Цифры для блока доверия. Подставьте реальные значения компании.
export const facts = [
  { value: "12 лет", label: "внедряем и монтируем" },
  { value: "340+", label: "проектов сдано" },
  { value: "15 мин", label: "реакция по SLA на аварию" },
  { value: "1 договор", label: "на ИТ и слаботочку" },
] as const;
