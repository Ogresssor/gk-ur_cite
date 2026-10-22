"use server";

import { headers } from "next/headers";
import { estimate, formatRub, formatWeeks, tierLabels } from "@/lib/estimate";
import { leadSchema, type Lead, type LeadState } from "@/lib/lead-schema";
import { createCrmLead, notifyTelegram } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";

const MIN_FILL_MS = 2000;
const directionNames = { b24: "Битрикс24", onec: "1С", low: "Слаботочка" } as const;
const contactNames = { call: "звонок", telegram: "Telegram", whatsapp: "WhatsApp" } as const;
const sourceNames = { contact: "форма контактов", quiz: "калькулятор", service: "страница услуги" } as const;

// Описание заявки без персональных данных: его можно слать и в CRM, и в уведомления.
function describeLead(lead: Lead) {
  const lines = [`Источник: ${sourceNames[lead.source]}`, `Связаться: ${contactNames[lead.contactWay]}`];
  if (lead.quiz) {
    const quiz = lead.quiz;
    const result = estimate(quiz);
    lines.push(
      "Калькулятор:",
      ...quiz.directions.map((d) => `• ${directionNames[d]}: ${tierLabels[d].options[quiz.tiers[d] ?? 0]}`),
      `• Срочно: ${quiz.urgent ? "да" : "нет"}`,
    );
    if (result) {
      lines.push(
        `• Оценка: ${formatRub(result.priceMin)} – ${formatRub(result.priceMax)}, ${formatWeeks(result.weeksMin, result.weeksMax)}`,
      );
    }
  }
  return lines;
}

async function clientIp() {
  const h = await headers();
  // x-real-ip выставляет платформа (Vercel, nginx); из X-Forwarded-For берём последний хоп,
  // его добавил ближайший прокси, а не клиент.
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
}

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const values = {
    name: String(formData.get("name") ?? "").slice(0, 80),
    phone: String(formData.get("phone") ?? "").slice(0, 24),
    comment: String(formData.get("comment") ?? "").slice(0, 1000),
    contactWay: String(formData.get("contactWay") ?? "call"),
  };

  // Скрытое поле заполняют только боты: отвечаем как обычно, но заявку не сохраняем.
  if (formData.get("website")) {
    return { status: "success", message: "Заявка принята. Перезвоним в течение 15 минут в рабочее время." };
  }

  const startedAt = Number(formData.get("startedAt"));
  if (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "Форма отправлена слишком быстро. Нажмите кнопку ещё раз.", values };
  }

  const parsed = leadSchema.safeParse({
    name: values.name,
    phone: values.phone,
    contactWay: values.contactWay,
    comment: values.comment || undefined,
    consent: formData.get("consent") ?? undefined,
    source: formData.get("source") ?? undefined,
    quiz: formData.get("quiz") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Проверьте поля формы.", fieldErrors, values };
  }

  // Лимит считаем только по валидным заявкам, чтобы опечатки не блокировали живого человека.
  if (!rateLimit(`lead:${await clientIp()}`)) {
    return {
      status: "error",
      message: "Слишком много заявок подряд. Попробуйте через 10 минут или позвоните нам.",
      values,
    };
  }

  const lead = parsed.data;
  const details = describeLead(lead);
  let leadId: number | null = null;
  try {
    leadId = await createCrmLead({
      title: `Заявка с сайта: ${sourceNames[lead.source]}`,
      name: lead.name,
      phone: lead.phone,
      comments: [...details, lead.comment ? `Комментарий: ${lead.comment}` : ""].filter(Boolean).join("\n"),
    });
  } catch (error) {
    console.error("crm lead failed", error instanceof Error ? error.message : "unknown");
  }

  if (leadId === null) {
    if (process.env.NODE_ENV === "production") {
      console.error("crm lead failed: BITRIX24_WEBHOOK_URL is not configured or unavailable");
      return { status: "error", message: "Не удалось отправить заявку. Позвоните нам — ответим сразу.", values };
    }
    console.info(`[dev] BITRIX24_WEBHOOK_URL не задан, заявка:\n${lead.name}, ${lead.phone}\n${details.join("\n")}`);
  }

  try {
    await notifyTelegram([`Новая заявка${leadId ? ` №${leadId}` : ""} в Битрикс24`, ...details].join("\n"));
  } catch (error) {
    console.error("telegram notify failed", error instanceof Error ? error.message : "unknown");
  }

  return { status: "success", message: "Заявка принята. Перезвоним в течение 15 минут в рабочее время." };
}
