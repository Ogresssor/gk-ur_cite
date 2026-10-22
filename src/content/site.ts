// Контакты, реквизиты и цифры — заглушки. Замените на реальные перед запуском.
export const site = {
  name: "ГК УР",
  legalName: "ООО «ГК УР»",
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
  { href: "/uslugi", label: "Услуги" },
  { href: "/kejsy", label: "Кейсы" },
  { href: "/kalkulyator", label: "Калькулятор" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/kontakty", label: "Контакты" },
] as const;

// Цифры для блоков доверия: число анимируется счётчиком. Подставьте реальные значения.
export const facts = [
  { value: 12, suffix: " лет", label: "внедряем и монтируем" },
  { value: 340, suffix: "+", label: "проектов сдано" },
  { value: 15, suffix: " мин", label: "реакция на аварию по SLA" },
  { value: 98, suffix: "%", label: "клиентов продлевают сопровождение" },
] as const;

// Платформы и оборудование, с которыми работаем (без заявлений о партнёрских статусах).
export const stack = [
  "Битрикс24",
  "1С:Предприятие",
  "1С:УТ",
  "1С:ЗУП",
  "1С:Бухгалтерия",
  "Hikvision",
  "Dahua",
  "Trassir",
  "Ubiquiti",
  "MikroTik",
  "Cisco",
  "Asterisk",
  "Mango Office",
  "PERCo",
  "ZKTeco",
  "Sigur",
] as const;
