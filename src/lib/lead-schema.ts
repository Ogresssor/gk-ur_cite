import { z } from "zod";

const dir = z.enum(["b24", "onec", "low"]);
const tier = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export const quizSchema = z.object({
  directions: z.array(dir).min(1).max(3),
  tiers: z.partialRecord(dir, tier),
  urgent: z.boolean(),
});

export const leadSchema = z.object({
  name: z
    .string()
    .transform((v) => v.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(2, "Укажите имя — хотя бы 2 буквы").max(80, "Имя слишком длинное")),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .pipe(z.string().regex(/^\+?\d{10,15}$/, "Проверьте номер: нужно 10–15 цифр")),
  contactWay: z.enum(["call", "telegram", "whatsapp"]).default("call"),
  // Переносы строк с отступом: текст клиента не притворится полем заявки вроде «Телефон: …».
  comment: z
    .string()
    .trim()
    .max(1000, "Комментарий — до 1000 символов")
    .transform((v) => v.replace(/\r?\n/g, "\n  "))
    .optional(),
  consent: z.literal("on", { error: "Нужно согласие на обработку данных" }),
  source: z.enum(["contact", "quiz", "service"]).default("contact"),
  quiz: z
    .string()
    .max(500)
    .optional()
    .transform((raw, ctx) => {
      if (!raw) return undefined;
      try {
        return quizSchema.parse(JSON.parse(raw));
      } catch {
        ctx.addIssue({ code: "custom", message: "Ответы калькулятора повреждены" });
        return z.NEVER;
      }
    }),
});

export type Lead = z.infer<typeof leadSchema>;

export type LeadState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<string, string>>;
      values?: { name?: string; phone?: string; comment?: string; contactWay?: string };
    };
