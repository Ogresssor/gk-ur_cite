"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "@/app/actions";
import type { LeadState } from "@/lib/lead-schema";

type Props = {
  source: "contact" | "quiz" | "service";
  quiz?: string;
  submitLabel?: string;
  withComment?: boolean;
};

const initial: LeadState = { status: "idle" };

export function LeadForm({
  source,
  quiz,
  submitLabel = "Получить консультацию",
  withComment = true,
}: Props) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const startedRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const formRef = useRef<HTMLFormElement>(null);

  // Время начала ставим один раз: при возврате на страницу эффект сработает снова.
  useEffect(() => {
    if (startedRef.current?.value === "0") startedRef.current.value = String(Date.now());
  }, []);

  // После ошибки переводим фокус на первое поле, которое нужно исправить.
  useEffect(() => {
    if (state.status !== "error") return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  // React сбрасывает форму после отправки: возвращаем введённое, чтобы не набирать заново.
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-base text-fg outline-none transition-colors placeholder:text-white/40 hover:border-white/25 focus:border-b24 focus:bg-white/[0.06]";
  const label = "mb-1.5 block text-sm font-medium text-fg/85";
  const errorText = "mt-1 text-sm text-red-300";

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-low/40 bg-low/10 p-5 text-fg"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-low" aria-hidden="true" />
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-4">
      <input type="hidden" name="source" value={source} />
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="0" />
      {quiz ? <input type="hidden" name="quiz" value={quiz} /> : null}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Не заполняйте это поле</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            Как к вам обращаться
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            defaultValue={values.name}
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Анна"
            className={field}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {errors.name ? <p id={`${uid}-name-err`} className={errorText}>{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>
            Телефон
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            defaultValue={values.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={24}
            placeholder="+7 900 000-00-00"
            className={field}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
          />
          {errors.phone ? <p id={`${uid}-phone-err`} className={errorText}>{errors.phone}</p> : null}
        </div>
      </div>

      <fieldset>
        <legend className={label}>Как удобнее связаться</legend>
        <div className="flex flex-wrap gap-2">
          {[
            ["call", "Звонок"],
            ["telegram", "Telegram"],
            ["whatsapp", "WhatsApp"],
          ].map(([value, text]) => (
            <label
              key={value}
              className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-fg/85 transition-colors has-[:checked]:border-b24 has-[:checked]:bg-b24 has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-b24"
            >
              <input
                type="radio"
                name="contactWay"
                value={value}
                defaultChecked={value === (values.contactWay ?? "call")}
                className="sr-only"
              />
              {text}
            </label>
          ))}
        </div>
      </fieldset>

      {withComment ? (
        <div>
          <label htmlFor={`${uid}-comment`} className={label}>
            Задача <span className="text-muted">(необязательно)</span>
          </label>
          <textarea
            id={`${uid}-comment`}
            name="comment"
            defaultValue={values.comment}
            rows={3}
            maxLength={1000}
            placeholder="Например: нужна CRM для 15 менеджеров и обмен с 1С:УТ"
            className={field}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? `${uid}-comment-err` : undefined}
          />
          {errors.comment ? <p id={`${uid}-comment-err`} className={errorText}>{errors.comment}</p> : null}
        </div>
      ) : null}

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 size-4 shrink-0 accent-b24"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
          />
          <span>
            Соглашаюсь на обработку персональных данных по{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              политике конфиденциальности
            </Link>
          </span>
        </label>
        {errors.consent ? <p id={`${uid}-consent-err`} className={errorText}>{errors.consent}</p> : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-onec px-6 py-4 text-base font-semibold text-bg shadow-[0_10px_40px_-10px_rgb(245_180_0/0.6)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Отправляем…" : submitLabel}
      </button>

      <p aria-live="polite" className={state.status === "error" ? errorText : "sr-only"}>
        {state.status === "error" ? [state.message, errors.quiz].filter(Boolean).join(" ") : ""}
      </p>
    </form>
  );
}
